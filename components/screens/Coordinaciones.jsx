"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useViewStack } from "@/lib/hooks/use-view-stack";
import { useRouter } from "next/navigation";
import { useDemoState, setDemo } from "@/lib/demo/store";
import { useTextInput } from "@/lib/hooks/use-text-input";
import { VECINOS, useSesion, chip } from "@/lib/demo/shared";
import { useCatalogo } from "@/lib/demo/catalogo";
import {
  useCoordinaciones, useBloqueos, participa, otroDe, esAbierta, noLeidos, proximoPaso, estaBloqueado, fase, reportar,
  ETIQUETA_TIPO, cambiarUsuarioDemo, responder, cancelar, enviarMensaje, marcarLeido, respuestaSimulada,
  proponerAcuerdo, confirmarAcuerdo, confirmarCierre, darSello, bloquear, desbloquear,
} from "@/lib/demo/coordinaciones";
import { sinConexionAhora } from "@/lib/demo/conexion";
import { useCola, encolarMensaje } from "@/lib/demo/cola";
import { screenStyles } from "./screen-styles";

const USUARIOS = ["maria", "luis", "pedro", "carlos"];
const AVATAR = "w-11 h-11 rounded-[50%] grid place-items-center font-extrabold text-[18px] flex-none bg-[#ddf0f2] text-[#14505a]";
const BUBBLE_ME = "self-end max-w-[82%] rounded-[18px] rounded-br-[6px] bg-(--color-brand) text-white px-3.5 py-2 flex flex-col gap-0.5 [&_b]:text-[13px] [&_b]:opacity-90";
const BUBBLE_OTHER = "self-start max-w-[82%] rounded-[18px] rounded-bl-[6px] bg-[#f1ece6] text-(--color-ink) px-3.5 py-2 flex flex-col gap-0.5 [&_b]:text-[13px] [&_b]:text-(--color-muted)";
const QUICK = ["¿A qué hora puedes?", "Estoy en camino", "Necesito reprogramar"];
const PASOS = ["Solicitud", "Aceptación", "Acuerdo", "Cierre", "Sello"];
const SHEET = "absolute left-0 right-0 bottom-0 max-h-[85%] overflow-y-auto bg-white rounded-[24px_24px_0_0] border-t border-t-(--color-line) shadow-[0_-8px_24px_rgba(32,33,36,.15)] pt-5 px-4 pb-5 flex flex-col gap-3 z-5";

const FILTROS = [
  { id: "pendientes", name: "Pendientes", test: (c) => c.estado === "solicitada" },
  { id: "activas", name: "Activas", test: (c) => c.estado === "aceptada" || c.estado === "acordada" },
  { id: "finalizadas", name: "Finalizadas", test: (c) => c.estado === "completada" },
  { id: "canceladas", name: "Canceladas", test: (c) => c.estado === "rechazada" || c.estado === "cancelada" },
  { id: "todas", name: "Todas", test: () => true },
];
const ROLES = [{ id: "todas", name: "Todas" }, { id: "enviadas", name: "Enviadas" }, { id: "recibidas", name: "Recibidas" }];
const TIPOS = [{ id: "todos", name: "Todos" }, { id: "favor", name: "Favores" }, { id: "cachuelo", name: "Cachuelos" }, { id: "movilidad", name: "Movilidad" }];
const SECCIONES = [["resumen", "Resumen"], ["chat", "Chat"], ["acuerdo", "Acuerdo"], ["cierre", "Cierre"]];
const MOTIVOS = ["Mensajes molestos", "No cumplió", "Otro motivo"];

const hora = (iso) => new Date(iso).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
const dia = (iso) => new Date(iso).toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
const pasoActual = (c) => (c.estado === "solicitada" ? 0 : c.estado === "aceptada" ? (c.acuerdo ? 2 : 1) : c.estado === "acordada" ? 3 : c.estado === "completada" ? (c.sellos.length ? 5 : 4) : 0);

const back = (<svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>);

