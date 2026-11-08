"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setDemo } from "@/lib/demo/store";
import { screenStyles } from "./screen-styles";
import { VECINOS, useSesion } from "@/lib/demo/shared";
import { useCoordinaciones, useBloqueos, tipoDePublicacion, solicitar, responder, esActiva, ETIQUETA_ESTADO } from "@/lib/demo/coordinaciones";

/** Texto del botón según el tipo y el modo de la publicación. */
function accionLabel(p) {
  if (p.tipo === "cachuelo") return p.modo === "pido" ? "Ofrecer mi servicio" : "Solicitar servicio";
  if (p.categoria === "Movilidad") return p.modo === "pido" ? "Puedo llevarte" : "Solicitar traslado";
  return p.modo === "pido" ? "Ofrecer ayuda" : "Solicitar ayuda";
}

/** Tarjeta de una publicación creada en la demo (mismo registro en muro y mapa), con coordinación integrada. */
export function PostCard({ p }) {
  const [sesion] = useSesion();
  const [co] = useCoordinaciones();
  const [bloqueos] = useBloqueos(); // re-renderiza al bloquear o desbloquear
  const router = useRouter();
  const [err, setErr] = useState("");
  const verDetalle = () => { setDemo("pub-foco", { id: "" }, { id: p.id }); router.push("/buscar"); };
  const uid = sesion.userId;
  const tag = p.tipo === "cachuelo" ? (p.precio || "A convenir") : p.tipo === "campana" ? "Solidaridad" : "Gratis";
  const tagCls = p.tipo === "cachuelo" ? screenStyles.badgeCachuelo : p.tipo === "campana" ? screenStyles.badgeSolidarity : screenStyles.badgeFavor;
  const autor = VECINOS[p.autor]?.name ?? "Tú";
  const esMia = p.autor === uid;
  const coordinable = !!tipoDePublicacion(p) && p.estado === "publicado" && !!VECINOS[p.autor];
  const delaPub = co.items.filter((c) => c.pubId === p.id);
  const mia = delaPub.find((c) => c.solicitante === uid && esActiva(c));
  const ultimaMia = delaPub.find((c) => c.solicitante === uid);
  const pendientes = delaPub.filter((c) => c.estado === "solicitada");
  const abiertas = delaPub.filter((c) => c.estado === "aceptada" || c.estado === "acordada");
  const bloq = coordinable && !esMia && bloqueos.items.some((x) => (x.by === uid && x.target === p.autor) || (x.by === p.autor && x.target === uid));

  const pedir = () => { const r = solicitar(p, uid); setErr(r.ok ? "" : r.error); };

  return (
    <div className={screenStyles.card}>
      <div className={screenStyles.row}>
        <span className={tagCls}>{tag}</span>
        <span className={screenStyles.badge}>{p.estado === "pendiente" ? "Pendiente de enviar" : p.estado === "cancelada" ? "Cancelada" : delaPub.some((c) => c.estado === "completada") ? "Completada" : delaPub.some((c) => c.estado === "aceptada" || c.estado === "acordada") ? "En coordinación" : "Abierta"}</span>
        <span className="flex-1 min-w-0 text-(--color-muted) text-[15px] text-right">{p.alcance === "junta" ? "Mi junta" : "Mi comunidad"}</span>
      </div>
      <h3 className="text-[19px]!">{p.titulo}</h3>
      <p className={screenStyles.muted}>{p.categoria} · {p.zona} · {p.disponibilidad}</p>
      <p className={screenStyles.muted}>Publicado por {autor}{esMia ? " (tú)" : ""}</p>

      {p.estado !== "pendiente" && p.tipo !== "campana" && (<button className={`${screenStyles.buttonSecondary} min-h-11!`} onClick={verDetalle}>Ver detalle y solicitudes</button>)}

      {coordinable && !esMia && (
        <>
          {!mia && !bloq && (<button className={screenStyles.button} onClick={pedir}>{accionLabel(p)}</button>)}
          {bloq && (<p className={screenStyles.error} role="alert">Hay un bloqueo con {autor}: no se pueden enviar solicitudes.</p>)}
          {mia && (
            <div role="status" className="flex flex-col gap-1.5">
              <p className={screenStyles.success}>{ETIQUETA_ESTADO[mia.estado]}</p>
              <Link className={screenStyles.buttonOutline} href="/coordinaciones">Abrir en Mis coordinaciones</Link>
            </div>
          )}
          {!mia && ultimaMia && (<p className={screenStyles.muted} role="status">Tu última solicitud: {ETIQUETA_ESTADO[ultimaMia.estado].toLowerCase()}.</p>)}
          {err && (<p className={screenStyles.error} role="alert">{err}</p>)}
        </>
      )}

      {coordinable && esMia && (pendientes.length > 0 || abiertas.length > 0) && (
        <div className="flex flex-col gap-2 border-t border-t-(--color-line) pt-2">
          {pendientes.map((c) => (
            <div key={c.id} className="flex flex-col gap-1.5">
              <p className="font-bold!">{VECINOS[c.solicitante].name} envió una solicitud</p>
              <div className="grid-cols-2 grid! gap-2!">
                <button className={`${screenStyles.buttonSecondary} min-h-12!`} onClick={() => { const r = responder(c.id, uid, false); setErr(r.ok ? "" : r.error); }}>Rechazar</button>
                <button className={`${screenStyles.button} min-h-12!`} onClick={() => { const r = responder(c.id, uid, true); setErr(r.ok ? "" : r.error); }}>Aceptar</button>
              </div>
            </div>
          ))}
          {abiertas.length > 0 && (<Link className={screenStyles.buttonOutline} href="/coordinaciones">Abrir coordinación ({abiertas.length})</Link>)}
          {err && (<p className={screenStyles.error} role="alert">{err}</p>)}
        </div>
      )}
      {coordinable && esMia && pendientes.length === 0 && abiertas.length === 0 && (
        <p className={screenStyles.muted}>Aún sin solicitudes. Cambia de usuario con «Probar como» (arriba o en Mis coordinaciones) para solicitarla como otro vecino.</p>
      )}
    </div>
  );
}
