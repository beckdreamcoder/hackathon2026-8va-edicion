"use client";

import { useCallback, useSyncExternalStore } from "react";
import * as idb from "./idb";

/**
 * Base local de la demostración sobre IndexedDB.
 * - Fuente síncrona: un caché en memoria (misma API que antes: useDemoState, getDemo, setDemo, resetDemo, hayDemo).
 * - Persistencia: IndexedDB («barrioconecta»), con escritura agrupada por clave. Si IndexedDB no existe o falla,
 *   se usa localStorage como alternativa.
 * - Migración: al primer arranque se copian los datos antiguos de localStorage (`bc:*`) a IndexedDB sin duplicar
 *   (si ya existe la clave en IndexedDB, esa gana) y se retiran las copias antiguas.
 * - Varias pestañas: BroadcastChannel avisa de los cambios para que todas lean lo último.
 */
const PREFIX = "bc:";
export const ESQUEMA = 1;
/**
 * Versión de los datos de ejemplo. Al subirla, cada dispositivo borra una vez la actividad guardada
 * (coordinaciones, chats, avisos, publicaciones…) y arranca con los ejemplos de `ejemplos.ts`.
 */
export const VERSION_DATOS = 2;
/** Claves que sobreviven a ese reinicio: la configuración del mapa no se toca. */
const CLAVES_CONSERVADAS = ["mapa-ui"];

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, unknown>();
/** Valores tal como están guardados (se combinan con el valor inicial al leerlos por primera vez). */
const crudo = new Map<string, unknown>();

export type MotorAlmacen = "pendiente" | "indexeddb" | "localstorage";
export type EstadoAlmacen = { motor: MotorAlmacen; hidratado: boolean; migrados: number; error: string };
let estado: EstadoAlmacen = { motor: "pendiente", hidratado: false, migrados: 0, error: "" };
const escuchasEstado = new Set<Listener>();
const cambiarEstado = (p: Partial<EstadoAlmacen>) => { estado = { ...estado, ...p }; escuchasEstado.forEach((l) => l()); };

const hayWindow = () => typeof window !== "undefined";

