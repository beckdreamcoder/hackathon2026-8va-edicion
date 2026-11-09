"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSinConexion } from "@/lib/demo/conexion";
import { useCola, procesarCola, pendientesCola } from "@/lib/demo/cola";
import { usePublicaciones } from "@/lib/demo/publicaciones";
import { useIncidentes } from "@/lib/demo/incidentes";
import { usePwa, aplicarActualizacion } from "@/lib/pwa";

/**
 * Indicador discreto de conexión y de pendientes. Al volver la conexión aplica la cola local en este dispositivo
 * (no hay servidor: nunca se dice que algo se sincronizó con uno).
 */
export function Conexion() {
  const sinConexion = useSinConexion();
  const [cola] = useCola();
  const [pubs] = usePublicaciones();
  const [incs] = useIncidentes();
  const pwa = usePwa();
  const [aviso, setAviso] = useState("");
  const antes = useRef(sinConexion);

  const pendCola = pendientesCola(cola.items).length;
  const pendPubs = pubs.items.filter((p) => p.estado === "pendiente").length;
  const pendReps = incs.items.reduce((n, i) => n + i.reportes.filter((r) => r.estado === "pendiente").length, 0);
  const pendientes = pendCola + pendPubs + pendReps;

  // Al recuperar la conexión se aplica la cola de solicitudes y mensajes
  useEffect(() => {
    if (antes.current && !sinConexion) {
      const t = setTimeout(() => {
        const r = procesarCola();
        const resto = pendPubs + pendReps;
        setAviso(r.total
          ? `Conexión restaurada. ${r.aplicadas} operación(es) aplicadas en este dispositivo${r.errores ? ` y ${r.errores} con error` : ""}. No hay servidor: nada se envió fuera de la app.${resto ? ` Tienes ${resto} envío(s) por confirmar en Pendientes.` : ""}`
          : resto ? `Conexión restaurada. Tienes ${resto} envío(s) por confirmar en Pendientes.` : "Conexión restaurada.");
      }, 0);
      antes.current = sinConexion;
      return () => clearTimeout(t);
    }
    antes.current = sinConexion;
    return undefined;
  }, [sinConexion, pendPubs, pendReps]);
  useEffect(() => {
    if (!aviso) return undefined;
    const t = setTimeout(() => setAviso(""), 7000);
    return () => clearTimeout(t);
  }, [aviso]);

  const etiqueta = sinConexion
    ? `Sin conexión · tus datos guardados siguen disponibles${pendientes ? ` · ${pendientes} pendiente${pendientes === 1 ? "" : "s"}` : ""}`
    : pendientes ? `${pendientes} pendiente${pendientes === 1 ? "" : "s"} de enviar` : "";

  return (
    <div className="fixed top-1.5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 max-w-[92vw] pointer-events-none" aria-live="polite">
      {etiqueta && (
        <Link href="/offline" className={`pointer-events-auto rounded-full px-3 py-0.5 text-[12px] font-bold shadow-[0_1px_4px_rgba(0,0,0,.18)] border ${sinConexion ? "bg-[#fff4d6] text-[#5c3d00] border-[#e6c77a]" : "bg-white text-(--color-ink) border-(--color-line)"}`} role="status">{etiqueta}</Link>
      )}
      {aviso && (<p className="pointer-events-auto rounded-[14px] px-3 py-1.5 text-[13px] bg-[#e6f0e4] text-[#2f5a2d] border border-[#b9d5b5] font-bold" role="status">{aviso}</p>)}
      {pwa.actualizacionLista && (
        <p className="pointer-events-auto rounded-[14px] px-3 py-1.5 text-[13px] bg-white border border-(--color-line) shadow-[0_1px_4px_rgba(0,0,0,.18)] flex items-center gap-2" role="status">
          Hay una versión nueva de BarrioConecta.
          <button className="font-bold text-(--color-brand) underline" onClick={aplicarActualizacion}>Actualizar</button>
        </p>
      )}
    </div>
  );
}
