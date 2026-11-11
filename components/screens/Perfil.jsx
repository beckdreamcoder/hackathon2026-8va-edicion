"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDemoState, setDemo } from "@/lib/demo/store";
import { useBloqueos, bloquear, desbloquear, cambiarUsuarioDemo, useCoordinaciones } from "@/lib/demo/coordinaciones";
import { useSesion, useAvisos, useSellos, sellosDe, logEvento, VECINOS } from "@/lib/demo/shared";
import { usePublicaciones } from "@/lib/demo/publicaciones";
import { useCatalogo, ESTADOS_CAT, TIPOS_CAT } from "@/lib/demo/catalogo";
import { useCampanas, ESTADO_CAMPANA, APORTES_INICIAL } from "@/lib/demo/campanas";
import { JUNTAS, AVISOS_INICIAL } from "@/lib/demo/juntas";
import { usePerfilDatos, guardarPerfil, nombreDe, distritoDe, enmascarar, estadisticas, registrarReporteVecino, useReportesVecinos, COLORES_AVATAR, DISTRITOS_PERFIL, TIPO_SELLO } from "@/lib/demo/perfiles";
import { participa, otroDe, fase, esAbierta } from "@/lib/demo/coordinaciones";
import PublicacionDetalle from "@/components/publicaciones/PublicacionDetalle";
import CampanaDetalle from "@/components/campanas/CampanaDetalle";

const NOTES_BASE = [{id: "nb1", kind: "Mensaje", title: "Luis te escribió sobre la escalera", time: "hace 5 min", href: "/favores"}, {id: "nb2", kind: "Solicitud", title: "Carlos puede llevarte al hospital", time: "hace 20 min", href: "/movilidad"}, {id: "nb3", kind: "Campaña", title: "Abrigo para familias de Calca: nueva actualización", time: "hace 1 h", href: "/campanas"}, {id: "nb4", kind: "Emergencia", title: "Calles anegadas en Campoy (reportado por varios vecinos)", time: "hace 25 min", href: "/emergencias"}, {id: "nb5", kind: "Acuerdo", title: "Pedro propuso un acuerdo para la fuga", time: "ayer", href: "Cachuelos"}];
const PERMS = [{id: "pm_ubic", name: "Ubicación", help: "Para mostrar vecinos y alertas cerca. Si la deniegas, eliges tu zona a mano."}, {id: "pm_cam", name: "Cámara", help: "Solo para reportes de emergencia. La foto no se sube desde la galería."}, {id: "pm_noti", name: "Notificaciones", help: "Avisos de mensajes, solicitudes y alertas de tu zona."}, {id: "pm_sms", name: "Canal SMS", help: "Consultar por mensaje sin datos móviles. Requiere celular verificado."}, {id: "pm_datos", name: "Uso de mis datos", help: "Necesario para tener cuenta. Tu DNI nunca es público."}];
const CHIP_ON = "min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white on";
const PERFIL_INICIAL = { nombres: {}, phone: "idle", numero: "", perms: {pm_ubic: true, pm_cam: true, pm_noti: true, pm_sms: false, pm_datos: true}, leidos: [], cats: ["Mensaje", "Solicitud", "Campaña"], bloqueados: [] };
const SESIONES = [{ id: "maria", name: "María", role: "Solicitante" }, { id: "luis", name: "Luis", role: "Oferente" }, { id: "pedro", name: "Pedro", role: "Gasfitero" }, { id: "carlos", name: "Carlos", role: "Coordinador de junta" }];
const KIND = { favor: "Mensaje", cachuelo: "Solicitud", junta: "Solicitud", solidaridad: "Campaña", emergencia: "Emergencia" };
import { screenStyles } from "./screen-styles";