/** Pantalla «Mis coordinaciones»: solicitudes enviadas y recibidas, con detalle, chat, acuerdo, cierre y sello. */
export default function Coordinaciones() {
  const nav = useViewStack("lista");
  const router = useRouter();
  const [sesion] = useSesion();
  const [co] = useCoordinaciones();
  const [bloqueos] = useBloqueos();
  const [cola] = useCola();
  const catalogo = useCatalogo();
  const uid = sesion.userId;
  const yo = VECINOS[uid];

  const [filtro, setFiltro] = useState("activas");
  const [rol, setRol] = useState("todas");
  const [tipo, setTipo] = useState("todos");
  const [selId, setSelId] = useState("");
  const [tab, setTab] = useState("resumen");
  const [err, setErr] = useState("");
  const [sheet, setSheet] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [motivoCancel, setMotivoCancel] = useState("");
  const [motivoRep, setMotivoRep] = useState("");
  const [repHecho, setRepHecho] = useState(false);
  const [escribiendo, setEscribiendo] = useState(false);
  const [foco, setFoco] = useDemoState("coord-foco", { id: "", tab: "" });
  const [filtroFoco, setFiltroFoco] = useDemoState("coord-filtro", { id: "" });
  const [comentarioSello, setComentarioSello] = useState("");
  const [editAg, setEditAg] = useState(false);
  const draft = useTextInput("");
  const lugar = useTextInput("");
  const nota = useTextInput("");
  const [fecha, setFecha] = useState("");
  const [horaAg, setHoraAg] = useState("");
  const fin = useRef(null);
  const timers = useRef([]);

  const mias = co.items.filter((c) => participa(c, uid));
  const f = FILTROS.find((x) => x.id === filtro) ?? FILTROS[0];
  const rolOk = (c) => rol === "todas" || (rol === "enviadas" ? c.solicitante === uid : c.receptor === uid);
  const base = mias.filter((c) => rolOk(c) && (tipo === "todos" || c.tipo === tipo));
  const visibles = base.filter(f.test).sort((a, b) => b.actualizada.localeCompare(a.actualizada));
  const sel = co.items.find((c) => c.id === selId && participa(c, uid));
  const otro = sel ? otroDe(sel, uid) : null;
  const otroN = otro ? VECINOS[otro].name : "";
  const bloqueado = sel ? estaBloqueado(sel.solicitante, sel.receptor) : false;
  const yoBloquee = otro ? bloqueos.items.some((x) => x.by === uid && x.target === otro) : false;
  const infoPub = (c) => catalogo.find((v) => v.id === c.pubId);
  const categoriaDe = (c) => infoPub(c)?.categoria ?? (c.legado ? "Flujo guiado" : ETIQUETA_TIPO[c.tipo]);
  const usuarios = [...USUARIOS, ...(USUARIOS.includes(uid) ? [] : [uid]), ...(otro && !USUARIOS.includes(otro) && otro !== uid ? [otro] : [])];

  useEffect(() => {
    if (nav.is("detalle") && sel && tab === "chat") marcarLeido(sel.id, uid);
    fin.current?.scrollIntoView?.({ block: "end" });
  }, [nav.current, sel?.id, sel?.msgs.length, tab, uid]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Si se llegó desde una publicación, se abre directamente esa coordinación (en su resumen, sin abrir el chat)
  useEffect(() => {
    if (!foco.id) return undefined;
    const t = setTimeout(() => {
      const c = co.items.find((x) => x.id === foco.id);
      if (c && participa(c, uid)) { setSelId(c.id); setTab(foco.tab || "resumen"); setErr(""); setEditAg(false); setConfirmando(false); nav.go("detalle"); }
      setFoco({ id: "", tab: "" });
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foco.id]);

  // Si se llegó desde el perfil con un filtro (pendientes, activas, finalizadas, canceladas)
  useEffect(() => {
    if (!filtroFoco.id) return undefined;
    const t = setTimeout(() => { setFiltro(filtroFoco.id); setFiltroFoco({ id: "" }); }, 0);
    return () => clearTimeout(t);
  }, [filtroFoco.id, setFiltroFoco]);

  const run = (r) => { setErr(r.ok ? "" : r.error); return r; };
  const abrir = (c) => { setSelId(c.id); setTab("resumen"); setErr(""); setEditAg(false); setEscribiendo(false); nav.go("detalle"); };
  const cambiarUsuario = (id) => { cambiarUsuarioDemo(id); setErr(""); if (nav.is("detalle")) nav.back(); };

  const enviar = () => {
    if (!sel) return;
    const id = sel.id;
    if (sinConexionAhora()) {
      // Sin conexión: el mensaje se guarda en este dispositivo y se aplica al volver la conexión (no hay respuesta simulada)
      const q = run(encolarMensaje(id, uid, draft.value, `Mensaje a ${otroN}`));
      if (q.ok) draft.setValue("");
      return;
    }
    const r = run(enviarMensaje(id, uid, draft.value));
    if (!r.ok) return;
    draft.setValue("");
    // respuesta simulada de la otra persona (demostración)
    setEscribiendo(true);
    timers.current.push(setTimeout(() => { respuestaSimulada(id, uid); setEscribiendo(false); }, 1600));
  };
  const abrirForm = () => {
    lugar.setValue(sel?.acuerdo?.lugar ?? ""); nota.setValue(sel?.acuerdo?.nota ?? "");
    setFecha(sel?.acuerdo?.fecha ?? ""); setHoraAg(sel?.acuerdo?.hora ?? ""); setEditAg(true); setErr("");
  };
  const proponer = () => { const r = run(proponerAcuerdo(sel.id, uid, { lugar: lugar.value, fecha, hora: horaAg, nota: nota.value })); if (r.ok) setEditAg(false); };

  const verForm = sel && esAbierta(sel) && (!sel.acuerdo || editAg);
  const hdr = (titulo, onBack) => (
    <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={onBack}>{back}</button>{titulo}</div>
  );
  const faseTxt = (c) => fase(c, sesion.fecha);
  const faseCls = (c) => (c.estado === "completada" ? screenStyles.badgeFavor : c.estado === "rechazada" || c.estado === "cancelada" ? screenStyles.badgeAlert : c.estado === "solicitada" ? screenStyles.badge : screenStyles.badgeSolidarity);

  return (
    <div className={screenStyles.screen}>
      <div className={screenStyles.frame}>
        {nav.is("lista") && hdr(<h1>Mis coordinaciones</h1>, nav.back)}
        {nav.is("detalle") && sel && hdr(
          <>
            <span className={AVATAR} aria-hidden="true">{VECINOS[otro].ini}</span>
            <div className={screenStyles.grow}><h1 className="text-[19px]!">{otroN}</h1><p className={screenStyles.muted}>{sel.titulo}</p></div>
            <button className={screenStyles.iconButton} aria-label="Reportar o bloquear" onClick={() => { setRepHecho(false); setSheet(true); }}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg></button>
          </>, nav.back)}

        <div className="flex gap-2 pt-0 px-4 pb-2 items-center flex-none overflow-x-auto [&_span]:text-[14px] [&_span]:text-(--color-muted) [&_span]:font-bold [&_span]:whitespace-nowrap [&_.chip]:min-h-10 [&_.chip]:px-3 [&_.chip]:py-0" role="group" aria-label="Probar como">
          <span>Probar como:</span>{usuarios.map((u) => (<button key={u} className={`${chip(uid === u)} chip`} onClick={() => cambiarUsuario(u)}>{VECINOS[u].name}</button>))}
        </div>

        {nav.is("lista") && (
          <div className={screenStyles.content}>
            <div className="flex gap-2 overflow-x-auto pb-0.5 shrink-0 [&>*]:shrink-0" role="group" aria-label="Estado">
              {FILTROS.map((x) => (<button key={x.id} className={chip(filtro === x.id)} aria-pressed={filtro === x.id} onClick={() => setFiltro(x.id)}>{x.name} ({base.filter(x.test).length})</button>))}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-0.5 shrink-0 [&>*]:shrink-0" role="group" aria-label="Rol">
              {ROLES.map((x) => (<button key={x.id} className={chip(rol === x.id)} aria-pressed={rol === x.id} onClick={() => setRol(x.id)}>{x.name}</button>))}
              {TIPOS.map((x) => (<button key={x.id} className={chip(tipo === x.id)} aria-pressed={tipo === x.id} onClick={() => setTipo(x.id)}>{x.name}</button>))}
            </div>
            {visibles.map((c) => {
              const o = otroDe(c, uid); const n = noLeidos(c, uid);
              const cuerpo = (
                <>
                  <div className={screenStyles.row}>
                    <span className={AVATAR} aria-hidden="true">{VECINOS[o].ini}</span>
                    <div className={screenStyles.grow}><b>{VECINOS[o].name}</b><p className={screenStyles.muted}>{c.titulo}</p><p className="text-[13px] text-(--color-muted)">{categoriaDe(c)} · {ETIQUETA_TIPO[c.tipo]}</p></div>
                    {n > 0 && (<span className="min-w-5.5 h-5.5 rounded-[11px] bg-(--color-brand) text-white text-[13px] font-bold grid place-items-center px-1.5" aria-label="mensajes sin leer">{n}</span>)}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5"><span className={faseCls(c)}>{faseTxt(c)}</span><span className={screenStyles.badge}>{c.solicitante === uid ? "Enviada" : "Recibida"}</span><span className="text-[12px] text-(--color-muted)">{dia(c.creada)}</span>{c.legado && (<span className={screenStyles.badge}>Flujo guiado</span>)}</div>
                  <p className="font-bold! text-[#9e0c24]! text-[14px]!">Próximo paso: {proximoPaso(c, uid)}</p>
                </>
              );
              return c.legado
                ? (<Link key={c.id} href={c.href} className={screenStyles.card}>{cuerpo}</Link>)
                : (<button key={c.id} className={screenStyles.card} onClick={() => abrir(c)}>{cuerpo}</button>);
            })}
            {visibles.length === 0 && (
              <div className={screenStyles.card} role="status"><p className="font-bold!">No hay coordinaciones en este filtro</p><p className={screenStyles.muted}>Se crean cuando alguien solicita una publicación y la otra parte acepta. Encuentra una en Buscar.</p>
                <Link className={screenStyles.buttonOutline} href="/buscar">Buscar publicaciones</Link></div>
            )}
          </div>
        )}

        {nav.is("detalle") && sel && (
          <>
            <div className="px-4 pb-2 flex-none flex flex-col gap-2">
              <div className={`${screenStyles.card} px-3.5! py-2.5!`}>
                <div className="flex flex-wrap items-center gap-1.5"><span className={faseCls(sel)}>{faseTxt(sel)}</span><span className={screenStyles.badge}>{ETIQUETA_TIPO[sel.tipo]}</span><span className={screenStyles.badge}>{sel.solicitante === uid ? "Enviada" : "Recibida"}</span></div>
                <div className="flex gap-1" aria-label="Progreso">{PASOS.map((p, i) => (<span key={p} className={`flex-1 text-center text-[11px] font-bold rounded-full py-0.5 ${i < pasoActual(sel) ? "bg-[#e6f0e4] text-[#2f5a2d]" : "bg-[#f1ece6] text-(--color-muted)"}`}>{p}</span>))}</div>
                <p className="font-bold! text-[14px]! text-[#9e0c24]!">Siguiente: {proximoPaso(sel, uid)}</p>
              </div>
              {sel.estado !== "solicitada" && (
                <div className="flex gap-2 overflow-x-auto [&>*]:shrink-0" role="group" aria-label="Sección">
                  {SECCIONES.map(([id, name]) => (<button key={id} className={`${chip(tab === id)} chip`} aria-pressed={tab === id} onClick={() => { setTab(id); setErr(""); }}>{name}</button>))}
                </div>
              )}
            </div>

            {sel.estado === "solicitada" && (
              <div className={screenStyles.content}>
                <div className={screenStyles.card}>
                  <p className="font-bold!">{sel.receptor === uid ? `${VECINOS[sel.solicitante].name} envió una solicitud` : `Tu solicitud a ${otroN}`}</p>
                  <p className={screenStyles.muted}>«{sel.titulo}» · {categoriaDe(sel)} · {dia(sel.creada)}. El chat se habilita cuando la solicitud se acepta.</p>
                  {sel.receptor === uid ? (
                    <div className="grid-cols-2 grid! gap-2!">
                      <button className={`${screenStyles.buttonSecondary} min-h-12!`} onClick={() => run(responder(sel.id, uid, false))}>Rechazar</button>
                      <button className={`${screenStyles.button} min-h-12!`} onClick={() => run(responder(sel.id, uid, true))}>Aceptar</button>
                    </div>
                  ) : (
                    <button className={screenStyles.buttonSecondary} onClick={() => { setMotivoCancel(""); setConfirmando(true); }}>Cancelar solicitud</button>
                  )}
                </div>
                {err && (<p className={screenStyles.error} role="alert">{err}</p>)}
              </div>
            )}

            {sel.estado !== "solicitada" && tab === "resumen" && (
              <div className={screenStyles.content}>
                <div className={screenStyles.card}>
                  <p className={screenStyles.label}>Publicación</p>
                  <b>{sel.titulo}</b>
                  <p className={screenStyles.muted}>{categoriaDe(sel)} · {ETIQUETA_TIPO[sel.tipo]} · con {otroN}</p>
                  <p className={screenStyles.muted}>Creada el {dia(sel.creada)} · {sel.solicitante === uid ? "Solicitud enviada por ti" : "Solicitud recibida"}</p>
                  <button className="text-[14px] font-bold text-(--color-brand) underline self-start" onClick={() => { setDemo("perfil-foco", { id: "" }, { id: otro }); router.push("/perfil"); }}>Ver perfil de {otroN}</button>
                  {sel.acuerdo && (<p className="text-[14px]"><b>Acuerdo:</b> {sel.acuerdo.lugar} · {sel.acuerdo.fecha} · {sel.acuerdo.hora} ({sel.estado === "aceptada" ? "por confirmar" : "confirmado"})</p>)}
                  {(sel.estado === "cancelada" || sel.estado === "rechazada") && (<p className="font-bold!">{sel.estado === "rechazada" ? "Rechazada" : "Cancelada"}{sel.cerradaPor ? ` por ${VECINOS[sel.cerradaPor].name}` : ""}{sel.motivo ? ` · Motivo: ${sel.motivo}` : ""}</p>)}
                </div>
                <div className={screenStyles.card}>
                  <p className={screenStyles.label}>Chat temporal</p>
                  <p className={screenStyles.muted}>{sel.msgs.filter((m) => m.from !== "sistema").length} mensajes · {esAbierta(sel) && !bloqueado ? "Disponible mientras la coordinación esté abierta." : "Solo lectura."}</p>
                  <button className={screenStyles.button} onClick={() => { setTab("chat"); setErr(""); }}>Abrir chat{noLeidos(sel, uid) > 0 ? ` (${noLeidos(sel, uid)} sin leer)` : ""}</button>
                </div>
                {esAbierta(sel) && (<button className={screenStyles.buttonSecondary} onClick={() => { setMotivoCancel(""); setConfirmando(true); }}>Cancelar coordinación</button>)}
                {err && (<p className={screenStyles.error} role="alert">{err}</p>)}
              </div>
            )}

            {sel.estado !== "solicitada" && tab === "chat" && (
              <>
                <div className="px-4 pb-1 flex-none"><p className="text-[13px] text-(--color-muted)" role="status">Chat temporal · {esAbierta(sel) && !bloqueado ? "activo" : "solo lectura"} · historial de esta coordinación</p></div>
                <div className={`${screenStyles.content} gap-2.5!`} role="log" aria-live="polite">
                  {sel.msgs.map((m) => m.from === "sistema"
                    ? (<p key={m.id} className="self-center text-center text-[13px] text-(--color-muted) bg-[#f1ece6] rounded-full px-3 py-1">{m.text}</p>)
                    : (<div key={m.id} className={m.from === uid ? BUBBLE_ME : BUBBLE_OTHER}><b>{VECINOS[m.from].name} · {hora(m.at)}{m.sim ? " · respuesta simulada" : ""}</b>{m.text}</div>))}
                  {cola.items.filter((o) => o.tipo === "mensaje" && o.datos.coordId === sel.id && o.usuario === uid && o.estado !== "aplicada").map((o) => (
                    <div key={o.id} className={`${BUBBLE_ME} opacity-70 border border-dashed border-white`}><b>Tú · guardado, no enviado{o.estado === "error" ? " · con error" : ""}</b>{o.datos.texto}</div>))}
                  {escribiendo && (<p className="self-start text-[13px] text-(--color-muted)" role="status">{otroN} está escribiendo… (respuesta simulada)</p>)}
                  <div ref={fin} />
                </div>
                {esAbierta(sel) && !bloqueado && (
                  <div className="border-t border-t-(--color-line) pt-2! px-4! pb-2! flex! flex-col! gap-2! bg-white! flex-none!">
                    <div className="flex gap-2 overflow-x-auto pb-0.5 [&>*]:shrink-0">{QUICK.map((q) => (<button key={q} className={`${chip(false)} chip`} onClick={() => draft.setValue(q)}>{q}</button>))}</div>
                    <div className={screenStyles.row}><label htmlFor="msg" className="absolute left-[-9999px]!">Mensaje</label><input id="msg" className={screenStyles.input} placeholder="Escribe un mensaje" {...draft.props} onKeyDown={(e) => { if (e.key === "Enter") enviar(); }} /><button className="w-12 h-12 grid place-items-center border-0 bg-(--color-brand) rounded-[16px] text-white" aria-label="Enviar" onClick={enviar}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-3-7z" /></svg></button></div>
                    {err && (<p className={screenStyles.error} role="alert">{err}</p>)}
                  </div>
                )}
                {(!esAbierta(sel) || bloqueado) && (
                  <div className="border-t border-t-(--color-line) px-4! py-3! bg-white! flex-none!"><p className={screenStyles.muted} role="status">{bloqueado && esAbierta(sel) ? "Hay un bloqueo entre ustedes: el chat quedó en solo lectura. Puedes cancelar la coordinación." : "Chat temporal en solo lectura. El historial y el acuerdo se conservan."}</p></div>
                )}
              </>
            )}

            {sel.estado !== "solicitada" && tab === "acuerdo" && (
              <div className={screenStyles.content}>
                {sel.acuerdo && !editAg && (
                  <div className={screenStyles.card}>
                    <p className={screenStyles.label}>{sel.estado === "acordada" || sel.estado === "completada" ? "Acuerdo confirmado" : "Acuerdo propuesto"}</p>
                    <p><b>Lugar:</b> {sel.acuerdo.lugar}</p><p><b>Fecha:</b> {sel.acuerdo.fecha} · <b>Hora:</b> {sel.acuerdo.hora}</p>
                    {sel.acuerdo.nota && (<p className={screenStyles.muted}>{sel.acuerdo.nota}</p>)}
                    <p>{VECINOS[sel.solicitante].name}: <b>{sel.acuerdo.conf.includes(sel.solicitante) ? "confirmó" : "pendiente"}</b> · {VECINOS[sel.receptor].name}: <b>{sel.acuerdo.conf.includes(sel.receptor) ? "confirmó" : "pendiente"}</b></p>
                    {sel.estado === "aceptada" && !sel.acuerdo.conf.includes(uid) && !bloqueado && (<button className={screenStyles.button} onClick={() => run(confirmarAcuerdo(sel.id, uid))}>Confirmar acuerdo</button>)}
                    {sel.estado === "aceptada" && sel.acuerdo.conf.includes(uid) && (<p className={screenStyles.success} role="status">Esperando que {otroN} confirme.</p>)}
                    {esAbierta(sel) && !bloqueado && (<><button className={screenStyles.buttonSecondary} onClick={abrirForm}>Cambiar términos</button><p className={screenStyles.muted}>Si cambias un acuerdo confirmado, ambas personas deben volver a confirmar.</p></>)}
                  </div>
                )}
                {verForm && (
                  <div className={screenStyles.card}>
                    <p className={screenStyles.label}>{sel.acuerdo ? "Nuevos términos" : "Propón lugar, fecha y hora"}</p>
                    <div className={screenStyles.field}><label htmlFor="lg">Lugar de encuentro</label><input id="lg" className={screenStyles.input} placeholder="Ej.: Parque de la zona" {...lugar.props} /></div>
                    <div className={screenStyles.field}><label htmlFor="fe">Fecha</label><input id="fe" type="date" min={sesion.fecha} className={screenStyles.input} value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
                    <div className={screenStyles.field}><label htmlFor="ho">Hora</label><input id="ho" type="time" className={screenStyles.input} value={horaAg} onChange={(e) => setHoraAg(e.target.value)} /></div>
                    <div className={screenStyles.field}><label htmlFor="no">Nota (opcional)</label><input id="no" className={screenStyles.input} {...nota.props} /></div>
                    <button className={screenStyles.button} onClick={proponer}>Proponer acuerdo</button>
                    {editAg && (<button className={screenStyles.buttonSecondary} onClick={() => setEditAg(false)}>Descartar cambios</button>)}
                  </div>
                )}
                {!sel.acuerdo && !esAbierta(sel) && (<div className={screenStyles.card} role="status"><p className={screenStyles.muted}>No se llegó a un acuerdo en esta coordinación.</p></div>)}
                {err && (<p className={screenStyles.error} role="alert">{err}</p>)}
              </div>
            )}

            {sel.estado !== "solicitada" && tab === "cierre" && (
              <div className={screenStyles.content}>
                <div className={screenStyles.card}>
                  {sel.estado === "aceptada" && (<p className={screenStyles.muted}>Primero confirmen el acuerdo de lugar, fecha y hora. Después podrán cerrar la coordinación.</p>)}
                  {sel.estado === "acordada" && (<>
                    <p className={screenStyles.label}>Cierre</p>
                    <p className={screenStyles.muted}>Se completa cuando ambas personas lo confirman.</p>
                    <p>{VECINOS[sel.solicitante].name}: <b>{sel.cierre.includes(sel.solicitante) ? "confirmó" : "pendiente"}</b> · {VECINOS[sel.receptor].name}: <b>{sel.cierre.includes(sel.receptor) ? "confirmó" : "pendiente"}</b></p>
                    {!sel.cierre.includes(uid) ? (<button className={screenStyles.button} onClick={() => run(confirmarCierre(sel.id, uid))}>Marcar como completado</button>) : (<p className={screenStyles.success} role="status">Esperando que {otroN} confirme.</p>)}
                  </>)}
                  {sel.estado === "completada" && (<>
                    <p className={screenStyles.success} role="status">✓ Finalizada por ambas personas</p>
                    <p className={screenStyles.muted}>Puedes agradecer con un sello de Visto Bueno Vecinal. Es opcional y se emite una sola vez.</p>
                    {!sel.sellos.includes(uid) ? (<><div className={screenStyles.field}><label htmlFor="com-s">Referencia para {otroN} (opcional)</label><input id="com-s" className={screenStyles.input} maxLength={140} value={comentarioSello} onChange={(e) => setComentarioSello(e.target.value)} placeholder="Ej.: llegó puntual y explicó todo" /></div><button className={screenStyles.button} onClick={() => { run(darSello(sel.id, uid, comentarioSello)); setComentarioSello(""); }}>Dar sello a {otroN}</button></>) : (<><p className={screenStyles.success} role="status">✓ Sello emitido. No se puede repetir.</p><Link className={screenStyles.buttonOutline} href="/noticias">Ver Vecino del mes</Link></>)}
                  </>)}
                  {(sel.estado === "rechazada" || sel.estado === "cancelada") && (<p className="font-bold!">{faseTxt(sel)}{sel.cerradaPor ? ` por ${VECINOS[sel.cerradaPor].name}` : ""}{sel.motivo ? ` · Motivo: ${sel.motivo}` : ""}. No se emiten sellos.</p>)}
                </div>
                {esAbierta(sel) && (<button className={screenStyles.buttonSecondary} onClick={() => { setMotivoCancel(""); setConfirmando(true); }}>Cancelar coordinación</button>)}
                {err && (<p className={screenStyles.error} role="alert">{err}</p>)}
              </div>
            )}
          </>
        )}

        {nav.is("detalle") && !sel && (
          <div className={screenStyles.content}><div className={screenStyles.card} role="status"><p className="font-bold!">Esta coordinación no es de {yo.name}</p><button className={screenStyles.button} onClick={nav.back}>Volver a la lista</button></div></div>
        )}

        {confirmando && sel && (
          <>
            <div className={screenStyles.scrim} aria-hidden="true" onClick={() => setConfirmando(false)}></div>
            <div className={SHEET} role="alertdialog" aria-label="Confirmar cancelación">
              <h2 className="text-[22px]!">{sel.estado === "solicitada" ? "¿Cancelar la solicitud?" : "¿Cancelar la coordinación?"}</h2>
              <p className={screenStyles.muted}>{sel.estado === "solicitada" ? "Quien publicó dejará de ver tu solicitud." : "El chat pasará a solo lectura y no podrán acordar ni cerrar. El historial se conserva y no se emiten sellos."}</p>
              <div className={screenStyles.field}><label htmlFor="motc">Motivo (opcional)</label><input id="motc" className={screenStyles.input} maxLength={140} value={motivoCancel} onChange={(e) => setMotivoCancel(e.target.value)} placeholder="Ej.: ya no puedo ese día" /></div>
              <div className="grid-cols-2 grid! gap-2!"><button className={screenStyles.buttonSecondary} onClick={() => setConfirmando(false)}>No, volver</button><button className={screenStyles.button} onClick={() => { run(cancelar(sel.id, uid, motivoCancel)); setConfirmando(false); setMotivoCancel(""); }}>Sí, cancelar</button></div>
            </div>
          </>
        )}

        {sheet && sel && (
          <>
            <div className={screenStyles.scrim} aria-hidden="true" onClick={() => setSheet(false)}></div>
            <div className={SHEET} role="dialog" aria-label="Reportar o bloquear">
              <h2 className="text-[22px]!">{yoBloquee ? `Bloqueaste a ${otroN}` : `Reportar o bloquear a ${otroN}`}</h2>
              {!repHecho ? (
                <>
                  <div className={screenStyles.wrap} role="group" aria-label="Motivo">{MOTIVOS.map((m) => (<button key={m} className={chip(motivoRep === m)} aria-pressed={motivoRep === m} onClick={() => setMotivoRep(m)}>{m}</button>))}</div>
                  <button className={screenStyles.buttonOutline} disabled={!motivoRep} onClick={() => { reportar(uid, otro, motivoRep); setRepHecho(true); }}>Reportar (demostración)</button>
                  <p className={screenStyles.muted}>Reportar no avisa a autoridades ni borra pruebas: queda en el registro de la demostración.</p>
                </>
              ) : (<p className={screenStyles.success} role="status">✓ Reporte guardado en la demostración.</p>)}
              <p className={screenStyles.muted}>Con un bloqueo no podrán enviarse mensajes, solicitudes ni cambios de acuerdo. Si hay una coordinación activa, puedes cancelarla; el acuerdo y el chat se conservan.</p>
              {yoBloquee
                ? (<button className={screenStyles.buttonOutline} onClick={() => { desbloquear(uid, otro); setSheet(false); }}>Desbloquear</button>)
                : (<button className={screenStyles.button} onClick={() => { bloquear(uid, otro); setSheet(false); }}>Bloquear</button>)}
              <button className={screenStyles.buttonSecondary} onClick={() => setSheet(false)}>Cerrar</button>
            </div>
          </>
        )}

        <nav className={screenStyles.navigation} aria-label="Principal">
          <Link href="/inicio"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</Link>
          <Link href="/mapa"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</Link>
          <Link href="/perfil"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</Link>
        </nav>
      </div>
    </div>
  );
}
