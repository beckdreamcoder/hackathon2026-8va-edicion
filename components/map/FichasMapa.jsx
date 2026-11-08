"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setDemo } from "@/lib/demo/store";
import { screenStyles } from "@/components/screens/screen-styles";
import { VECINOS, useSesion, avisar, logEvento } from "@/lib/demo/shared";
import { useCoordinaciones, abrirCoordinacionMovilidad, esActiva, participa } from "@/lib/demo/coordinaciones";
import { ESTADO_PERSONA, TIPO_INCIDENTE, NIVEL, RADIOS_KM, kmTxt, desdeMiZona } from "@/lib/map/personas";

const TARJETA = "bg-white border border-(--color-line) rounded-[18px] shadow-[0_2px_10px_rgba(32,33,36,.18)] p-3 flex flex-col gap-1.5";
const ACCION = "min-h-10 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-3.5 font-bold text-[14px] whitespace-nowrap text-white";
const ACCION_2 = "min-h-10 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 font-bold text-[14px] whitespace-nowrap text-(--color-ink) flex items-center";
const FILA = "flex gap-2 overflow-x-auto pb-0.5 [&>*]:shrink-0";
const PERSONA = "M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 21a7 7 0 0 1 14 0";

export const IconoPersona = ({ estado, cls = "w-9 h-9" }) => (
  <span className={`${cls} rounded-[50%] grid place-items-center flex-none text-white ${ESTADO_PERSONA[estado].fondo}`} aria-hidden="true">
    <svg className={`${screenStyles.icon} w-5! h-5!`} viewBox="0 0 24 24"><path d={PERSONA} /></svg>
  </span>
);

/** Ficha compacta de una persona o incidente del mapa. Las acciones reutilizan el motor de coordinaciones. */
export function FichaPersona({ p, onCerrar, sinCerrar = false }) {
  const [sesion] = useSesion();
  const [co] = useCoordinaciones();
  const router = useRouter();
  const [msg, setMsg] = useState({ ok: true, texto: "" });
  const uid = sesion.userId;
  const soyYo = p.vecino === uid;
  const previa = p.vecino ? co.items.find((c) => esActiva(c) && participa(c, uid) && participa(c, p.vecino)) : null;
  const dist = kmTxt(p.dist != null && Number.isFinite(p.dist) ? p.dist : desdeMiZona(p.lngLat));
  const info = ESTADO_PERSONA[p.estado];

  const abrir = (nota, irAlChat) => {
    // Si la persona solicita, quien actúa ayuda; si la persona está disponible, ella ayuda a quien actúa.
    const ayuda = p.estado !== "disponible";
    const r = abrirCoordinacionMovilidad({
      conductor: ayuda ? uid : p.vecino, pasajero: ayuda ? p.vecino : uid, titulo: p.necesidad, lugar: p.origen,
      hora: new Date().toTimeString().slice(0, 5), nota, tipo: p.tipo === "movilidad" ? "movilidad" : p.tipo === "cachuelo" ? "cachuelo" : "favor", via: "Mapa",
    });
    if (!r.ok) { setMsg({ ok: false, texto: r.error }); return; }
    if (irAlChat) router.push("/coordinaciones");
    else setMsg({ ok: true, texto: "✓ Coordinación abierta. Sigue en Mis coordinaciones." });
  };
  const chatear = () => (previa ? router.push("/coordinaciones") : abrir("Consulta iniciada desde el mapa.", true));
  const cerca = () => {
    avisar({ categoria: "favor", titulo: `${VECINOS[uid]?.name ?? "Un vecino"} está cerca`, texto: `Aviso para «${p.necesidad}» · a ${dist} de tu zona.`, href: "/coordinaciones" });
    logEvento(`Mapa: «Estoy cerca» sobre «${p.necesidad}»`);
    setMsg({ ok: true, texto: "✓ Aviso enviado: estás cerca." });
  };

  return (
    <div className={TARJETA} role="dialog" aria-label={`Ficha de ${p.nombre}`}>
      <div className="flex items-center gap-2.5">
        <IconoPersona estado={p.estado} />
        <div className="flex-1 min-w-0"><b className="block truncate">{p.nombre}</b><span className={`inline-flex rounded-full px-2 py-px text-[12px] font-bold ${info.badge}`}>{p.sos ? "SOS · " : ""}{info.etiqueta}</span> <span className="text-[12px] text-(--color-muted)">a {dist} · {p.simulado ? "simulado" : "demostración"}</span></div>
        {!sinCerrar && (<button className="w-10 h-10 grid place-items-center bg-transparent border-0" aria-label="Cerrar ficha" onClick={onCerrar}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>)}
      </div>
      <p className="font-bold! text-[15px]!">{p.necesidad}</p>
      {p.descripcion && (<p className="text-[13px] line-clamp-2">{p.descripcion}</p>)}
      {(p.categoria || p.pago || p.distrito) && (<p className="text-[12px] font-bold text-(--color-muted)">{[p.categoria, p.pago, p.distrito].filter(Boolean).join(" · ")}</p>)}
      {(p.origen || p.destino) && (<p className="text-[13px] text-(--color-muted)">{p.origen}{p.destino ? ` → ${p.destino}` : ""}</p>)}
      {p.sos && (<p className="text-[12px] text-[#9e0c24]">Emergencia de demostración: no avisa a servicios reales. Ante un peligro real llama al 105, 116 o 106.</p>)}
      {msg.texto && (<p className={msg.ok ? "text-[#2f5a2d] font-bold text-[14px]" : screenStyles.error} role={msg.ok ? "status" : "alert"}>{msg.texto}</p>)}
      <div className={FILA}>
        {soyYo && (<span className="text-[14px] text-(--color-muted) self-center">Esta eres tú.</span>)}
        {!soyYo && p.vecino && p.estado === "solicita" && p.tipo === "movilidad" && (<button className={ACCION} onClick={() => abrir("Te llevo.", false)}>Te llevo</button>)}
        {!soyYo && p.vecino && p.estado !== "disponible" && p.tipo !== "movilidad" && (<button className={ACCION} onClick={() => abrir(p.sos ? "Ofrezco ayuda ante tu SOS." : "Ofrezco ayuda.", false)}>{p.tipo === "cachuelo" ? "Ofrecer mi servicio" : "Ofrecer ayuda"}</button>)}
        {!soyYo && p.vecino && p.estado === "disponible" && (<button className={ACCION} onClick={() => abrir(p.tipo === "movilidad" ? "Quisiera un asiento." : "Necesito tu ayuda.", false)}>{p.tipo === "cachuelo" ? "Solicitar trabajo" : p.tipo === "movilidad" ? "Pedir aventón" : "Pedir ayuda"}</button>)}
        {!soyYo && p.estado !== "disponible" && (<button className={ACCION_2} onClick={cerca}>Estoy cerca</button>)}
        {!soyYo && p.vecino && (<button className={ACCION_2} onClick={chatear}>{p.estado === "emergencia" ? "Consultar" : "Chatear"}</button>)}
        {p.incId && !sinCerrar && (<button className={ACCION_2} onClick={() => { setDemo("inc-foco", { id: "" }, { id: p.incId }); router.push("/emergencias"); }}>Ver detalle</button>)}
        {p.href && !p.incId && (<Link className={ACCION_2} href={p.href}>{p.estado === "emergencia" ? "Ver emergencias" : "Ver publicación"}</Link>)}
      </div>
    </div>
  );
}

