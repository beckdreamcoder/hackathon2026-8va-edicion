"use client";

import { getDemo, setDemo, useDemoState } from "./store";
import { distancia, porcentajeALngLat, type LngLat } from "@/lib/map/geo";
import type { VecinoId } from "./shared";

export type Reporte = {
  id: string;
  clientActionId: string;
  autor: string;
  tipo: string;
  medio: "cámara" | "ejemplo rotulado" | "SMS";
  hora: string;
  precision: string;
  descripcion?: string;
  lugarConfirmado: boolean;
  estado: "enviado" | "pendiente";
};

export type Incidente = {
  id: string;
  titulo: string;
  tipo: string;
  zona: string;
  /** Posición en el mapa de demostración (porcentaje). */
  x: number;
  y: number;
  actualizado: string;
  /** Índice en ESTADOS_INST. */
  inst: number;
  reportes: Reporte[];
  /** Ubicación real (si se reportó con ubicación); si no, se usa la posición ilustrativa x,y. */
  lngLat?: LngLat;
  descripcion?: string;
  prioridad?: "Alta" | "Media" | "Baja";
  estadoOp?: "Reportada" | "En atención" | "Resuelta";
  /** Marca de tiempo del último reporte (ms). */
  ultimo?: number;
  creado?: number;
};

export const ESTADOS_OP = ["Reportada", "En atención", "Resuelta"] as const;
export const PRIORIDADES = ["Alta", "Media", "Baja"] as const;
export const estadoOpDe = (i: Incidente) => i.estadoOp ?? "Reportada";

/** Posición geográfica de un incidente (real o derivada de la posición ilustrativa). */
export const posInc = (i: Incidente): LngLat => i.lngLat ?? porcentajeALngLat(i.x, i.y);

export const RADIO_AGRUPAR_M = 300;
export const VENTANA_AGRUPAR_MIN = 180;

/** Incidente existente que podría agrupar un nuevo reporte: mismo tipo, cercano en distancia real y reciente. */
export function candidatoIncidente(items: Incidente[], q: { tipo: string; lngLat: LngLat; ahora?: number }) {
  const ahora = q.ahora ?? Date.now();
  let mejor: { inc: Incidente; dist: number; minutos: number } | null = null;
  for (const i of items) {
    if (i.tipo !== q.tipo || estadoOpDe(i) === "Resuelta") continue;
    const d = distancia(posInc(i), q.lngLat);
    const min = (ahora - (i.ultimo ?? ahora - 30 * 60000)) / 60000;
    if (d <= RADIO_AGRUPAR_M && min <= VENTANA_AGRUPAR_MIN && (!mejor || d < mejor.dist)) mejor = { inc: i, dist: d, minutos: min };
  }
  return mejor;
}

export const ESTADOS_INST = [
  "Sin respuesta institucional registrada",
  "Ayuda solicitada",
  "Respuesta confirmada",
  "Atención en curso",
];

const seedRep = (id: string, autor: string, tipo: string, hora: string): Reporte => ({
  id, clientActionId: id, autor, tipo, medio: "ejemplo rotulado", hora, precision: "±20 m", lugarConfirmado: true, estado: "enviado",
});

export const INCIDENTES_INICIAL = {
  items: [
    { id: "INC-0007", titulo: "Calles anegadas en Campoy", tipo: "Inundación", zona: "Campoy · Sector 2", x: 46, y: 52, actualizado: "hace 25 min", inst: 0, reportes: [seedRep("r1", "rosa", "Inundación", "09:12"), seedRep("r2", "luis", "Inundación", "09:16")] },
    { id: "INC-0005", titulo: "Corte de agua en la avenida principal", tipo: "Corte de agua", zona: "Campoy · Av. Principal", x: 70, y: 30, actualizado: "hace 40 min", inst: 0, reportes: [seedRep("r3", "carmen", "Corte de agua", "08:55")] },
  ] as Incidente[],
};

export function useIncidentes() {
  return useDemoState("incidentes", INCIDENTES_INICIAL);
}

/** Personas distintas que reportaron (más fotos de la misma persona no suman testigos). */
export function autoresDistintos(inc: Incidente) {
  return new Set(inc.reportes.filter((r) => r.estado === "enviado").map((r) => r.autor)).size;
}

export function estadoCorroboracion(inc: Incidente) {
  return autoresDistintos(inc) >= 2 ? "Reportado por varios vecinos" : "Sin confirmar";
}

