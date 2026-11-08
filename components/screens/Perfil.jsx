"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment, useEffect, useState } from "react";
import { useDemoState } from "@/lib/demo/store";
import { useBloqueos, bloquear, desbloquear, cambiarUsuarioDemo, useCoordinaciones } from "@/lib/demo/coordinaciones";
import { useSesion, useAvisos, useSellos, sellosDe, logEvento, VECINOS } from "@/lib/demo/shared";

const NOTES_BASE = [{id: "nb1", kind: "Mensaje", title: "Luis te escribió sobre la escalera", time: "hace 5 min", href: "/favores"}, {id: "nb2", kind: "Solicitud", title: "Carlos puede llevarte al hospital", time: "hace 20 min", href: "/movilidad"}, {id: "nb3", kind: "Campaña", title: "Abrigo para familias de Calca: nueva actualización", time: "hace 1 h", href: "/campanas"}, {id: "nb4", kind: "Emergencia", title: "Calles anegadas en Campoy (reportado por varios vecinos)", time: "hace 25 min", href: "/emergencias"}, {id: "nb5", kind: "Acuerdo", title: "Pedro propuso un acuerdo para la fuga", time: "ayer", href: "Cachuelos"}];
const PERMS = [{id: "pm_ubic", name: "Ubicación", help: "Para mostrar vecinos y alertas cerca. Si la deniegas, eliges tu zona a mano."}, {id: "pm_cam", name: "Cámara", help: "Solo para reportes de emergencia. La foto no se sube desde la galería."}, {id: "pm_noti", name: "Notificaciones", help: "Avisos de mensajes, solicitudes y alertas de tu zona."}, {id: "pm_sms", name: "Canal SMS", help: "Consultar por mensaje sin datos móviles. Requiere celular verificado."}, {id: "pm_datos", name: "Uso de mis datos", help: "Necesario para tener cuenta. Tu DNI nunca es público."}];
const CHIP_ON = "min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white on";
const PERFIL_INICIAL = { nombres: {}, phone: "idle", numero: "", perms: {pm_ubic: true, pm_cam: true, pm_noti: true, pm_sms: false, pm_datos: true}, leidos: [], cats: ["Mensaje", "Solicitud", "Campaña"], bloqueados: [] };
const SESIONES = [{ id: "maria", name: "María", role: "Solicitante" }, { id: "luis", name: "Luis", role: "Oferente" }, { id: "pedro", name: "Pedro", role: "Gasfitero" }, { id: "carlos", name: "Carlos", role: "Coordinador de junta" }];
const KIND = { favor: "Mensaje", cachuelo: "Solicitud", junta: "Solicitud", solidaridad: "Campaña", emergencia: "Emergencia" };
import { screenStyles } from "./screen-styles";

