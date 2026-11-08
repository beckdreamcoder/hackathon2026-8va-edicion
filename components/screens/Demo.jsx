"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { Fragment } from "react";
import "./Demo.css";

/**
 * Pantalla Demo del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Demo() {
  const nav = useViewStack("consola");
  const askReset = () => {};
  const closeReset = () => {};
  const dates = [{name: "8 nov", cls: "chip on", pick: () => {}}, {name: "30 nov", cls: "chip", pick: () => {}}, {name: "1 dic", cls: "chip", pick: () => {}}];
  const doReset = () => {};
  const ia = [{name: "Controlada", cls: "chip on", pick: () => {}}, {name: "Sin respuesta", cls: "chip", pick: () => {}}];
  const inst = [{name: "Sin respuesta", cls: "chip on", pick: () => {}}, {name: "Ayuda solicitada", cls: "chip", pick: () => {}}, {name: "Respuesta confirmada", cls: "chip", pick: () => {}}];
  const log = [];
  const monthInfo = "Noviembre en curso: se muestra avance de Vecino del mes.";
  const noLog = true;
  const retried = false;
  const retry = () => {};
  const roles = [{name: "Vecino", cls: "chip on", pick: () => {}}, {name: "Coordinador", cls: "chip", pick: () => {}}, {name: "Editor", cls: "chip", pick: () => {}}];
  const sheetReset = false;
  const signals = [{name: "Normal", cls: "chip on", pick: () => {}}, {name: "Intermitente", cls: "chip", pick: () => {}}, {name: "Sin conexión", cls: "chip", pick: () => {}}];
  const sms = [{name: "Activa", cls: "chip on", pick: () => {}}, {name: "Caída", cls: "chip", pick: () => {}}];
  const tCon = "chip on";
  const tEst = "chip";
  const terrs = [{name: "Costa · Lima", cls: "chip on", pick: () => {}}, {name: "Sierra · Cusco", cls: "chip", pick: () => {}}, {name: "Selva · Loreto", cls: "chip", pick: () => {}}];
  const title = "Consola de demostración";
  const users = [{name: "María", cls: "chip on", pick: () => {}}, {name: "Luis", cls: "chip", pick: () => {}}, {name: "Carlos", cls: "chip", pick: () => {}}];
  return (
    <div className="scr-demo">
      <div className="app">
      <div className="top"><h1>{title}</h1><span className="tag sim">Solo para la demostración</span></div>
      <div className="tabs" role="tablist"><button className={`${tCon ?? ""}`} role="tab" onClick={() => nav.go("consola")}>Consola (P55)</button><button className={`${tEst ?? ""}`} role="tab" onClick={() => nav.go("estados")}>Estados (P56)</button></div>
      
      {nav.is("consola") && (<>
      <div className="body">
        <div className="warn" role="note">Esta consola está separada del recorrido normal. En la versión Next.js escribirá en la base local; aquí solo muestra su interfaz y registra eventos.</div>
        <div className="card"><p className="lbl">Usuario</p><div className="wrap">{(users ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={`${o.cls ?? ""}`} onClick={o.pick}>{o.name}</button></Fragment>))}</div>
          <p className="lbl">Rol</p><div className="wrap">{(roles ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={`${o.cls ?? ""}`} onClick={o.pick}>{o.name}</button></Fragment>))}</div>
          <p className="lbl">Territorio</p><div className="wrap">{(terrs ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={`${o.cls ?? ""}`} onClick={o.pick}>{o.name}</button></Fragment>))}</div></div>
        <div className="card"><p className="lbl">Fecha del simulador</p><div className="wrap">{(dates ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={`${o.cls ?? ""}`} onClick={o.pick}>{o.name}</button></Fragment>))}</div><p className="mut">{monthInfo}</p></div>
        <div className="card"><p className="lbl">Señal del dispositivo</p><div className="wrap">{(signals ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={`${o.cls ?? ""}`} onClick={o.pick}>{o.name}</button></Fragment>))}</div>
          <p className="lbl">Central SMS simulada</p><div className="wrap">{(sms ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={`${o.cls ?? ""}`} onClick={o.pick}>{o.name}</button></Fragment>))}</div>
          <p className="lbl">Respuesta de IA simulada</p><div className="wrap">{(ia ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={`${o.cls ?? ""}`} onClick={o.pick}>{o.name}</button></Fragment>))}</div>
          <p className="lbl">Respuesta institucional simulada</p><div className="wrap">{(inst ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={`${o.cls ?? ""}`} onClick={o.pick}>{o.name}</button></Fragment>))}</div></div>
        <div className="card"><p className="lbl">Eventos</p>{(log ?? []).map((e, __i1) => (<Fragment key={__i1}><p className="log">{e.t}</p></Fragment>))}{noLog && (<><p className="mut">Todavía no hay eventos.</p></>)}</div>
        <button className="btn g" onClick={askReset}>Restablecer datos de ejemplo</button>
      </div>
      </>)}
      
      {nav.is("estados") && (<>
      <div className="body">
        <p className="mut">Estados que cada pantalla debe resolver: carga, vacío, error, permiso denegado, sin conexión, información antigua, confirmación, envío pendiente y simulación.</p>
        <div className="card"><span className="tag">Carga</span><div className="sk" style={{width: "70%"}}></div><div className="sk"></div><div className="sk" style={{width: "50%"}}></div></div>
        <div className="card"><span className="tag">Vacío con acción</span><p style={{fontWeight: "700"}}>Aún no tienes coordinaciones</p><p className="mut">Se crean cuando ambas personas aceptan.</p><a className="btn" style={{minHeight: "48px"}} href="/favores">Ver favores cercanos</a></div>
        <div className="card"><span className="tag red">Error recuperable</span><p style={{fontWeight: "700"}}>No pudimos cargar los avisos</p><p className="mut">Revisa tu conexión e intenta de nuevo. No se perdió nada.</p><button className="btn o" style={{minHeight: "48px"}} onClick={retry}>Reintentar</button>{retried && (<><p className="ok" role="status">✓ Listo, volvimos a cargar.</p></>)}</div>
        <div className="card"><span className="tag red">Permiso denegado</span><p style={{fontWeight: "700"}}>No tenemos acceso a tu ubicación</p><p className="mut">Puedes elegir tu zona a mano o activar el permiso en los ajustes del navegador.</p><a className="btn o" style={{minHeight: "48px"}} href="/">Elegir mi zona</a></div>
        <div className="card"><span className="tag">Sin conexión</span><div className="warn">Sin conexión · mostrando datos guardados. Última sincronización completa: hoy 7:50 a. m.</div></div>
        <div className="card"><span className="tag">Información antigua</span><p style={{fontWeight: "700"}}>Corte de agua en la avenida principal</p><span className="tag sim">Sin actualización reciente · hace 3 h</span><p className="mut">Un reporte viejo no se marca como resuelto por el simple paso del tiempo.</p></div>
        <div className="card"><span className="tag">Confirmación</span><p style={{fontWeight: "700"}}>¿Cancelar esta coordinación?</p><p className="mut">El acuerdo se conserva. Esto no se puede deshacer.</p><div style={{display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px"}}><button className="btn g" style={{minHeight: "48px"}}>Volver</button><button className="btn" style={{minHeight: "48px"}}>Sí, cancelar</button></div></div>
        <div className="card"><span className="tag sim">Envío pendiente</span><p style={{fontWeight: "700"}}>Tu reporte se enviará al reconectar</p><a className="btn o" style={{minHeight: "48px"}} href="/offline">Ver pendientes</a></div>
        <div className="card"><span className="tag sim">Simulación</span><p className="mut">Identidad, biometría, entidades, pagos, SMS y respuestas de IA llevan siempre esta insignia mientras sean simulados.</p></div>
      </div>
      </>)}
      
      <nav className="nav" aria-label="Principal">
        <a href="/inicio"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a href="/mapa"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a href="/perfil"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      
      {sheetReset && (<>
      <div className="scrim" aria-hidden="true"></div>
      <div className="sheet" role="dialog" aria-label="Restablecer datos"><h2 style={{fontSize: "22px"}}>¿Restablecer los datos de ejemplo?</h2><p className="mut">Se borrarán los cambios de esta demostración y volverán las semillas originales.</p><button className="btn" onClick={doReset}>Sí, restablecer</button><button className="btn g" onClick={closeReset}>Cancelar</button></div>
      </>)}
      </div>
    </div>
  );
}
