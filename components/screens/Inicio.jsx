"use client";

import { Fragment } from "react";
import { screenStyles } from "./screen-styles";
import { useSesion, useAvisos, VECINOS } from "@/lib/demo/shared";
import { useDemoState } from "@/lib/demo/store";

/**
 * Pantalla Inicio del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
const PERFIL_MIN = { nombres: {}, leidos: [] };

export default function Inicio() {
  const [sesion] = useSesion();
  const [perfil] = useDemoState("perfil", PERFIL_MIN);
  const [avisos] = useAvisos();
  const nombre = perfil.nombres?.[sesion.userId] ?? VECINOS[sesion.userId]?.name ?? "María";
  const sinLeer = avisos.items.filter((a) => !a.leida).length + Math.max(0, 3 - (perfil.leidos?.length ?? 0));
  const offline = sesion.senal === "Sin datos";
  return (
    <div className="m-0 bg-white text-(--color-ink) font-[Nunito,system-ui,sans-serif] text-[17px] leading-[1.4] [&_h1]:font-[Nunito,system-ui,sans-serif] [&_h1]:m-0 [&_h1]:leading-[1.15] [&_h2]:font-[Nunito,system-ui,sans-serif] [&_h2]:m-0 [&_h2]:leading-[1.15] [&_h3]:font-[Nunito,system-ui,sans-serif] [&_h3]:m-0 [&_h3]:leading-[1.15] [&_p]:m-0 [&_:focus-visible]:outline-3 [&_:focus-visible]:outline-(--color-ink) [&_:focus-visible]:outline-offset-2">
      <div className={screenStyles.frame}>
      <div className="pt-3 pr-3 pb-1 pl-4 flex! items-center! gap-3! min-h-16! flex-none!">
        <span className="w-13 h-13 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[22px] flex-none bg-[#f4d9c6] text-[#8a2b07] border-2 border-white shadow-[0_0_0_1px_#E3DDD7]" aria-hidden="true">{nombre.charAt(0)}</span>
        <div className="min-w-0 flex-1!"><h1 className="text-[24px]!">Hola, {nombre}</h1><p className={`${screenStyles.muted} flex! items-center! gap-1!`}><svg className="w-6 h-6 fill-current stroke-none stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic w-4.5! h-4.5! text-(--color-brand)!" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 2.009c-2.762 0-5 2.229-5 4.99c0 4.774 5 11 5 11s5-6.227 5-11c0-2.76-2.238-4.99-5-4.99m0 7.751a2.7 2.7 0 1 1 0-5.4a2.7 2.7 0 0 1 0 5.4" /></svg>{sesion.localidad}{sesion.juntaId ? "" : " · sin junta"}</p></div>
        <a className="w-12 h-12 grid place-items-center rounded-[16px] text-(--color-ink) relative" href="/notificaciones" aria-label={`Avisos, ${sinLeer} sin leer`}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4" /></svg>{sinLeer > 0 && (<i className="absolute top-2.5 right-[11px] w-2.5 h-2.5 rounded-[50%] bg-(--color-brand) border-2 border-white"></i>)}</a>
      </div>
      <div className={`${screenStyles.content} gap-3.5!`}>
        {offline && (<a href="/offline" className="bg-[#f1ece6] rounded-[16px] px-3.5 py-2.5 text-[15px] font-bold" role="status">Sin conexión · ves datos guardados. Ver pendientes</a>)}
        <svg viewBox="0 0 177 26" role="img" aria-labelledby="sep-title" className="w-full! h-auto! block!"><title id="sep-title">Separador con murallas escalonadas y siete cuadrados</title><path d="M0 15H5V17.5H13V15H20V12.5H24V10H27.5V5.5H34.5V10H38V12.5H42V15H53V17.5H56.5V21.5H63.5V17.5H67V15H77.5V12.5H81.5V10H85V5.5H92V10H95.5V12.5H99.5V15H110V17.5H113.5V21.5H120.5V17.5H124V15H134.5V12.5H138.5V10H142V5.5H149V10H152.5V12.5H156.5V15H164V17.5H172V15H177" fill="none" stroke="#a19790" strokeWidth="0.85" strokeLinejoin="round" /><g fill="none" stroke="#bd1227" strokeWidth="0.95"><rect x="7" y="9.5" width="3.5" height="3.5" /><rect x="29.25" y="14.5" width="3.5" height="3.5" /><rect x="58.25" y="9.5" width="3.5" height="3.5" /><rect x="86.75" y="14.5" width="3.5" height="3.5" /><rect x="115.25" y="9.5" width="3.5" height="3.5" /><rect x="143.75" y="14.5" width="3.5" height="3.5" /><rect x="167" y="9.5" width="3.5" height="3.5" /></g></svg>
        <h2 className="text-center text-[36px]! font-extrabold! px-2! py-1!">Conecta. Ayuda. Comparte.</h2>
        <div className="flex! justify-center!" aria-hidden="true"><svg viewBox="0 0 250 42" role="img" aria-labelledby="sep-title2" className="w-full! h-auto! block!"><title id="sep-title2">Separador de tres rombos rojos</title><path d="M13 23.5H84 M167 23.5H238" fill="none" stroke="#a19790" strokeWidth="1.2" strokeLinecap="round" /><path d="M103.5 17.5l6 6-6 6-6-6Z M125.5 17.5l6 6-6 6-6-6Z M147.5 17.5l6 6-6 6-6-6Z" fill="none" stroke="#c81024" strokeWidth="2.2" strokeLinejoin="round" /></svg></div>
      
        <a className="flex items-center gap-3.5 rounded-[20px] p-4.5 min-h-28 w-full text-left bg-white border-2 border-(--color-brand) shadow-[0_2px_8px_rgba(32,33,36,.05)] [&_.ic]:w-13.5 [&_.ic]:h-13.5 [&_.ic]:stroke-[1.8] [&_b]:block [&_b]:font-[Nunito,system-ui,sans-serif] [&_b]:text-[24px] [&_b]:leading-[1.1] [&_span.t]:text-[16px] text-(--color-ink)! bg-white! gap-0!" href="/comunidad">
          <span className="min-w-0 flex! items-center! gap-3.5! flex-1!">
            <svg className="w-6 h-6 fill-current stroke-none stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic text-(--color-brand)!" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7m-1.5 8a4 4 0 0 0-4 4a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2a4 4 0 0 0-4-4zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293a3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2a4 4 0 0 0-4-4h-1.1a5.5 5.5 0 0 1-.471.762A6 6 0 0 1 19.5 18M4 7.5a3.5 3.5 0 0 1 5.477-2.889a5.5 5.5 0 0 0-2.796 6.293A3.5 3.5 0 0 1 4 7.5M7.1 12H6a4 4 0 0 0-4 4a2 2 0 0 0 2 2h.5a6 6 0 0 1 3.071-5.238A5.5 5.5 0 0 1 7.1 12" /></svg>
            <span className="block!"><b>Mi comunidad</b><span className="text-(--color-muted) text-[15px] t">Favores, cachuelos y ayuda cercana</span></span>
          </span>
        </a>
        <a className="flex items-center gap-3.5 rounded-[22px] p-4.5 min-h-28 w-full text-left [&_.ic]:w-13.5 [&_.ic]:h-13.5 [&_.ic]:stroke-[1.8] [&_b]:block [&_b]:font-[Nunito,system-ui,sans-serif] [&_b]:text-[24px] [&_b]:leading-[1.1] [&_span.t]:text-[16px] bg-(--color-brand)! border-2! border-(--color-brand)! text-white! gap-0!" href="/solidaria">
          <span className="min-w-0 flex! items-center! gap-3.5! flex-1!">
            <svg className="w-6 h-6 fill-current stroke-none stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 512 512" aria-hidden="true"><g fill="currentColor"><path d="M256 33C216-9 153-11 112 27c-42 39-42 105 0 147l138 138a8.5 8.5 0 0 0 12 0l138-138c42-42 42-108 0-147-41-38-104-36-144 6Z" /><path id="rs-hand" d="M104 512a9 9 0 0 1-9-10l5-60-83-110A72 72 0 0 1 2 285l9-132a32 32 0 0 1 64 2l-1 108 45 59c9 11 21 15 33 12l-50-64c-11-14-8-31 4-41 13-11 30-9 41 4l74 88c15 18 22 38 21 61l-1 121a9 9 0 0 1-9 9Z" /><use href="#rs-hand" transform="translate(512 0) scale(-1 1)" /></g></svg>
            <span className="block!"><b>Red solidaria</b><span className="t">Noticias y campañas de apoyo</span></span>
          </span>
        </a>
        <a className="bg-white border border-(--color-line) rounded-[20px] shadow-[0_2px_8px_rgba(32,33,36,.05)] flex! items-center! gap-3! min-h-16! px-4! py-0!" href="/junta"><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic text-(--color-brand)!" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 17H4a1 1 0 0 1-1-1a3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1a3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3a1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z" /></svg><b className="flex-1!">Mi junta vecinal</b><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></a>
      </div>
      <nav className="absolute left-3 right-3 bottom-3 z-10 flex bg-white px-1.5 py-2 border border-[#ede9e6] rounded-[28px] shadow-[0_8px_24px_rgba(32,33,36,.14)] [&_a]:flex-1 [&_a]:min-h-14 [&_a]:flex [&_a]:flex-col [&_a]:items-center [&_a]:justify-center [&_a]:gap-0.5 [&_a]:text-[13px] [&_a]:text-(--color-muted) [&_a]:rounded-[14px] [&_a.on]:text-(--color-brand) [&_a.on]:font-bold" aria-label="Principal">
        <a className="on" href="/inicio" aria-current="page"><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a href="/mapa"><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a href="/perfil"><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      </div>
    </div>
  );
}