/* ---------- localStorage: solo migración y alternativa ---------- */
function legado(key: string): unknown | null {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw != null ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Borra la actividad antigua guardada en localStorage (`bc:*`, salvo las claves conservadas) si aún no se
 * hizo para esta versión de datos. Devuelve true si borró algo.
 */
function reiniciarLegado(): boolean {
  try {
    const ls = window.localStorage;
    if (ls.getItem("bc-version-datos") === String(VERSION_DATOS)) return false;
    const borrar: string[] = [];
    for (let i = 0; i < ls.length; i++) {
      const k = ls.key(i);
      if (k && k.startsWith(PREFIX) && !CLAVES_CONSERVADAS.includes(k.slice(PREFIX.length))) borrar.push(k);
    }
    borrar.forEach((k) => ls.removeItem(k));
    ls.setItem("bc-version-datos", String(VERSION_DATOS));
    return borrar.length > 0;
  } catch {
    return false;
  }
}

/* ---------- Escritura agrupada hacia IndexedDB ---------- */
const sucias = new Map<string, unknown>();
let temporizador: ReturnType<typeof setTimeout> | null = null;

async function volcar() {
  temporizador = null;
  const lote = [...sucias.entries()];
  sucias.clear();
  for (const [key, value] of lote) {
    if (estado.motor === "indexeddb") {
      const ok = await idb.guardar({ key, value, esquema: ESQUEMA, actualizado: Date.now() });
      if (!ok) {
        // IndexedDB falló: se conserva el dato en localStorage para no perderlo
        try { window.localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* sin espacio */ }
        cambiarEstado({ error: "No se pudo escribir en IndexedDB; se guardó una copia en localStorage." });
      }
    } else {
      try { window.localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* el estado vive solo en esta sesión */ }
    }
  }
}
function programar(key: string, value: unknown) {
  sucias.set(key, value);
  if (!temporizador) temporizador = setTimeout(volcar, 120);
}
/** Fuerza el guardado de lo pendiente (se usa al ocultar la pestaña y en pruebas). */
export function volcarPendientes() {
  if (temporizador) clearTimeout(temporizador);
  return volcar();
}

/* ---------- Varias pestañas ---------- */
let canal: BroadcastChannel | null = null;
function abrirCanal() {
  if (canal || !hayWindow() || typeof BroadcastChannel === "undefined") return;
  canal = new BroadcastChannel("bc-store");
  canal.onmessage = async (e: MessageEvent<{ key?: string; reset?: boolean }>) => {
    if (e.data?.reset) { cache.clear(); crudo.clear(); listeners.forEach((s) => s.forEach((l) => l())); return; }
    const key = e.data?.key;
    if (!key) return;
    const f = await idb.leerUna(key);
    if (f) { crudo.set(key, f.value); cache.delete(key); listeners.get(key)?.forEach((l) => l()); }
  };
}

if (hayWindow()) {
  abrirCanal();
  window.addEventListener("pagehide", () => { void volcarPendientes(); });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") void volcarPendientes(); });
  // Alternativa localStorage: cambios de otra pestaña
  window.addEventListener("storage", (e) => {
    if (estado.motor === "indexeddb") return;
    if (!e.key) { cache.clear(); listeners.forEach((s) => s.forEach((l) => l())); return; }
    if (!e.key.startsWith(PREFIX)) return;
    const key = e.key.slice(PREFIX.length);
    cache.delete(key);
    listeners.get(key)?.forEach((l) => l());
  });
}

/* ---------- Lectura y escritura síncronas ---------- */
function read<T>(key: string, initial: T): T {
  if (cache.has(key)) return cache.get(key) as T;
  let value: T = initial;
  const guardado = crudo.has(key) ? crudo.get(key) : estado.motor === "indexeddb" || !hayWindow() ? null : legado(key);
  if (guardado != null && typeof guardado === "object") value = { ...initial, ...(guardado as object) } as T;
  cache.set(key, value);
  return value;
}

function write<T>(key: string, value: T) {
  cache.set(key, value);
  if (!estado.hidratado) {
    // Antes de cargar lo guardado, las pantallas ya pueden haberse renderizado (con los valores iniciales): lo que
    // escriban aquí es solo temporal y se descarta al hidratar, para no pisar los datos guardados.
    listeners.get(key)?.forEach((l) => l());
    return;
  }
  crudo.set(key, value);
  programar(key, value);
  listeners.get(key)?.forEach((l) => l());
  try { canal?.postMessage({ key }); } catch { /* sin canal */ }
}

function subscribe(key: string, listener: Listener) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(listener);
  return () => listeners.get(key)?.delete(listener);
}

/**
 * Carga todo desde IndexedDB al caché (y migra lo antiguo de localStorage). Se llama una sola vez al arrancar.
 * Nada se muestra hasta que termina, para no escribir sobre datos guardados con un valor inicial.
 */
