"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment } from "react";
import "./Perfil.css";

/**
 * Pantalla Perfil del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Perfil() {
  const nav = useViewStack("perfil");
  const note = useTextInput("");
  const closeRep = () => {};
  const code = useTextInput("");
  const codeErr = false;
  const confirmRep = () => {};
  const hasUnread = true;
  const ini = "M";
  const notes = [{kind: "Mensaje", title: "Luis te escribió sobre la escalera", time: "hace 5 min", href: "Favores.dc.html", unread: true, read: () => {}}, {kind: "Solicitud", title: "Carlos puede llevarte al hospital", time: "hace 20 min", href: "Movilidad.dc.html", unread: true, read: () => {}}, {kind: "Campaña", title: "Abrigo para familias de Calca: nueva actualización", time: "hace 1 h", href: "Campanas.dc.html", unread: true, read: () => {}}, {kind: "Emergencia", title: "Calles anegadas en Campoy (reportado por varios vecinos)", time: "hace 25 min", href: "Emergencias.dc.html", unread: true, read: () => {}}, {kind: "Acuerdo", title: "Pedro propuso un acuerdo para la fuga", time: "ayer", href: "Cachuelos.dc.html", unread: true, read: () => {}}];
  const openRep = () => {};
  const perms = [{id: "pm_ubic", name: "Ubicación", help: "Para mostrar vecinos y alertas cerca. Si la deniegas, eliges tu zona a mano.", on: true, toggle: () => {}}, {id: "pm_cam", name: "Cámara", help: "Solo para reportes de emergencia. La foto no se sube desde la galería.", on: true, toggle: () => {}}, {id: "pm_noti", name: "Notificaciones", help: "Avisos de mensajes, solicitudes y alertas de tu zona.", on: true, toggle: () => {}}, {id: "pm_sms", name: "Canal SMS", help: "Consultar por mensaje sin datos móviles. Requiere celular verificado.", on: false, toggle: () => {}}, {id: "pm_datos", name: "Uso de mis datos", help: "Necesario para tener cuenta. Tu DNI nunca es público.", on: true, toggle: () => {}}];
  const phone = useTextInput("");
  const phoneCode = false;
  const phoneIdle = true;
  const phoneOk = false;
  const readAll = () => {};
  const repDone = false;
  const repForm = true;
  const sendCode = () => {};
  const sessions = [{name: "María", role: "Solicitante", cls: "chip on", lbl: "Activa", pick: () => {}}, {name: "Luis", role: "Oferente", cls: "chip", lbl: "Cambiar", pick: () => {}}, {name: "Carlos", role: "Coordinador de junta", cls: "chip", lbl: "Cambiar", pick: () => {}}];
  const sheetRep = false;
  const targets = [{name: "Luis", cls: "chip on", pick: () => {}}, {name: "Carlos", cls: "chip", pick: () => {}}];
  const unlink = () => {};
  const unreadN = 5;
  const user = useTextInput("");
  const verify = () => {};
  return (
    <div className="scr-perfil">
      <div className="app">
      
      {nav.is("perfil") && (<>
      <div className="top"><h1 style={{paddingLeft: "8px"}}>Mi perfil</h1></div>
      <div className="body">
        <div className="card" style={{flexDirection: "row", alignItems: "center"}}><span className="av" aria-hidden="true">{ini}</span><div className="sp"><h2 style={{fontSize: "24px"}}>{user.value}</h2><p className="mut">Campoy · San Juan de Lurigancho</p><span className="tag">Vecino nuevo · sin referencias aún</span></div></div>
        <p className="mut">Tu DNI y tu celular son privados. Solo se muestran tu nombre público y tu zona aproximada.</p>
        <a className="li" href="/movilidad"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3" /><circle cx="5" cy="10" r="2.2" /><circle cx="19" cy="10" r="2.2" /><path d="M6 20a6 6 0 0 1 12 0" /></svg><b className="sp">Mi junta vecinal</b><svg className="ic" style={{color: "#202124"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></a>
        <a className="li" href="/favores"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /></svg><b className="sp">Mis coordinaciones</b><svg className="ic" style={{color: "#202124"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></a>
        <a className="li" href="/publicar"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg><b className="sp">Mis publicaciones</b><svg className="ic" style={{color: "#202124"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></a>
        <a className="li" href="/campanas"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z" /></svg><b className="sp">Mis apoyos</b><svg className="ic" style={{color: "#202124"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></a>
        <button className="li" onClick={() => nav.go("avisos")}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4" /></svg><b className="sp">Avisos</b>{hasUnread && (<><span className="tag red">{unreadN} nuevos</span></>)}<svg className="ic" style={{color: "#202124"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
        <button className="li" onClick={() => nav.go("privacidad")}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg><b className="sp">Privacidad y permisos</b><svg className="ic" style={{color: "#202124"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
        <button className="li" onClick={() => nav.go("cuenta")}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg><b className="sp">Mi cuenta</b><svg className="ic" style={{color: "#202124"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
        <button className="li" onClick={openRep}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4h11l-1 4 1 4H5" /></svg><b className="sp">Reportar o bloquear a un vecino</b></button>
      </div>
      </>)}
      
      {nav.is("privacidad") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Privacidad y permisos</h1></div>
      <div className="body">
        {(perms ?? []).map((p, __i1) => (<Fragment key={__i1}><div className="card"><div className="sw"><input id={`${p.id ?? ""}`} type="checkbox" checked={`${p.on ?? ""}`} onChange={p.toggle} /><label htmlFor={`${p.id ?? ""}`}><b>{p.name}</b><br /><span className="mut">{p.help}</span></label></div></div></Fragment>))}
        <div className="card" role="note"><p className="lbl">Importante</p><p className="mut">Estos interruptores guardan tu preferencia en BarrioConecta. Para revocar un permiso del sistema (cámara, ubicación, notificaciones), cámbialo en los ajustes de tu navegador o teléfono.</p></div>
        <p className="mut">El canal por SMS solo se activa con un celular verificado en «Mi cuenta».</p>
      </div>
      </>)}
      
      {nav.is("cuenta") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Mi cuenta</h1></div>
      <div className="body">
        <div className="field"><label htmlFor="nm">Nombre público</label><input id="nm" className="in" {...user.props} /></div>
        <div className="card"><p className="lbl">Celular para SMS</p><span className="tag sim">Verificación simulada</span>
          {phoneIdle && (<><label htmlFor="ph" style={{position: "absolute", left: "-9999px"}}>Celular</label><input id="ph" className="in" inputMode="numeric" placeholder="9 d\u00edgitos" {...phone.props} /><button className="btn" onClick={sendCode}>Enviar código (simulado)</button></>)}
          {phoneCode && (<><p className="mut">Código de demostración: 000000 · escríbelo abajo</p><label htmlFor="cd" style={{position: "absolute", left: "-9999px"}}>Código</label><input id="cd" className="in" inputMode="numeric" maxLength="6" {...code.props} /><button className="btn" onClick={verify}>Verificar</button>{codeErr && (<><p className="err" role="alert">Código incorrecto. Prueba con 000000.</p></>)}</>)}
          {phoneOk && (<><p className="ok" role="status">✓ Celular vinculado solo para el canal SMS</p><p className="mut">No reemplaza el acceso por DNI ni verifica tu identidad.</p><button className="btn g" onClick={unlink}>Desvincular</button></>)}</div>
        <div className="card"><p className="lbl">Sesiones de demostración</p>{(sessions ?? []).map((s, __i1) => (<Fragment key={__i1}><div className="row"><span className="sp"><b>{s.name}</b><br /><span className="mut">{s.role}</span></span><button className={`${s.cls ?? ""}`} onClick={s.pick}>{s.lbl}</button></div></Fragment>))}<p className="mut">Cambiar de sesión no mezcla datos privados de otros perfiles.</p></div>
        <a className="btn g" href="/">Cerrar sesión</a>
        <p className="mut">Recuperación segura de cuenta y cambio de DNI: evolución futura, no incluida en esta demostración.</p>
      </div>
      </>)}
      
      {nav.is("avisos") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Avisos</h1><button className="chip" onClick={readAll}>Marcar leídos</button></div>
      <div className="body">
        {(notes ?? []).map((n, __i1) => (<Fragment key={__i1}>
          <a className="card" href="{{ n.href }}" onClick={n.read} style={{flexDirection: "row", alignItems: "flex-start"}}>{n.unread && (<><span className="unr" aria-label="sin leer" style={{marginTop: "8px"}}></span></>)}<div className="sp"><span className="tag">{n.kind}</span><p style={{fontWeight: "700", marginTop: "4px"}}>{n.title}</p><p className="mut">{n.time}</p></div></a>
        </Fragment>))}
        <div className="card"><p className="lbl">Categorías de avisos</p><div className="wrap"><button className="chip on">Mensajes</button><button className="chip on">Solicitudes</button><button className="chip on">Campañas</button><button className="chip on">Emergencias</button></div><p className="mut">Los avisos de emergencia de tu zona se muestran siempre con fuente y antigüedad. La entrega por notificación depende de los permisos de tu dispositivo.</p></div>
      </div>
      </>)}
      
      <nav className="nav" aria-label="Principal">
        <a href="/inicio"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a href="/mapa"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a className="on" href="/perfil" aria-current="page"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      
      {sheetRep && (<>
      <div className="scrim" aria-hidden="true"></div>
      <div className="sheet" role="dialog" aria-label="Reportar o bloquear">
        <h2 style={{fontSize: "22px"}}>Reportar o bloquear</h2>
        {repForm && (<>
          <div className="field"><p className="lbl">Vecino</p><div className="wrap">{(targets ?? []).map((t, __i1) => (<Fragment key={__i1}><button className={`${t.cls ?? ""}`} onClick={t.pick}>{t.name}</button></Fragment>))}</div></div>
          <div className="field"><p className="lbl">Motivo</p><div className="wrap"><button className="chip on">Mensajes molestos</button><button className="chip">No cumplió</button><button className="chip">Otro</button></div></div>
          <div className="field"><label htmlFor="nt">Nota (opcional)</label><input id="nt" className="in" {...note.props} /></div>
          <div className="card"><p className="mut">Al bloquear, no recibirán mensajes ni solicitudes entre sí. Si hay una coordinación activa, podrás cerrarla o cancelarla y el acuerdo se conserva. Reportar no borra pruebas ni avisa automáticamente a la policía.</p></div>
          <button className="btn" onClick={confirmRep}>Confirmar</button>
        </>)}
        {repDone && (<><p className="ok" role="status">✓ Reporte guardado y bloqueo aplicado en la demostración.</p></>)}
        <button className="btn g" onClick={closeRep}>Cerrar</button>
      </div>
      </>)}
      </div>
    </div>
  );
}
