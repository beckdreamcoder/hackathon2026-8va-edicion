"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useCheckbox } from "@/lib/hooks/use-checkbox";

import { Fragment, useState } from "react";
import { useDemoState } from "@/lib/demo/store";
import { useSesion, avisar, logEvento } from "@/lib/demo/shared";
import { useIncidentes, autoresDistintos, estadoCorroboracion, registrarReporte, ESTADOS_INST } from "@/lib/demo/incidentes";

const EME_UI = { tab: "n", incId: "INC-0007", needs: [{name: "Alimentos", note: "Comida lista y agua embotellada", ofrecido: false}, {name: "Abrigo", note: "Frazadas y ropa seca", ofrecido: false}, {name: "Materiales", note: "Bolsas, palas y botas", ofrecido: false}, {name: "Logística", note: "Transporte seguro de donaciones", ofrecido: false}] };
const CMSGS = [{kind: "Alertas", title: "Evita el pasaje Los Olivos por agua acumulada", time: "09:20", zone: "Campoy Sector 2", src: "Vecinos (ejemplo)", until: "12:00"}, {kind: "Puntos de reunión", title: "Punto de reunión: local comunal", time: "09:05", zone: "Campoy", src: "Junta de demostración", until: "18:00"}, {kind: "Suministros", title: "Acopio de agua embotellada en el parque", time: "08:50", zone: "Campoy Sector 1", src: "Junta de demostración", until: "20:00"}, {kind: "Apoyo institucional", title: "Mensaje institucional de ejemplo", time: "08:30", zone: "Distrito", src: "Simulación", until: "—"}];
const KIND_ON = "min-h-11 rounded-full border-[1.5px] border-[#9a3412] bg-[#9a3412] px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white";
const KINDS = ["Inundación", "Corte de agua", "Árbol caído", "Otro"];
const DTABS = ["Qué ocurre", "Qué hacer", "Cómo ayudar"];
const CFILTERS = ["Todos", "Alertas", "Puntos de reunión", "Suministros", "Apoyo institucional"];
import { screenStyles } from "./screen-styles";

