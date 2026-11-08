"use client";

import { useMemo } from "react";
import { usePublicaciones } from "./publicaciones";
import { useCoordinaciones, type Coordinacion } from "./coordinaciones";
import { useSesion, type VecinoId } from "./shared";
import { COMUNIDAD_SIM } from "@/lib/map/comunidad";
import { RECURSOS_SIM, CLASES_RECURSO } from "@/lib/map/recursos-sim";
import { distancia, porcentajeALngLat, type LngLat } from "@/lib/map/geo";
import { MI_ZONA } from "@/lib/map/personas";

/**
 * Catálogo único de publicaciones (favores, cachuelos y movilidad): las creadas en Publicar y las de la comunidad simulada.
 * Todas las pantallas (muro, búsqueda, cachuelos, mapa) leen el mismo ID; el estado se deriva de las coordinaciones.
 */
export type TipoCat = "favor" | "cachuelo" | "movilidad";
export type EstadoCat = "abierto" | "en_coordinacion" | "completado" | "cancelado";

export const ESTADOS_CAT: Record<EstadoCat, string> = { abierto: "Abierto", en_coordinacion: "En coordinación", completado: "Completado", cancelado: "Cancelado" };
export const TIPOS_CAT: Record<TipoCat, string> = { favor: "Favor", cachuelo: "Cachuelo", movilidad: "Movilidad" };

export type PublicacionCat = {
  id: string;
  origen: "pub" | "sim";
  tipo: TipoCat;
  modo: "pido" | "ofrezco";
  titulo: string;
  descripcion: string;
  categoria: string;
  ubicacion: string;
  distrito: string;
  vecino: VecinoId;
  fecha: string;
  /** Marca de tiempo para ordenar por fecha (0 en la comunidad simulada). */
  creado: number;
  disponibilidad: string;
  pago: string | null;
  simulado: boolean;
  lngLat: LngLat;
  /** Metros desde mi zona. */
  dist: number;
  estado: EstadoCat;
  pendientes: number;
  /** Recursos comunitarios: unidades y entregas confirmadas. */
  recurso?: { clase: string; cantidad: number; unidad: string; restante: number };
  /** Objeto con la forma que espera el motor de coordinaciones. */
  pubLike: { id: string; tipo: "favor" | "cachuelo"; modo: "pido" | "ofrezco"; autor: VecinoId; titulo: string; categoria: string; estado: "publicado" };
};

export const DISTRITO_PROPIO = "San Juan de Lurigancho";

const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 997, 7);
const pagoDe = (p: string | null | undefined) => {
  const t = (p ?? "").toString().trim();
  if (!t) return "A convenir";
  return /^\d+([.,]\d+)?$/.test(t) ? `S/ ${t}` : t;
};

/** Coordinaciones de una publicación: por ID (motor) o las abiertas desde el mapa con el mismo título y vecino. */
export function relacionadas(items: Coordinacion[], vm: Pick<PublicacionCat, "id" | "tipo" | "titulo" | "vecino">) {
  return items.filter((c) => c.tipo === vm.tipo && (c.pubId === vm.id || (c.pubId?.startsWith("mapa:") && c.titulo === vm.titulo && (c.solicitante === vm.vecino || c.receptor === vm.vecino))));
}

function estadoDe(rel: Coordinacion[], cancelada: boolean): EstadoCat {
  if (cancelada) return "cancelado";
  if (rel.some((c) => c.estado === "completada")) return "completado";
  if (rel.some((c) => c.estado === "aceptada" || c.estado === "acordada")) return "en_coordinacion";
  return "abierto";
}

