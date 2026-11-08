"use client";

import { screenStyles } from "@/components/screens/screen-styles";
import { ESTADO_CAMPANA } from "@/lib/demo/campanas";

export const pct = (c) => Math.min(100, Math.round((c.progreso / Math.max(1, c.meta)) * 100));

/** Barra de progreso de una campaña (solo aportes confirmados por el organizador). */
export function Progreso({ c }) {
  const p = pct(c);
  return (
    <div className="flex flex-col gap-1">
      <div className="h-2.5 rounded-full bg-[#f1ece6] overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p} aria-label={`Progreso de la campaña: ${p}%`}><div className="h-full bg-[#1f6f7a]" style={{ width: `${p}%` }} /></div>
      <p className="text-[13px] text-(--color-muted)">{Math.round(c.progreso * 10) / 10} de {c.meta} unidades · {p}%{c.comprometido > 0 ? ` · +${Math.round(c.comprometido * 10) / 10} por confirmar` : ""}</p>
    </div>
  );
}

const claseEstado = (e) => (e === "activa" ? screenStyles.badgeFavor : e === "proxima" ? screenStyles.badgeDemo : screenStyles.badge);

/** Tarjeta seleccionable de una campaña. */
export default function CampanaTarjeta({ c, onAbrir }) {
  return (
    <button className={screenStyles.card} onClick={() => onAbrir(c)} aria-label={`${c.titulo}, ${ESTADO_CAMPANA[c.estado]}, abrir campaña`}>
      {c.imagen && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.imagen} alt={`Imagen de la campaña ${c.titulo}`} className="w-full h-28 object-cover rounded-[14px]" />
      )}
      <div className={screenStyles.row}><span className={screenStyles.badgeSolidarity}>Campaña</span><span className={claseEstado(c.estado)}>{ESTADO_CAMPANA[c.estado]}</span>{c.simulado && (<span className={`${screenStyles.badgeDemo} ml-auto`}>Ejemplo</span>)}</div>
      <h3 className="text-[20px]!">{c.titulo}</h3>
      <p className={screenStyles.muted}>{c.organizador} · {c.zona}</p>
      <Progreso c={c} />
    </button>
  );
}
