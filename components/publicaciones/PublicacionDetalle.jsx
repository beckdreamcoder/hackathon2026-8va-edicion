"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { screenStyles } from "@/components/screens/screen-styles";
import { setDemo } from "@/lib/demo/store";
import { sinConexionAhora, useSinConexion } from "@/lib/demo/conexion";
import { useCola, encolarSolicitud } from "@/lib/demo/cola";
import { VECINOS, useSesion, useSellos, sellosDe, chip, logEvento } from "@/lib/demo/shared";
import { usePublicaciones } from "@/lib/demo/publicaciones";
import { relacionadas, ESTADOS_CAT, TIPOS_CAT } from "@/lib/demo/catalogo";
import {
  useCoordinaciones, solicitar, responder, cancelar, participa, otroDe, esActiva, proximoPaso, cambiarUsuarioDemo, ETIQUETA_ESTADO,
} from "@/lib/demo/coordinaciones";

const PRUEBA = ["maria", "luis", "pedro", "carlos"];
const AVATAR = "w-12 h-12 rounded-[50%] grid place-items-center font-extrabold text-[19px] flex-none bg-[#e6f0e4] text-[#2f5a2d]";

/** Texto del botón principal según la categoría y el modo de la publicación. */
export function etiquetaAccion(vm) {
  if (vm.recurso) return vm.modo === "ofrezco" ? "Solicitar este recurso" : "Ofrecer este recurso";
  if (vm.tipo === "cachuelo") return vm.modo === "pido" ? "Quiero realizar este cachuelo" : "Quiero contratar este servicio";
  if (vm.tipo === "movilidad") return vm.modo === "pido" ? "Ofrecer aventón" : "Pedir aventón";
  return vm.modo === "pido" ? "Ofrecer ayuda" : "Pedir ayuda";
}

/**
 * Detalle exacto de cualquier publicación (favor, cachuelo o movilidad), creada en Publicar o de la comunidad simulada.
 * La solicitud, el chat temporal, el acuerdo, el cierre y el sello usan el motor de coordinaciones existente.
 */