/** Ficha de una zona de calor (incidente SIMULADO). */
export function FichaCalor({ i, onCerrar }) {
  const t = TIPO_INCIDENTE[i.tipo];
  return (
    <div className={TARJETA} role="dialog" aria-label={`Detalle: ${i.titulo}`}>
      <div className="flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-[50%] grid place-items-center flex-none bg-[#fff1e6] text-[#8a2b07]" aria-hidden="true"><svg className={`${screenStyles.icon} w-5! h-5!`} viewBox="0 0 24 24"><path d={t.icono} /></svg></span>
        <div className="flex-1 min-w-0"><b className="block truncate">{i.titulo}</b><span className="text-[12px] text-(--color-muted)">{t.etiqueta} · {i.hace} · a {kmTxt(desdeMiZona(i.lngLat))}</span></div>
        <button className="w-10 h-10 grid place-items-center bg-transparent border-0" aria-label="Cerrar detalle" onClick={onCerrar}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
      </div>
      <p className="text-[14px]">{i.detalle}</p>
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="inline-flex rounded-full px-2 py-px text-[12px] font-bold bg-[#fbe3e7] text-[#9e0c24]">Intensidad {i.intensidad}/5 · {NIVEL[i.intensidad]}</span>
        <span className={`${screenStyles.badgeDemo} text-[12px]!`}>Simulación</span>
        <span className="text-[12px] text-(--color-muted)">Alerta oficial: ninguna conectada</span>
      </div>
      {i.href && (<Link className={ACCION_2} href={i.href}>Abrir</Link>)}
    </div>
  );
}

