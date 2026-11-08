"use client";

import { screenStyles } from "./screen-styles";
import { VECINOS } from "@/lib/demo/shared";

/** Tarjeta de una publicación creada en la demo (mismo registro en muro y mapa). */
export function PostCard({ p }) {
  const tag = p.tipo === "cachuelo" ? (p.precio || "A convenir") : p.tipo === "campana" ? "Solidaridad" : "Gratis";
  const tagCls = p.tipo === "cachuelo" ? screenStyles.badgeCachuelo : p.tipo === "campana" ? screenStyles.badgeSolidarity : screenStyles.badgeFavor;
  const autor = VECINOS[p.autor]?.name ?? "Tú";
  return (
    <div className={screenStyles.card}>
      <div className={screenStyles.row}>
        <span className={tagCls}>{tag}</span>
        <span className={screenStyles.badge}>{p.estado === "pendiente" ? "Pendiente de enviar" : "Abierta"}</span>
        <span className="flex-1 min-w-0 text-(--color-muted) text-[15px] text-right">{p.alcance === "junta" ? "Mi junta" : "Mi comunidad"}</span>
      </div>
      <h3 className="text-[19px]!">{p.titulo}</h3>
      <p className={screenStyles.muted}>{p.categoria} · {p.zona} · {p.disponibilidad}</p>
      <p className={screenStyles.muted}>Publicado por {autor} (tú)</p>
    </div>
  );
}
