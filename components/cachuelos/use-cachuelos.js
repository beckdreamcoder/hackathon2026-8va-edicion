"use client";

import { useMemo } from "react";
import { useCatalogo, relacionadas, ESTADOS_CAT } from "@/lib/demo/catalogo";

export { relacionadas };
export const ESTADO_CACH = { abierto: "Abierto", en_coordinacion: "En coordinación", completado: "Completado" };

/** Cachuelos del catálogo único (mismo ID y estado que en búsqueda y mapa). Los cancelados no se listan. */
export function useCachuelos() {
  const todo = useCatalogo();
  return useMemo(() => todo.filter((v) => v.tipo === "cachuelo" && v.estado !== "cancelado").map((v) => ({ ...v, pago: v.pago ?? "A convenir" })), [todo]);
}

export { ESTADOS_CAT };