/**
 * Pantalla Emergencias del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Emergencias() {
  const nav = useViewStack("centro");
  const [sesion] = useSesion();
  const [incs, setIncs] = useIncidentes();
  const [ui, setUi] = useDemoState("emergencias-ui", EME_UI);
  const lugar = useCheckbox(false);
  const sinRed = useCheckbox(false);
  const [foto, setFoto] = useState(null); // null | "cámara" | "ejemplo rotulado"
  const [capHora, setCapHora] = useState("");
  const [precision, setPrecision] = useState("±15 m");
  const [camMsg, setCamMsg] = useState("Vista de la cámara");
  const [kind, setKind] = useState("Inundación");
  const [join, setJoin] = useState(true);
  const [sent, setSent] = useState(null); // null | { pendiente, incId, msg }
  const [dtab, setDtab] = useState(0);
  const [cfilter, setCfilter] = useState("Todos");

  const inc = incs.items.find((i) => i.id === ui.incId) ?? incs.items[0];
  const autores = autoresDistintos(inc);
  const estadoReporte = estadoCorroboracion(inc);
  const instState = ESTADOS_INST[inc.inst];
  const otros = incs.items.filter((i) => i.id !== "INC-0007" && i.reportes.some((r) => r.estado === "enviado"));

  const tabN = ui.tab === "n";
  const tabP = ui.tab === "p";
  const tN = tabN ? screenStyles.chipActive : screenStyles.chip;
  const tP = tabP ? screenStyles.chipActive : screenStyles.chip;
  const setN = () => setUi({ tab: "n" });
  const setP = () => setUi({ tab: "p" });
  const abrir = (id) => { setUi({ incId: id }); setDtab(0); nav.go("detalle"); };

  const takePhoto = async (real) => {
    let medio = "ejemplo rotulado";
    if (real && navigator.mediaDevices?.getUserMedia) {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        s.getTracks().forEach((t) => t.stop());
        medio = "cámara";
        setCamMsg("Foto capturada con la cámara. No se guarda en el dispositivo.");
      } catch {
        setCamMsg("No se pudo usar la cámara. Usamos un ejemplo rotulado de demostración.");
      }
    } else setCamMsg("Ejemplo rotulado de demostración (sin cámara).");
    setCapHora(new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => setPrecision(`±${Math.round(p.coords.accuracy)} m`),
        () => setPrecision("ubicación no autorizada · zona elegida a mano"),
        { timeout: 6000 },
      );
    }
    setFoto(medio);
  };
  const retake = () => { setFoto(null); setCamMsg("Vista de la cámara"); };
  const camKind = foto ?? "";
  const noFoto = !foto;
  const noLugar = !lugar.checked;

  const kinds = KINDS.map((k, i) => ({ name: i === 0 ? `${k} (sugerido)` : k, cls: k === kind ? KIND_ON : screenStyles.chip, pick: () => setKind(k) }));
  const jOn = join ? screenStyles.chipActive : screenStyles.chip;
  const jOff = join ? screenStyles.chip : screenStyles.chipActive;
  const joinYes = () => setJoin(true);
  const joinNo = () => setJoin(false);
  const pendFlag = sinRed.checked || sesion.senal === "Sin datos";
  const sendLbl = pendFlag ? "Guardar como pendiente" : "Enviar reporte";
  const noSent = !sent;
  const sendRep = () => {
    if (sent) return; // bloquea doble envío
    const now = Date.now();
    const rep = { id: `rep-${now}`, clientActionId: `ca-rep-${now}`, autor: sesion.userId, tipo: kind, medio: foto ?? "ejemplo rotulado", hora: capHora, precision, lugarConfirmado: lugar.checked, estado: pendFlag ? "pendiente" : "enviado" };
    const target = join && kind === "Inundación" ? "INC-0007" : null;
    const incId = registrarReporte(rep, target, { titulo: `${kind} en Campoy`, zona: "Campoy" });
    setUi({ incId });
    const repetido = target && inc.reportes.some((r) => r.autor === sesion.userId && r.estado === "enviado");
    setSent({
      pendiente: pendFlag,
      msg: pendFlag ? "Reporte guardado como pendiente. No se ha enviado." : target ? (repetido ? "✓ Reporte unido al incidente. Ya habías reportado: no suma otro testigo." : "✓ Reporte enviado y unido al incidente.") : "✓ Reporte enviado como incidente nuevo.",
    });
    logEvento(pendFlag ? `Reporte de ${kind} en cola sin conexión` : `Reporte de ${kind} ${target ? "unido a INC-0007" : "creó incidente " + incId}`);
    if (!pendFlag) avisar({ categoria: "emergencia", titulo: `Nuevo reporte: ${kind}`, texto: "Reportado cerca de tu zona. Fuente: vecinos (demostración).", href: "/emergencias" });
  };
  const sentMsg = sent?.msg ?? "";

  const advance = () => {
    setIncs((p) => ({ items: p.items.map((i) => (i.id === inc.id ? { ...i, inst: (i.inst + 1) % ESTADOS_INST.length } : i)) }));
    logEvento(`Respuesta institucional simulada: ${ESTADOS_INST[(inc.inst + 1) % ESTADOS_INST.length]}`);
  };
  const dtabs = DTABS.map((d, i) => ({ name: d, cls: i === dtab ? screenStyles.chipActive : screenStyles.chip, pick: () => setDtab(i) }));
  const dtext = [
    `Vecinos reportan ${inc.tipo.toLowerCase()} en ${inc.zona}. ${autores} personas distintas han reportado. El estado no está confirmado por una entidad.`,
    "Aléjate del agua en movimiento, desconecta la electricidad si es seguro y sigue la guía oficial de INDECI para lluvias intensas. Si hay peligro, llama al 116 o al 106.",
    "Apoya con recursos concretos (alimentos, abrigo, materiales o logística segura). No entres a zonas peligrosas ni hagas rescates.",
  ][dtab];

  const needs = ui.needs.map((n, i) => ({
    ...n,
    lbl: n.ofrecido ? "Retirar mi oferta" : "Puedo ofrecer",
    state: n.ofrecido ? "En coordinación" : "Activa",
    cls: n.ofrecido ? screenStyles.buttonSecondary : screenStyles.button,
    pick: () => {
      setUi((p) => ({ needs: p.needs.map((x, j) => (j === i ? { ...x, ofrecido: !x.ofrecido } : x)) }));
      logEvento(`${n.ofrecido ? "Retiró" : "Ofreció"} apoyo: ${n.name}`);
    },
  }));
  const cfilters = CFILTERS.map((f) => ({ name: f, cls: f === cfilter ? screenStyles.chipActive : screenStyles.chip, pick: () => setCfilter(f) }));
  const cmsgs = CMSGS.filter((m) => cfilter === "Todos" || m.kind === cfilter);
  return (
    <div className={screenStyles.screen}>
      <div className={screenStyles.frame}>
      
      {nav.is("centro") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Centro de emergencias</h1></div>
      <div className={screenStyles.content}>
        <a className="min-h-15 rounded-[18px] border-2 border-[#9a3412] bg-[#9a3412] text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full text-[19px] disabled:opacity-50" href="tel:106"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>Llamar al 106 (SAMU)</a>
        <p className={screenStyles.muted}>Abre tu marcador. BarrioConecta no envía ayuda ni avisa a entidades por ti.</p>
        <div className={screenStyles.wrap}><button className={tN} onClick={setN}>Necesito ayuda</button><button className={tP} onClick={setP}>Puedo apoyar</button></div>
        {tabN && (<>
          <h2 className="text-[20px]!">Cerca de mí</h2>
          <button className="bg-[#fff1e6] border border-[#f0c8a8] rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 text-left w-full" onClick={() => abrir("INC-0007")}><div className={screenStyles.row}><span className={screenStyles.badgeEmergency}><svg className={`${screenStyles.icon} w-4! h-4!`} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.5" /></svg>Eventualidad</span><span className={screenStyles.badgeDemo}>Simulación</span></div><h3 className="text-[19px]!">Calles anegadas en Campoy</h3><p className={screenStyles.muted}>{estadoCorroboracion(incs.items.find((i) => i.id === "INC-0007") ?? inc)} · {autoresDistintos(incs.items.find((i) => i.id === "INC-0007") ?? inc)} vecinos distintos · {(incs.items.find((i) => i.id === "INC-0007") ?? inc).actualizado}</p></button>
          {otros.map((o) => (<button key={o.id} className={screenStyles.card} onClick={() => abrir(o.id)}><div className={screenStyles.row}><span className={screenStyles.badgeEmergency}>{estadoCorroboracion(o)}</span></div><h3 className="text-[19px]!">{o.titulo}</h3><p className={screenStyles.muted}>{o.actualizado === "ahora" ? "Actualizado ahora" : `Sin actualización reciente · ${o.actualizado}`} · {autoresDistintos(o)} {autoresDistintos(o) === 1 ? "vecino" : "vecinos"}</p></button>))}
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={() => nav.go("reportar")}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>Reportar con cámara</button>
        </>)}
        {tabP && (<>
          <h2 className="text-[20px]!">Cómo puedo ayudar</h2>
          <p className={screenStyles.muted}>Ayuda con recursos y logística segura. No se envía a civiles a rescates peligrosos.</p>
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={() => nav.go("apoyo")}>Ver necesidades de apoyo</button>
        </>)}
        <div className="grid-cols-2 grid! gap-2.5!">
          <button className={`${screenStyles.card} min-h-19! justify-center!`} onClick={() => nav.go("contactos")}><b>Contactos oficiales</b><span className={screenStyles.muted}>Sin conexión: disponible</span></button>
          <button className={`${screenStyles.card} min-h-19! justify-center!`} onClick={() => nav.go("canal")}><b>Canal de ayuda</b><span className={screenStyles.muted}>Alertas y recursos</span></button>
        </div>
        <a className={`${screenStyles.card} flex-row! items-center!`} href="/offline"><div className={screenStyles.grow}><b>Mis consultas por SMS</b><p className={screenStyles.muted}>Pregunta sin datos móviles (simulado)</p></div><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></a>
      </div>
      </>)}
      
      {nav.is("reportar") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Reportar incidencia</h1></div>
      <div className={screenStyles.content}>
        <div className="bg-[#fff1e6] border border-[#f0c8a8] rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 text-left w-full" role="note"><p><b>¿Hay peligro ahora?</b> Llama primero. No necesitas foto para pedir ayuda.</p><a className="min-h-15 rounded-[18px] border-2 border-[#9a3412] bg-[#9a3412] text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full text-[19px] disabled:opacity-50 min-h-13!" href="tel:106">Llamar al 106</a></div>
        <div className="relative h-62.5 rounded-[20px] bg-[#2b2b2b] grid place-items-center text-white overflow-hidden [&_.fr]:absolute [&_.fr]:inset-4.5 [&_.fr]:border-2 [&_.fr]:border-dashed [&_.fr]:border-[rgba(255,255,255,.7)] [&_.fr]:rounded-[16px]"><div className="fr"></div><p className="text-center px-10! py-0!">{camMsg}</p></div>
        <p className={screenStyles.muted}>La foto se toma con la cámara; no se sube desde la galería. Tu navegador pedirá permiso.</p>
        <div className={screenStyles.card}><p className={screenStyles.label}>Ubicación y hora (de tu dispositivo)</p><p>{sesion.localidad} · precisión {precision} · {capHora || "se registra al tomar la foto"}</p><p className={screenStyles.muted}>Tu ubicación no prueba por sí sola dónde ocurrió el hecho.</p></div>
        <div className={screenStyles.checkboxRow}><input id="lug" type="checkbox" {...lugar.props} /><label htmlFor="lug"><b>Confirmo que veo este lugar ahora</b></label></div>
        {noFoto && (<>
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={() => takePhoto(true)}>Tomar foto</button>
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={() => takePhoto(false)}>No tengo cámara · ejemplo rotulado</button>
        </>)}
        {foto && (<>
          <p className={screenStyles.success} role="status">✓ Foto tomada ({camKind})</p>
          {lugar.checked && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={() => nav.go("revisar")}>Continuar</button></>)}
          {noLugar && (<><p className={screenStyles.error} role="alert">Marca que confirmas el lugar para continuar.</p></>)}
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={retake}>Tomar otra</button>
        </>)}
      </div>
      </>)}
      
      {nav.is("revisar") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Revisa tu reporte</h1></div>
      <div className={screenStyles.content}>
        <div className="h-37.5 rounded-[20px] bg-[repeating-linear-gradient(45deg,#E3DDD7,#E3DDD7_10px,#EFE8DD_10px,#EFE8DD_20px)] grid place-items-center text-center p-3 border border-[#cfc7bf]" role="img" aria-label="Imagen protegida"><div><b>Imagen protegida</b><p className={screenStyles.muted}>Se oculta antes de publicar. Demostración con ejemplo inocuo.</p></div></div>
        <span className={screenStyles.badgeDemo}>Análisis simulado, sin IA real</span>
        <div className="flex flex-col gap-1.5"><p className={screenStyles.label}>Tipo sugerido (puedes corregir)</p><div className={screenStyles.wrap}>{(kinds ?? []).map((k, __i1) => (<Fragment key={__i1}><button className={k.cls} onClick={k.pick}>{k.name}</button></Fragment>))}</div></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Posible incidente existente</p><p>«Calles anegadas en Campoy» · a 120 m · mismo tipo y franja horaria</p><div className={screenStyles.wrap}><button className={jOn} onClick={joinYes}>Unir a este incidente</button><button className={jOff} onClick={joinNo}>Es otro</button></div><p className={screenStyles.muted}>Se cuentan personas distintas y se conservan los reportes originales.</p></div>
        {pendFlag && (<><p className={screenStyles.muted}>Sin conexión: se guardará pendiente y se pedirá confirmar vigencia al reconectar.</p></>)}
        <div className={screenStyles.checkboxRow}><input id="off" type="checkbox" {...sinRed.props} /><label htmlFor="off"><b>Simular que no tengo conexión</b></label></div>
        {noSent && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={sendRep}>{sendLbl}</button></>)}
        {sent && (<><div className={screenStyles.card} role="status"><p className={screenStyles.success}>{sentMsg}</p><p className={screenStyles.muted}>Estado: {estadoReporte} · {autores} vecinos distintos.</p><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={() => nav.go("detalle")}>Ver incidente</button></div></>)}
      </div>
      </>)}
      
      {nav.is("detalle") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>{inc.titulo}</h1></div>
      <div className={screenStyles.content}>
        <div className={screenStyles.row}><span className={screenStyles.badgeEmergency}>{estadoReporte}</span><span className={screenStyles.badgeDemo}>Ejemplo ficticio</span></div>
        <p className={screenStyles.muted}>ID {inc.id} · {autores} vecinos distintos · actualizado {inc.actualizado}</p>
        <div className="flex gap-2 overflow-x-auto pb-0.5" role="tablist">{(dtabs ?? []).map((d, __i1) => (<Fragment key={__i1}><button className={d.cls} role="tab" onClick={d.pick}>{d.name}</button></Fragment>))}</div>
        <div className={screenStyles.card}><p>{dtext}</p><p className={screenStyles.muted}>Fuente: reportes de vecinos y guía de ejemplo de Defensa Civil (demostración).</p></div>
        <div className="bg-[#fff1e6] border border-[#f0c8a8] rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 text-left w-full"><p className={screenStyles.label}>Respuesta institucional</p><span className={screenStyles.badgeDemo}>Simulación</span><p className="font-bold">{instState}</p><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 min-h-12!" onClick={advance}>Simular siguiente respuesta</button><p className={screenStyles.muted}>No hay despacho real. Solo se muestran estados con constancia o rotulados como simulación.</p></div>
        <a className="min-h-15 rounded-[18px] border-2 border-[#9a3412] bg-[#9a3412] text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full text-[19px] disabled:opacity-50" href="tel:106">Llamar al 106</a>
        <div className="grid-cols-2 grid! gap-2!"><a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 min-h-12!" href="/mapa">Ver en el mapa</a><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 min-h-12!" onClick={() => nav.go("apoyo")}>Recursos</button></div>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={() => nav.go("reportar")}>Aportar un reporte</button>
      </div>
      </>)}
      
      {nav.is("apoyo") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Necesidades y apoyo</h1></div>
      <div className={screenStyles.content}>
        <div className="bg-[#fff1e6] border border-[#f0c8a8] rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 text-left w-full" role="note"><p>No se envía a vecinos a rescates entre escombros ni a zonas peligrosas. Para rescate, llama al 116.</p></div>
        {(needs ?? []).map((n, __i1) => (<Fragment key={__i1}>
          <div className={screenStyles.card}><div className={screenStyles.row}><b className={screenStyles.grow}>{n.name}</b><span className={screenStyles.badgeSolidarity}>{n.state}</span></div><p className={screenStyles.muted}>{n.note}</p><button className={`${n.cls} min-h-12!`} onClick={n.pick}>{n.lbl}</button></div>
        </Fragment>))}
        <p className={screenStyles.muted}>«Atendida» no significa que la emergencia terminó.</p>
      </div>
      </>)}
      
      {nav.is("contactos") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Contactos oficiales</h1></div>
      <div className={screenStyles.content}>
        <span className={screenStyles.badgeFavor}>Guardado en tu dispositivo · disponible sin conexión</span>
        <a className={`${screenStyles.card} flex-row! items-center!`} href="tel:105"><div className={screenStyles.grow}><h3 className="text-[20px]!">Policía · 105</h3><p className={screenStyles.muted}>Seguridad y delitos</p></div><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg></a>
        <a className={`${screenStyles.card} flex-row! items-center!`} href="tel:116"><div className={screenStyles.grow}><h3 className="text-[20px]!">Bomberos · 116</h3><p className={screenStyles.muted}>Incendios y rescates</p></div><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg></a>
        <a className={`${screenStyles.card} flex-row! items-center!`} href="tel:106"><div className={screenStyles.grow}><h3 className="text-[20px]!">SAMU · 106</h3><p className={screenStyles.muted}>Urgencias médicas</p></div><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg></a>
        <div className={screenStyles.card}><p className={screenStyles.label}>Fuente</p><p className={screenStyles.muted}>Directorio oficial de números de emergencia del Perú. Fecha de revisión: [FECHA POR VALIDAR]. Verifica siempre en la fuente oficial.</p><p className={screenStyles.muted}>Otros contactos de tu zona: [POR VALIDAR POR TU JUNTA O MUNICIPALIDAD]</p></div>
        <p className={screenStyles.muted}>La llamada depende del servicio telefónico de tu celular.</p>
      </div>
      </>)}
      
      {nav.is("canal") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Canal de ayuda</h1></div>
      <div className={screenStyles.content}>
        <span className={screenStyles.badgeDemo}>Mensajes de demostración</span>
        <div className="flex gap-2 overflow-x-auto pb-0.5" role="group" aria-label="Filtrar">{(cfilters ?? []).map((f, __i1) => (<Fragment key={__i1}><button className={f.cls} onClick={f.pick}>{f.name}</button></Fragment>))}</div>
        {(cmsgs ?? []).map((m, __i1) => (<Fragment key={__i1}><div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 text-left w-full border-l-0 border-t-[4px] border-t-[#9a3412]"><div className={screenStyles.row}><span className={screenStyles.badgeEmergency}>{m.kind}</span><span className="flex-1 min-w-0 text-(--color-muted) text-[15px] text-right!">{m.time}</span></div><b>{m.title}</b><p className={screenStyles.muted}>{m.zone} · Fuente: {m.src} · Vigente hasta {m.until}</p></div></Fragment>))}
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
