"use client";

import PublicacionDetalle from "@/components/publicaciones/PublicacionDetalle";

/** Detalle de un cachuelo: usa el detalle común de publicaciones (mismo motor de coordinaciones). */
export default function CachueloDetalle({ vm }) {
  return <PublicacionDetalle vm={vm} />;
}
