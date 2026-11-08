"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Base local de la demostración.
 * Cada clave se guarda en localStorage con el prefijo `bc:` para que el estado
 * sobreviva a recargas y se comparta entre pantallas y pestañas.
 * La consola demo puede restablecerlo todo con `resetDemo()`.
 */
const PREFIX = "bc:";

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, unknown>();

function read<T>(key: string, initial: T): T {
  if (cache.has(key)) return cache.get(key) as T;
  let value: T = initial;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw != null) value = { ...initial, ...JSON.parse(raw) } as T;
  } catch {
    /* almacenamiento no disponible: se usa el valor inicial */
  }
  cache.set(key, value);
  return value;
}

function write<T>(key: string, value: T) {
  cache.set(key, value);
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* sin almacenamiento: el estado vive solo en esta sesión */
  }
  listeners.get(key)?.forEach((l) => l());
}

function subscribe(key: string, listener: Listener) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(listener);
  return () => listeners.get(key)?.delete(listener);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (!e.key) {
      cache.clear();
      listeners.forEach((set) => set.forEach((l) => l()));
      return;
    }
    if (!e.key.startsWith(PREFIX)) return;
    const key = e.key.slice(PREFIX.length);
    cache.delete(key);
    listeners.get(key)?.forEach((l) => l());
  });
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

/** Indica si una clave ya tiene estado completo (en memoria o guardado). */
export function hayDemo(key: string): boolean {
  if (cache.has(key)) return true;
  try {
    return window.localStorage.getItem(PREFIX + key) != null;
  } catch {
    return false;
  }
}

/** Borra todos los datos de la demostración y vuelve a la semilla. */
export function resetDemo() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* nada que borrar */
  }
  const keys = [...cache.keys()];
  cache.clear();
  keys.forEach((k) => listeners.get(k)?.forEach((l) => l()));
}
