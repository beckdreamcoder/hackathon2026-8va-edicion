"use client";

import { useDemoState } from "./store";

/** Regla MVP configurable: máximo de solicitudes de cachuelo publicadas por usuario y día. */
export const LIMITE_CACHUELOS = 3;

export type PublicacionDemo = {
  id: string;
  /** Identificador idempotente para reintentos de la cola offline. */
  clientActionId: string;
  tipo: "favor" | "cachuelo" | "campana";
  modo: "pido" | "ofrezco";
  autor: string;
  fecha: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  disponibilidad: string;
  precio: string | null;
  responsable: string;
  plazo: string;
  formas: string[];
  alcance: "junta" | "comunidad";
  zona: string;
  estado: "publicado" | "pendiente";
};

export const PUBLICACIONES_INICIAL = { items: [] as PublicacionDemo[] };

export function usePublicaciones() {
  return useDemoState("publicaciones", PUBLICACIONES_INICIAL);
}
