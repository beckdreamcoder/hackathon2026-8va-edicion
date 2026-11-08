"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { screenStyles } from "@/components/screens/screen-styles";
import { setDemo } from "@/lib/demo/store";
import { VECINOS, useSesion, chip } from "@/lib/demo/shared";
import { usePublicaciones } from "@/lib/demo/publicaciones";
import { cambiarUsuarioDemo } from "@/lib/demo/coordinaciones";
import { ESTADO_CAMPANA, MODALIDADES, SOLES_POR_UNIDAD, crearAporte, responderAporte, alternarFinalizadaSim } from "@/lib/demo/campanas";
import { Progreso } from "./CampanaTarjeta";

const PRUEBA = ["maria", "luis", "pedro", "carlos"];

/**
 * Detalle exacto de una campaña (de ejemplo o creada en Publicar): objetivo, organizador, progreso y formas de apoyo.
 * Todo es simulado: no existe ningún cobro. La entrega y el voluntariado se coordinan en «Mis coordinaciones».
 */
export default function CampanaDetalle({ c }) {
  const router = useRouter();
  const [sesion] = useSesion();
  const [, setPubs] = usePublicaciones();
  const uid = sesion.userId;
  const soyOrg = uid === c.vecino;
  const [mod, setMod] = useState(c.modalidades[0]);
  const [cant, setCant] = useState("1");
  const [nota, setNota] = useState("");
  const [msg, setMsg] = useState({ ok: true, t: "" });
  const mias = c.aportes.filter((a) => a.vecino === uid);
  const usuarios = soyOrg || PRUEBA.includes(c.vecino) ? PRUEBA : [...PRUEBA, c.vecino];
  const modActual = c.modalidades.includes(mod) ? mod : c.modalidades[0];
  const info = MODALIDADES[modActual];

  const apoyar = () => {
    const n = Number(cant);
    const r = crearAporte(c, { vecino: uid, modalidad: modActual, cantidad: n, nota }, sesion.fecha);
    setMsg(r.ok ? { ok: true, t: "✓ Apoyo registrado. Queda por confirmar por la organización: aún no cuenta en el progreso." } : { ok: false, t: r.error });
    if (r.ok) setNota("");
  };
  const alternar = () => {
    if (c.origen === "pub") setPubs((p) => ({ items: p.items.map((x) => (x.id === c.id ? { ...x, cerrada: c.estado !== "finalizada" } : x)) }));
    else alternarFinalizadaSim(c.id);
  };
  const abrirCoord = (id) => { setDemo("coord-foco", { id: "" }, { id }); router.push("/coordinaciones"); };

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex gap-2 items-center flex-wrap" role="group" aria-label="Probar como">
        <span className="text-[14px] text-(--color-muted) font-bold">Probar como:</span>
        {usuarios.map((u) => (<button key={u} className={`${chip(uid === u)} min-h-10! px-3!`} onClick={() => { cambiarUsuarioDemo(u); setMsg({ ok: true, t: "" }); }}>{VECINOS[u].name}{u === c.vecino ? " (organiza)" : ""}</button>))}
      </div>

      {c.imagen && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.imagen} alt={`Imagen de la campaña ${c.titulo}`} className="w-full max-h-52 object-cover rounded-[18px]" />
      )}
      <div className={screenStyles.card}>
        <div className={screenStyles.row}><span className={screenStyles.badgeSolidarity}>Campaña</span><span className={c.estado === "activa" ? screenStyles.badgeFavor : screenStyles.badge}>{ESTADO_CAMPANA[c.estado]}</span>{c.simulado && (<span className={`${screenStyles.badgeDemo} ml-auto`}>Ejemplo</span>)}</div>
        <p className={screenStyles.muted}>ID {c.id}</p>
        <h2 className="text-[24px]!">{c.titulo}</h2>
        <p>{c.descripcion}</p>
        <p className={screenStyles.muted}>Organiza: <b>{c.organizador}</b> · Zona: {c.zona}</p>
        <p className={screenStyles.muted}>Inicio: {c.inicio} · Plazo: {c.plazo || "sin fecha límite"}</p>
        {c.nota && (<p className={screenStyles.muted}>{c.nota}</p>)}
      </div>

      <div className={screenStyles.card}>
        <p className={screenStyles.label}>Objetivo y progreso</p>
        <Progreso c={c} />
        <p className="text-[12px] text-(--color-muted)">Meta: {c.meta} unidades (1 unidad = 1 bien, 1 turno, 1 artículo o S/ {SOLES_POR_UNIDAD} simulados). Solo cuentan los apoyos confirmados por la organización.</p>
        {c.recursos.length > 0 && (<div className="flex flex-wrap gap-1.5" aria-label="Recursos solicitados">{c.recursos.map((r) => (<span key={r} className={screenStyles.badge}>{r}</span>))}</div>)}
        <div className="flex flex-wrap gap-1.5" aria-label="Formas de apoyo">{c.modalidades.map((m) => (<span key={m} className={screenStyles.badgeSolidarity}>{MODALIDADES[m].nombre}</span>))}</div>
      </div>

      {!soyOrg && c.estado === "activa" && (
        <div className={screenStyles.card}>
          <p className={screenStyles.label}>¿Cómo quieres apoyar?</p>
          <div className={screenStyles.wrap} role="group" aria-label="Forma de apoyo">{c.modalidades.map((m) => (<button key={m} className={chip(modActual === m)} aria-pressed={modActual === m} onClick={() => { setMod(m); setMsg({ ok: true, t: "" }); }}>{MODALIDADES[m].nombre}</button>))}</div>
          <div className={screenStyles.field}><label htmlFor="ap-c">{modActual === "Dinero" ? "Monto simulado (S/)" : `Cantidad (${info.unidad})`}</label><input id="ap-c" className={screenStyles.input} inputMode="numeric" value={cant} onChange={(e) => setCant(e.target.value)} /></div>
          <div className={screenStyles.field}><label htmlFor="ap-n">Nota (opcional)</label><input id="ap-n" className={screenStyles.input} maxLength={140} value={nota} onChange={(e) => setNota(e.target.value)} /></div>
          {modActual === "Dinero" && (<span className={`${screenStyles.badgeDemo} w-fit`}>No se realiza ningún cobro</span>)}
          <p className={screenStyles.muted}>{info.ayuda}</p>
          <button className={screenStyles.button} onClick={apoyar}>Confirmar mi apoyo</button>
          {msg.t && (<p className={msg.ok ? screenStyles.success : screenStyles.error} role={msg.ok ? "status" : "alert"}>{msg.t}</p>)}
        </div>
      )}
      {!soyOrg && c.estado !== "activa" && (<div className={screenStyles.card} role="status"><p className="font-bold!">{c.estado === "proxima" ? "Esta campaña aún no empieza" : "Campaña finalizada"}</p><p className={screenStyles.muted}>{c.estado === "proxima" ? `Podrás apoyarla desde el ${c.inicio}.` : "Ya no recibe nuevos apoyos."}</p></div>)}
      {soyOrg && (<div className={screenStyles.card} role="note"><p className={screenStyles.muted}>Organizas esta campaña: no puedes apoyarla. Confirma abajo los apoyos que recibas para actualizar el progreso.</p></div>)}

      {!soyOrg && mias.length > 0 && (<>
        <h3 className="text-[18px]!">Mis apoyos</h3>
        {mias.map((a) => (<div key={a.id} className={screenStyles.card}><div className={screenStyles.row}><b className="flex-1">{MODALIDADES[a.modalidad].nombre}</b><span className={a.estado === "confirmado" ? screenStyles.badgeFavor : a.estado === "rechazado" ? screenStyles.badgeAlert : screenStyles.badge}>{a.estado === "prometido" ? "Por confirmar" : a.estado === "confirmado" ? "Confirmado" : "Rechazado"}</span></div><p className={screenStyles.muted}>{a.modalidad === "Dinero" ? `S/ ${a.cantidad} (simulado, sin cobro)` : `${a.cantidad} ${MODALIDADES[a.modalidad].unidad}`}</p>{a.coordId && (<button className={`${screenStyles.buttonOutline} min-h-11!`} onClick={() => abrirCoord(a.coordId)}>Abrir coordinación de la entrega</button>)}</div>))}
      </>)}

      {soyOrg && (<>
        <h3 className="text-[18px]!">Apoyos recibidos ({c.aportes.length})</h3>
        {c.aportes.length === 0 && (<div className={screenStyles.card} role="status"><p className={screenStyles.muted}>Aún nadie ha registrado un apoyo.</p></div>)}
        {c.aportes.map((a) => (<div key={a.id} className={screenStyles.card}><div className={screenStyles.row}><b className="flex-1">{VECINOS[a.vecino]?.name ?? "Vecino"} · {MODALIDADES[a.modalidad].nombre}</b><span className={a.estado === "confirmado" ? screenStyles.badgeFavor : a.estado === "rechazado" ? screenStyles.badgeAlert : screenStyles.badge}>{a.estado === "prometido" ? "Por confirmar" : a.estado === "confirmado" ? "Confirmado" : "Rechazado"}</span></div><p className={screenStyles.muted}>{a.modalidad === "Dinero" ? `S/ ${a.cantidad} (simulado, sin cobro)` : `${a.cantidad} ${MODALIDADES[a.modalidad].unidad}`}{a.nota ? ` · ${a.nota}` : ""}</p>
          {a.estado === "prometido" && (<div className="grid-cols-2 grid! gap-2!"><button className={`${screenStyles.buttonSecondary} min-h-11!`} onClick={() => responderAporte(a.id, false)}>Rechazar</button><button className={`${screenStyles.button} min-h-11!`} onClick={() => responderAporte(a.id, true)}>Confirmar recepción</button></div>)}
          {a.coordId && (<button className={`${screenStyles.buttonOutline} min-h-11!`} onClick={() => abrirCoord(a.coordId)}>Abrir coordinación</button>)}</div>))}
        <button className={screenStyles.buttonSecondary} onClick={alternar}>{c.estado === "finalizada" ? "Reactivar campaña" : "Finalizar campaña"}</button>
      </>)}
      <p className={screenStyles.muted}>Campañas y aportes de demostración. La popularidad no acredita la legitimidad de una campaña.</p>
    </div>
  );
}
