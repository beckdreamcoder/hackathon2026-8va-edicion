"use client";

import { getDemo, setDemo, useDemoState } from "./store";
import { logEvento, VECINOS, type Sello, type VecinoId } from "./shared";
import { reportar, participa, type Coordinacion } from "./coordinaciones";
import { COMUNIDAD_SIM } from "@/lib/map/comunidad";
import { RECURSOS_SIM } from "@/lib/map/recursos-sim";

/** Datos de perfil editables por cada vecino (se guardan en este navegador). */
export type DatosPerfil = { nombre?: string; bio?: string; distrito?: string; avatar?: string; color?: string };
export const PERFIL_DATOS_INICIAL = { items: {} as Record<string, DatosPerfil> };

export const COLORES_AVATAR = ["#f4d9c6", "#ddf0f2", "#e6f0e4", "#fbebd0", "#f1ece6"];
export const DISTRITOS_PERFIL = ["San Juan de Lurigancho", "Jicamarca Anexo 22", "El Agustino", "Cercado de Lima", "San Borja", "Ate", "Santa Anita", "La Victoria", "Rímac", "Otro distrito"];
const DIST_POR_DEP: Record<string, string> = { Lima: "San Juan de Lurigancho", Piura: "Castilla", Cusco: "San Sebastián", Loreto: "Belén", "San Martín": "Tarapoto", Puno: "Puno" };

export function usePerfilDatos() {
  return useDemoState("perfil-datos", PERFIL_DATOS_INICIAL);
}

export function guardarPerfil(id: string, d: DatosPerfil) {
  const { items } = getDemo("perfil-datos", PERFIL_DATOS_INICIAL);
  setDemo("perfil-datos", PERFIL_DATOS_INICIAL, { items: { ...items, [id]: { ...items[id], ...d } } });
  logEvento(`Perfil actualizado: ${VECINOS[id as VecinoId]?.name ?? id}`);
}

/** Distrito público de un vecino: el que editó, o el de sus publicaciones de ejemplo. */
export function distritoDe(id: string, datos: Record<string, DatosPerfil>, departamento = "Lima") {
  if (datos[id]?.distrito) return datos[id].distrito as string;
  const sim = COMUNIDAD_SIM.find((c) => c.vecino === id)?.distrito ?? RECURSOS_SIM.find((r) => r.vecino === id)?.distrito;
  return sim ?? DIST_POR_DEP[departamento] ?? "San Juan de Lurigancho";
}

export const nombreDe = (id: string, datos: Record<string, DatosPerfil>, nombres: Record<string, string> = {}) => datos[id]?.nombre ?? nombres[id] ?? VECINOS[id as VecinoId]?.name ?? "Vecino";

/** Oculta casi todo un dato privado (DNI, celular): solo la persona dueña de la cuenta lo ve así. */
export const enmascarar = (t: string, visibles = 2) => (t ? `${"•".repeat(Math.max(3, t.length - visibles))}${t.slice(-visibles)}` : "");

/** Actividad comunitaria derivada de coordinaciones completadas (mismos IDs que el resto de la app). */
export function estadisticas(id: string, coords: Coordinacion[], aportesConfirmados: number, avisosPublicados: number) {
  const hechas = coords.filter((c) => c.estado === "completada" && participa(c, id as VecinoId));
  return {
    favores: hechas.filter((c) => c.tipo === "favor").length,
    cachuelos: hechas.filter((c) => c.tipo === "cachuelo").length,
    traslados: hechas.filter((c) => c.tipo === "movilidad").length,
    participacion: aportesConfirmados + avisosPublicados,
  };
}

export const TIPO_SELLO: Record<Sello["tipo"], string> = { favor: "Favor", cachuelo: "Cachuelo", movilidad: "Movilidad" };

/* ---------- Reportes locales de vecinos (no se envían a ninguna autoridad) ---------- */
export type ReporteVecino = { id: string; by: VecinoId; target: VecinoId; motivo: string; nota: string; fecha: string; bloqueado: boolean };
export const REPORTES_INICIAL = { items: [] as ReporteVecino[] };
export function useReportesVecinos() {
  return useDemoState("reportes-vecinos", REPORTES_INICIAL);
}
export function registrarReporteVecino(d: { by: VecinoId; target: VecinoId; motivo: string; nota: string; fecha: string; bloqueado: boolean }) {
  const r = reportar(d.by, d.target, d.motivo);
  if (!r.ok) return r;
  const { items } = getDemo("reportes-vecinos", REPORTES_INICIAL);
  setDemo("reportes-vecinos", REPORTES_INICIAL, { items: [{ id: `rv-${Date.now().toString(36)}${items.length}`, ...d, nota: d.nota.slice(0, 140) }, ...items] });
  return r;
}
