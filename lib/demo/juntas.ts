"use client";

import { getDemo, setDemo, useDemoState } from "./store";
import { logEvento, type VecinoId } from "./shared";

/**
 * Juntas vecinales de DEMOSTRACIÓN: no tienen reconocimiento estatal real ni verifican a nadie.
 * Los avisos son comunitarios y nunca se presentan como alertas oficiales.
 */
export type Junta = { name: string; zona: string; dep: string; coordId: VecinoId; coord: string };

export const JUNTAS: Record<string, Junta> = {
  campoy: { name: "Junta Vecinal Campoy Unido", zona: "Campoy · San Juan de Lurigancho", dep: "Lima", coordId: "carmen", coord: "Carmen" },
  olivos: { name: "Junta del Pasaje Los Olivos", zona: "Campoy · Sector 4", dep: "Lima", coordId: "rosa", coord: "Rosa" },
  tacala: { name: "Junta Vecinal Tacalá Solidario", zona: "Tacalá · Castilla, Piura", dep: "Piura", coordId: "carmen", coord: "Carmen" },
  kari: { name: "Junta Vecinal Kari Grande", zona: "Kari Grande · San Sebastián, Cusco", dep: "Cusco", coordId: "carmen", coord: "Carmen" },
  belen: { name: "Junta Vecinal Bajo Belén", zona: "Bajo Belén · Belén, Loreto", dep: "Loreto", coordId: "carmen", coord: "Carmen" },
  atum: { name: "Junta Vecinal Atumpampa", zona: "Atumpampa · Tarapoto", dep: "San Martín", coordId: "carmen", coord: "Carmen" },
};

/** Miembros visibles (solo quienes dieron permiso). El usuario actual se suma si pertenece a la junta. */
export const MIEMBROS: Record<string, VecinoId[]> = {
  campoy: ["carmen", "rosa", "luis", "pedro", "carlos", "maria"],
  olivos: ["rosa", "diego", "valeria"],
  tacala: ["carmen", "miguel"],
  kari: ["carmen", "rocio"],
  belen: ["carmen", "hugo"],
  atum: ["carmen", "elena"],
};

export type AvisoJunta = { id: string; juntaId: string; titulo: string; texto: string; autor: VecinoId; fecha: string; semilla?: boolean };

export const AVISOS_SEMILLA: AvisoJunta[] = [
  { id: "sem-reunion", juntaId: "campoy", titulo: "Reunión vecinal el sábado", texto: "Local comunal · 5:00 p. m. Revisaremos la limpieza del parque y el rol de turnos de vigilancia vecinal.", autor: "carmen", fecha: "2026-11-05", semilla: true },
  { id: "sem-faena", juntaId: "campoy", titulo: "Faena de limpieza del parque", texto: "Domingo 8:00 a. m. Traer guantes y bolsas.", autor: "carmen", fecha: "2026-11-04", semilla: true },
];

export const AVISOS_INICIAL = { items: [] as AvisoJunta[] };

export function useAvisosJunta(juntaId: string | null) {
  const [st] = useDemoState("juntas-avisos", AVISOS_INICIAL);
  const todos = [...st.items, ...AVISOS_SEMILLA];
  return juntaId ? todos.filter((a) => a.juntaId === juntaId).sort((a, b) => b.fecha.localeCompare(a.fecha) || (a.semilla ? 1 : -1)) : [];
}

const idNuevo = () => `av-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export function crearAviso(d: { juntaId: string; titulo: string; texto: string; autor: VecinoId; fecha: string }): { ok: true; id: string } | { ok: false; error: string } {
  const titulo = d.titulo.trim();
  const texto = d.texto.trim();
  if (titulo.length < 3) return { ok: false, error: "El título necesita al menos 3 letras." };
  if (texto.length < 8) return { ok: false, error: "Escribe el aviso en pocas palabras (mínimo 8 caracteres)." };
  const { items } = getDemo("juntas-avisos", AVISOS_INICIAL);
  const id = idNuevo();
  setDemo("juntas-avisos", AVISOS_INICIAL, { items: [{ id, juntaId: d.juntaId, titulo: titulo.slice(0, 80), texto: texto.slice(0, 400), autor: d.autor, fecha: d.fecha }, ...items] });
  logEvento(`Aviso comunitario publicado en la junta: «${titulo}»`);
  return { ok: true, id };
}

export function editarAviso(id: string, autor: VecinoId, d: { titulo: string; texto: string }): { ok: true } | { ok: false; error: string } {
  const { items } = getDemo("juntas-avisos", AVISOS_INICIAL);
  const a = items.find((x) => x.id === id);
  if (!a) return { ok: false, error: "No se puede editar este aviso." };
  if (a.autor !== autor) return { ok: false, error: "Solo quien publicó el aviso puede editarlo." };
  if (d.titulo.trim().length < 3 || d.texto.trim().length < 8) return { ok: false, error: "Completa el título (3+) y el texto (8+)." };
  setDemo("juntas-avisos", AVISOS_INICIAL, { items: items.map((x) => (x.id === id ? { ...x, titulo: d.titulo.trim().slice(0, 80), texto: d.texto.trim().slice(0, 400) } : x)) });
  return { ok: true };
}

export function eliminarAviso(id: string, autor: VecinoId): { ok: true } | { ok: false; error: string } {
  const { items } = getDemo("juntas-avisos", AVISOS_INICIAL);
  const a = items.find((x) => x.id === id);
  if (!a || a.autor !== autor) return { ok: false, error: "Solo quien publicó el aviso puede eliminarlo." };
  setDemo("juntas-avisos", AVISOS_INICIAL, { items: items.filter((x) => x.id !== id) });
  logEvento(`Aviso de la junta eliminado: «${a.titulo}»`);
  return { ok: true };
}
