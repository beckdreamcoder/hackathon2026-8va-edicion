"use client";

import { useRouter } from "next/navigation";
import { screenStyles } from "./screen-styles";
import { ScreenShell } from "./screen-shell";
import { useCheckbox } from "@/lib/hooks/use-checkbox";
import { useSesion, logEvento } from "@/lib/demo/shared";
import { useDemoState } from "@/lib/demo/store";

const JUNTAS = {
  campoy: { name: "Junta Vecinal Campoy Unido", zona: "Campoy · San Juan de Lurigancho", coord: "Carmen" },
  olivos: { name: "Junta del Pasaje Los Olivos", zona: "Campoy · Sector 4", coord: "Rosa" },
  tacala: { name: "Junta Vecinal Tacalá Solidario", zona: "Tacalá · Castilla, Piura", coord: "Carmen" },
  kari: { name: "Junta Vecinal Kari Grande", zona: "Kari Grande · San Sebastián, Cusco", coord: "Carmen" },
  belen: { name: "Junta Vecinal Bajo Belén", zona: "Bajo Belén · Belén, Loreto", coord: "Carmen" },
  atum: { name: "Junta Vecinal Atumpampa", zona: "Atumpampa · Tarapoto", coord: "Carmen" },
};
const MOV = { stage: "none", req: { cuando: "" } };

/** P28 · Mi junta vecinal: ficha, avisos, solicitudes y movilidad prioritaria. */
export default function Junta() {
  const router = useRouter();
  const [sesion, setSesion] = useSesion();
  const [mov] = useDemoState("movilidad-hospital", MOV);
  const avisos = useCheckbox(true);
  const id = sesion.juntaId;
  const j = id ? JUNTAS[id] ?? JUNTAS.campoy : null;
  const puedeEditar = sesion.rol !== "Vecino";

  const unirme = () => { setSesion({ juntaId: "campoy" }); logEvento("Se unió a la Junta Vecinal Campoy Unido"); };
  const salir = () => { setSesion({ juntaId: null }); logEvento("Salió de su junta (puede seguir usando toda la app)"); };

  if (!j) {
    return (
      <ScreenShell title="Mi junta vecinal" onBack={() => router.back()}>
        <div className={screenStyles.card} role="status"><p className="font-bold!">Aún no perteneces a una junta</p><p className={screenStyles.muted}>Sumarte es voluntario. Puedes usar toda la app, incluidas las emergencias, sin junta.</p></div>
        <div className={screenStyles.card}><b>{JUNTAS.campoy.name}</b><p className={screenStyles.muted}>{JUNTAS.campoy.zona}</p><span className={screenStyles.badgeDemo}>Junta de demostración</span><button className={screenStyles.button} onClick={unirme}>Unirme</button></div>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Mi junta vecinal" onBack={() => router.back()}>
      <div className={screenStyles.card}>
        <h2 className="text-[21px]!">{j.name}</h2>
        <p className={screenStyles.muted}>{j.zona}</p>
        <span className={screenStyles.badgeDemo}>Junta de demostración</span>
        <p className={screenStyles.muted}>No tiene reconocimiento estatal real. Pertenecer no verifica a nadie. Tu rol demo: {sesion.rol}.</p>
      </div>
      {mov.stage !== "none" && mov.stage !== "cancel" && (
        <a className={`${screenStyles.card} border-(--color-brand)!`} href="/movilidad"><span className={screenStyles.badgeFavor}>Traslado prioritario</span><b>María necesita llegar al hospital</b><p className={screenStyles.muted}>{mov.req.cuando} · la junta recibe este aviso primero</p></a>
      )}
      <h3 className="text-[19px]!">Avisos</h3>
      <div className={screenStyles.card}><p className="font-bold!">Reunión vecinal el sábado</p><p className={screenStyles.muted}>Local comunal · 5:00 p. m. · Publicado por {j.coord} (coordinadora demo)</p></div>
      <div className={screenStyles.card}><p className="font-bold!">Faena de limpieza del parque</p><p className={screenStyles.muted}>Domingo 8:00 a. m. · Aviso de demostración</p></div>
      {puedeEditar && (<button className={screenStyles.buttonOutline} onClick={() => logEvento(`${sesion.rol} demo publicó un aviso en la junta`)}>Publicar aviso (rol {sesion.rol})</button>)}
      <h3 className="text-[19px]!">Necesidades de los miembros</h3>
      <a className={screenStyles.card} href="/favores"><b>Escalera de 3 metros prestada</b><p className={screenStyles.muted}>Favor · María · visible porque lo publicó para su junta</p></a>
      <p className={screenStyles.muted}>Solo se muestran avisos y necesidades publicadas para la junta. Nunca conversaciones privadas.</p>
      <div className={screenStyles.checkboxRow}><input id="avj" type="checkbox" {...avisos.props} /><label htmlFor="avj"><b>Recibir avisos de mi junta</b></label></div>
      <button className={screenStyles.buttonSecondary} onClick={salir}>Salir de la junta</button>
    </ScreenShell>
  );
}
