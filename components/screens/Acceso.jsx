"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";
import { useCheckbox } from "@/lib/hooks/use-checkbox";

import { Fragment } from "react";
import "./Acceso.css";

/**
 * Pantalla Acceso del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Acceso() {
  const nav = useViewStack("acceso");
  const busqueda = useTextInput("");
  const canQuery = false;
  const cantQuery = true;
  const chipErr = "chip";
  const chipOk = "chip on";
  const cur = {id: "lima", name: "Lima", zona: "Costa", prov: "Lima", dist: "San Juan de Lurigancho", locs: ["Campoy", "Mariátegui", "Canto Grande"], juntas: [{id: "a", name: "Junta Vecinal Campoy Unido", zona: "Campoy · Sector 2"}, {id: "b", name: "Junta del Pasaje Los Olivos", zona: "Campoy · Sector 4"}]};
  const d1 = "on";
  const d2 = "";
  const d3 = "";
  const dataOk = useCheckbox(false);
  const deps = [{name: "Lima", zona: "Costa", cls: "chip on", pick: () => {}}, {name: "Piura", zona: "Costa", cls: "chip", pick: () => {}}, {name: "Cusco", zona: "Sierra", cls: "chip", pick: () => {}}, {name: "Puno", zona: "Sierra", cls: "chip", pick: () => {}}, {name: "Loreto", zona: "Selva", cls: "chip", pick: () => {}}, {name: "San Martín", zona: "Selva", cls: "chip", pick: () => {}}];
  const dni = useTextInput("");
  const dni2 = useTextInput("");
  const dniNoValido = true;
  const dniValido = false;
  const faceDone = false;
  const faceIdle = true;
  const faceReset = () => {};
  const faceRun = false;
  const faceStart = () => {};
  const hayJuntas = true;
  const juntas = [{name: "Junta Vecinal Campoy Unido", zona: "Campoy · Sector 2", open: false, verLbl: "Ver ficha", toggle: () => {}, joinLbl: "Unirme", joinCls: "btn", join: () => {}}, {name: "Junta del Pasaje Los Olivos", zona: "Campoy · Sector 4", open: false, verLbl: "Ver ficha", toggle: () => {}, joinLbl: "Unirme", joinCls: "btn", join: () => {}}];
  const locManual = () => {};
  const locOk = useCheckbox(false);
  const locs = [{name: "Campoy", cls: "chip on", pick: () => {}}, {name: "Mariátegui", cls: "chip", pick: () => {}}, {name: "Canto Grande", cls: "chip", pick: () => {}}];
  const noData = false;
  const noDataBtn = false;
  const qErr = false;
  const qLoading = false;
  const qOk = false;
  const runQuery = () => {};
  const scenErr = () => {};
  const scenOk = () => {};
  const showDetail = false;
  const showErr = false;
  const sinJuntas = false;
  const toggleDetail = () => {};
  const tryFinish = () => {};
  const tryLogin = () => {};
  const tu1 = true;
  const tu2 = false;
  const tu3 = false;
  const tuAdv = () => {};
  const tuLast = false;
  const tuNext = true;
  const tuNum = 1;
  const tuText = "Busca favores, cachuelos y avisos de tu barrio en el mapa o en Mi comunidad.";
  const tuTitle = "Explora lo que hay cerca";
  return (
    <div className="scr-main">
      <div className="app">
      
      {nav.is("acceso") && (<>
      <div className="body" style={{paddingTop: "28px", gap: "14px", alignItems: "stretch"}}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}>
          <svg width="76" height="70" viewBox="0 0 64 60" aria-hidden="true"><path d="M5 28 32 5l27 23" fill="none" stroke="#C8102E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="32" cy="29" r="5" fill="#C8102E" /><circle cx="20" cy="33" r="4.5" fill="#C8102E" /><circle cx="44" cy="33" r="4.5" fill="#C8102E" /><path d="M25 55V42a7 7 0 0 1 14 0v13zM12 55V44a6 6 0 0 1 11-3M52 55V44a6 6 0 0 0-11-3" fill="#C8102E" /></svg>
          <h1 style={{fontSize: "36px", fontWeight: "800"}}><span style={{color: "#202124"}}>Barrio</span><span style={{color: "#C8102E"}}>Conecta</span></h1>
          <p className="mut" style={{fontSize: "17px"}}>Un Perú más cercano</p>
        </div>
        <svg viewBox="0 0 260 72" role="img" aria-labelledby="sep-title" style={{width: "100%", height: "auto", display: "block"}}><title id="sep-title">Separador con una muralla escalonada y tres cuadrados</title><path d="M10 30H54V36H62V45H78V36H86V30H105V24H113V18H122V8H138V18H147V24H155V30H176V36H184V45H200V36H208V30H250" fill="none" stroke="#a19790" strokeWidth="2" strokeLinejoin="round" /><g fill="none" stroke="#bd1227" strokeWidth="2.2"><rect x="65" y="20" width="8" height="8" /><rect x="126" y="30" width="8" height="8" /><rect x="188" y="20" width="8" height="8" /></g></svg>
        <div className="field">
          <label htmlFor="dni">DNI</label>
          <div style={{position: "relative"}}>
            <svg aria-hidden="true" viewBox="0 0 24 24" style={{position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "26px", height: "26px", fill: "none", stroke: "#5E6268", strokeWidth: "1.6", strokeLinecap: "round", pointerEvents: "none"}}><rect x="2.5" y="5" width="19" height="14" rx="2" /><circle cx="8" cy="11" r="2.2" /><path d="M5 16a3.5 3.5 0 0 1 6 0M14 10h4M14 14h3" /></svg><input id="dni" className="in" style={{paddingLeft: "50px"}} inputMode="numeric" maxLength="8" placeholder="Ingresa tu DNI" {...dni.props} />
          </div>
          {showErr && (<><p className="err" role="alert">Ese DNI no está registrado en la demostración. Crea tu cuenta o prueba con 12345678.</p></>)}
        </div>
        <a className="btn" href="/inicio">Ingresar</a>
        {dniValido && (<>
          <a className="btn" href="/inicio">Ingresar</a>
        </>)}
        {dniNoValido && (<>
          <button className="btn" onClick={tryLogin}>Ingresar</button>
        </>)}
        <div style={{display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "12px"}}>
          <button className="btn g" style={{flexDirection: "column", minHeight: "76px", gap: "4px", fontSize: "16px"}} onClick={() => nav.go("bio_huella")}><svg className="ic" style={{color: "#C8102E", width: "30px", height: "30px", fill: "currentColor", stroke: "none"}} viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M7 5.21a.77.77 0 0 1-.46-1.38A15.46 15.46 0 0 1 16 1c2.66 0 6.48.45 9.5 2.62a.77.77 0 0 1 .18 1.07a.78.78 0 0 1-1.08.17A15 15 0 0 0 16 2.53a14 14 0 0 0-8.5 2.52a.74.74 0 0 1-.5.16" /><path fill="currentColor" d="M28.23 12.26a.78.78 0 0 1-.63-.33C25.87 9.49 22.78 6.24 16 6.24a14 14 0 0 0-11.63 5.7a.77.77 0 0 1-1.07.17a.76.76 0 0 1-.15-1.11A15.54 15.54 0 0 1 16 4.71c5.61 0 9.81 2.08 12.84 6.34a.77.77 0 0 1-.19 1.07a.8.8 0 0 1-.42.14" /><path fill="currentColor" d="M12.28 31a.78.78 0 0 1-.72-.49a.75.75 0 0 1 .44-1c4.37-1.68 7-5.12 7-9.21a2.8 2.8 0 0 0-3-3c-1.86 0-2.76 1-3 3.35a4.27 4.27 0 0 1-4.52 3.83a4.27 4.27 0 0 1-4.32-4.59A11.71 11.71 0 0 1 16 8.39a12 12 0 0 1 12 11.93a18.7 18.7 0 0 1-1.39 6.5a.78.78 0 0 1-1 .41a.76.76 0 0 1-.41-1a17.3 17.3 0 0 0 1.27-5.91A10.45 10.45 0 0 0 16 9.92a10.18 10.18 0 0 0-10.38 10a2.77 2.77 0 0 0 2.79 3.06a2.74 2.74 0 0 0 3-2.48c.36-3.11 1.89-4.69 4.56-4.69a4.31 4.31 0 0 1 4.52 4.56c0 4.74-3 8.72-8 10.63a1 1 0 0 1-.21 0" /><path fill="currentColor" d="M19.77 30.28a.8.8 0 0 1-.52-.2a.76.76 0 0 1 0-1.08a12.63 12.63 0 0 0 3.54-8.68c0-1.56-.48-6.65-6.7-6.65a6.83 6.83 0 0 0-4.94 1.87A6.17 6.17 0 0 0 9.32 20a.77.77 0 0 1-.77.76a.76.76 0 0 1-.77-.76A7.73 7.73 0 0 1 10 14.46a8.34 8.34 0 0 1 6-2.32c6.08 0 8.24 4.4 8.24 8.18a14.1 14.1 0 0 1-3.9 9.68a.75.75 0 0 1-.57.28" /><path fill="currentColor" d="M8.66 27.74a14 14 0 0 1-1.56-.09a.76.76 0 1 1 .17-1.52c2.49.28 4.45-.16 5.84-1.32a6.37 6.37 0 0 0 2.12-4.53a.75.75 0 0 1 .82-.71a.78.78 0 0 1 .72.81A7.9 7.9 0 0 1 14.09 26a8.2 8.2 0 0 1-5.43 1.74" /></svg>Huella</button>
          <button className="btn g" style={{flexDirection: "column", minHeight: "76px", gap: "4px", fontSize: "16px"}} onClick={() => nav.go("bio_rostro")}><svg className="ic" style={{color: "#C8102E", width: "30px", height: "30px", strokeWidth: "1"}} viewBox="0 0 14 14" aria-hidden="true"><path d="M4 3.988v1m6-1v1m-3 .5v1.25a1 1 0 0 1-1 1h-.5m-.214 2.564a2.49 2.49 0 0 0 3.428 0m1.3-9.372q.555.061 1.102.125a2.09 2.09 0 0 1 1.833 1.836l.12 1.095m-3.055 9.058q.555-.06 1.102-.125a2.09 2.09 0 0 0 1.833-1.836l.12-1.095M4 .93q-.555.061-1.102.125A2.09 2.09 0 0 0 1.065 2.89q-.062.543-.12 1.095M4 13.044q-.555-.06-1.102-.125a2.09 2.09 0 0 1-1.833-1.836q-.062-.542-.12-1.095" /></svg>Rostro</button>
        </div>
        <button className="btn o" style={{borderColor: "transparent", background: "none"}} onClick={() => nav.go("dni")}>Crear cuenta</button>
        <p className="mut" style={{textAlign: "center"}}>Ingreso por DNI de demostración. No es seguridad real de producción.</p>
        <svg viewBox="0 0 358 150" width="100%" aria-hidden="true" style={{marginTop: "auto", borderRadius: "20px"}}><rect width="358" height="150" fill="#F6EEE3" /><path d="M180 120 270 56l70 52v42H180z" fill="#E9E1D6" /><rect x="14" y="70" width="86" height="80" fill="#F4D9C6" /><path d="M8 72 57 40l49 32z" fill="#C8102E" /><rect x="30" y="92" width="22" height="26" fill="#fff" stroke="#C8102E" strokeWidth="2" /><rect x="62" y="104" width="22" height="46" fill="#8A5300" /><rect x="108" y="86" width="70" height="64" fill="#F8E6B8" /><path d="M104 88 143 62l39 26z" fill="#E6B34A" /><rect x="124" y="104" width="20" height="22" fill="#fff" stroke="#8A5300" strokeWidth="2" /><rect x="196" y="78" width="80" height="72" fill="#FBE0E3" /><path d="M190 80 236 52l46 28z" fill="#C8102E" /><circle cx="318" cy="84" r="24" fill="#6E9B55" /><circle cx="300" cy="96" r="16" fill="#86B06B" /><rect x="314" y="96" width="6" height="54" fill="#7A5A3A" /><rect x="284" y="64" width="3" height="86" fill="#3F4A50" /><circle cx="285" cy="62" r="6" fill="#F3C969" /><rect x="0" y="136" width="358" height="14" fill="#D9CDBE" /></svg>
      </div>
      </>)}
      
      {nav.is("bio_huella") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Ingreso con huella</h1></div>
      <div className="body" style={{alignItems: "center", justifyContent: "center", textAlign: "center"}}>
        <span className="tag sim">Simulación de demostración</span>
        <svg className="ic" style={{color: "#C8102E", width: "120px", height: "120px", strokeWidth: "1.4"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11v4a6 6 0 0 1-1 3M8 11a4 4 0 0 1 8 0v2a9 9 0 0 1-1 4M5 12a7 7 0 0 1 14 0v1M6 17a12 12 0 0 0 1 2" /></svg>
        <h2 style={{fontSize: "24px"}}>Apoya tu dedo en el lector</h2>
        <p className="mut">Esta experiencia es solo de demostración. No se lee ni se guarda ninguna huella real.</p>
        <a className="btn" href="/inicio">Simular ingreso como María</a>
        <button className="btn g" onClick={() => nav.go("acceso")}>Cancelar</button>
      </div>
      </>)}
      
      {nav.is("bio_rostro") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Ingreso con rostro</h1></div>
      <div className="body" style={{alignItems: "center", justifyContent: "center", textAlign: "center"}}>
        <span className="tag sim">Simulación de demostración</span>
        <svg className="ic" style={{color: "#C8102E", width: "120px", height: "120px", strokeWidth: "1.4"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M9 10v1M15 10v1M9 15c1.5 1.5 4.5 1.5 6 0" /></svg>
        <h2 style={{fontSize: "24px"}}>Mira al frente</h2>
        <p className="mut">No se usa tu cámara en esta simulación ni se conserva ninguna imagen de tu rostro.</p>
        <a className="btn" href="/inicio">Simular ingreso como María</a>
        <button className="btn g" onClick={() => nav.go("acceso")}>Cancelar</button>
      </div>
      </>)}
      
      {nav.is("dni") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Crear cuenta</h1></div>
      <div className="prog" aria-hidden="true"><i className="on"></i><i></i><i></i></div>
      <div className="body">
        <p className="mut" style={{fontWeight: "700"}}>Paso 1 de 3 · Tu DNI</p>
        <span className="tag sim">Consulta RENIEC y PNP simulada</span>
        <div className="field"><label htmlFor="dni2">DNI de demostración (8 dígitos)</label><input id="dni2" className="in" inputMode="numeric" maxLength="8" {...dni2.props} /></div>
        <div className="field"><p style={{fontWeight: "700", fontSize: "15px"}}>Resultado que quieres probar</p>
          <div className="wrap"><button className={`${chipOk ?? ""}`} onClick={scenOk}>Resultado válido</button><button className={`${chipErr ?? ""}`} onClick={scenErr}>Con error</button></div></div>
        {canQuery && (<><button className="btn" onClick={runQuery}>Consultar (simulado)</button></>)}
        {cantQuery && (<><button className="btn" disabled>Escribe 8 dígitos</button></>)}
        {qLoading && (<><div className="card" role="status"><p style={{fontWeight: "700"}}>Consultando… (simulado)</p><p className="mut">RENIEC · PNP</p></div></>)}
        {qOk && (<>
          <div className="card" role="status"><p className="ok">✓ Consulta simulada completada</p><p className="mut">No se muestran datos personales reales ni antecedentes. Es solo una demostración.</p></div>
          <button className="btn" onClick={() => nav.go("rostro")}>Continuar</button>
        </>)}
        {qErr && (<>
          <div className="card" role="alert"><p className="err">No pudimos validar este DNI (error simulado)</p><p className="mut">Revisa el número o intenta de nuevo.</p></div>
          <button className="btn o" onClick={runQuery}>Reintentar</button>
        </>)}
      </div>
      </>)}
      
      {nav.is("rostro") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Crear cuenta</h1></div>
      <div className="prog" aria-hidden="true"><i className="on"></i><i className="on"></i><i></i></div>
      <div className="body">
        <p className="mut" style={{fontWeight: "700"}}>Paso 2 de 3 · Tu rostro</p>
        <span className="tag sim">Comparación facial simulada</span>
        <div style={{display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "12px"}}>
          <div style={{position: "relative", height: "190px", borderRadius: "20px", background: "#fff", border: "2px dashed #C8102E", display: "grid", placeItems: "center", overflow: "hidden"}}>
            <svg viewBox="0 0 100 130" width="80" aria-hidden="true"><ellipse cx="50" cy="62" rx="36" ry="48" fill="none" stroke="#C8102E" strokeWidth="3" strokeDasharray="6 5" /></svg>
            {faceRun && (<><span className="scan"></span></>)}
            <p className="mut" style={{position: "absolute", bottom: "8px", fontSize: "13px", textAlign: "center"}}>Tu cámara</p>
          </div>
          <div style={{height: "190px", borderRadius: "20px", background: "#fff", border: "1px solid #E3DDD7", padding: "12px", display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center", alignItems: "center"}}>
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#5E6268" strokeWidth="1.6" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="8" cy="11" r="2.5" /><path d="M4.5 16a4 4 0 0 1 7 0M14 10h5M14 14h4" /></svg>
            <p className="mut" style={{fontSize: "14px", textAlign: "center"}}>Foto de DNI ficticia</p>
          </div>
        </div>
        <p className="mut">Tu navegador te pedirá permiso antes de usar la cámara. Sin cámara, usa la demostración.</p>
        {faceIdle && (<>
          <button className="btn" onClick={faceStart}>Tomar foto (simulado)</button>
          <button className="btn g" onClick={faceStart}>No tengo cámara · usar demostración</button>
        </>)}
        {faceRun && (<><div className="card" role="status"><p style={{fontWeight: "700"}}>Comparando… (simulado)</p></div></>)}
        {faceDone && (<>
          <div className="card" role="status"><p className="ok">✓ Coincidencia simulada</p><p className="mut">No se guarda biometría real.</p></div>
          <button className="btn" onClick={() => nav.go("permisos")}>Continuar</button>
          <button className="btn g" onClick={faceReset}>Repetir captura</button>
        </>)}
      </div>
      </>)}
      
      {nav.is("permisos") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Crear cuenta</h1></div>
      <div className="prog" aria-hidden="true"><i className="on"></i><i className="on"></i><i className="on"></i></div>
      <div className="body">
        <p className="mut" style={{fontWeight: "700"}}>Paso 3 de 3 · Tus permisos</p>
        <div className="card">
          <div className="sw"><input id="c1" type="checkbox" {...locOk.props} /><label htmlFor="c1"><b>Usar mi ubicación</b><br /><span className="mut">Para mostrarte vecinos y alertas cerca. Puedes elegir tu zona a mano.</span></label></div>
          <button className="chip" style={{alignSelf: "flex-start"}} onClick={locManual}>Prefiero elegir mi zona</button>
        </div>
        <div className="card">
          <div className="sw"><input id="c2" type="checkbox" {...dataOk.props} /><label htmlFor="c2"><b>Tratar mis datos personales</b><br /><span className="mut">Necesario para crear tu cuenta. Tu DNI nunca es público.</span></label></div>
          <button className="chip" style={{alignSelf: "flex-start", borderColor: "transparent", color: "#C8102E", padding: "0"}} onClick={toggleDetail}>Ver detalle</button>
          {showDetail && (<><p className="mut">Usamos tu DNI solo para identificar tu cuenta de demostración. Muestras un nombre público mínimo y una zona aproximada.</p></>)}
        </div>
        {noData && (<><div className="card" role="alert"><p className="err">Sin este consentimiento no creamos tu cuenta.</p><p className="mut">Puedes seguir viendo el directorio público de juntas y contactos de emergencia.</p></div></>)}
        {dataOk.checked && (<><button className="btn" onClick={() => nav.go("territorio")}>Finalizar registro</button></>)}
        {noDataBtn && (<><button className="btn" onClick={tryFinish}>Finalizar registro</button></>)}
      </div>
      </>)}
      
      {nav.is("territorio") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>¿Dónde vives?</h1></div>
      <div className="body">
        <div className="field"><label htmlFor="busq">Buscar tu localidad</label><input id="busq" className="in" placeholder="Distrito o barrio" {...busqueda.props} /></div>
        <p style={{fontWeight: "700", fontSize: "15px"}}>Departamento</p>
        <div className="wrap">
          {(deps ?? []).map((d, __i1) => (<Fragment key={__i1}><button className={`${d.cls ?? ""}`} onClick={d.pick}>{d.name} · {d.zona}</button></Fragment>))}
        </div>
        <div className="card">
          <p className="mut">Provincia</p><p style={{fontWeight: "700"}}>{cur.prov}</p>
          <p className="mut">Distrito</p><p style={{fontWeight: "700"}}>{cur.dist}</p>
          <p className="mut">Localidad o comunidad</p>
          <div className="wrap">{(locs ?? []).map((l, __i1) => (<Fragment key={__i1}><button className={`${l.cls ?? ""}`} onClick={l.pick}>{l.name}</button></Fragment>))}</div>
        </div>
        <div style={{position: "relative", height: "92px", borderRadius: "20px", background: "#EFE8DD", border: "1px solid #E3DDD7", overflow: "hidden"}}>
          <svg viewBox="0 0 358 92" width="100%" height="92" aria-hidden="true"><path d="M0 60 70 40l60 16 80-30 70 26 78-14" fill="none" stroke="#CFC4B3" strokeWidth="2" /><path d="M0 80 90 62l80 10 90-24 98 20" fill="none" stroke="#CFC4B3" strokeWidth="2" /><path d="M179 24s-9-8-9-14a9 9 0 0 1 18 0c0 6-9 14-9 14z" transform="translate(0 20)" fill="#C8102E" /></svg>
          <span className="tag sim" style={{position: "absolute", left: "8px", bottom: "8px"}}>Mapa de demostración</span>
        </div>
        <button className="btn" onClick={() => nav.go("juntas")}>Confirmar zona</button>
        <p className="mut" style={{textAlign: "center"}}>Lima es solo un ejemplo: BarrioConecta sirve en costa, sierra y selva.</p>
      </div>
      </>)}
      
      {nav.is("juntas") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Juntas cerca de ti</h1></div>
      <div className="body">
        <p className="mut">Sumarte es voluntario. Puedes usar toda la app sin junta.</p>
        {hayJuntas && (<>
          {(juntas ?? []).map((j, __i1) => (<Fragment key={__i1}>
            <div className="jc">
              <div className="row"><svg className="ic" style={{color: "#C8102E"}} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3" /><circle cx="5" cy="10" r="2.2" /><circle cx="19" cy="10" r="2.2" /><path d="M6 20a6 6 0 0 1 12 0M1.5 18a4 4 0 0 1 4-4M22.5 18a4 4 0 0 0-4-4" /></svg><div className="sp"><h3 style={{fontSize: "19px"}}>{j.name}</h3><p className="mut">{j.zona}</p></div></div>
              <span className="tag sim">Junta de demostración</span>
              {j.open && (<><p className="mut">Avisos del barrio, pedidos de ayuda y traslados solidarios entre miembros. Sin reconocimiento oficial; no verifica a nadie.</p></>)}
              <div style={{display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px"}}>
                <button className="btn g" style={{minHeight: "48px"}} onClick={j.toggle}>{j.verLbl}</button>
                <button className={`${j.joinCls ?? ""}`} style={{minHeight: "48px"}} onClick={j.join}>{j.joinLbl}</button>
              </div>
            </div>
          </Fragment>))}
        </>)}
        {sinJuntas && (<><div className="card" role="status"><p style={{fontWeight: "700"}}>Aún no hay juntas en esta zona</p><p className="mut">Puedes usar BarrioConecta con normalidad. Más adelante podrás sumarte si se registra una.</p></div></>)}
        <button className="btn" onClick={() => nav.go("tutorial")}>Continuar</button>
        <button className="btn g" onClick={() => nav.go("tutorial")}>Ahora no</button>
      </div>
      </>)}
      
      {nav.is("tutorial") && (<>
      <div className="top"><h1 style={{paddingLeft: "8px"}}>Así funciona</h1><a className="btn g" style={{width: "auto", minHeight: "44px", fontSize: "15px"}} href="/inicio">Omitir</a></div>
      <div className="body" style={{justifyContent: "center", gap: "20px"}}>
        <div className="card" style={{alignItems: "center", textAlign: "center", padding: "28px 20px"}}>
          <span className="tag red">Paso {tuNum} de 3</span>
          <svg className="ic" style={{color: "#C8102E", width: "72px", height: "72px", strokeWidth: "1.5"}} viewBox="0 0 24 24" aria-hidden="true">{tu1 && (<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>)}{tu2 && (<><path d="M12 5v14M5 12h14" /></>)}{tu3 && (<><path d="M4 5h16v11H9l-5 4z" /></>)}</svg>
          <h2 style={{fontSize: "26px"}}>{tuTitle}</h2>
          <p className="mut" style={{fontSize: "17px"}}>{tuText}</p>
        </div>
        <div className="prog" aria-hidden="true" style={{justifyContent: "center"}}><i className={`${d1 ?? ""}`} style={{maxWidth: "36px"}}></i><i className={`${d2 ?? ""}`} style={{maxWidth: "36px"}}></i><i className={`${d3 ?? ""}`} style={{maxWidth: "36px"}}></i></div>
        {tuNext && (<><button className="btn" onClick={tuAdv}>Siguiente</button></>)}
        {tuLast && (<><a className="btn" href="/inicio">Ir a mi inicio</a></>)}
        <p className="mut" style={{textAlign: "center"}}>¿Es una emergencia? Llama al 106 o al 116 desde tu teléfono en cualquier momento.</p>
      </div>
      </>)}
      
      </div>
    </div>
  );
}
