"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useCheckbox } from "@/lib/hooks/use-checkbox";

import { Fragment } from "react";
import "./Emergencias.css";

/**
 * Pantalla Emergencias del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Emergencias() {
  const nav = useViewStack("centro");
  const advance = () => {};
  const autores = 2;
  const camKind = "";
  const camMsg = "Vista de la cámara";
  const cfilters = [{name: "Todos", cls: "chip on", pick: () => {}}, {name: "Alertas", cls: "chip", pick: () => {}}, {name: "Puntos de reunión", cls: "chip", pick: () => {}}, {name: "Suministros", cls: "chip", pick: () => {}}, {name: "Apoyo institucional", cls: "chip", pick: () => {}}];
  const cmsgs = [{kind: "Alertas", title: "Evita el pasaje Los Olivos por agua acumulada", time: "09:20", zone: "Campoy Sector 2", src: "Vecinos (ejemplo)", until: "12:00"}, {kind: "Puntos de reunión", title: "Punto de reunión: local comunal", time: "09:05", zone: "Campoy", src: "Junta de demostración", until: "18:00"}, {kind: "Suministros", title: "Acopio de agua embotellada en el parque", time: "08:50", zone: "Campoy Sector 1", src: "Junta de demostración", until: "20:00"}, {kind: "Apoyo institucional", title: "Mensaje institucional de ejemplo", time: "08:30", zone: "Distrito", src: "Simulación", until: "—"}];
  const dtabs = [{name: "Qué ocurre", cls: "chip on", pick: () => {}}, {name: "Qué hacer", cls: "chip", pick: () => {}}, {name: "Cómo ayudar", cls: "chip", pick: () => {}}];
  const dtext = "Varios vecinos reportan calles con agua acumulada cerca del pasaje principal. El estado no está confirmado por una entidad.";
  const estadoReporte = "Reportado por varios vecinos";
  const foto = false;
  const instState = "Sin respuesta institucional registrada";
  const jOff = "chip";
  const jOn = "chip on";
  const joinNo = () => {};
  const joinYes = () => {};
  const kinds = [{name: "Inundación (sugerido)", cls: "chip sel", pick: () => {}}, {name: "Corte de agua", cls: "chip", pick: () => {}}, {name: "Árbol caído", cls: "chip", pick: () => {}}, {name: "Otro", cls: "chip", pick: () => {}}];
  const lugar = useCheckbox(false);
  const needs = [{name: "Alimentos", note: "Comida lista y agua embotellada", state: "Activa", cls: "btn", lbl: "Puedo ofrecer", pick: () => {}}, {name: "Abrigo", note: "Frazadas y ropa seca", state: "Activa", cls: "btn", lbl: "Puedo ofrecer", pick: () => {}}, {name: "Materiales", note: "Bolsas, palas y botas", state: "Activa", cls: "btn", lbl: "Puedo ofrecer", pick: () => {}}, {name: "Logística", note: "Transporte seguro de donaciones", state: "Activa", cls: "btn", lbl: "Puedo ofrecer", pick: () => {}}];
  const noFoto = true;
  const noLugar = true;
  const noSent = true;
  const pendFlag = false;
  const retake = () => {};
  const sendLbl = "Enviar reporte";
  const sendRep = () => {};
  const sent = false;
  const sentMsg = "✓ Reporte enviado y unido al incidente.";
  const setN = () => {};
  const setP = () => {};
  const sinRed = useCheckbox(false);
  const tN = "chip on";
  const tP = "chip";
  const tabN = true;
  const tabP = false;
  const takePhoto = () => {};
  return (
    <div className="scr-emergencias">
      <div className="app">
      
      {nav.is("centro") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Centro de emergencias</h1></div>
      <div className="body">
        <a className="btn call" href="tel:106"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>Llamar al 106 (SAMU)</a>
        <p className="mut">Abre tu marcador. BarrioConecta no envía ayuda ni avisa a entidades por ti.</p>
        <div className="wrap"><button className={`${tN ?? ""}`} onClick={setN}>Necesito ayuda</button><button className={`${tP ?? ""}`} onClick={setP}>Puedo apoyar</button></div>
        {tabN && (<>
          <h2 style={{fontSize: "20px"}}>Cerca de mí</h2>
          <button className="card eme" onClick={() => nav.go("detalle")}><div className="row"><span className="tag eme"><svg className="ic" style={{width: "16px", height: "16px"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.5" /></svg>Eventualidad</span><span className="tag sim">Simulación</span></div><h3 style={{fontSize: "19px"}}>Calles anegadas en Campoy</h3><p className="mut">{estadoReporte} · {autores} vecinos distintos · hace 25 min</p></button>
          <div className="card"><div className="row"><span className="tag eme">Sin confirmar</span></div><h3 style={{fontSize: "19px"}}>Corte de agua en la avenida principal</h3><p className="mut">Sin actualización reciente · hace 40 min</p></div>
          <button className="btn" onClick={() => nav.go("reportar")}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>Reportar con cámara</button>
        </>)}
        {tabP && (<>
          <h2 style={{fontSize: "20px"}}>Cómo puedo ayudar</h2>
          <p className="mut">Ayuda con recursos y logística segura. No se envía a civiles a rescates peligrosos.</p>
          <button className="btn o" onClick={() => nav.go("apoyo")}>Ver necesidades de apoyo</button>
        </>)}
        <div style={{display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "10px"}}>
          <button className="card" style={{minHeight: "76px", justifyContent: "center"}} onClick={() => nav.go("contactos")}><b>Contactos oficiales</b><span className="mut">Sin conexión: disponible</span></button>
          <button className="card" style={{minHeight: "76px", justifyContent: "center"}} onClick={() => nav.go("canal")}><b>Canal de ayuda</b><span className="mut">Alertas y recursos</span></button>
        </div>
        <a className="card" style={{flexDirection: "row", alignItems: "center"}} href="/offline"><div className="sp"><b>Mis consultas por SMS</b><p className="mut">Pregunta sin datos móviles (simulado)</p></div><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></a>
      </div>
      </>)}
      
      {nav.is("reportar") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Reportar incidencia</h1></div>
      <div className="body">
        <div className="card eme" role="note"><p><b>¿Hay peligro ahora?</b> Llama primero. No necesitas foto para pedir ayuda.</p><a className="btn call" style={{minHeight: "52px"}} href="tel:106">Llamar al 106</a></div>
        <div className="cam"><div className="fr"></div><p style={{textAlign: "center", padding: "0 40px"}}>{camMsg}</p></div>
        <p className="mut">La foto se toma con la cámara; no se sube desde la galería. Tu navegador pedirá permiso.</p>
        <div className="card"><p className="lbl">Ubicación y hora (de tu dispositivo)</p><p>Campoy · precisión ±15 m · 09:41 a. m.</p><p className="mut">Tu ubicación no prueba por sí sola dónde ocurrió el hecho.</p></div>
        <div className="sw"><input id="lug" type="checkbox" {...lugar.props} /><label htmlFor="lug"><b>Confirmo que veo este lugar ahora</b></label></div>
        {noFoto && (<>
          <button className="btn" onClick={takePhoto}>Tomar foto</button>
          <button className="btn g" onClick={takePhoto}>No tengo cámara · ejemplo rotulado</button>
        </>)}
        {foto && (<>
          <p className="ok" role="status">✓ Foto tomada ({camKind})</p>
          {lugar.checked && (<><button className="btn" onClick={() => nav.go("revisar")}>Continuar</button></>)}
          {noLugar && (<><p className="err" role="alert">Marca que confirmas el lugar para continuar.</p></>)}
          <button className="btn g" onClick={retake}>Tomar otra</button>
        </>)}
      </div>
      </>)}
      
      {nav.is("revisar") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Revisa tu reporte</h1></div>
      <div className="body">
        <div className="prot" role="img" aria-label="Imagen protegida"><div><b>Imagen protegida</b><p className="mut">Se oculta antes de publicar. Demostración con ejemplo inocuo.</p></div></div>
        <span className="tag sim">Análisis simulado, sin IA real</span>
        <div className="field"><p className="lbl">Tipo sugerido (puedes corregir)</p><div className="wrap">{(kinds ?? []).map((k, __i1) => (<Fragment key={__i1}><button className={`${k.cls ?? ""}`} onClick={k.pick}>{k.name}</button></Fragment>))}</div></div>
        <div className="card"><p className="lbl">Posible incidente existente</p><p>«Calles anegadas en Campoy» · a 120 m · hace 25 min</p><div className="wrap"><button className={`${jOn ?? ""}`} onClick={joinYes}>Unir a este incidente</button><button className={`${jOff ?? ""}`} onClick={joinNo}>Es otro</button></div><p className="mut">Se cuentan personas distintas y se conservan los reportes originales.</p></div>
        {pendFlag && (<><p className="mut">Sin conexión: se guardará pendiente y se pedirá confirmar vigencia al reconectar.</p></>)}
        <div className="sw"><input id="off" type="checkbox" {...sinRed.props} /><label htmlFor="off"><b>Simular que no tengo conexión</b></label></div>
        {noSent && (<><button className="btn" onClick={sendRep}>{sendLbl}</button></>)}
        {sent && (<><div className="card" role="status"><p className="ok">{sentMsg}</p><p className="mut">Estado: {estadoReporte} · {autores} vecinos distintos.</p><button className="btn" onClick={() => nav.go("detalle")}>Ver incidente</button></div></>)}
      </div>
      </>)}
      
      {nav.is("detalle") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Calles anegadas en Campoy</h1></div>
      <div className="body">
        <div className="row"><span className="tag eme">{estadoReporte}</span><span className="tag sim">Ejemplo ficticio</span></div>
        <p className="mut">ID INC-0007 · {autores} vecinos distintos · actualizado hace 25 min</p>
        <div className="scrollx" role="tablist">{(dtabs ?? []).map((d, __i1) => (<Fragment key={__i1}><button className={`${d.cls ?? ""}`} role="tab" onClick={d.pick}>{d.name}</button></Fragment>))}</div>
        <div className="card"><p>{dtext}</p><p className="mut">Fuente: reportes de vecinos y guía de ejemplo de Defensa Civil (demostración).</p></div>
        <div className="card eme"><p className="lbl">Respuesta institucional</p><span className="tag sim">Simulación</span><p style={{fontWeight: "700"}}>{instState}</p><button className="btn o" style={{minHeight: "48px"}} onClick={advance}>Simular siguiente respuesta</button><p className="mut">No hay despacho real. Solo se muestran estados con constancia o rotulados como simulación.</p></div>
        <a className="btn call" href="tel:106">Llamar al 106</a>
        <div style={{display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px"}}><a className="btn o" style={{minHeight: "48px"}} href="/mapa">Ver en el mapa</a><button className="btn o" style={{minHeight: "48px"}} onClick={() => nav.go("apoyo")}>Recursos</button></div>
        <button className="btn g" onClick={() => nav.go("reportar")}>Aportar un reporte</button>
      </div>
      </>)}
      
      {nav.is("apoyo") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Necesidades y apoyo</h1></div>
      <div className="body">
        <div className="card eme" role="note"><p>No se envía a vecinos a rescates entre escombros ni a zonas peligrosas. Para rescate, llama al 116.</p></div>
        {(needs ?? []).map((n, __i1) => (<Fragment key={__i1}>
          <div className="card"><div className="row"><b className="sp">{n.name}</b><span className="tag sol">{n.state}</span></div><p className="mut">{n.note}</p><button className={`${n.cls ?? ""}`} style={{minHeight: "48px"}} onClick={n.pick}>{n.lbl}</button></div>
        </Fragment>))}
        <p className="mut">«Atendida» no significa que la emergencia terminó.</p>
      </div>
      </>)}
      
      {nav.is("contactos") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Contactos oficiales</h1></div>
      <div className="body">
        <span className="tag fav">Guardado en tu dispositivo · disponible sin conexión</span>
        <a className="card" style={{flexDirection: "row", alignItems: "center"}} href="tel:105"><div className="sp"><h3 style={{fontSize: "20px"}}>Policía · 105</h3><p className="mut">Seguridad y delitos</p></div><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg></a>
        <a className="card" style={{flexDirection: "row", alignItems: "center"}} href="tel:116"><div className="sp"><h3 style={{fontSize: "20px"}}>Bomberos · 116</h3><p className="mut">Incendios y rescates</p></div><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg></a>
        <a className="card" style={{flexDirection: "row", alignItems: "center"}} href="tel:106"><div className="sp"><h3 style={{fontSize: "20px"}}>SAMU · 106</h3><p className="mut">Urgencias médicas</p></div><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg></a>
        <div className="card"><p className="lbl">Fuente</p><p className="mut">Directorio oficial de números de emergencia del Perú. Fecha de revisión: [FECHA POR VALIDAR]. Verifica siempre en la fuente oficial.</p><p className="mut">Otros contactos de tu zona: [POR VALIDAR POR TU JUNTA O MUNICIPALIDAD]</p></div>
        <p className="mut">La llamada depende del servicio telefónico de tu celular.</p>
      </div>
      </>)}
      
      {nav.is("canal") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Canal de ayuda</h1></div>
      <div className="body">
        <span className="tag sim">Mensajes de demostración</span>
        <div className="scrollx" role="group" aria-label="Filtrar">{(cfilters ?? []).map((f, __i1) => (<Fragment key={__i1}><button className={`${f.cls ?? ""}`} onClick={f.pick}>{f.name}</button></Fragment>))}</div>
        {(cmsgs ?? []).map((m, __i1) => (<Fragment key={__i1}><div className="card msg"><div className="row"><span className="tag eme">{m.kind}</span><span className="mut sp" style={{textAlign: "right"}}>{m.time}</span></div><b>{m.title}</b><p className="mut">{m.zone} · Fuente: {m.src} · Vigente hasta {m.until}</p></div></Fragment>))}
      </div>
      </>)}
      
      <nav className="nav" aria-label="Principal">
        <a href="/inicio"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a href="/mapa"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a href="/perfil"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      </div>
    </div>
  );
}
