"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { screenStyles } from "@/components/screens/screen-styles";
import { useSesion } from "@/lib/demo/shared";
import { useCoordinaciones, esActiva, participa, cambiarUsuarioDemo } from "@/lib/demo/coordinaciones";
import { ESTADO_PERSONA } from "@/lib/map/personas";
import { km, minutos } from "@/lib/map/geo";
import { IconoPersona } from "./FichasMapa";

const ACCION = "min-h-10 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-3.5 font-bold text-[14px] whitespace-nowrap text-white disabled:opacity-50";
const ACCION_2 = "min-h-10 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 font-bold text-[14px] whitespace-nowrap text-(--color-ink)";

/**
 * Ficha de una persona con una ruta de RutaJuntos activa: compatibilidad, propuesta de aventón con
 * respuesta simulada y chat opcional. Enviar la propuesta no acepta ni abre el chat.
 */
export default function FichaRuta({ s, rj, onCerrar }) {
  const router = useRouter();
  const [sesion] = useSesion();
  const [co] = useCoordinaciones();
  const [redactando, setRedactando] = useState(false);
  const [texto, setTexto] = useState("Voy hacia mi destino, ¿te queda de camino?");
  const [aviso, setAviso] = useState("");
  const prop = rj.propuestas[s.id];
  const abordo = rj.pas[s.id];
  const ev = s.ev;
  const bloqueado = !!ev?.motivos.some((m) => /bloqueo/i.test(m));
  const enCurso = prop?.estado === "enviada" || prop?.estado === "aceptada" || !!abordo;
  const info = ESTADO_PERSONA[s.estado ?? "solicita"];

  const enviar = () => {
    const r = rj.proponer(s.pLike, texto);
    if (!r.ok) { setAviso(r.error); return; }
    setAviso(""); setRedactando(false);
  };
  const chatear = () => {
    const previa = co.items.find((c) => esActiva(c) && participa(c, s.vecino) && participa(c, rj.vehiculo.conductor));
    if (!previa) { setAviso("El chat se abre cuando acepte tu propuesta."); return; }
    if (!participa(previa, sesion.userId)) cambiarUsuarioDemo(rj.vehiculo.conductor);
    router.push("/coordinaciones");
  };

  return (
    <div className="bg-white border border-(--color-line) rounded-[18px] shadow-[0_2px_10px_rgba(32,33,36,.18)] p-3 flex flex-col gap-1.5" role="dialog" aria-label={`Ficha de ${s.nombre}`}>
      <div className="flex items-center gap-2.5">
        <IconoPersona estado={s.estado ?? "solicita"} />
        <div className="flex-1 min-w-0"><b className="block truncate">{s.nombre}</b><span className={`inline-flex rounded-full px-2 py-px text-[12px] font-bold ${info.badge}`}>{abordo ? (abordo.estado === "abordo" ? "A bordo" : abordo.estado === "entregado" ? "Entregado" : "Aceptado") : info.etiqueta}</span> <span className="text-[12px] text-(--color-muted)">simulado</span></div>
      </div>
      {s.msg && (<p className="font-bold! text-[15px]!">«{s.msg}»</p>)}
      <p className="text-[13px] text-(--color-muted)">{s.origenTxt} → {s.destinoTxt}</p>

      {ev ? (
        <div className="flex flex-wrap items-center gap-1.5 text-[13px]" role="status">
          <span className={`inline-flex rounded-full px-2 py-px text-[12px] font-bold ${ev.compatible ? "bg-[#e1f1e2] text-[#1f5a22]" : "bg-[#f1ece6] text-(--color-ink)"}`}>{ev.compatible ? "Compatible con tu ruta" : "No compatible"}</span>
          <span className="text-(--color-muted)">Recogida a {km(ev.recogidaM)} de la ruta · desvío estimado ~{minutos(ev.desvioS)}</span>
          {!ev.compatible && (<span className={screenStyles.error}>{ev.motivos.join(" · ")}</span>)}
          {s.sinDestino && (<span className="text-(--color-muted)">Sin destino indicado: se evalúa hacia tu destino B.</span>)}
        </div>
      ) : (<p className="text-[13px] text-(--color-muted)" role="status">Calcula una ruta A → B para evaluar la compatibilidad.</p>)}

      {prop && (
        <p className={`text-[13px] font-bold ${prop.estado === "aceptada" ? "text-[#2f5a2d]" : prop.estado === "enviada" ? "text-(--color-muted)" : "text-[#9e0c24]"}`} role="status">
          {prop.estado === "enviada" && `Propuesta enviada: «${prop.texto}». Esperando respuesta simulada…`}
          {prop.estado === "aceptada" && `✓ ${s.nombre} aceptó. Coordinación confirmada y ruta recalculada${prop.desvioRealS != null ? ` (${prop.desvioRealS >= 0 ? "+" : "−"}${minutos(Math.abs(prop.desvioRealS))})` : ""}.`}
          {prop.estado === "rechazada" && `✗ ${s.nombre} rechazó: ${prop.motivo}.`}
          {prop.estado === "error" && `No se pudo confirmar: ${prop.motivo}`}
        </p>
      )}
      {aviso && (<p className="text-[13px] text-(--color-muted)" role="status">{aviso}</p>)}

      {redactando && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="prop-aventon" className="text-[13px] font-bold">Tu propuesta</label>
          <textarea id="prop-aventon" rows={2} maxLength={160} className="border-[1.5px] border-[#cfc7bf] rounded-[12px] px-3 py-2 text-[14px] bg-white w-full resize-none" value={texto} onChange={(e) => setTexto(e.target.value)} />
          <div className="flex gap-2"><button className={ACCION} onClick={enviar}>Enviar propuesta</button><button className={ACCION_2} onClick={() => setRedactando(false)}>Cancelar</button></div>
        </div>
      )}

      {!redactando && (
        <div className="flex gap-2 overflow-x-auto pb-0.5 [&>*]:shrink-0">
          <button className={ACCION} disabled={enCurso || bloqueado || !ev} onClick={() => { setAviso(""); setRedactando(true); }}>Ofrecer aventón</button>
          <button className={ACCION_2} onClick={chatear}>Chatear</button>
          <button className={ACCION_2} onClick={onCerrar}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