/** Une un reporte a un incidente existente o crea uno nuevo. Idempotente por clientActionId. */
export function registrarReporte(rep: Reporte, incidenteId: string | null, nuevo?: Partial<Incidente>) {
  const { items } = getDemo("incidentes", INCIDENTES_INICIAL);
  if (items.some((i) => i.reportes.some((r) => r.clientActionId === rep.clientActionId))) return incidenteId;
  if (incidenteId) {
    setDemo("incidentes", INCIDENTES_INICIAL, {
      items: items.map((i) => (i.id === incidenteId ? { ...i, actualizado: "ahora", reportes: [...i.reportes, rep] } : i)),
    });
    return incidenteId;
  }
  const id = `INC-${String(10 + items.length).padStart(4, "0")}`;
  const inc: Incidente = { id, titulo: nuevo?.titulo ?? `${rep.tipo} reportado`, tipo: rep.tipo, zona: nuevo?.zona ?? "Campoy", x: 30 + Math.round(Math.random() * 40), y: 30 + Math.round(Math.random() * 40), actualizado: "ahora", inst: 0, reportes: [rep] };
  setDemo("incidentes", INCIDENTES_INICIAL, { items: [inc, ...items] });
  return id;
}

/** Registra un reporte agrupándolo (si se indica un incidente) o creando uno nuevo con su ubicación real. Idempotente. */
export function registrarReporteAgrupado(rep: Reporte, o: { incidenteId: string | null; tipo: string; lngLat: LngLat; zona: string; titulo?: string; descripcion?: string; prioridad?: "Alta" | "Media" | "Baja" }) {
  const { items } = getDemo("incidentes", INCIDENTES_INICIAL);
  const previo = items.find((i) => i.reportes.some((r) => r.clientActionId === rep.clientActionId));
  if (previo) return { id: previo.id, unido: previo.reportes.length > 1 };
  const ahora = Date.now();
  if (o.incidenteId && items.some((i) => i.id === o.incidenteId)) {
    setDemo("incidentes", INCIDENTES_INICIAL, {
      items: items.map((i) => (i.id === o.incidenteId ? { ...i, actualizado: "ahora", ultimo: ahora, prioridad: o.prioridad === "Alta" ? "Alta" : i.prioridad, reportes: [...i.reportes, rep] } : i)),
    });
    return { id: o.incidenteId, unido: true };
  }
  const id = `INC-${String(10 + items.length).padStart(4, "0")}`;
  const inc: Incidente = { id, titulo: o.titulo ?? `${rep.tipo} en ${o.zona}`, tipo: rep.tipo, zona: o.zona, x: 50, y: 50, lngLat: o.lngLat, descripcion: o.descripcion, prioridad: o.prioridad ?? "Media", estadoOp: "Reportada", actualizado: "ahora", ultimo: ahora, creado: ahora, inst: 0, reportes: [rep] };
  setDemo("incidentes", INCIDENTES_INICIAL, { items: [inc, ...items] });
  return { id, unido: false };
}

/** Actualiza el estado operativo de una incidencia (Reportada, En atención, Resuelta): lo ven todas las pantallas. */
export function cambiarEstadoIncidente(id: string, estado: (typeof ESTADOS_OP)[number]) {
  const { items } = getDemo("incidentes", INCIDENTES_INICIAL);
  setDemo("incidentes", INCIDENTES_INICIAL, { items: items.map((i) => (i.id === id ? { ...i, estadoOp: estado, actualizado: "ahora" } : i)) });
}

/** Una incidencia con la forma que usa la ficha del mapa (reutiliza coordinaciones y chat con quien la reportó). */
export function entidadDeIncidente(i: Incidente) {
  const primero = i.reportes.find((r) => r.estado === "enviado")?.autor;
  return {
    key: i.id, nombre: i.titulo, msg: i.titulo, estado: "emergencia" as const, tipo: "emergencia" as const, sos: true, simulado: true, incId: i.id,
    necesidad: i.descripcion || `${autoresDistintos(i)} ${autoresDistintos(i) === 1 ? "vecino" : "vecinos"} · ${estadoCorroboracion(i)}`,
    origen: i.zona, lngLat: posInc(i), vecino: (primero ?? null) as VecinoId | null, categoria: i.tipo, descripcion: undefined as string | undefined,
  };
}

/** Envía los reportes pendientes de la cola offline sin duplicarlos. */
export function enviarPendientes(vigentes: boolean) {
  const { items } = getDemo("incidentes", INCIDENTES_INICIAL);
  let n = 0;
  const next = items
    .map((i) => ({
      ...i,
      reportes: i.reportes
        .filter((r) => r.estado === "enviado" || vigentes)
        .map((r) => {
          if (r.estado === "pendiente") n++;
          return { ...r, estado: "enviado" as const };
        }),
    }))
    .filter((i) => i.reportes.length > 0);
  setDemo("incidentes", INCIDENTES_INICIAL, { items: next });
  return n;
}
