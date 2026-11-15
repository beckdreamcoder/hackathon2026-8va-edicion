"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSesion } from "@/lib/demo/shared";
import { useDemoState, setDemo } from "@/lib/demo/store";

const CLAVE = "modo-emergencia";
const INICIAL = { activo: false };

/**
 * Modo emergencia: se activa y desactiva con Ctrl + Shift + E.
 * Muestra una pantalla de emergencia con llamadas y consulta por SMS.
 * Al activarlo, el dispositivo pasa a «Sin conexión» (así funciona la consulta por SMS).
 */
export function ModoEmergencia() {
  const pathname = usePathname();
  const [modo] = useDemoState(CLAVE, INICIAL);
  const [vista, setVista] = useState<"inicio" | "llamadas">("inicio");
  const [sesion, setSesion] = useSesion();

  const alternar = () => {
    const nuevo = !modo.activo;
    setDemo(CLAVE, INICIAL, { activo: nuevo });
    setSesion({ senal: nuevo ? "Sin datos" : "Normal" });
  };

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        alternar();
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo.activo, sesion.senal]);

  // En la consulta por SMS no se tapa la pantalla: ahí ya está el servicio
  if (!modo.activo || pathname.startsWith("/offline")) return null;

  // Números de emergencia de Perú
  const NUMEROS = [
    { nombre: "Policía", numero: "105", icono: "M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z" },
    { nombre: "Ambulancia (SAMU)", numero: "106", icono: "M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" },
    { nombre: "Bomberos", numero: "116", icono: "M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z" },
  ];

  if (vista === "llamadas") {
    return (
      <div role="alertdialog" aria-modal="true" aria-labelledby="llam-t" className="fixed inset-0 z-[90] bg-[#7a0c14] text-white flex flex-col items-center justify-center gap-5 px-6 text-center">
        <h1 id="llam-t" className="text-[26px] font-extrabold">Llamadas de emergencia</h1>
        <p className="text-[15px] opacity-90">Toca el número que necesitas. Se abre tu marcador.</p>
        <div className="w-full max-w-[22rem] flex flex-col gap-3">
          {NUMEROS.map((n) => (
            <a key={n.numero} href={`tel:${n.numero}`} className="min-h-16 rounded-[18px] bg-white text-[#7a0c14] font-extrabold flex items-center gap-3 px-4 text-left">
              <span className="w-11 h-11 rounded-[50%] bg-[#7a0c14] text-white grid place-items-center flex-none" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d={n.icono} /></svg>
              </span>
              <span className="flex-1">{n.nombre}</span>
              <span className="text-[20px]">{n.numero}</span>
            </a>
          ))}
        </div>
        <button type="button" onClick={() => setVista("inicio")} className="min-h-11 px-3 text-[14px] underline opacity-90">Volver</button>
      </div>
    );
  }

  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="emerg-t" className="fixed inset-0 z-[90] bg-[#7a0c14] text-white flex flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="w-24 h-24 rounded-[50%] bg-white/15 grid place-items-center" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="w-14 h-14 fill-none stroke-current stroke-[2] [stroke-linecap:round] [stroke-linejoin:round]"><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.5" /></svg>
      </span>
      <div className="flex flex-col gap-1">
        <h1 id="emerg-t" className="text-[28px] font-extrabold">Modo emergencia</h1>
        <p className="text-[15px] opacity-90">Elige cómo pedir ayuda.</p>
      </div>
      <div className="w-full max-w-[22rem] flex flex-col gap-3">
        <button type="button" onClick={() => setVista("llamadas")} className="min-h-14 rounded-[18px] bg-white text-[#7a0c14] font-extrabold text-[17px] flex items-center justify-center">Llamadas de emergencia</button>
        <a href="/offline?vista=sms" className="min-h-14 rounded-[18px] border-2 border-white text-white font-extrabold text-[17px] flex items-center justify-center">Servicio SMS</a>
      </div>
      <button type="button" onClick={alternar} className="min-h-11 px-3 text-[14px] underline opacity-90">Salir del modo emergencia</button>
      <p className="text-[12px] opacity-70">Atajo: Ctrl + Shift + E</p>
    </div>
  );
}
