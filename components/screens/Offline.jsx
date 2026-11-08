"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useCheckbox } from "@/lib/hooks/use-checkbox";
import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment, useEffect, useState } from "react";
import { useDemoState } from "@/lib/demo/store";
import { useSesion, logEvento, CHIP_ON } from "@/lib/demo/shared";
import { usePublicaciones } from "@/lib/demo/publicaciones";
import { useIncidentes } from "@/lib/demo/incidentes";
import { precacheZona, estimarEspacio } from "@/lib/demo/offline-cache";
import { useSinConexion } from "@/lib/demo/conexion";
import { useCola, procesarCola, descartarOp, pendientesCola } from "@/lib/demo/cola";
import { useEstadoAlmacen } from "@/lib/demo/store";
import { usePwa, instalarApp } from "@/lib/pwa";

const CHIP_OFF = "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip";
const CHIP_INK_ON = "min-h-11 rounded-full border-[1.5px] border-(--color-ink) bg-(--color-ink) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip";
const OFF_INICIAL = { zonas: { campoy: { estado: "No descargada", sync: "", mb: 0 }, calca: { estado: "No descargada", sync: "", mb: 0 } }, consultas: [], actual: null };
const SMS_KINDS = ["Necesito orientación", "Busco suministros", "Necesito ayuda", "Consultar mi solicitud"];
const SMS_ME = "self-end max-w-[85%] rounded-[18px] rounded-br-[6px] bg-(--color-ink) text-white px-3.5 py-2 flex flex-col gap-0.5 [&_b]:text-[13px] [&_b]:opacity-80";
const SMS_CENTRAL = "self-start max-w-[85%] rounded-[18px] rounded-bl-[6px] bg-[#f1ece6] px-3.5 py-2 flex flex-col gap-0.5 [&_b]:text-[13px] [&_b]:text-(--color-muted)";
/** Respuestas controladas (sin IA real): guías oficiales y recursos registrados en la demo. */
const RESPUESTAS = {
  "Necesito orientación": { t: "Aléjate de zonas con agua en movimiento y cables. Si hay peligro, llama al 116 (Bomberos) o al 106 (SAMU).", contingencia: "sigue las indicaciones de INDECI y llama al 116 o 106 si hay peligro.", fuente: "Guía INDECI (ejemplo)" },
  "Busco suministros": { t: "Punto de acopio de demostración: parque del Sector 1, agua embotellada hasta las 20:00. No hay más suministros confirmados.", contingencia: "no hay información confirmada de suministros en este momento.", fuente: "Canal de ayuda de la junta (demo)" },
  "Necesito ayuda": { t: "Si es una urgencia médica llama al 106. Registramos tu necesidad con este ID para que vecinos de apoyo la vean, sin publicar tus datos.", contingencia: "llama al 106 o al 105 según el caso. No se despacha ayuda desde este canal.", fuente: "Directorio oficial de emergencias" },
  "Consultar mi solicitud": { t: "Tu última solicitud sigue Activa, sin respuesta institucional registrada (simulación).", contingencia: "no pudimos consultar el estado ahora; se conserva tu ID.", fuente: "Registro de la demo" },
};
import { screenStyles } from "./screen-styles";