/**
 * Pantalla Perfil del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Perfil() {
  const nav = useViewStack("perfil");
  const [sesion, setSesion] = useSesion();
  const [pf, setPf] = useDemoState("perfil", PERFIL_INICIAL);
  const [avisos, setAvisos] = useAvisos();
  const [sellos] = useSellos();
  const note = useTextInput("");
  const code = useTextInput("");
  const phone = useTextInput("");
  const nombreBase = VECINOS[sesion.userId]?.name ?? "María";
  const user = useTextInput(pf.nombres?.[sesion.userId] ?? nombreBase);
  useEffect(() => { user.setValue(pf.nombres?.[sesion.userId] ?? nombreBase); }, [sesion.userId, pf.nombres, nombreBase]); // eslint-disable-line react-hooks/exhaustive-deps
  const guardarNombre = () => { const v = user.value.trim(); if (v) setPf((p) => ({ nombres: { ...p.nombres, [sesion.userId]: v } })); };
  const ini = (user.value.trim() || nombreBase).charAt(0).toUpperCase();
  const refs = sellosDe(sellos.items, sesion.userId).length;
  const refLbl = refs > 0 ? `Recomendado por ${refs} ${refs === 1 ? "vecino" : "vecinos"}` : "Vecino nuevo · sin referencias aún";

  const [codeErr, setCodeErr] = useState(false);
  const phoneIdle = pf.phone === "idle";
  const phoneCode = pf.phone === "code";
  const phoneOk = pf.phone === "ok";
  const [phoneErr, setPhoneErr] = useState(false);
  const sendCode = () => { if (!/^9\d{8}$/.test(phone.value)) { setPhoneErr(true); return; } setPhoneErr(false); setPf({ phone: "code", numero: phone.value }); };
  const verify = () => {
    if (code.value !== "000000") { setCodeErr(true); return; }
    setCodeErr(false);
    setPf((p) => ({ phone: "ok", perms: { ...p.perms, pm_sms: true } }));
    logEvento("Celular vinculado para el canal SMS (verificación simulada)");
  };
  const unlink = () => setPf((p) => ({ phone: "idle", numero: "", perms: { ...p.perms, pm_sms: false } }));

  const perms = PERMS.map((p) => ({
    ...p,
    on: !!pf.perms[p.id],
    toggle: () => {
      if (p.id === "pm_sms" && !phoneOk && !pf.perms.pm_sms) { nav.go("cuenta"); return; }
      setPf((x) => ({ perms: { ...x.perms, [p.id]: !x.perms[p.id] } }));
    },
  }));

  const sessions = SESIONES.map((s) => ({
    ...s,
    cls: s.id === sesion.userId ? CHIP_ON : screenStyles.chip,
    lbl: s.id === sesion.userId ? "Activa" : "Cambiar",
    pick: () => cambiarUsuarioDemo(s.id),
  }));
  const cerrarSesion = () => { setSesion({ registrada: false }); logEvento("Sesión cerrada"); };

  const estaticos = NOTES_BASE.map((n) => ({ ...n, unread: !pf.leidos.includes(n.id), read: () => setPf((p) => ({ leidos: [...new Set([...p.leidos, n.id])] })) }));
  const generados = avisos.items.map((a) => ({ id: a.id, kind: KIND[a.categoria] ?? "Aviso", title: a.titulo, time: a.hace, href: a.href, unread: !a.leida, read: () => setAvisos((p) => ({ items: p.items.map((x) => (x.id === a.id ? { ...x, leida: true } : x)) })) }));
  const notes = [...generados, ...estaticos].filter((n) => pf.cats.includes(n.kind) || n.kind === "Emergencia" || n.kind === "Aviso");
  const unreadN = notes.filter((n) => n.unread).length;
  const hasUnread = unreadN > 0;
  const readAll = () => {
    setPf({ leidos: NOTES_BASE.map((n) => n.id) });
    setAvisos((p) => ({ items: p.items.map((x) => ({ ...x, leida: true })) }));
  };
  const toggleCat = (c) => setPf((p) => ({ cats: p.cats.includes(c) ? p.cats.filter((x) => x !== c) : [...p.cats, c] }));

  const [sheetRep, setSheetRep] = useState(false);
  const [repDone, setRepDone] = useState(false);
  const [bloqueos] = useBloqueos();
  const [co] = useCoordinaciones();
  const pendRec = co.items.filter((x) => x.estado === "solicitada" && x.receptor === sesion.userId).length;
  const [target, setTarget] = useState("luis");
  const [motivo, setMotivo] = useState("Mensajes molestos");
  const repForm = !repDone;
  const posibles = Object.values(VECINOS).filter((v) => v.id !== sesion.userId && !v.sim);
  const targetId = posibles.some((v) => v.id === target) ? target : posibles[0].id;
  const targets = posibles.map((v) => ({ name: v.name, cls: v.id === targetId ? CHIP_ON : screenStyles.chip, pick: () => setTarget(v.id) }));
  const misBloqueos = bloqueos.items.filter((x) => x.by === sesion.userId);
  const openRep = () => { setRepDone(false); setSheetRep(true); };
  const closeRep = () => setSheetRep(false);
  const confirmRep = () => {
    const nombre = VECINOS[targetId].name;
    bloquear(sesion.userId, targetId);
    setPf((p) => ({ bloqueados: [...new Set([...p.bloqueados, nombre])] }));
    setRepDone(true);
    logEvento(`Reporte demo y bloqueo de ${nombre} · motivo: ${motivo}${note.value ? " · nota" : ""}`);
  };
  return (
    <div className={screenStyles.screen}>
      <div className={screenStyles.frame}>
      
      {nav.is("perfil") && (<>
      <div className={screenStyles.header}><h1 className="pl-2">Mi perfil</h1></div>
      <div className={screenStyles.content}>
        <div className={`${screenStyles.card} flex-row! items-center!`}><span className="w-16 h-16 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[26px] flex-none bg-[#f4d9c6] text-[#8a2b07]" aria-hidden="true">{ini}</span><div className={screenStyles.grow}><h2 className="text-[24px]!">{user.value}</h2><p className={screenStyles.muted}>{sesion.localidad} · {sesion.departamento}</p><span className={screenStyles.badge}>{refLbl}</span></div></div>
        <p className={screenStyles.muted}>Tu DNI y tu celular son privados. Solo se muestran tu nombre público y tu zona aproximada.</p>
        <a className="flex items-center gap-3.5 min-h-15 px-3.5 py-2 bg-white border border-(--color-line) rounded-[18px] w-full text-left [&_.ic]:text-(--color-brand)" href="/movilidad"><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3" /><circle cx="5" cy="10" r="2.2" /><circle cx="19" cy="10" r="2.2" /><path d="M6 20a6 6 0 0 1 12 0" /></svg><b className={screenStyles.grow}>Mi junta vecinal</b><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic text-(--color-ink)!" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></a>
        <a className="flex items-center gap-3.5 min-h-15 px-3.5 py-2 bg-white border border-(--color-line) rounded-[18px] w-full text-left [&_.ic]:text-(--color-brand)" href="/coordinaciones"><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /></svg><b className={screenStyles.grow}>Mis coordinaciones</b>{pendRec > 0 && (<span className={screenStyles.badgeAlert}>{pendRec} {pendRec === 1 ? "pendiente" : "pendientes"}</span>)}<svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic text-(--color-ink)!" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></a>
        <a className="flex items-center gap-3.5 min-h-15 px-3.5 py-2 bg-white border border-(--color-line) rounded-[18px] w-full text-left [&_.ic]:text-(--color-brand)" href="/publicar"><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg><b className={screenStyles.grow}>Mis publicaciones</b><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic text-(--color-ink)!" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></a>
        <a className="flex items-center gap-3.5 min-h-15 px-3.5 py-2 bg-white border border-(--color-line) rounded-[18px] w-full text-left [&_.ic]:text-(--color-brand)" href="/campanas"><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z" /></svg><b className={screenStyles.grow}>Mis apoyos</b><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic text-(--color-ink)!" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></a>
        <button className="flex items-center gap-3.5 min-h-15 px-3.5 py-2 bg-white border border-(--color-line) rounded-[18px] w-full text-left [&_.ic]:text-(--color-brand)" onClick={() => nav.go("avisos")}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4" /></svg><b className={screenStyles.grow}>Avisos</b>{hasUnread && (<><span className={screenStyles.badgeAlert}>{unreadN} nuevos</span></>)}<svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic text-(--color-ink)!" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
        <button className="flex items-center gap-3.5 min-h-15 px-3.5 py-2 bg-white border border-(--color-line) rounded-[18px] w-full text-left [&_.ic]:text-(--color-brand)" onClick={() => nav.go("privacidad")}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg><b className={screenStyles.grow}>Privacidad y permisos</b><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic text-(--color-ink)!" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
        <button className="flex items-center gap-3.5 min-h-15 px-3.5 py-2 bg-white border border-(--color-line) rounded-[18px] w-full text-left [&_.ic]:text-(--color-brand)" onClick={() => nav.go("cuenta")}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg><b className={screenStyles.grow}>Mi cuenta</b><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic text-(--color-ink)!" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
        <button className="flex items-center gap-3.5 min-h-15 px-3.5 py-2 bg-white border border-(--color-line) rounded-[18px] w-full text-left [&_.ic]:text-(--color-brand)" onClick={openRep}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4h11l-1 4 1 4H5" /></svg><b className={screenStyles.grow}>Reportar o bloquear a un vecino</b></button>
      </div>
      </>)}
      
      {nav.is("privacidad") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Privacidad y permisos</h1></div>
      <div className={screenStyles.content}>
        {(perms ?? []).map((p, __i1) => (<Fragment key={__i1}><div className={screenStyles.card}><div className={screenStyles.checkboxRow}><input id={`${p.id ?? ""}`} type="checkbox" checked={!!p.on} onChange={p.toggle} /><label htmlFor={`${p.id ?? ""}`}><b>{p.name}</b><br /><span className={screenStyles.muted}>{p.help}</span></label></div></div></Fragment>))}
        <div className={screenStyles.card} role="note"><p className={screenStyles.label}>Importante</p><p className={screenStyles.muted}>Estos interruptores guardan tu preferencia en BarrioConecta. Para revocar un permiso del sistema (cámara, ubicación, notificaciones), cámbialo en los ajustes de tu navegador o teléfono.</p></div>
        <p className={screenStyles.muted}>El canal por SMS solo se activa con un celular verificado en «Mi cuenta».</p>
      </div>
      </>)}
      
      {nav.is("cuenta") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Mi cuenta</h1></div>
      <div className={screenStyles.content}>
        <div className={screenStyles.field}><label htmlFor="nm">Nombre público</label><input id="nm" className={screenStyles.input} {...user.props} onBlur={guardarNombre} /></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Celular para SMS</p><span className={screenStyles.badgeDemo}>Verificación simulada</span>
          {phoneIdle && (<><label htmlFor="ph" className="absolute left-[-9999px]!">Celular</label><input id="ph" className={screenStyles.input} inputMode="numeric" placeholder="9 d\u00edgitos" {...phone.props} />{phoneErr && (<p className={screenStyles.error} role="alert">Escribe un celular de 9 dígitos que empiece con 9.</p>)}<button className={screenStyles.button} onClick={sendCode}>Enviar código (simulado)</button></>)}
          {phoneCode && (<><p className={screenStyles.muted}>Código de demostración: 000000 · escríbelo abajo</p><label htmlFor="cd" className="absolute left-[-9999px]!">Código</label><input id="cd" className={screenStyles.input} inputMode="numeric" maxLength="6" {...code.props} /><button className={screenStyles.button} onClick={verify}>Verificar</button>{codeErr && (<><p className={screenStyles.error} role="alert">Código incorrecto. Prueba con 000000.</p></>)}</>)}
          {phoneOk && (<><p className={screenStyles.success} role="status">✓ Celular vinculado solo para el canal SMS</p><p className={screenStyles.muted}>No reemplaza el acceso por DNI ni verifica tu identidad.</p><button className={screenStyles.buttonSecondary} onClick={unlink}>Desvincular</button></>)}</div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Sesiones de demostración</p>{(sessions ?? []).map((s, __i1) => (<Fragment key={__i1}><div className={screenStyles.row}><span className={screenStyles.grow}><b>{s.name}</b><br /><span className={screenStyles.muted}>{s.role}</span></span><button className={s.cls} onClick={s.pick}>{s.lbl}</button></div></Fragment>))}<p className={screenStyles.muted}>Cambiar de sesión no mezcla datos privados de otros perfiles.</p></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Vecinos bloqueados</p>
          {misBloqueos.length === 0 && (<p className={screenStyles.muted}>No has bloqueado a nadie.</p>)}
          {misBloqueos.map((b) => (<div key={b.target} className={screenStyles.row}><span className={screenStyles.grow}><b>{VECINOS[b.target].name}</b></span><button className={screenStyles.chip} onClick={() => desbloquear(sesion.userId, b.target)}>Desbloquear</button></div>))}</div>
        <a className={screenStyles.buttonSecondary} href="/" onClick={cerrarSesion}>Cerrar sesión</a>
        <p className={screenStyles.muted}>Recuperación segura de cuenta y cambio de DNI: evolución futura, no incluida en esta demostración.</p>
      </div>
      </>)}
      
      {nav.is("avisos") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Avisos</h1><button className={screenStyles.chip} onClick={readAll}>Marcar leídos</button></div>
      <div className={screenStyles.content}>
        {(notes ?? []).map((n, __i1) => (<Fragment key={__i1}>
          <a className={`${screenStyles.card} flex-row! items-start!`} href={n.href} onClick={n.read}>{n.unread && (<><span className="w-2.5 h-2.5 rounded-[50%] bg-(--color-brand) flex-none mt-2!" aria-label="sin leer"></span></>)}<div className={screenStyles.grow}><span className={screenStyles.badge}>{n.kind}</span><p className="font-bold! mt-1!">{n.title}</p><p className={screenStyles.muted}>{n.time}</p></div></a>
        </Fragment>))}
        <div className={screenStyles.card}><p className={screenStyles.label}>Categorías de avisos</p><div className={screenStyles.wrap}><button className={pf.cats.includes("Mensaje") ? CHIP_ON : screenStyles.chip} onClick={() => toggleCat("Mensaje")}>Mensajes</button><button className={pf.cats.includes("Solicitud") ? CHIP_ON : screenStyles.chip} onClick={() => toggleCat("Solicitud")}>Solicitudes</button><button className={pf.cats.includes("Campaña") ? CHIP_ON : screenStyles.chip} onClick={() => toggleCat("Campaña")}>Campañas</button><button className={CHIP_ON} disabled title="Siempre activos">Emergencias</button></div><p className={screenStyles.muted}>Los avisos de emergencia de tu zona se muestran siempre con fuente y antigüedad. La entrega por notificación depende de los permisos de tu dispositivo.</p></div>
      </div>
      </>)}
      
      <nav className="absolute left-3 right-3 bottom-3 z-10 flex bg-white px-1.5 py-2 border border-[#ede9e6] rounded-[28px] shadow-[0_8px_24px_rgba(32,33,36,.14)] [&_a]:flex-1 [&_a]:min-h-14 [&_a]:flex [&_a]:flex-col [&_a]:items-center [&_a]:justify-center [&_a]:gap-0.5 [&_a]:text-[13px] [&_a]:text-(--color-muted) [&_a]:rounded-[14px] [&_a.on]:text-(--color-brand) [&_a.on]:font-bold" aria-label="Principal">
        <a href="/inicio"><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a href="/mapa"><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a className="on" href="/perfil" aria-current="page"><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      
      {sheetRep && (<>
      <div className={screenStyles.scrim} aria-hidden="true"></div>
      <div className="absolute left-0 right-0 bottom-0 max-h-[90%] overflow-y-auto bg-white rounded-[24px_24px_0_0] border-t border-t-(--color-line) shadow-[0_-8px_24px_rgba(32,33,36,.15)] px-4 py-5 flex flex-col gap-3 z-5" role="dialog" aria-label="Reportar o bloquear">
        <h2 className="text-[22px]!">Reportar o bloquear</h2>
        {repForm && (<>
          <div className={screenStyles.field}><p className={screenStyles.label}>Vecino</p><div className={screenStyles.wrap}>{(targets ?? []).map((t, __i1) => (<Fragment key={__i1}><button className={t.cls} onClick={t.pick}>{t.name}</button></Fragment>))}</div></div>
          <div className={screenStyles.field}><p className={screenStyles.label}>Motivo</p><div className={screenStyles.wrap}>{["Mensajes molestos", "No cumplió", "Otro"].map((m) => (<button key={m} className={m === motivo ? CHIP_ON : screenStyles.chip} onClick={() => setMotivo(m)}>{m}</button>))}</div></div>
          <div className={screenStyles.field}><label htmlFor="nt">Nota (opcional)</label><input id="nt" className={screenStyles.input} {...note.props} /></div>
          <div className={screenStyles.card}><p className={screenStyles.muted}>Al bloquear, no recibirán mensajes ni solicitudes entre sí. Si hay una coordinación activa, podrás cerrarla o cancelarla y el acuerdo se conserva. Reportar no borra pruebas ni avisa automáticamente a la policía.</p></div>
          <button className={screenStyles.button} onClick={confirmRep}>Confirmar</button>
        </>)}
        {repDone && (<><p className={screenStyles.success} role="status">✓ Reporte guardado y bloqueo aplicado en la demostración.</p></>)}
        <button className={screenStyles.buttonSecondary} onClick={closeRep}>Cerrar</button>
      </div>
      </>)}
      </div>
    </div>
  );
}
