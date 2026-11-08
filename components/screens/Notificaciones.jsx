"use client";

import { useState } from "react";
import "./Notificaciones.css";
import { notificacionesTest } from "@/lib/mock/notificaciones";
import { useViewStack } from "@/lib/hooks/use-view-stack";

const CATEGORIAS = {
  favor: { label: "Favor", cls: "tag fav" },
  cachuelo: { label: "Cachuelo", cls: "tag sim" },
  solidaridad: { label: "Solidaridad", cls: "tag sol" },
  emergencia: { label: "Emergencia", cls: "tag red" },
  junta: { label: "Junta", cls: "tag" },
  sistema: { label: "Sistema", cls: "tag" },
};

/**
 * Lista de notificaciones. Usa datos de prueba de lib/mock/notificaciones.ts.
 * Tocar una notificación la marca como leída; "Volver" regresa a la pantalla anterior.
 */
export default function Notificaciones() {
  const nav = useViewStack("lista");
  const [items, setItems] = useState(notificacionesTest);

  const sinLeer = items.filter((n) => !n.leida).length;

  const marcarLeida = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
  };

  const marcarTodas = () => {
    setItems((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  return (
    <div className="scr-notificaciones">
      <div className="app">
        <div className="top">
          <button className="ib" aria-label="Volver" onClick={nav.back}>
            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <h1>Notificaciones</h1>
        </div>

        <div className="body">
          <div className="resumen">
            <p className="mut">{sinLeer > 0 ? `${sinLeer} sin leer` : "Todo al día"}</p>
            {sinLeer > 0 && (
              <button className="link" onClick={marcarTodas}>
                Marcar todas como leídas
              </button>
            )}
          </div>

          {items.map((n) => (
            <button
              key={n.id}
              className={`card notif${n.leida ? "" : " nueva"}`}
              onClick={() => marcarLeida(n.id)}
              aria-label={`${n.titulo}${n.leida ? "" : ", sin leer"}`}
            >
              <div className="row">
                <span className={CATEGORIAS[n.categoria].cls}>{CATEGORIAS[n.categoria].label}</span>
                <span className="mut sp" style={{ textAlign: "right" }}>
                  {n.hace}
                </span>
              </div>
              <b>{n.titulo}</b>
              <p className="mut">{n.texto}</p>
            </button>
          ))}
        </div>

        <nav className="nav" aria-label="Principal">
          <a href="/inicio">
            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
            </svg>
            Inicio
          </a>
          <a href="/mapa">
            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Mapa
          </a>
          <a href="/perfil">
            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
            Mi perfil
          </a>
        </nav>
      </div>
    </div>
  );
}