/**
 * Pantalla Offline del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Offline() {
  const nav = useViewStack("zonas");
  const [sesion, setSesion] = useSesion();
  const [of, setOf] = useDemoState("offline", OFF_INICIAL);
  const [pubs, setPubs] = usePublicaciones();
  const [incs, setIncs] = useIncidentes();
  const question = useTextInput("");
  const zone = useTextInput("");
  const reply = useTextInput("");
  const failMode = useCheckbox(false);
  const [cola] = useCola();
  const almacen = useEstadoAlmacen();
  const pwa = usePwa();
  const [espacio, setEspacio] = useState(null);
  useEffect(() => { estimarEspacio().then(setEspacio); }, [of, cola.items.length]);
  const offline = useSinConexion();
  const cOn = offline ? CHIP_OFF : CHIP_ON;
  const cOff = offline ? CHIP_ON : CHIP_OFF;
  const goOnline = () => setSesion({ senal: "Normal" });
  const goOffline = () => setSesion({ senal: "Sin datos" });

  // ---- Zonas descargadas
  const [dl, setDl] = useState({ zona: null, pct: 0, fail: false });
  const z = of.zonas.campoy;
  const zoneTag = z.estado;
  const zoneInfo = z.estado === "Descargada" ? `Guardada en este dispositivo: ${z.sync}` : "Sin datos guardados en este dispositivo";
  const dlRun = dl.zona === "campoy" && dl.pct < 100 && !dl.fail;
  const dlFail = dl.zona === "campoy" && dl.fail;
  const pct = dl.pct;
  const dlLbl = z.estado === "Descargada" ? "Actualizar" : "Guardar zona";
  const descargar = (id) => {
    if (offline) { setDl({ zona: id, pct: 0, fail: true }); return; }
    setDl({ zona: id, pct: 0, fail: false });
    let p = 0;
    const t = setInterval(() => {
      p += 20;
      if (failMode.checked && p >= 60) {
        clearInterval(t);
        setDl({ zona: id, pct: p, fail: true }); // se conserva la versión anterior
        logEvento(`Descarga de zona falló al ${p} %: se conserva la versión anterior`);
        return;
      }
      setDl({ zona: id, pct: p, fail: false });
      if (p >= 100) {
        clearInterval(t);
        precacheZona();
        const sync = `hoy ${new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}`;
        setOf((o) => ({ zonas: { ...o.zonas, [id]: { ...o.zonas[id], estado: "Descargada", sync, mb: id === "campoy" ? 48 : 31 } } }));
        logEvento(`Zona ${id === "campoy" ? "Campoy" : "Calca Centro"} descargada (sincronización completa)`);
      }
    }, 350);
  };
  const startDl = () => descargar("campoy");
  const [delWarn, setDelWarn] = useState(false);
  const delZone = () => {
    setDelWarn(pendCount > 0);
    setOf((o) => ({ zonas: { ...o.zonas, campoy: { ...o.zonas.campoy, estado: "No descargada" } } }));
    logEvento("Zona Campoy eliminada del dispositivo (los pendientes se conservan)");
  };
  const calca = of.zonas.calca;

  // ---- Cola de pendientes (idempotente por clientActionId)
  const [askIds, setAskIds] = useState([]);
  const [msg, setMsg] = useState(null);
  const pubsPend = pubs.items.filter((p) => p.estado === "pendiente");
  const repsPend = incs.items.flatMap((i) => i.reportes.filter((r) => r.estado === "pendiente").map((r) => ({ ...r, incId: i.id, incTitulo: i.titulo })));
  const opsCola = pendientesCola(cola.items);
  const pendCount = pubsPend.length + repsPend.length + opsCola.length;
  const resolverReporte = (r, vigente) => {
    setIncs((p) => ({
      items: p.items
        .map((i) => (i.id !== r.incId ? i : { ...i, actualizado: vigente ? "ahora" : i.actualizado, reportes: vigente ? i.reportes.map((x) => (x.clientActionId === r.clientActionId ? { ...x, estado: "enviado" } : x)) : i.reportes.filter((x) => x.clientActionId !== r.clientActionId) }))
        .filter((i) => i.reportes.length > 0),
    }));
    setAskIds((a) => a.filter((x) => x !== r.clientActionId));
    logEvento(vigente ? `Reporte pendiente enviado tras confirmar vigencia (${r.incId})` : "Reporte pendiente descartado: ya no estaba vigente");
  };
  const queue = [
    ...opsCola.map((o) => ({
      title: o.tipo === "solicitud" ? `Solicitud: «${o.titulo}»` : `${o.titulo}: «${(o.datos.texto ?? "").slice(0, 60)}»`, kind: "Coordinación",
      stateLbl: o.estado === "error" ? "Con error" : "Guardada, no enviada", tagCls: o.estado === "error" ? screenStyles.badgeAlert : screenStyles.badgeDemo,
      detalle: o.estado === "error" ? `No se pudo aplicar: ${o.error}` : "", ask: false, canCancel: true, canRetry: o.estado === "error" && !offline,
      retry: () => procesarCola(o.id), yes: () => {}, no: () => {}, cancel: () => descartarOp(o.id),
    })),
    ...pubsPend.map((p) => ({
      title: `${p.tipo === "cachuelo" ? "Cachuelo" : p.tipo === "campana" ? "Campaña" : "Favor"}: «${p.titulo}»`, kind: "Ordinaria", stateLbl: "Pendiente de enviar", tagCls: screenStyles.badgeDemo, ask: false, canCancel: true,
      yes: () => {}, no: () => {}, cancel: () => setPubs((x) => ({ items: x.items.filter((y) => y.clientActionId !== p.clientActionId) })),
    })),
    ...repsPend.map((r) => ({
      title: `Reporte: ${r.tipo} · ${r.incTitulo}`, kind: "Emergencia", stateLbl: askIds.includes(r.clientActionId) ? "Confirma vigencia" : "Pendiente de enviar", tagCls: screenStyles.badgeDemo,
      ask: askIds.includes(r.clientActionId), canCancel: !askIds.includes(r.clientActionId),
      yes: () => resolverReporte(r, true), no: () => resolverReporte(r, false), cancel: () => resolverReporte(r, false),
    })),
  ];
  const sync = () => {
    if (offline) { setMsg({ ok: false, t: "Sin conexión: no se aplicó nada. Tus pendientes siguen guardados en este dispositivo." }); return; }
    const r = procesarCola();
    const n = pubsPend.length;
    if (n) {
      setPubs((x) => ({ items: x.items.map((y) => (y.estado === "pendiente" ? { ...y, estado: "publicado" } : y)) }));
      logEvento(`Pendientes: ${n} publicación(es) publicadas en este dispositivo sin duplicar`);
    }
    setAskIds(repsPend.map((r) => r.clientActionId));
    setMsg({ ok: true, t: (n || r.total) ? `✓ ${n + r.aplicadas} operación(es) aplicadas en este dispositivo${r.errores ? ` y ${r.errores} con error` : ""}. No hay servidor: nada se envió fuera de la app.${repsPend.length ? " Confirma la vigencia de las emergencias." : ""}` : repsPend.length ? "Confirma si las emergencias pendientes siguen vigentes." : "✓ No hay nada pendiente." });
  };
  const msgCls = msg?.ok === false ? screenStyles.error : screenStyles.success;
  const msgTxt = msg?.t ?? "";

  // ---- Consulta SMS simulada
  const [kind, setKind] = useState(SMS_KINDS[0]);
  const kinds = SMS_KINDS.map((k) => ({ name: k, cls: k === kind ? CHIP_INK_ON : CHIP_OFF, pick: () => setKind(k) }));
  const cons = of.consultas.find((c) => c.id === of.actual) ?? null;
  const hasConsulta = !!cons;
  const cid = cons?.id ?? "";
  const cstatus = cons?.estado ?? "";
  const needZone = cons?.estado === "Esperando tu localidad";
  const synced = !!cons?.sincronizada;
  const hora = () => new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  const msgs = (cons?.msgs ?? []).map((m) => ({ ...m, cls: m.who === "Tú" ? SMS_ME : SMS_CENTRAL }));
  const responder = (c, zona) => {
    if (sesion.smsCentral === "Caída") return { ...c, estado: "Sin respuesta de la central", msgs: [...c.msgs, { who: "Pasarela", time: hora(), t: "La central simulada no responde. Tu mensaje queda registrado con el mismo ID; reintenta más tarde." }] };
    const base = RESPUESTAS[c.kind] ?? RESPUESTAS["Necesito orientación"];
    const texto = sesion.ia === "Sin respuesta" ? `Respuesta revisada de contingencia para ${zona}: ${base.contingencia}` : `Para ${zona}: ${base.t}`;
    return { ...c, zona, estado: "Respondida", msgs: [...c.msgs, { who: "Central (simulada)", time: hora(), t: `${texto} Fuente: ${base.fuente}. ID ${c.id}.` }] };
  };
  const sendSms = () => {
    const q = question.value.trim();
    if (!q) return;
    const dup = of.consultas.find((c) => c.msgs.some((m) => m.who === "Tú" && m.t === q));
    if (dup) { setOf({ actual: dup.id }); logEvento(`SMS duplicado ignorado (${dup.id})`); nav.go("consulta"); return; }
    const id = `SMS-${String(of.consultas.length + 1).padStart(4, "0")}`;
    let c = { id, kind, zona: zone.value.trim(), estado: "Recibida", sincronizada: false, msgs: [{ who: "Tú", time: hora(), t: q }] };
    c = c.zona ? responder(c, c.zona) : { ...c, estado: "Esperando tu localidad", msgs: [...c.msgs, { who: "Central (simulada)", time: hora(), t: `Recibimos tu consulta ${id}. ¿En qué localidad estás? Responde con el nombre de tu barrio o comunidad.` }] };
    setOf((o) => ({ consultas: [c, ...o.consultas], actual: id }));
    logEvento(`SMS simulado recibido por la central: ${id} (${kind})`);
    question.setValue("");
    nav.go("consulta");
  };
  const sendReply = () => {
    const zona = reply.value.trim();
    if (!zona || !cons) return;
    const c = responder({ ...cons, msgs: [...cons.msgs, { who: "Tú", time: hora(), t: zona }] }, zona);
    setOf((o) => ({ consultas: o.consultas.map((x) => (x.id === c.id ? c : x)) }));
    reply.setValue("");
  };
  const reconnect = () => {
    if (!cons) return;
    setOf((o) => ({ consultas: o.consultas.map((x) => (x.id === cons.id ? { ...x, sincronizada: true } : x)) }));
    logEvento(`Consulta ${cons.id} sincronizada con la app al recuperar conexión`);
  };
  return (
    <div className="m-0 bg-white text-(--color-ink) font-[Nunito,system-ui,sans-serif] text-[17px] leading-[1.4] [&_h1]:font-[Nunito,system-ui,sans-serif] [&_h1]:m-0 [&_h1]:leading-[1.15] [&_h1]:tracking-[-.01em] [&_h2]:font-[Nunito,system-ui,sans-serif] [&_h2]:m-0 [&_h2]:leading-[1.15] [&_h2]:tracking-[-.01em] [&_h3]:font-[Nunito,system-ui,sans-serif] [&_h3]:m-0 [&_h3]:leading-[1.15] [&_h3]:tracking-[-.01em] [&_h4]:font-[Nunito,system-ui,sans-serif] [&_h4]:m-0 [&_h4]:leading-[1.15] [&_h4]:tracking-[-.01em] [&_.t]:font-[Nunito,system-ui,sans-serif] [&_.t]:m-0 [&_.t]:leading-[1.15] [&_.t]:tracking-[-.01em] [&_p]:m-0 [&_button]:cursor-pointer [&_:focus-visible]:outline-3 [&_:focus-visible]:outline-(--color-ink) [&_:focus-visible]:outline-offset-2 [&_textarea.in]:px-3.5 [&_textarea.in]:py-3 [&_textarea.in]:min-h-21 [&_textarea.in]:resize-none">
      <div className={screenStyles.frame}>
      
      {nav.is("zonas") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Mis zonas sin conexión</h1></div></>)}
      {nav.is("pend") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Pendientes de envío</h1></div></>)}
      {nav.is("sms") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Consulta por SMS</h1></div></>)}
      {nav.is("consulta") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Consulta {cid}</h1></div></>)}
      
      <div className="flex gap-2 pt-0 px-4 pb-2 items-center flex-none [&_span]:text-[14px] [&_span]:text-(--color-muted) [&_span]:font-bold [&_span]:whitespace-nowrap [&_.chip]:min-h-10 [&_.chip]:px-3 [&_.chip]:py-0" role="group" aria-label="Conexi\u00f3n del dispositivo"><span>Conexión:</span><button className={cOn} onClick={goOnline}>En línea</button><button className={cOff} onClick={goOffline}>Sin conexión</button></div>
      {offline && (<><div className="mt-0 mx-4 mb-2 bg-[#fff4d6] text-[#5c3d00] border border-[#e6c77a] rounded-[14px] px-3 py-2 text-[14px] font-bold flex-none" role="status">Sin conexión. Verás lo descargado con su hora. No hay mensajes ni noticias nuevas.</div></>)}
      
      {nav.is("zonas") && (<>
      <div className={screenStyles.content}>
        <div className={screenStyles.card}><div className={screenStyles.row}><b className={screenStyles.grow}>Campoy · San Juan de Lurigancho</b><span className={screenStyles.badgeFavor}>{zoneTag}</span></div>
          <p className={screenStyles.muted}>{zoneInfo}</p>
          {dlRun && (<><div className="h-3 rounded-[6px] bg-(--color-line) overflow-hidden [&_i]:block [&_i]:h-full [&_i]:bg-[#2f5a2d]" role="progressbar" aria-valuenow={`${pct ?? ""}`} aria-valuemin="0" aria-valuemax="100" aria-label="Descarga"><i style={{ width: `${pct}%` }}></i></div><p className={screenStyles.muted} role="status">Descargando… {pct} %</p></>)}
          {dlFail && (<><p className={screenStyles.error} role="alert">{offline ? "Sin conexión no se puede descargar. Conservamos tu versión anterior." : "No se pudo completar la descarga. Conservamos tu versión anterior."}</p></>)}
          <div className={`${screenStyles.row} flex-wrap!`}><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 flex-1! min-h-12!" onClick={startDl}>{dlLbl}</button><button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 flex-1! min-h-12!" onClick={delZone}>Eliminar</button></div>
          <div className={screenStyles.checkboxRow}><input id="fl" type="checkbox" {...failMode.props} /><label htmlFor="fl"><span className={screenStyles.muted}>Simular que la descarga falla</span></label></div>
          {delWarn && (<><p className={screenStyles.error} role="alert">Tienes {pendCount} envíos pendientes. Eliminar la zona no los borra; se enviarán cuando haya conexión.</p></>)}
          <p className={screenStyles.muted}>Incluye mapa de demostración, incidencias con hora, calor de instantánea, contactos oficiales y orientación. La interfaz y tus datos se guardan en el navegador (IndexedDB y caché). Las teselas del mapa y el cálculo de rutas necesitan Internet: sin conexión solo verás las teselas ya vistas.</p></div>
        <div className={screenStyles.card}><div className={screenStyles.row}><b className={screenStyles.grow}>Calca Centro</b><span className={screenStyles.badge}>{calca.estado}</span></div><p className={screenStyles.muted}>{calca.estado === "Descargada" ? `Guardada en este dispositivo: ${calca.sync}` : "Área no descargada: sin conexión verías un aviso y la lista de reportes como alternativa."}</p>{dl.zona === "calca" && dl.pct < 100 && !dl.fail && (<p className={screenStyles.muted} role="status">Descargando… {dl.pct} %</p>)}{dl.zona === "calca" && dl.fail && (<p className={screenStyles.error} role="alert">No se pudo descargar. No se marcó como disponible.</p>)}<button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 min-h-12!" onClick={() => descargar("calca")}>{calca.estado === "Descargada" ? "Actualizar" : "Guardar zona"}</button></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Espacio</p><div className="h-3 rounded-[6px] bg-(--color-line) overflow-hidden [&_i]:block [&_i]:h-full [&_i]:bg-[#2f5a2d]" aria-hidden="true"><i className="w-[18%]!"></i></div><p className={screenStyles.muted}>{espacio ? `Usado por BarrioConecta: ${espacio.usadoMb} MB · Libre aprox.: ${espacio.libreMb} MB` : "El navegador no informa el espacio usado."}</p><p className={screenStyles.muted}>Almacén de datos: {almacen.motor === "indexeddb" ? "IndexedDB" : almacen.motor === "localstorage" ? "localStorage (IndexedDB no disponible)" : "iniciando…"}{almacen.migrados ? ` · ${almacen.migrados} dato(s) migrados desde la versión anterior` : ""}{almacen.error ? ` · ${almacen.error}` : ""}</p></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Instalar como app</p><p className={screenStyles.muted}>{pwa.instalada ? "BarrioConecta ya está instalada en este dispositivo." : pwa.sw === "desarrollo" ? "El modo sin conexión de la interfaz solo se activa en la versión de producción." : pwa.puedeInstalar ? "Puedes instalarla para abrirla como una app." : "Si tu navegador lo permite, usa «Instalar» del menú. En iPhone: Compartir › Añadir a pantalla de inicio."}</p>{pwa.puedeInstalar && !pwa.instalada && (<button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full min-h-11!" onClick={instalarApp}>Instalar BarrioConecta</button>)}</div>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={() => nav.go("pend")}>Pendientes de envío ({pendCount})</button>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={() => nav.go("sms")}>Consulta por SMS</button>
      </div>
      </>)}
      
      {nav.is("pend") && (<>
      <div className={screenStyles.content}>
        {queue.length === 0 && (<div className={screenStyles.card} role="status"><p className="font-bold!">No tienes envíos pendientes</p><p className={screenStyles.muted}>Lo que publiques o reportes sin conexión aparecerá aquí.</p></div>)}
        {(queue ?? []).map((q, __i1) => (<Fragment key={__i1}>
          <div className={screenStyles.card}><div className={screenStyles.row}><span className={q.tagCls}>{q.stateLbl}</span><span className="flex-1 min-w-0 text-(--color-muted) text-[15px] text-right!">{q.kind}</span></div><b>{q.title}</b>{q.detalle && (<p className={screenStyles.error} role="alert">{q.detalle}</p>)}
            {q.ask && (<><p className={screenStyles.muted}>Antes de enviar: ¿esta emergencia sigue vigente?</p><div className="grid-cols-2 grid! gap-2!"><button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 min-h-12!" onClick={q.no}>Ya no</button><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 min-h-12!" onClick={q.yes}>Sigue vigente</button></div></>)}
            {q.canRetry && (<button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full min-h-11!" onClick={q.retry}>Reintentar</button>)}
            {q.canCancel && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 min-h-11!" onClick={q.cancel}>Cancelar envío</button></>)}</div>
        </Fragment>))}
        {msg && (<><p className={msgCls} role="status">{msgTxt}</p></>)}
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={sync}>Sincronizar ahora</button>
        <p className={screenStyles.muted}>Cada envío tiene un identificador único: reintentar no duplica ni revive reportes cerrados.</p>
      </div>
      </>)}
      
      {nav.is("sms") && (<>
      <div className={screenStyles.content}>
        <span className={screenStyles.badgeDemo}>Teléfono y central estatal simulados</span>
        <div className={screenStyles.card} role="note"><p className={screenStyles.muted}>Esto simula a una persona <b>sin datos móviles</b> que solo tiene SMS. No es lo mismo que perder la conexión del dispositivo. Una PWA no puede leer tu bandeja de SMS: en la vida real el mensaje llega a tu app de mensajes.</p></div>
        <div className={screenStyles.field}><p className={screenStyles.label}>¿Qué necesitas?</p><div className={screenStyles.wrap}>{(kinds ?? []).map((k, __i1) => (<Fragment key={__i1}><button className={k.cls} onClick={k.pick}>{k.name}</button></Fragment>))}</div></div>
        <div className={screenStyles.field}><label htmlFor="q">Tu pregunta</label><textarea id="q" className="min-h-21 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-3 bg-white w-full resize-none" placeholder="Ejemplo: \u00bfd\u00f3nde recojo agua?" {...question.props}></textarea></div>
        <div className={screenStyles.field}><label htmlFor="z">Localidad (opcional)</label><input id="z" className={screenStyles.input} placeholder="Ejemplo: Campoy" {...zone.props} /></div>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={sendSms}>Enviar SMS (simulado)</button>
        {hasConsulta && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={() => nav.go("consulta")}>Ver mi consulta {cid}</button></>)}
      </div>
      </>)}
      
      {nav.is("consulta") && (<>
      <div className={screenStyles.content} role="log" aria-live="polite">
        <div className={screenStyles.row}><span className={screenStyles.badgeDemo}>SMS simulado</span><span className={screenStyles.badge}>{cstatus}</span></div>
        <span className={screenStyles.badgeAlert}>Consulta privada · no se publica</span>
        {(msgs ?? []).map((m, __i1) => (<Fragment key={__i1}><div className={m.cls}><b>{m.who} · {m.time}</b>{m.t}</div></Fragment>))}
        {needZone && (<><div className={screenStyles.field}><label htmlFor="rz">Tu respuesta</label><input id="rz" className={screenStyles.input} placeholder="Ejemplo: Campoy" {...reply.props} /></div><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={sendReply}>Responder por SMS</button></>)}
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={reconnect}>Simular que recupero la conexión</button>
        {synced && (<><p className={screenStyles.success} role="status">✓ Esta consulta ya aparece en Emergencias › Mis consultas con el mismo ID y tu celular vinculado.</p></>)}
        <p className={screenStyles.muted}>Respuestas de ejemplo con guías controladas; no se usa IA real ni se inventan suministros, rutas seguras ni despachos.</p>
      </div>
      </>)}
      
      <nav className={screenStyles.navigation} aria-label="Principal">
        <a href="/inicio"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a href="/mapa"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a href="/perfil"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      </div>
    </div>
  );
}
