"use client";

import { useRouter } from "next/navigation";
import { useAvisos } from "@/lib/demo/shared";
import { useDemoState } from "@/lib/demo/store";
import { screenStyles } from "./screen-styles";
import { notificacionesTest } from "@/lib/mock/notificaciones";
import { useViewStack } from "@/lib/hooks/use-view-stack";

const LECT_INICIAL = { leidas: [] };

const CATEGORIAS = {
  favor: { label: "Favor", cls: "inline-flex items-center text-[13px] font-bold rounded-full px-2.5 py-[3px] bg-[#e6f0e4] text-[#2f5a2d] w-fit" },
  cachuelo: { label: "Cachuelo", cls: "inline-flex items-center text-[13px] font-bold rounded-full px-2.5 py-[3px] bg-[#fff4d6] text-[#5c3d00] w-fit" },
  solidaridad: { label: "Solidaridad", cls: "inline-flex items-center text-[13px] font-bold rounded-full px-2.5 py-[3px] bg-[#ddeff1] text-[#1f6f7a] w-fit" },
  emergencia: { label: "Emergencia", cls: "inline-flex items-center text-[13px] font-bold rounded-full px-2.5 py-[3px] bg-[#fbe3e7] text-[#9e0c24] w-fit" },
  junta: { label: "Junta", cls: "inline-flex items-center text-[13px] font-bold rounded-full px-2.5 py-[3px] bg-[#f1ece6] text-(--color-ink) w-fit" },
  sistema: { label: "Sistema", cls: "inline-flex items-center text-[13px] font-bold rounded-full px-2.5 py-[3px] bg-[#f1ece6] text-(--color-ink) w-fit" },
};

/**
 * Lista de notificaciones. Usa datos de prueba de lib/mock/notificaciones.ts.
 * Tocar una notificación la marca como leída; "Volver" regresa a la pantalla anterior.
 */
export default function Notificaciones() {
  const nav = useViewStack("lista");
  const router = useRouter();
  const [avisos, setAvisos] = useAvisos();
  const [lect, setLect] = useDemoState("notificaciones", LECT_INICIAL);
  // Avisos generados por la actividad de la demo + ejemplos de semilla
  const items = [
    ...avisos.items.map((a) => ({ ...a, categoria: CATEGORIAS[a.categoria] ? a.categoria : "sistema" })),
    ...notificacionesTest.map((n) => ({ ...n, leida: n.leida || lect.leidas.includes(n.id) })),
  ];

  const sinLeer = items.filter((n) => !n.leida).length;

  const marcarLeida = (id) => {
    if (avisos.items.some((a) => a.id === id)) setAvisos((p) => ({ items: p.items.map((a) => (a.id === id ? { ...a, leida: true } : a)) }));
    else setLect((p) => ({ leidas: [...new Set([...p.leidas, id])] }));
  };
  const abrir = (n) => {
    marcarLeida(n.id);
    if (n.href) router.push(n.href);
  };

  const marcarTodas = () => {
    setAvisos((p) => ({ items: p.items.map((a) => ({ ...a, leida: true })) }));
    setLect({ leidas: notificacionesTest.map((n) => n.id) });
  };

  return (
    <div className="m-0 bg-white text-(--color-ink) font-[Nunito,system-ui,sans-serif] text-[17px] leading-[1.4] [&_h1]:font-[Nunito,system-ui,sans-serif] [&_h1]:m-0 [&_h1]:leading-[1.15] [&_h2]:font-[Nunito,system-ui,sans-serif] [&_h2]:m-0 [&_h2]:leading-[1.15] [&_h3]:font-[Nunito,system-ui,sans-serif] [&_h3]:m-0 [&_h3]:leading-[1.15] [&_p]:m-0 [&_button]:cursor-pointer [&_:focus-visible]:outline-3 [&_:focus-visible]:outline-(--color-ink) [&_:focus-visible]:outline-offset-2">
      <div className={screenStyles.frame}>
        <div className={screenStyles.header}>
          <button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}>
            <svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <h1>Notificaciones</h1>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-28 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className={screenStyles.muted}>{sinLeer> 0 ? `${sinLeer} sin leer` : "Todo al día"}</p>
            {sinLeer> 0 && (
              <button className="border-0 bg-none bg-transparent text-(--color-brand) font-bold text-[15px] px-0 py-2 min-h-11" onClick={marcarTodas}>
                Marcar todas como leídas
              </button>
            )}
          </div>

          {items.map((n) => (
            <button
              key={n.id}
              className={n.leida ? "bg-white border border-(--color-line) rounded-[20px] px-4 py-3.5 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-1.5 text-left w-full [&_b]:text-[18px] [&_b]:leading-[1.2]" : "bg-white border-2 border-(--color-brand) rounded-[20px] px-4 py-3.5 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-1.5 text-left w-full [&_b]:text-[18px] [&_b]:leading-[1.2]"}
              onClick={() => abrir(n)}
              aria-label={`${n.titulo}${n.leida ? "" : ", sin leer"}`}
            >
              <div className={screenStyles.row}>
                <span className={CATEGORIAS[n.categoria].cls}>{CATEGORIAS[n.categoria].label}</span>
                <span className="text-(--color-muted) text-[15px] flex-1 min-w-0 text-right!">
                  {n.hace}
                </span>
              </div>
              <b>{n.titulo}</b>
              <p className={screenStyles.muted}>{n.texto}</p>
            </button>
          ))}
        </div>

        <nav className={screenStyles.navigation} aria-label="Principal">
          <a href="/inicio">
            <svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
            </svg>
            Inicio
          </a>
          <a href="/mapa">
            <svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Mapa
          </a>
          <a href="/perfil">
            <svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true">
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
