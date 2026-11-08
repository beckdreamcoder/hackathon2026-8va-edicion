"use client";

import { getDemo, setDemo, useDemoState } from "./store";

/** Vecinos ficticios de la demostración. */
export const VECINOS = {
  maria: { id: "maria", name: "María", ini: "M", role: "Solicitante" },
  luis: { id: "luis", name: "Luis", ini: "L", role: "Oferente" },
  pedro: { id: "pedro", name: "Pedro", ini: "P", role: "Gasfitero" },
  rosa: { id: "rosa", name: "Rosa", ini: "R", role: "Vecina" },
  carmen: { id: "carmen", name: "Carmen", ini: "C", role: "Coordinadora" },
  carlos: { id: "carlos", name: "Carlos", ini: "C", role: "Pasa por la zona" },
} as const;
export type VecinoId = keyof typeof VECINOS;

export type Sesion = {
  registrada: boolean;
  dni: string;
  userId: VecinoId;
  rol: "Vecino" | "Coordinador" | "Editor";
  departamento: string;
  localidad: string;
  juntaId: string | null;
  ubicacionPermitida: boolean;
  /** Fecha simulada (ISO yyyy-mm-dd) que usa el reconocimiento mensual. */
  fecha: string;
  /** Señal simulada desde la consola demo. */
  senal: "Normal" | "Intermitente" | "Sin datos";
  smsCentral: "Activa" | "Caída";
  ia: "Controlada" | "Sin respuesta";
};

export const SESION_INICIAL: Sesion = {
  registrada: false,
  dni: "",
  userId: "maria",
  rol: "Vecino",
  departamento: "Lima",
  localidad: "Campoy",
  juntaId: null,
  ubicacionPermitida: false,
  fecha: "2026-11-08",
  senal: "Normal",
  smsCentral: "Activa",
  ia: "Controlada",
};

export function useSesion() {
  return useDemoState("sesion", SESION_INICIAL);
}

/* ---------- Sellos de Visto Bueno Vecinal (F06 / Vecino del mes) ---------- */

export type Sello = {
  id: string;
  coordId: string;
  from: VecinoId;
  to: VecinoId;
  /** yyyy-mm según America/Lima. */
  mes: string;
  tipo: "favor" | "cachuelo" | "movilidad";
  valido: boolean;
  comentario?: string;
};

/** Sellos semilla de coordinaciones completadas ficticias (no contadores sueltos). */
function seedSellos(): Sello[] {
  const out: Sello[] = [];
  const add = (to: VecinoId, n: number, mes: string) => {
    for (let i = 0; i < n; i++) {
      const from = (["luis", "pedro", "carmen", "maria"] as VecinoId[]).filter((v) => v !== to)[i % 3];
      out.push({ id: `seed-${to}-${mes}-${i}`, coordId: `seed-c-${to}-${mes}-${i}`, from, to, mes, tipo: i % 3 === 0 ? "movilidad" : "favor", valido: true });
    }
  };
  add("rosa", 12, "2026-11");
  add("luis", 4, "2026-11");
  add("rosa", 9, "2026-10");
  add("carmen", 9, "2026-10");
  return out;
}

export const SELLOS_INICIAL = { items: seedSellos() };

export function useSellos() {
  return useDemoState("sellos", SELLOS_INICIAL);
}

export type ResultadoSello = "emitido" | "duplicado" | "autosello" | "no_completada";

/** Emite un sello aplicando las reglas: sin autosello, sin duplicados, solo tras coordinación completada. */
export function emitirSello(s: Omit<Sello, "id" | "valido" | "mes">, completada: boolean): ResultadoSello {
  if (s.from === s.to) return "autosello";
  if (!completada) return "no_completada";
  const { items } = getDemo("sellos", SELLOS_INICIAL);
  if (items.some((x) => x.coordId === s.coordId && x.from === s.from && x.to === s.to)) return "duplicado";
  const mes = getDemo("sesion", SESION_INICIAL).fecha.slice(0, 7);
  setDemo("sellos", SELLOS_INICIAL, { items: [...items, { ...s, id: `s-${Date.now()}`, mes, valido: true }] });
  logEvento(`Sello emitido por ${VECINOS[s.from].name} a ${VECINOS[s.to].name} (${s.tipo})`);
  return "emitido";
}

/** Anula los sellos de una coordinación invalidada. */
export function anularSellos(coordId: string) {
  const { items } = getDemo("sellos", SELLOS_INICIAL);
  setDemo("sellos", SELLOS_INICIAL, { items: items.map((x) => (x.coordId === coordId ? { ...x, valido: false } : x)) });
}

export function sellosDe(items: Sello[], to: VecinoId) {
  return items.filter((x) => x.valido && x.to === to);
}

/* ---------- Registro de eventos de la consola demo ---------- */

export const EVENTOS_INICIAL = { items: [] as { t: string; text: string }[] };

export function logEvento(text: string) {
  const { items } = getDemo("eventos", EVENTOS_INICIAL);
  const t = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  setDemo("eventos", EVENTOS_INICIAL, { items: [{ t, text }, ...items].slice(0, 40) });
}

export function useEventos() {
  return useDemoState("eventos", EVENTOS_INICIAL);
}

/* ---------- Avisos generados por la actividad de la demo ---------- */

export type AvisoDemo = { id: string; categoria: string; titulo: string; texto: string; href: string; leida: boolean; hace: string };
export const AVISOS_INICIAL = { items: [] as AvisoDemo[] };

export function avisar(a: Omit<AvisoDemo, "id" | "leida" | "hace">) {
  const { items } = getDemo("avisos", AVISOS_INICIAL);
  setDemo("avisos", AVISOS_INICIAL, { items: [{ ...a, id: `a-${Date.now()}`, leida: false, hace: "ahora" }, ...items].slice(0, 30) });
}

export function useAvisos() {
  return useDemoState("avisos", AVISOS_INICIAL);
}

/* ---------- Estilos de chip compartidos ---------- */

export const CHIP_ON = "min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white";
export const CHIP_OFF = "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap";
export const chip = (on: boolean) => (on ? CHIP_ON : CHIP_OFF);
