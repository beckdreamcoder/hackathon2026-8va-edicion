"use client";

import { useRouter } from "next/navigation";
import { screenStyles } from "./screen-styles";
import { ScreenShell } from "./screen-shell";
import { useSesion } from "@/lib/demo/shared";
import { useIncidentes, autoresDistintos, estadoCorroboracion } from "@/lib/demo/incidentes";
import { useDemoState } from "@/lib/demo/store";

const CAMP_INICIAL = { estado: "Activa", intencion: false };

/** P10 · Red solidaria: eventualidades, noticias de mayor alcance, campañas y acopio. */
export default function Solidaria() {
  const router = useRouter();
  const [sesion] = useSesion();
  const [incs] = useIncidentes();
  const [camp] = useDemoState("campana-abrigo", CAMP_INICIAL);
  const offline = sesion.senal === "Sin datos";
  const destacado = incs.items.find((i) => i.id === "INC-0007") ?? incs.items[0];
  const intencion = 14 + (camp.intencion ? 1 : 0);

  return (
    <ScreenShell title="Red solidaria" onBack={() => router.push("/inicio")}>
      {offline && (<div className={`${screenStyles.card} bg-[#f1ece6]!`} role="status"><p className="font-bold!">Sin conexión · copia guardada</p><p className={screenStyles.muted}>Lo que ves puede estar desactualizado. No hay noticias frescas.</p></div>)}

      <h2 className="text-[20px]!">Eventualidad destacada</h2>
      {destacado ? (
        <a className={`${screenStyles.card} border-[#9a3412]!`} href="/emergencias">
          <div className={screenStyles.row}><span className={screenStyles.badgeEmergency}>{estadoCorroboracion(destacado)}</span><span className={screenStyles.badgeDemo}>Simulación</span></div>
          <h3 className="text-[19px]!">{destacado.titulo}</h3>
          <p className={screenStyles.muted}>{destacado.id} · {autoresDistintos(destacado)} vecinos distintos · {destacado.actualizado}</p>
          <p className="font-bold! text-[15px]! text-(--color-brand)!">Misma ficha que el mapa y el centro de emergencias</p>
        </a>
      ) : (
        <div className={screenStyles.card} role="status"><p className="font-bold!">No hay eventualidades activas</p><p className={screenStyles.muted}>Que no haya reportes no significa que no haya riesgo.</p></div>
      )}

      <h2 className="text-[20px]!">Noticias de mayor alcance</h2>
      <a className={screenStyles.card} href="/noticias"><span className={screenStyles.badgeSolidarity}>Mayor alcance</span><b>Colecta nacional de abrigo antes de las heladas</b><p className={screenStyles.muted}>Editor demo · 6 nov 2026 · Sierra sur</p></a>
      <a className={screenStyles.card} href="/noticias"><span className={screenStyles.badgeSolidarity}>Mayor alcance</span><b>Recordatorio: números de emergencia 105, 116 y 106</b><p className={screenStyles.muted}>Editor demo · 5 nov 2026 · Todo el país</p></a>

      <h2 className="text-[20px]!">Campañas activas</h2>
      {camp.estado === "Activa" ? (
        <a className={screenStyles.card} href="/campanas"><div className={screenStyles.row}><span className={screenStyles.badgeSolidarity}>Acopio</span><span className={screenStyles.badge}>Activa</span></div><b>Abrigo para familias de Calca</b><p className={screenStyles.muted}>{intencion} personas quieren apoyar (intención, no aportes recibidos)</p></a>
      ) : (
        <div className={screenStyles.card} role="status"><p className="font-bold!">No hay campañas activas</p><a className={screenStyles.buttonOutline} href="/publicar">Crear campaña</a></div>
      )}
      <a className={screenStyles.buttonSecondary} href="/campanas">Ver centros de acopio y campañas</a>
      <a className={screenStyles.button} href="/publicar">Crear campaña de apoyo</a>
    </ScreenShell>
  );
}
