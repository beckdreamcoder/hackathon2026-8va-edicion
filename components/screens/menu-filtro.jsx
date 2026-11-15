"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Menú de filtro propio (no el del sistema): botón redondeado y lista con la opción activa en rojo.
 * `opciones` es una lista de { id, name }. `derecha` alinea la lista a la derecha del botón.
 */
export function MenuFiltro({ label, valor, opciones, onChange, derecha = false }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);
  const actual = opciones.find((o) => o.id === valor) ?? opciones[0];
  useEffect(() => {
    if (!abierto) return undefined;
    const fuera = (e) => { if (!ref.current?.contains(e.target)) setAbierto(false); };
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, [abierto]);
  return (
    <div ref={ref} className="relative min-w-0">
      <span className="block mb-1 text-[12px] font-bold text-(--color-muted)">{label}</span>
      <button type="button" aria-haspopup="listbox" aria-expanded={abierto} aria-label={`${label}: ${actual.name}`} onClick={() => setAbierto((v) => !v)} className={`w-full min-h-11 min-w-0 rounded-[14px] border-[1.5px] bg-white px-3 flex items-center justify-between gap-1 font-bold text-[14px] text-(--color-ink) ${abierto ? "border-(--color-brand)" : "border-[#cfc7bf]"}`}>
        <span className="truncate">{actual.name}</span>
        <svg className={`w-4 h-4 flex-none fill-none stroke-current stroke-2 transition-transform ${abierto ? "rotate-180" : ""}`} viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {abierto && (
        <ul role="listbox" aria-label={label} className={`absolute z-30 ${derecha ? "right-0" : "left-0"} w-max min-w-full mt-1.5 rounded-[18px] border border-(--color-line) bg-white shadow-[0_10px_24px_rgba(32,33,36,.18)] p-1.5 flex flex-col gap-1`}>
          {opciones.map((o) => (
            <li key={o.id} role="option" aria-selected={o.id === valor}>
              <button type="button" onClick={() => { onChange(o.id); setAbierto(false); }} className={`w-full text-left rounded-[12px] px-3 min-h-10 text-[14px] font-bold ${o.id === valor ? "bg-(--color-brand) text-white" : "text-(--color-ink) hover:bg-[#f7f3ee]"}`}>{o.name}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
