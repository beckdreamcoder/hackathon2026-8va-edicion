"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSesion, useSellos, VECINOS, ubicacionCorta } from "@/lib/demo/shared";
import { screenStyles } from "./screen-styles";

const MES = "2026-11";
const TIPO_TXT = { favor: "Favores", cachuelo: "Cachuelos", movilidad: "Movilidad" };

/**
 * Vecino del mes: el vecino con más sellos de votación válidos del mes.
 * Los sellos vienen de coordinaciones completadas por ambas partes.
 */
export default function VecinoDelMes() {
  const router = useRouter();
  const [sesion] = useSesion();
  const [sellos] = useSellos();

  const closed = sesion.fecha.slice(0, 7) > MES;
  const validos = sellos.items.filter((s) => s.valido && s.mes === MES);
  const conteo = validos.reduce((acc, s) => ({ ...acc, [s.to]: (acc[s.to] ?? 0) + 1 }), {});
  const ranking = Object.entries(conteo).sort((a, b) => b[1] - a[1]);
  const max = ranking[0]?.[1] ?? 0;
  const ganadores = ranking.filter(([, n]) => n === max && max > 0).map(([id]) => VECINOS[id]?.name ?? id);
  const lider = ranking[0]?.[0] ?? null;
  const liderNombre = lider ? (VECINOS[lider]?.name ?? lider) : "Aún sin sellos";
  const sellosLider = lider ? validos.filter((s) => s.to === lider) : [];
  const resultado = ganadores.length === 0
    ? "Sin sellos este mes: todavía no hay ganador"
    : ganadores.length > 1
      ? `Reconocimiento compartido: ${ganadores.join(" y ")} con ${max} sellos`
      : `${ganadores[0]} con ${max} sellos`;


  return (
    <div className={screenStyles.screen}>
      <div className={screenStyles.frame}>
        <div className={screenStyles.header}>
          <button className={screenStyles.iconButton} aria-label="Volver" onClick={() => router.back()}>
            <svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <h1>Vecino del mes</h1>
        </div>
        <div className={screenStyles.content}>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="w-24 h-24 rounded-[50%] grid place-items-center bg-[#e6f0e4] text-[#2f5a2d]" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-none stroke-current stroke-[1.8] [stroke-linecap:round]"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
            </span>
            <h2 className="text-[24px]!">{liderNombre}</h2>
            <p className={screenStyles.muted}>{ubicacionCorta(sesion) || "Tu zona"} · {closed ? "noviembre 2026 · mes cerrado" : "noviembre 2026 · en curso"}</p>
            <span className={closed ? screenStyles.badgeAlert : screenStyles.badgeDemo}>{closed ? "Reconocimiento de noviembre" : "Avance del mes · no es ganador definitivo"}</span>
            {closed && (<p className="font-bold">{resultado}</p>)}
          </div>

          <h3 className="text-[19px]!">Sellos de noviembre</h3>
          <p className={screenStyles.muted}>Un sello por cada favor, cachuelo o movilidad completado este mes.</p>
          {sellosLider.length === 0 ? (
            <div className={screenStyles.card}><p className={screenStyles.muted}>Aún no tiene sellos de votación este mes.</p></div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {Object.keys(TIPO_TXT).map((tipo) => (
                <div key={tipo} className={`${screenStyles.card} items-center! text-center! p-3!`}>
                  <span className="text-[26px] font-extrabold text-(--color-brand)">{sellosLider.filter((s) => s.tipo === tipo).length}</span>
                  <span className={`${screenStyles.muted} text-[13px]!`}>{TIPO_TXT[tipo]}</span>
                </div>
              ))}
            </div>
          )}

          {ranking.length > 1 && (<>
            <h3 className="text-[19px]!">Ranking del mes</h3>
            {ranking.slice(0, 3).map(([id, n]) => (
              <div key={id} className={`${screenStyles.card} flex-row! items-center! justify-between!`}>
                <b>{VECINOS[id]?.name ?? id}</b>
                <span className={screenStyles.muted}>{n} sellos</span>
              </div>
            ))}
          </>)}

          <p className={screenStyles.muted}>Los sellos vienen de coordinaciones completadas por ambas partes. No suman clics, dinero aportado ni exposición al peligro. El reconocimiento no verifica oficialmente a nadie.</p>

        </div>
      </div>
    </div>
  );
}