export function useCatalogo(): PublicacionCat[] {
  const [pubs] = usePublicaciones();
  const [co] = useCoordinaciones();
  const [sesion] = useSesion();
  return useMemo(() => {
    const propios = pubs.items.filter((p) => (p.estado === "publicado" || p.estado === "cancelada") && p.tipo !== "campana").map((p) => {
      const tipo: TipoCat = p.tipo === "cachuelo" ? "cachuelo" : p.categoria === "Movilidad" ? "movilidad" : "favor";
      const lngLat = porcentajeALngLat(15 + (hash(p.id) % 70), 15 + (hash(p.id + "y") % 55));
      return {
        id: p.id, origen: "pub" as const, tipo, modo: p.modo, titulo: p.titulo, descripcion: p.descripcion, categoria: p.categoria || "Servicio", ubicacion: p.zona,
        distrito: p.distrito ?? DISTRITO_PROPIO, vecino: p.autor as VecinoId, fecha: p.fecha, creado: Number(p.id.split("-")[1]) || 0, disponibilidad: p.disponibilidad,
        pago: tipo === "cachuelo" ? pagoDe(p.precio) : null, simulado: false, lngLat, dist: distancia(MI_ZONA, lngLat), _cancelada: p.estado === "cancelada",
        recurso: p.recurso ? { ...p.recurso, restante: p.recurso.cantidad } : undefined,
        pubLike: { id: p.id, tipo: (p.tipo === "cachuelo" ? "cachuelo" : "favor") as "favor" | "cachuelo", modo: p.modo, autor: p.autor as VecinoId, titulo: p.titulo, categoria: p.categoria, estado: "publicado" as const },
      };
    });
    const sim = COMUNIDAD_SIM.filter((c) => c.tipo !== "emergencia").map((c) => {
      const tipo = c.tipo as TipoCat;
      const modo = c.estado === "solicita" ? "pido" : "ofrezco";
      return {
        id: c.key, origen: "sim" as const, tipo, modo: modo as "pido" | "ofrezco", titulo: c.titulo, descripcion: c.descripcion, categoria: c.categoria, ubicacion: c.distrito,
        distrito: c.distrito, vecino: c.vecino, fecha: sesion.fecha, creado: 0, disponibilidad: "Esta semana · se acuerda en la coordinación",
        pago: tipo === "cachuelo" ? pagoDe(c.pago) : null, simulado: true, lngLat: c.lngLat, dist: distancia(MI_ZONA, c.lngLat), _cancelada: false,
        pubLike: { id: c.key, tipo: (tipo === "cachuelo" ? "cachuelo" : "favor") as "favor" | "cachuelo", modo: modo as "pido" | "ofrezco", autor: c.vecino, titulo: c.titulo, categoria: tipo === "movilidad" ? "Movilidad" : c.categoria, estado: "publicado" as const },
      };
    });
    const recursos = RECURSOS_SIM.map((r) => {
      const lngLat = porcentajeALngLat(15 + (hash(r.key) % 70), 15 + (hash(r.key + "y") % 55));
      const cat = `Recurso · ${CLASES_RECURSO[r.clase]}`;
      return {
        id: r.key, origen: "sim" as const, tipo: "favor" as TipoCat, modo: r.modo, titulo: r.titulo, descripcion: r.descripcion, categoria: cat, ubicacion: r.zona, distrito: r.distrito, vecino: r.vecino,
        fecha: sesion.fecha, creado: 0, disponibilidad: "Según la entrega acordada", pago: null, simulado: true, lngLat, dist: distancia(MI_ZONA, lngLat), _cancelada: false,
        recurso: { clase: r.clase, cantidad: r.cantidad, unidad: r.unidad, restante: r.cantidad },
        pubLike: { id: r.key, tipo: "favor" as const, modo: r.modo, autor: r.vecino, titulo: r.titulo, categoria: cat, estado: "publicado" as const },
      };
    });
    return [...propios, ...sim, ...recursos].map(({ _cancelada, ...vm }) => {
      const rel = relacionadas(co.items, vm);
      let estado = estadoDe(rel, _cancelada);
      let recurso = (vm as { recurso?: PublicacionCat["recurso"] }).recurso;
      if (recurso) {
        // La disponibilidad baja con cada entrega confirmada (coordinación completada)
        const restante = Math.max(0, recurso.cantidad - rel.filter((c) => c.estado === "completada").length);
        recurso = { ...recurso, restante };
        if (!_cancelada) estado = restante <= 0 ? "completado" : rel.some((c) => c.estado === "aceptada" || c.estado === "acordada") ? "en_coordinacion" : "abierto";
      }
      return { ...vm, recurso, estado, pendientes: rel.filter((c) => c.estado === "solicitada").length } as PublicacionCat;
    });
  }, [pubs.items, co.items, sesion.fecha]);
}