let hidratando: Promise<EstadoAlmacen> | null = null;
export function hidratar(): Promise<EstadoAlmacen> {
  if (hidratando) return hidratando;
  hidratando = (async () => {
    if (!hayWindow()) return estado;
    let filas = await idb.leerTodo();
    if (filas === null) {
      reiniciarLegado(); // datos anteriores de localStorage descartados una vez
      cambiarEstado({ motor: "localstorage", hidratado: true, error: "IndexedDB no está disponible en este navegador: se usa localStorage." });
      listeners.forEach((s) => s.forEach((l) => l()));
      return estado;
    }
    // Nueva versión de los datos de ejemplo: se descarta una sola vez la actividad guardada antes
    // (se conserva la configuración del mapa) para arrancar con los ejemplos listos.
    if ((await idb.metaLeer<number>("version-datos")) !== VERSION_DATOS) {
      await idb.limpiarKv();
      const conservadas = filas.filter((f) => CLAVES_CONSERVADAS.includes(f.key));
      for (const f of conservadas) await idb.guardar(f);
      filas = conservadas;
      reiniciarLegado();
      await idb.metaGuardar("migracion-localstorage", { fecha: Date.now(), migrados: 0, esquema: ESQUEMA });
      await idb.metaGuardar("version-datos", VERSION_DATOS);
    }
    const porClave = new Map(filas.map((f) => [f.key, f]));
    let migrados = 0;
    const hecho = await idb.metaLeer<{ fecha: number }>("migracion-localstorage");
    if (!hecho) {
      // Migración única: copia lo antiguo sin pisar lo que ya exista en IndexedDB
      const claves: string[] = [];
      try { for (let i = 0; i < window.localStorage.length; i++) { const k = window.localStorage.key(i); if (k && k.startsWith(PREFIX)) claves.push(k); } } catch { /* sin acceso */ }
      let completa = true;
      for (const k of claves) {
        const key = k.slice(PREFIX.length);
        if (porClave.has(key)) continue;
        let valor: unknown = null;
        try { valor = JSON.parse(window.localStorage.getItem(k) ?? "null"); } catch { valor = null; }
        if (valor == null) continue;
        const fila = { key, value: valor, esquema: ESQUEMA, actualizado: Date.now() };
        if (await idb.guardar(fila)) { porClave.set(key, fila); migrados++; } else completa = false;
      }
      if (completa) {
        await idb.metaGuardar("migracion-localstorage", { fecha: Date.now(), migrados, esquema: ESQUEMA });
        for (const k of claves) { try { window.localStorage.removeItem(k); } catch { /* nada */ } }
      }
    }
    await idb.metaGuardar("esquema", ESQUEMA);
    porClave.forEach((f, key) => { if (!crudo.has(key)) crudo.set(key, f.value); });
    cache.clear(); // los valores se reconstruyen combinando el valor inicial con lo guardado
    cambiarEstado({ motor: "indexeddb", hidratado: true, migrados, error: "" });
    listeners.forEach((s) => s.forEach((l) => l()));
    return estado;
  })();
  return hidratando;
}

export const estadoAlmacen = () => estado;
export function useEstadoAlmacen() {
  return useSyncExternalStore((l) => { escuchasEstado.add(l); return () => { escuchasEstado.delete(l); }; }, () => estado, () => estado);
}

/**
 * Estado persistente por clave. `initial` debe ser un objeto estable (definido fuera del componente).
 * `set` acepta un parche parcial o una función que recibe el estado actual.
 */
export function useDemoState<T extends object>(key: string, initial: T) {
  const value = useSyncExternalStore(
    useCallback((l: Listener) => subscribe(key, l), [key]),
    () => read(key, initial),
    () => initial,
  );
  const set = useCallback(
    (patch: Partial<T> | ((prev: T) => Partial<T>)) => {
      const prev = read(key, initial);
      const next = typeof patch === "function" ? patch(prev) : patch;
      write(key, { ...prev, ...next });
    },
    [key, initial],
  );
  const reset = useCallback(() => write(key, initial), [key, initial]);
  return [value, set, reset] as const;
}

/** Lectura y escritura fuera de React (servicios de dominio). */
export function getDemo<T extends object>(key: string, initial: T): T {
  return read(key, initial);
}
export function setDemo<T extends object>(key: string, initial: T, patch: Partial<T>) {
  write(key, { ...read(key, initial), ...patch });
}

/** Indica si una clave ya tiene estado guardado o en memoria. */
export function hayDemo(key: string): boolean {
  if (cache.has(key) || crudo.has(key)) return true;
  return hayWindow() && estado.motor !== "indexeddb" ? legado(key) != null : false;
}

/** Borra todos los datos de la demostración y vuelve a la semilla. */
export async function resetDemo() {
  sucias.clear();
  if (temporizador) { clearTimeout(temporizador); temporizador = null; }
  cache.clear();
  crudo.clear();
  await idb.limpiarKv();
  try {
    const borrar: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) { const k = window.localStorage.key(i); if (k && k.startsWith(PREFIX)) borrar.push(k); }
    borrar.forEach((k) => window.localStorage.removeItem(k));
  } catch { /* nada que borrar */ }
  listeners.forEach((s) => s.forEach((l) => l()));
  try { canal?.postMessage({ reset: true }); } catch { /* sin canal */ }
}