export default function PublicacionDetalle({ vm }) {
  const router = useRouter();
  const [sesion] = useSesion();
  const [co] = useCoordinaciones();
  const [sellos] = useSellos();
  const [, setPubs] = usePublicaciones();
  const sinCon = useSinConexion();
  const [cola] = useCola();
  const [err, setErr] = useState("");
  const [aviso, setAviso] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [motivo, setMotivo] = useState("");
  const [editando, setEditando] = useState(false);
  const [f, setF] = useState({ titulo: "", descripcion: "", pago: "", disponibilidad: "" });
  const uid = sesion.userId;
  const dueno = VECINOS[vm.vecino];
  const soyDueno = uid === vm.vecino;
  const rel = relacionadas(co.items, vm);
  const visibles = rel.filter((c) => participa(c, uid)).sort((a, b) => b.actualizada.localeCompare(a.actualizada));
  const miActiva = rel.find((c) => c.solicitante === uid && esActiva(c));
  const refs = sellosDe(sellos.items, vm.vecino).length;
  const cancelado = vm.estado === "cancelado";
  const enCola = cola.items.some((o) => o.tipo === "solicitud" && o.estado !== "aplicada" && o.usuario === uid && o.datos.pub?.id === vm.id);
  const puedeSolicitar = !soyDueno && !enCola && !miActiva && vm.estado !== "completado" && !cancelado;
  const editable = soyDueno && vm.origen === "pub" && !cancelado;
  const usuarios = soyDueno || PRUEBA.includes(vm.vecino) ? PRUEBA : [...PRUEBA, vm.vecino];

  const run = (r) => { setErr(r.ok ? "" : r.error); return r; };
  const abrirCoord = (c) => { setDemo("coord-foco", { id: "" }, { id: c.id }); router.push("/coordinaciones"); };

  const abrirEdicion = () => { setF({ titulo: vm.titulo, descripcion: vm.descripcion, pago: vm.pago ?? "", disponibilidad: vm.disponibilidad }); setErr(""); setEditando(true); };
  const guardar = () => {
    if (f.titulo.trim().length < 3) { setErr("El título necesita al menos 3 letras."); return; }
    if (f.descripcion.trim().length < 8) { setErr("Cuenta en pocas palabras qué necesitas u ofreces."); return; }
    if (vm.tipo === "cachuelo" && !f.pago.trim()) { setErr("Indica el pago referencial en soles o «A convenir»."); return; }
    setPubs((p) => ({ items: p.items.map((x) => (x.id === vm.id ? { ...x, titulo: f.titulo.trim(), descripcion: f.descripcion.trim(), disponibilidad: f.disponibilidad.trim() || x.disponibilidad, precio: vm.tipo === "cachuelo" ? f.pago.replace(/^S\/\s*/i, "").trim() : x.precio } : x)) }));
    logEvento(`Publicación editada: «${f.titulo.trim()}»`);
    setErr(""); setEditando(false);
  };
  const cancelarPub = () => {
    if (rel.some((c) => c.estado === "aceptada" || c.estado === "acordada")) { setErr("Hay coordinaciones activas: cancélalas o ciérralas antes de cancelar la publicación."); setConfirmar(""); return; }
    rel.filter((c) => c.estado === "solicitada" && c.receptor === uid).forEach((c) => responder(c.id, uid, false));
    setPubs((p) => ({ items: p.items.map((x) => (x.id === vm.id ? { ...x, estado: "cancelada" } : x)) }));
    logEvento(`Publicación cancelada: «${vm.titulo}»`);
    setErr(""); setConfirmar("");
  };

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex gap-2 items-center flex-wrap" role="group" aria-label="Probar como">
        <span className="text-[14px] text-(--color-muted) font-bold">Probar como:</span>
        {usuarios.map((u) => (<button key={u} className={`${chip(uid === u)} min-h-10! px-3!`} onClick={() => { cambiarUsuarioDemo(u); setErr(""); setConfirmar(""); }}>{VECINOS[u].name}{u === vm.vecino ? " (publica)" : ""}</button>))}
      </div>

      <div className={`${screenStyles.card} ${vm.tipo === "cachuelo" ? "border-l-0 border-t-[5px] border-t-[#8a5300]" : ""}`}>
        <div className={screenStyles.row}>
          <span className={vm.tipo === "cachuelo" ? screenStyles.badgeCachuelo : screenStyles.badgeFavor}>{vm.tipo === "cachuelo" ? vm.pago : "Gratis"}</span>
          <span className={vm.estado === "abierto" ? screenStyles.badge : cancelado ? screenStyles.badgeAlert : screenStyles.badgeSolidarity}>{ESTADOS_CAT[vm.estado]}</span>
          {vm.simulado && (<span className={`${screenStyles.badgeDemo} ml-auto`}>Ejemplo</span>)}
        </div>
        <p className={screenStyles.muted}>{TIPOS_CAT[vm.tipo]} · ID {vm.id}</p>
        <h2 className="text-[24px]!">{vm.titulo}</h2>
        <p>{vm.descripcion}</p>
        {vm.recurso && (<p className="font-bold!" role="status">Disponibles: {vm.recurso.restante} de {vm.recurso.cantidad} {vm.recurso.unidad}{vm.recurso.restante === 0 ? " · agotado" : ""}</p>)}
        <p className={screenStyles.muted}>{vm.categoria} · {vm.distrito} · {vm.ubicacion} (zona aproximada)</p>
        <p className={screenStyles.muted}>Publicado: {vm.fecha} · Disponibilidad: {vm.disponibilidad}</p>
      </div>

      <div className={`${screenStyles.card} flex-row! items-center!`}>
        <span className={AVATAR} aria-hidden="true">{dueno?.ini ?? "V"}</span>
        <div className={screenStyles.grow}><b>{dueno?.name ?? "Vecino"}</b>{soyDueno ? " (tú)" : ""}<p className={screenStyles.muted}>{refs > 0 ? `Recomendado por ${refs} ${refs === 1 ? "vecino" : "vecinos"}` : "Vecino nuevo · sin referencias aún"}</p><p className={screenStyles.muted}>{vm.modo === "ofrezco" ? "Ofrece" : "Necesita"} · {TIPOS_CAT[vm.tipo].toLowerCase()}</p><button className="text-[14px] font-bold text-(--color-brand) underline" onClick={() => { setDemo("perfil-foco", { id: "" }, { id: vm.vecino }); router.push("/perfil"); }}>Ver perfil</button></div>
      </div>

      {soyDueno && (<div className={screenStyles.card} role="note"><p className={screenStyles.muted}>Publicaste esto: no puedes solicitarlo. Aquí respondes las solicitudes de otros vecinos.</p></div>)}
      {puedeSolicitar && (<button className={screenStyles.button} onClick={() => {
        if (sinConexionAhora()) { const q = run(encolarSolicitud(vm.pubLike, uid)); if (q.ok) setAviso("Solicitud guardada en este dispositivo, pendiente de enviar. Se aplicará al volver la conexión; todavía no se avisó a nadie."); return; }
        run(solicitar(vm.pubLike, uid));
      }}>{etiquetaAccion(vm)}{sinCon ? " (se guardará sin conexión)" : ""}</button>)}
      {enCola && (<div className={screenStyles.card} role="status"><p className="font-bold!">Solicitud guardada, pendiente de enviar</p><p className={screenStyles.muted}>{aviso || "Está en la cola de este dispositivo y se aplicará al recuperar la conexión. Puedes verla o descartarla en Pendientes."}</p></div>)}
      {!soyDueno && vm.estado === "completado" && !miActiva && (<div className={screenStyles.card} role="status"><p className="font-bold!">{vm.recurso ? "Este recurso ya no tiene unidades disponibles" : "Esta publicación ya se completó"}</p></div>)}
      {cancelado && (<div className={screenStyles.card} role="status"><p className="font-bold!">Publicación cancelada</p><p className={screenStyles.muted}>Ya no recibe solicitudes. Sus coordinaciones previas se conservan.</p></div>)}

      {editable && !editando && (
        <div className="grid-cols-2 grid! gap-2!">
          <button className={`${screenStyles.buttonOutline} min-h-11!`} onClick={abrirEdicion}>Editar</button>
          {confirmar === "pub" ? null : (<button className={`${screenStyles.buttonSecondary} min-h-11!`} onClick={() => setConfirmar("pub")}>Cancelar publicación</button>)}
        </div>
      )}
      {editable && confirmar === "pub" && (
        <div className={screenStyles.card} role="alertdialog" aria-label="Confirmar cancelación de la publicación">
          <p className="font-bold!">¿Cancelar esta publicación?</p><p className={screenStyles.muted}>Dejará de aparecer en el muro, la búsqueda y el mapa. Las solicitudes pendientes se rechazan.</p>
          <div className="grid-cols-2 grid! gap-2!"><button className={`${screenStyles.buttonSecondary} min-h-11!`} onClick={() => setConfirmar("")}>No</button><button className={`${screenStyles.button} min-h-11!`} onClick={cancelarPub}>Sí, cancelar</button></div>
        </div>
      )}
      {editable && editando && (
        <div className={screenStyles.card}>
          <p className={screenStyles.label}>Editar publicación</p>
          <div className={screenStyles.field}><label htmlFor="ed-t">Título</label><input id="ed-t" className={screenStyles.input} value={f.titulo} onChange={(e) => setF({ ...f, titulo: e.target.value })} /></div>
          <div className={screenStyles.field}><label htmlFor="ed-d">Descripción</label><textarea id="ed-d" className="min-h-21 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-3 bg-white w-full resize-none" value={f.descripcion} onChange={(e) => setF({ ...f, descripcion: e.target.value })} /></div>
          {vm.tipo === "cachuelo" && (<div className={screenStyles.field}><label htmlFor="ed-p">Pago referencial (S/)</label><input id="ed-p" className={screenStyles.input} value={f.pago} onChange={(e) => setF({ ...f, pago: e.target.value })} /></div>)}
          <div className={screenStyles.field}><label htmlFor="ed-v">Disponibilidad</label><input id="ed-v" className={screenStyles.input} value={f.disponibilidad} onChange={(e) => setF({ ...f, disponibilidad: e.target.value })} /></div>
          <div className="grid-cols-2 grid! gap-2!"><button className={screenStyles.buttonSecondary} onClick={() => { setEditando(false); setErr(""); }}>Descartar</button><button className={screenStyles.button} onClick={guardar}>Guardar cambios</button></div>
        </div>
      )}
      {err && (<p className={screenStyles.error} role="alert">{err}</p>)}

      <h3 className="text-[18px]!">{soyDueno ? "Solicitudes y coordinaciones" : "Mi solicitud"}</h3>
      {visibles.length === 0 && (<div className={screenStyles.card} role="status"><p className={screenStyles.muted}>{soyDueno ? "Aún nadie ha solicitado esta publicación." : "Todavía no has enviado una solicitud. Queda pendiente hasta que quien publicó la acepte."}</p></div>)}
      {visibles.map((c) => {
        const o = otroDe(c, uid);
        return (
          <div key={c.id} className={screenStyles.card}>
            <div className={screenStyles.row}><b className="flex-1">{VECINOS[o].name}</b><span className={c.estado === "completada" ? screenStyles.badgeFavor : screenStyles.badge}>{ETIQUETA_ESTADO[c.estado]}</span></div>
            <p className="text-[14px] font-bold text-[#9e0c24]">Próximo paso: {proximoPaso(c, uid)}</p>
            {c.estado === "solicitada" && c.receptor === uid && (
              <div className="grid-cols-2 grid! gap-2!">
                <button className={`${screenStyles.buttonSecondary} min-h-12!`} onClick={() => run(responder(c.id, uid, false))}>Rechazar</button>
                <button className={`${screenStyles.button} min-h-12!`} onClick={() => run(responder(c.id, uid, true))}>Aceptar</button>
              </div>
            )}
            {c.estado === "solicitada" && c.solicitante === uid && (confirmar === c.id
              ? (<div className="flex flex-col gap-2" role="alertdialog" aria-label="Confirmar cancelación"><p className="text-[14px]">¿Cancelar tu solicitud? Quien publicó dejará de verla.</p><label htmlFor="mot-c" className="text-[13px] font-bold">Motivo (opcional)</label><input id="mot-c" className={screenStyles.input} value={motivo} maxLength={140} onChange={(e) => setMotivo(e.target.value)} /><div className="grid-cols-2 grid! gap-2!"><button className={`${screenStyles.buttonSecondary} min-h-11!`} onClick={() => setConfirmar("")}>No</button><button className={`${screenStyles.button} min-h-11!`} onClick={() => { run(cancelar(c.id, uid, motivo)); setConfirmar(""); setMotivo(""); }}>Sí, cancelar</button></div></div>)
              : (<button className={`${screenStyles.buttonSecondary} min-h-11!`} onClick={() => setConfirmar(c.id)}>Cancelar solicitud</button>))}
            {(c.estado === "aceptada" || c.estado === "acordada" || c.estado === "completada") && (<button className={`${screenStyles.buttonOutline} min-h-11!`} onClick={() => abrirCoord(c)}>{c.estado === "completada" ? "Ver coordinación y sello" : "Abrir coordinación"}</button>)}
            {(c.estado === "rechazada" || c.estado === "cancelada") && (<p className={screenStyles.muted}>Sin acciones pendientes. {c.estado === "rechazada" ? "La solicitud fue rechazada." : "La coordinación fue cancelada."}</p>)}
          </div>
        );
      })}
      <p className={screenStyles.muted}>Interacciones simuladas, sin servicios reales. {vm.tipo === "cachuelo" ? "Los pagos no se hacen en la app: acuérdenlos en el chat." : "Acuerden fecha, hora y lugar en el chat de la coordinación."}</p>
    </div>
  );
}
