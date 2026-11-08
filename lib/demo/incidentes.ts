"use client";

import { getDemo, setDemo, useDemoState } from "./store";

export type Reporte = {
  id: string;
  clientActionId: string;
  autor: string;
  tipo: string;
  medio: "cámara" | "ejemplo rotulado" | "SMS";
  hora: string;
  precision: string;
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
  /** Índice en ESTADOS_INST; siempre rotulado como simulación. */
  inst: number;
  reportes: Reporte[];
};

export const ESTADOS_INST = [
  "Sin respuesta institucional registrada",
  "Ayuda solicitada · simulación",
  "Respuesta confirmada · simulación",
  "Atención en curso · simulación",
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