/** Leyenda compacta del calor. */
export function LeyendaCalor({ conteo }) {
  return (
    <div className={`${TARJETA} py-2!`} role="note" aria-label="Leyenda del calor">
      <div className="flex items-center gap-2 text-[12px] font-bold">
        <span>Intensidad</span><span className="text-(--color-muted)">baja</span>
        <span className="h-2 w-24 rounded-full bg-[linear-gradient(to_right,#f5c542,#f08a24,#c8102e)]" aria-hidden="true" />
        <span className="text-(--color-muted)">alta</span>
        <span className={`${screenStyles.badgeDemo} ml-auto text-[11px]! py-px!`}>Simulado</span>
      </div>
      <div className={FILA}>
        {Object.entries(TIPO_INCIDENTE).map(([k, t]) => (<span key={k} className="inline-flex items-center gap-1 text-[12px] whitespace-nowrap bg-[#f1ece6] rounded-full px-2 py-0.5"><svg className={`${screenStyles.icon} w-3.5! h-3.5!`} viewBox="0 0 24 24" aria-hidden="true"><path d={t.icono} /></svg>{t.etiqueta} · {conteo[k] ?? 0}</span>))}
      </div>
      <p className="text-[11px] text-(--color-muted)">Toca una zona para ver el detalle. Datos de demostración: no son alertas oficiales.</p>
    </div>
  );
}

/** Radar: filtros de alcance y resultados ordenados por distancia geográfica real. */
const MOTIVO = {
  denegado: "Sin permiso de ubicación. Toca el mapa para elegir un punto de referencia.",
  fuera: "Tu ubicación está fuera de Lima (el mapa solo cubre Lima). Toca el mapa para elegir un punto de referencia.",
  error: "No se pudo obtener tu ubicación. Toca el mapa para elegir un punto de referencia.",
};

export function RadarTira({ km, setKm, resultados, onAbrir, centro, onUsar, onElegir, onPreset, presets = [] }) {
  const texto = centro.estado === "pidiendo" ? "Buscando tu ubicación… acepta el permiso del navegador."
    : centro.eligiendo ? (MOTIVO[centro.estado] ?? "Toca el mapa para elegir el punto de referencia.")
    : centro.origen === "gps" ? "Centro: tu ubicación actual (GPS del navegador)."
    : centro.origen === "manual" ? "Centro: punto de referencia manual, no es tu ubicación."
    : "";
  return (
    <div className={`${TARJETA} py-2!`} role="region" aria-label="Radar">
      <div className="flex items-center gap-2" role="group" aria-label="Alcance del radar">
        <b className="text-[14px]">Radar</b>
        {RADIOS_KM.map((r) => (<button key={r} className={`min-h-9 rounded-full border-[1.5px] px-3 text-[13px] font-bold whitespace-nowrap ${km === r ? "border-[#2f7d32] bg-[#2f7d32] text-white" : "border-[#cfc7bf] bg-white"}`} aria-pressed={km === r} onClick={() => setKm(r)}>{r} km</button>))}
        <span className="ml-auto text-[12px] text-(--color-muted) whitespace-nowrap">{resultados.length} cerca · simulado</span>
      </div>
      {texto && (<p className={`text-[12px] ${centro.eligiendo ? "text-[#8a4300] font-bold" : "text-(--color-muted)"}`} role="status">{texto}</p>)}
      <div className={FILA}>
        {centro.origen !== "gps" && centro.estado !== "pidiendo" && (<button className="min-h-8 rounded-full border border-[#cfc7bf] bg-white px-3 text-[12px] font-bold" onClick={onUsar}>Usar mi ubicación</button>)}
        {!centro.eligiendo && centro.estado !== "pidiendo" && (<button className="min-h-8 rounded-full border border-[#cfc7bf] bg-white px-3 text-[12px] font-bold" onClick={onElegir}>Elegir punto manual</button>)}
        {presets.map(([nombre, ll]) => (<button key={nombre} className="min-h-8 rounded-full border border-[#cfc7bf] bg-white px-3 text-[12px] font-bold whitespace-nowrap" onClick={() => onPreset(ll)}>Ref.: {nombre}</button>))}
      </div>
      {resultados.length === 0 && centro.centro && (<p className="text-[13px] text-(--color-muted)" role="status">Nada detectado en este alcance.</p>)}
      <div className={FILA}>
        {resultados.map((r) => (
          <button key={r.key} className="w-44 text-left flex items-center gap-2 rounded-[14px] border border-(--color-line) bg-white p-2" onClick={() => onAbrir(r)}>
            <IconoPersona estado={r.estado} cls="w-8 h-8" />
            <span className="min-w-0"><b className="block truncate text-[13px]">{r.nombre}</b><span className="block truncate text-[12px] text-(--color-muted)">{r.msg} · {kmTxt(r.dist)}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}