const FILA = "flex items-center gap-3.5 min-h-14 px-3.5 py-2 bg-white border border-(--color-line) rounded-[18px] w-full text-left [&_.ic]:text-(--color-brand)";
const ICONOS = { config: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.7a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4l.4-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z", junta: "M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 20a6 6 0 0 1 12 0", coord: "M4 5h16v11H9l-5 4z", pub: "M12 5v14M5 12h14", apoyo: "M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z", aviso: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4", lock: "M5 11h14v9H5zM8 11V8a4 4 0 0 1 8 0v3", cuenta: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0", flag: "M5 21V4h11l-1 4 1 4H5", star: "M12 3l2.7 5.5 6 .9-4.4 4.2 1 6L12 16.8 6.7 19.6l1-6L3.3 9.4l6-.9z", block: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM5.6 5.6l12.8 12.8", edit: "M4 20h4L19 9l-4-4L4 16z" };
const Fila = ({ icono, titulo, extra, onClick, href }) => {
  const cuerpo = (<><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d={ICONOS[icono]} /></svg><b className={screenStyles.grow}>{titulo}</b>{extra}<svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none text-(--color-ink)" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></>);
  return href ? (<a className={FILA} href={href}>{cuerpo}</a>) : (<button className={FILA} onClick={onClick}>{cuerpo}</button>);
};
/** Avatar: foto guardada en este dispositivo, o inicial sobre el color elegido. */
const Avatar = ({ datos, id, nombre, tam = "w-16 h-16 text-[26px]" }) => {
  const d = datos[id] ?? {};
  return d.avatar
    // eslint-disable-next-line @next/next/no-img-element
    ? (<img src={d.avatar} alt={`Foto de ${nombre}`} className={`${tam} rounded-[50%] object-cover flex-none`} />)
    : (<span className={`${tam} rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] flex-none text-[#5c3d00]`} style={{ background: d.color ?? "#f4d9c6" }} aria-hidden="true">{(nombre || "?").charAt(0).toUpperCase()}</span>);
};
const Stat = ({ n, t }) => (<div className="bg-[#f6f2ec] rounded-[14px] px-2 py-2 flex flex-col items-center text-center"><b className="text-[20px] font-[Nunito,system-ui,sans-serif]">{n}</b><span className="text-[12px] text-(--color-muted) leading-tight">{t}</span></div>);
const MOTIVOS = ["Mensajes molestos", "No cumplió", "Otro motivo"];
const ATRAS = (<svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>);
/** Reduce una imagen elegida a un máximo de px y la devuelve como data URL (no se sube a ningún servidor). */
function reducirImagen(file, max, alTerminar, alFallar) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    const k = Math.min(1, max / Math.max(img.width, img.height));
    const cv = document.createElement("canvas");
    cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
    cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
    URL.revokeObjectURL(url);
    alTerminar(cv.toDataURL("image/jpeg", 0.75));
  };
  img.onerror = () => { URL.revokeObjectURL(url); alFallar(); };
  img.src = url;
}

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
  const guardarNombre = () => { const v = user.value.trim(); if (v) { setPf((p) => ({ nombres: { ...p.nombres, [sesion.userId]: v } })); guardarPerfil(sesion.userId, { nombre: v }); } };
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
    logEvento("Celular vinculado y verificado para el canal SMS");
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

  const router = useRouter();
  const [sheetRep, setSheetRep] = useState(false);
  const [repDone, setRepDone] = useState("");
  const [repFijo, setRepFijo] = useState(false);
  const [bloqueos] = useBloqueos();
  const [co] = useCoordinaciones();
  const [datos] = usePerfilDatos();
  const [reportes] = useReportesVecinos();
  const [aportes] = useDemoState("campana-aportes", APORTES_INICIAL);
  const [avJunta] = useDemoState("juntas-avisos", AVISOS_INICIAL);
  const [pubsRaw] = usePublicaciones();
  const catalogo = useCatalogo();
  const camps = useCampanas();
  const [foco, setFoco] = useDemoState("perfil-foco", { id: "" });
  const [verId, setVerId] = useState("");
  const [selPub, setSelPub] = useState("");
  const [tabPub, setTabPub] = useState("activas");
  const [msg, setMsg] = useState("");
  const [eNombre, setENombre] = useState("");
  const [eBio, setEBio] = useState("");
  const [eDistrito, setEDistrito] = useState("");
  const [eAvatar, setEAvatar] = useState("");
  const [eColor, setEColor] = useState("");
  const [errEd, setErrEd] = useState("");
  const uid = sesion.userId;
  const nombreVec = (id) => nombreDe(id, datos.items, pf.nombres);
  const miNombre = nombreVec(uid);
  const miDatos = datos.items[uid] ?? {};
  const junta = sesion.juntaId ? JUNTAS[sesion.juntaId] ?? JUNTAS.campoy : null;
  const miDistrito = distritoDe(uid, datos.items, sesion.departamento);
  const statsDe = (id) => estadisticas(id, co.items, aportes.items.filter((a) => a.vecino === id && a.estado === "confirmado").length, avJunta.items.filter((a) => a.autor === id).length);
  const refsDe = (id) => sellos.items.filter((x) => x.valido && x.to === id).sort((a, b) => b.mes.localeCompare(a.mes));
  const misCoord = co.items.filter((c) => participa(c, uid)).sort((a, b) => b.actualizada.localeCompare(a.actualizada));
  const cuentaCoord = { pendRec: misCoord.filter((c) => c.estado === "solicitada" && c.receptor === uid).length, pendEnv: misCoord.filter((c) => c.estado === "solicitada" && c.solicitante === uid).length, activas: misCoord.filter((c) => c.estado === "aceptada" || c.estado === "acordada").length, fin: misCoord.filter((c) => c.estado === "completada").length, canc: misCoord.filter((c) => c.estado === "cancelada" || c.estado === "rechazada").length };
  const pendRec = cuentaCoord.pendRec;
  const abrirCoord = (c, tab) => { setDemo("coord-foco", { id: "", tab: "" }, { id: c.id, tab: tab ?? "" }); router.push("/coordinaciones"); };
  const abrirFiltro = (f) => { setDemo("coord-filtro", { id: "" }, { id: f }); router.push("/coordinaciones"); };

  // Si se llegó desde una publicación o una coordinación, se abre el perfil público de ese vecino
  useEffect(() => {
    if (!foco.id) return undefined;
    const t = setTimeout(() => { if (foco.id !== uid) { setVerId(foco.id); nav.go("vecino"); } setFoco({ id: "" }); }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foco.id]);

  // Edición del perfil propio
  const abrirEditar = () => { setENombre(miNombre); setEBio(miDatos.bio ?? ""); setEDistrito(miDistrito); setEAvatar(miDatos.avatar ?? ""); setEColor(miDatos.color ?? COLORES_AVATAR[0]); setErrEd(""); setMsg(""); nav.go("editar"); };
  const elegirFoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { setErrEd("Elige un archivo de imagen."); return; }
    reducirImagen(f, 192, (url) => { setEAvatar(url); setErrEd(""); }, () => setErrEd("No se pudo leer la imagen."));
  };
  const guardarPerfilPropio = () => {
    if (eNombre.trim().length < 2) { setErrEd("El nombre público necesita al menos 2 letras."); return; }
    guardarPerfil(uid, { nombre: eNombre.trim().slice(0, 40), bio: eBio.trim().slice(0, 140), distrito: eDistrito, avatar: eAvatar || undefined, color: eColor });
    setPf((p) => ({ nombres: { ...p.nombres, [uid]: eNombre.trim().slice(0, 40) } }));
    setErrEd(""); setMsg("✓ Cambios guardados en este dispositivo."); nav.back();
  };

  // Mis publicaciones: las creadas por mí en Publicar, Favores, Cachuelos, Recursos y campañas
  const mias = [
    ...catalogo.filter((v) => v.origen === "pub" && v.vecino === uid).map((v) => ({ id: v.id, kind: "pub", vm: v, tipoTxt: v.recurso ? "Recurso" : TIPOS_CAT[v.tipo], titulo: v.titulo, sub: `${v.categoria} · ${v.fecha}`, grupo: v.estado === "cancelado" ? "canceladas" : v.estado === "completado" ? "finalizadas" : "activas", estadoTxt: ESTADOS_CAT[v.estado] })),
    ...camps.filter((c) => c.origen === "pub" && c.vecino === uid).map((c) => ({ id: c.id, kind: "camp", c, tipoTxt: "Campaña", titulo: c.titulo, sub: `${c.zona} · desde ${c.inicio}`, grupo: c.estado === "finalizada" ? "finalizadas" : "activas", estadoTxt: ESTADO_CAMPANA[c.estado] })),
  ];
  const pendientes = pubsRaw.items.filter((p) => p.autor === uid && p.estado === "pendiente");
  const selItem = mias.find((m) => m.id === selPub);

  const posibles = Object.values(VECINOS).filter((v) => v.id !== uid && !v.sim);
  const [target, setTarget] = useState("luis");
  const [motivo, setMotivo] = useState("Mensajes molestos");
  const targetId = repFijo ? target : posibles.some((v) => v.id === target) ? target : posibles[0].id;
  const misBloqueos = bloqueos.items.filter((x) => x.by === uid);
  const misReportes = reportes.items.filter((x) => x.by === uid);
  const openRep = (fijo) => { if (fijo) setTarget(fijo); setRepFijo(!!fijo); setRepDone(""); setSheetRep(true); };
  const closeRep = () => setSheetRep(false);
  const hacerReporte = (conBloqueo) => {
    const nombre = VECINOS[targetId].name;
    registrarReporteVecino({ by: uid, target: targetId, motivo, nota: note.value, fecha: sesion.fecha, bloqueado: conBloqueo });
    if (conBloqueo) { bloquear(uid, targetId); setPf((p) => ({ bloqueados: [...new Set([...p.bloqueados, nombre])] })); }
    setRepDone(conBloqueo ? "bloqueo" : "reporte");
    logEvento(`Reporte sobre ${nombre} · motivo: ${motivo}${conBloqueo ? " · bloqueado" : ""}`);
  };
  return (
    <div className={screenStyles.screen}>
      <div className={screenStyles.frame}>
      
      {nav.is("perfil") && (<>
      <div className={screenStyles.header}><h1 className="pl-2">Mi perfil</h1></div>
      <div className={screenStyles.content}>
        {msg && (<p className={screenStyles.success} role="status">{msg}</p>)}
        <div className={`${screenStyles.card} flex-row! items-center!`}>
          <Avatar datos={datos.items} id={uid} nombre={miNombre} />
          <div className={screenStyles.grow}><h2 className="text-[24px]!">{miNombre}</h2><p className={screenStyles.muted}>{miDistrito} · {sesion.localidad}</p><p className={screenStyles.muted}>{junta ? junta.name : "Sin junta vecinal"}</p>
            <div className="flex flex-wrap gap-1.5"><span className={screenStyles.badge}>{refLbl}</span><span className={screenStyles.badgeDemo}>{sesion.registrada && sesion.dni ? "Identidad validada con RENIEC" : "Sin validar"}</span></div></div>
        </div>
        {miDatos.bio && (<p>{miDatos.bio}</p>)}
        <div className="grid grid-cols-4 gap-2" role="group" aria-label="Actividad">{(() => { const st = statsDe(uid); return (<><Stat n={refs} t="referencias" /><Stat n={st.favores} t="favores" /><Stat n={st.cachuelos} t="cachuelos" /><Stat n={st.participacion} t="participación" /></>); })()}</div>
        <p className={screenStyles.muted}>Privado (solo tú lo ves): DNI {enmascarar(sesion.dni ?? "") || "sin registrar"} · Celular {pf.phone === "ok" ? enmascarar(pf.numero) : "sin vincular"}. Los sellos son reconocimientos entre vecinos, no una certificación de identidad.</p>
        <Fila icono="edit" titulo="Editar perfil" onClick={abrirEditar} />

        <div className={screenStyles.card}>
          <div className={screenStyles.row}><b className="flex-1">Mis coordinaciones</b>{pendRec > 0 && (<span className={screenStyles.badgeAlert}>{pendRec} {pendRec === 1 ? "pendiente" : "pendientes"}</span>)}</div>
          <div className="flex gap-2 overflow-x-auto pb-0.5 [&>*]:shrink-0" role="group" aria-label="Ir a coordinaciones">
            {[["pendientes", `Pendientes (${cuentaCoord.pendRec + cuentaCoord.pendEnv})`], ["activas", `Activas (${cuentaCoord.activas})`], ["finalizadas", `Finalizadas (${cuentaCoord.fin})`], ["canceladas", `Canceladas (${cuentaCoord.canc})`]].map(([k, n]) => (<button key={k} className={screenStyles.chip} onClick={() => abrirFiltro(k)}>{n}</button>))}
          </div>
          {misCoord.length === 0 && (<p className={screenStyles.muted}>Aún no tienes coordinaciones. Se crean cuando una solicitud se acepta.</p>)}
          {misCoord.slice(0, 3).map((c) => (
            <div key={c.id} className="flex items-center gap-2 border-t border-t-(--color-line) pt-2">
              <div className="flex-1 min-w-0"><b className="block truncate text-[15px]">{c.titulo}</b><span className="text-[13px] text-(--color-muted)">con {nombreVec(otroDe(c, uid))} · {fase(c, sesion.fecha)}</span></div>
              {c.legado ? (<a className={screenStyles.chip} href={c.href}>Abrir</a>) : (<><button className={screenStyles.chip} onClick={() => abrirCoord(c)}>Abrir</button>{esAbierta(c) && (<button className={screenStyles.chip} onClick={() => abrirCoord(c, "chat")}>Chat</button>)}</>)}
            </div>
          ))}
          <button className={`${screenStyles.buttonOutline} min-h-11!`} onClick={() => abrirFiltro("todas")}>Ver todas mis coordinaciones</button>
        </div>

        <Fila icono="pub" titulo="Mis publicaciones" extra={<span className={screenStyles.badge}>{mias.length + pendientes.length}</span>} onClick={() => { setTabPub("activas"); nav.go("pubs"); }} />
        <Fila icono="star" titulo="Referencias recibidas" extra={<span className={screenStyles.badge}>{refs}</span>} onClick={() => nav.go("refs")} />
        <Fila icono="junta" titulo="Mi junta vecinal" href="/junta" />
        <Fila icono="apoyo" titulo="Mis apoyos y campañas" href="/campanas?vista=apoyos" />
        <Fila icono="aviso" titulo="Avisos" extra={hasUnread && (<span className={screenStyles.badgeAlert}>{unreadN} nuevos</span>)} onClick={() => nav.go("avisos")} />
        <Fila icono="config" titulo="Configuración" href="/configuracion" />
        <Fila icono="lock" titulo="Privacidad y permisos" onClick={() => nav.go("privacidad")} />
        <Fila icono="cuenta" titulo="Mi cuenta" onClick={() => nav.go("cuenta")} />
        <Fila icono="block" titulo="Vecinos bloqueados y reportes" extra={misBloqueos.length > 0 && (<span className={screenStyles.badge}>{misBloqueos.length}</span>)} onClick={() => nav.go("bloqueos")} />
        <Fila icono="flag" titulo="Reportar o bloquear a un vecino" onClick={() => openRep()} />
      </div>
      </>)}

      {nav.is("editar") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}>{ATRAS}</button><h1>Editar perfil</h1></div>
      <div className={screenStyles.content}>
        <div className={`${screenStyles.card} flex-row! items-center!`}>
          {eAvatar
            // eslint-disable-next-line @next/next/no-img-element
            ? (<img src={eAvatar} alt="Vista previa de tu foto" className="w-16 h-16 rounded-[50%] object-cover flex-none" />)
            : (<span className="w-16 h-16 rounded-[50%] grid place-items-center font-extrabold text-[26px] flex-none text-[#5c3d00]" style={{ background: eColor }} aria-hidden="true">{(eNombre || "?").charAt(0).toUpperCase()}</span>)}
          <div className={screenStyles.grow}><label htmlFor="foto" className="font-bold text-[15px]">Foto (opcional)</label><input id="foto" type="file" accept="image/*" className="text-[14px] w-full" onChange={elegirFoto} />{eAvatar && (<button className="text-[14px] font-bold text-(--color-brand) underline" onClick={() => setEAvatar("")}>Quitar foto</button>)}</div>
        </div>
        <div className={screenStyles.field}><p className={screenStyles.label}>Color del avatar</p><div className={screenStyles.wrap} role="group" aria-label="Color">{COLORES_AVATAR.map((c) => (<button key={c} className={`w-11 h-11 rounded-[50%] border-2 ${eColor === c ? "border-(--color-ink)" : "border-(--color-line)"}`} style={{ background: c }} aria-label={`Color ${c}`} aria-pressed={eColor === c} onClick={() => setEColor(c)}></button>))}</div></div>
        <div className={screenStyles.field}><label htmlFor="en">Nombre público</label><input id="en" className={screenStyles.input} maxLength={40} value={eNombre} onChange={(e) => setENombre(e.target.value)} /></div>
        <div className={screenStyles.field}><label htmlFor="eb">Sobre mí (opcional)</label><textarea id="eb" className="min-h-21 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-3 bg-white w-full resize-none" maxLength={140} value={eBio} onChange={(e) => setEBio(e.target.value)} /></div>
        <div className={screenStyles.field}><label htmlFor="ed">Distrito</label><select id="ed" className="min-h-12 border-[1.5px] border-[#cfc7bf] rounded-[14px] px-3 bg-white w-full" value={eDistrito} onChange={(e) => setEDistrito(e.target.value)}>{DISTRITOS_PERFIL.map((d) => (<option key={d}>{d}</option>))}</select></div>
        <p className={screenStyles.muted}>Tu DNI y tu celular no se muestran en tu perfil público.</p>
        {errEd && (<p className={screenStyles.error} role="alert">{errEd}</p>)}
        <button className={screenStyles.button} onClick={guardarPerfilPropio}>Guardar cambios</button>
      </div>
      </>)}

      {nav.is("pubs") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}>{ATRAS}</button><h1>Mis publicaciones</h1></div>
      <div className={screenStyles.content}>
        <div className="flex gap-2 overflow-x-auto pb-0.5 [&>*]:shrink-0" role="group" aria-label="Estado de mis publicaciones">{[["activas", "Activas"], ["finalizadas", "Finalizadas"], ["canceladas", "Canceladas"]].map(([k, n]) => (<button key={k} className={tabPub === k ? CHIP_ON : screenStyles.chip} aria-pressed={tabPub === k} onClick={() => setTabPub(k)}>{n} ({mias.filter((m) => m.grupo === k).length + (k === "activas" ? pendientes.length : 0)})</button>))}</div>
        {tabPub === "activas" && pendientes.map((p) => (<a key={p.id} className={screenStyles.card} href="/offline?vista=pend"><div className={screenStyles.row}><span className={screenStyles.badge}>Pendiente de enviar</span></div><b>{p.titulo}</b><p className={screenStyles.muted}>Se enviará al volver la conexión · ver pendientes</p></a>))}
        {mias.filter((m) => m.grupo === tabPub).map((m) => (
          <button key={m.id} className={screenStyles.card} onClick={() => { setSelPub(m.id); nav.go("pubdetalle"); }} aria-label={`${m.titulo}, abrir publicación`}>
            <div className={screenStyles.row}><span className={screenStyles.badgeSolidarity}>{m.tipoTxt}</span><span className={m.grupo === "activas" ? screenStyles.badge : m.grupo === "canceladas" ? screenStyles.badgeAlert : screenStyles.badgeFavor}>{m.estadoTxt}</span></div>
            <b>{m.titulo}</b><p className={screenStyles.muted}>{m.sub} · ID {m.id}</p>
          </button>
        ))}
        {mias.filter((m) => m.grupo === tabPub).length === 0 && !(tabPub === "activas" && pendientes.length) && (<div className={screenStyles.card} role="status"><p className="font-bold!">No tienes publicaciones {tabPub}</p><p className={screenStyles.muted}>Las que crees en Publicar aparecen aquí al instante.</p><a className={screenStyles.buttonOutline} href="/publicar">Publicar</a></div>)}
      </div>
      </>)}

      {nav.is("pubdetalle") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}>{ATRAS}</button><h1>Publicación</h1></div>
      <div className={screenStyles.content}>
        {!selItem ? (<div className={screenStyles.card} role="status"><p className="font-bold!">Esta publicación ya no está disponible</p><button className={screenStyles.button} onClick={nav.back}>Volver</button></div>) : selItem.kind === "camp" ? (<CampanaDetalle c={selItem.c} />) : (<PublicacionDetalle vm={selItem.vm} />)}
      </div>
      </>)}

      {nav.is("refs") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}>{ATRAS}</button><h1>Referencias recibidas</h1></div>
      <div className={screenStyles.content}>
        <div className={screenStyles.card} role="note"><p className={screenStyles.muted}>Los sellos de Visto Bueno Vecinal son reconocimientos entre vecinos tras una coordinación completada. No verifican identidad ni son certificaciones oficiales. No se puede darse sellos a uno mismo ni repetirlos.</p></div>
        {refsDe(uid).length === 0 && (<div className={screenStyles.card} role="status"><p className="font-bold!">Aún no tienes referencias</p><p className={screenStyles.muted}>Llegan cuando alguien te da un sello al completar una coordinación.</p></div>)}
        {refsDe(uid).map((r) => (<div key={r.id} className={screenStyles.card}><div className={screenStyles.row}><b className="flex-1">{nombreVec(r.from)}</b><span className={screenStyles.badgeFavor}>{TIPO_SELLO[r.tipo]}</span></div><p className={screenStyles.muted}>{r.mes}</p>{r.comentario && (<p>«{r.comentario}»</p>)}</div>))}
      </div>
      </>)}

      {nav.is("bloqueos") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}>{ATRAS}</button><h1>Bloqueados y reportes</h1></div>
      <div className={screenStyles.content}>
        <div className={screenStyles.card}><p className={screenStyles.label}>Vecinos bloqueados</p>
          {misBloqueos.length === 0 && (<p className={screenStyles.muted}>No has bloqueado a nadie.</p>)}
          {misBloqueos.map((b) => (<div key={b.target} className={screenStyles.row}><span className={screenStyles.grow}><b>{nombreVec(b.target)}</b></span><button className={screenStyles.chip} onClick={() => desbloquear(uid, b.target)}>Desbloquear</button></div>))}
          <p className={screenStyles.muted}>Un vecino bloqueado no puede enviarte solicitudes ni mensajes. Las coordinaciones anteriores se conservan.</p></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Reportes enviados</p>
          {misReportes.length === 0 && (<p className={screenStyles.muted}>No has reportado a nadie.</p>)}
          {misReportes.map((r) => (<p key={r.id} className="text-[14px]"><b>{nombreVec(r.target)}</b> · {r.motivo} · {r.fecha}{r.bloqueado ? " · bloqueado" : ""}</p>))}
          <p className={screenStyles.muted}>Los reportes quedan solo en este navegador: no se envían a autoridades.</p></div>
        <button className={screenStyles.button} onClick={() => openRep()}>Reportar o bloquear a un vecino</button>
      </div>
      </>)}

      {nav.is("vecino") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}>{ATRAS}</button><h1>Perfil de vecino</h1></div>
      <div className={screenStyles.content}>
        {(() => {
          const v = verId; const nom = nombreVec(v); const d = datos.items[v] ?? {}; const st = statsDe(v); const rs = refsDe(v);
          const yoLoBloquee = bloqueos.items.some((x) => x.by === uid && x.target === v);
          return (<>
            <div className={`${screenStyles.card} flex-row! items-center!`}>
              <Avatar datos={datos.items} id={v} nombre={nom} />
              <div className={screenStyles.grow}><h2 className="text-[24px]!">{nom}</h2><p className={screenStyles.muted}>{distritoDe(v, datos.items, sesion.departamento)}</p>
                <div className="flex flex-wrap gap-1.5"><span className={screenStyles.badge}>{rs.length > 0 ? `Recomendado por ${rs.length} ${rs.length === 1 ? "vecino" : "vecinos"}` : "Vecino nuevo · sin referencias aún"}</span></div></div>
            </div>
            {d.bio && (<p>{d.bio}</p>)}
            <div className="grid grid-cols-4 gap-2"><Stat n={rs.length} t="referencias" /><Stat n={st.favores} t="favores" /><Stat n={st.cachuelos} t="cachuelos" /><Stat n={st.participacion} t="participación" /></div>
            <div className={screenStyles.card}><p className={screenStyles.label}>Referencias recientes</p>{rs.length === 0 && (<p className={screenStyles.muted}>Todavía no tiene referencias.</p>)}{rs.slice(0, 5).map((r) => (<p key={r.id} className="text-[14px]"><b>{nombreVec(r.from)}</b> · {TIPO_SELLO[r.tipo]} · {r.mes}{r.comentario ? ` · «${r.comentario}»` : ""}</p>))}</div>
            <p className={screenStyles.muted}>Su DNI, celular y otros datos personales son privados y no se muestran.</p>
            {v !== uid && (yoLoBloquee
              ? (<button className={screenStyles.buttonOutline} onClick={() => desbloquear(uid, v)}>Desbloquear a {nom}</button>)
              : (<button className={screenStyles.buttonSecondary} onClick={() => openRep(v)}>Reportar o bloquear</button>))}
          </>);
        })()}
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
        <div className={screenStyles.card}><p className={screenStyles.label}>Celular para SMS</p>
          {phoneIdle && (<><label htmlFor="ph" className="absolute left-[-9999px]!">Celular</label><input id="ph" className={screenStyles.input} inputMode="numeric" placeholder="9 d\u00edgitos" {...phone.props} />{phoneErr && (<p className={screenStyles.error} role="alert">Escribe un celular de 9 dígitos que empiece con 9.</p>)}<button className={screenStyles.button} onClick={sendCode}>Enviar código por SMS</button></>)}
          {phoneCode && (<><p className={screenStyles.muted}>Te enviamos un código por SMS (000000). Escríbelo abajo.</p><label htmlFor="cd" className="absolute left-[-9999px]!">Código</label><input id="cd" className={screenStyles.input} inputMode="numeric" maxLength="6" {...code.props} /><button className={screenStyles.button} onClick={verify}>Verificar</button>{codeErr && (<><p className={screenStyles.error} role="alert">Código incorrecto. Prueba con 000000.</p></>)}</>)}
          {phoneOk && (<><p className={screenStyles.success} role="status">✓ Celular vinculado solo para el canal SMS</p><p className={screenStyles.muted}>No reemplaza el acceso por DNI ni verifica tu identidad.</p><button className={screenStyles.buttonSecondary} onClick={unlink}>Desvincular</button></>)}</div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Sesiones activas</p>{(sessions ?? []).map((s, __i1) => (<Fragment key={__i1}><div className={screenStyles.row}><span className={screenStyles.grow}><b>{s.name}</b><br /><span className={screenStyles.muted}>{s.role}</span></span><button className={s.cls} onClick={s.pick}>{s.lbl}</button></div></Fragment>))}<p className={screenStyles.muted}>Cambiar de sesión no mezcla datos privados de otros perfiles.</p></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Vecinos bloqueados</p>
          {misBloqueos.length === 0 && (<p className={screenStyles.muted}>No has bloqueado a nadie.</p>)}
          {misBloqueos.map((b) => (<div key={b.target} className={screenStyles.row}><span className={screenStyles.grow}><b>{VECINOS[b.target].name}</b></span><button className={screenStyles.chip} onClick={() => desbloquear(sesion.userId, b.target)}>Desbloquear</button></div>))}</div>
        <div className={screenStyles.card} role="note"><p className={screenStyles.label}>Datos privados</p><p className={screenStyles.muted}>DNI {enmascarar(sesion.dni ?? "") || "sin registrar"} · Celular {pf.phone === "ok" ? enmascarar(pf.numero) : "sin vincular"}. Solo tú los ves.</p></div>
        <Link className={screenStyles.buttonSecondary} href="/" onClick={cerrarSesion}>Cerrar sesión</Link>
        
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
      <div className={screenStyles.scrim} aria-hidden="true" onClick={closeRep}></div>
      <div className="absolute left-0 right-0 bottom-0 max-h-[90%] overflow-y-auto bg-white rounded-[24px_24px_0_0] border-t border-t-(--color-line) shadow-[0_-8px_24px_rgba(32,33,36,.15)] px-4 py-5 flex flex-col gap-3 z-40" role="dialog" aria-label="Reportar o bloquear">
        <h2 className="text-[22px]!">Reportar o bloquear</h2>
        {!repDone && (<>
          {!repFijo && (<div className={screenStyles.field}><p className={screenStyles.label}>Vecino</p><div className="flex gap-2 overflow-x-auto pb-0.5 [&>*]:shrink-0">{posibles.map((v) => (<button key={v.id} className={v.id === targetId ? CHIP_ON : screenStyles.chip} aria-pressed={v.id === targetId} onClick={() => setTarget(v.id)}>{v.name}</button>))}</div></div>)}
          {repFijo && (<p>Vecino: <b>{nombreVec(targetId)}</b></p>)}
          <div className={screenStyles.field}><p className={screenStyles.label}>Motivo</p><div className={screenStyles.wrap}>{MOTIVOS.map((m) => (<button key={m} className={m === motivo ? CHIP_ON : screenStyles.chip} aria-pressed={m === motivo} onClick={() => setMotivo(m)}>{m}</button>))}</div></div>
          <div className={screenStyles.field}><label htmlFor="nt">Nota (opcional)</label><input id="nt" className={screenStyles.input} maxLength={140} {...note.props} /></div>
          <div className={screenStyles.card}><p className={screenStyles.muted}>Al bloquear, no podrán enviarse solicitudes ni mensajes entre sí. Si hay una coordinación activa, podrás cancelarla y el historial se conserva. Reportar no avisa a la policía ni a ninguna autoridad: queda solo en este navegador.</p></div>
          <div className="grid-cols-2 grid! gap-2!"><button className={screenStyles.buttonOutline} onClick={() => hacerReporte(false)}>Solo reportar</button><button className={screenStyles.button} onClick={() => hacerReporte(true)}>Reportar y bloquear</button></div>
        </>)}
        {repDone && (<p className={screenStyles.success} role="status">{repDone === "bloqueo" ? "✓ Reporte enviado y bloqueo aplicado." : "✓ Reporte enviado. Lo revisaremos."}</p>)}
        <button className={screenStyles.buttonSecondary} onClick={closeRep}>Cerrar</button>
      </div>
      </>)}
      </div>
    </div>
  );
}
