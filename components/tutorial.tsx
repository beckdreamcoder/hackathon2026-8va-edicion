"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n";
import { useTutorial, terminarTutorial } from "@/lib/demo/tutorial";
import { hidratar } from "@/lib/demo/store";

/** Pasos de la guía de bienvenida (máximo 5). Los textos están en lib/i18n (guia.pN.t / guia.pN.d). */
const PASOS = ["guia.p1", "guia.p2", "guia.p3", "guia.p4", "guia.p5"];

const BTN = "min-h-11 rounded-[14px] px-4 font-bold text-[15px] border-2";

/** Guía de bienvenida: aparece una vez, en el primer ingreso a inicio, en un solo popup por pasos. */
export function Tutorial() {
  const { t } = useT();
  const pathname = usePathname();
  const [tut] = useTutorial();
  const [listo, setListo] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [paso, setPaso] = useState(0);

  // Espera a cargar los datos guardados para saber si la guía ya se vio
  useEffect(() => {
    let vivo = true;
    hidratar().then(() => { if (vivo) setListo(true); });
    return () => { vivo = false; };
  }, []);

  useEffect(() => {
    if (listo && pathname === "/inicio" && tut.estado === "pendiente") {
      setPaso(0);
      setAbierto(true);
    }
  }, [listo, pathname, tut.estado]);

  if (!abierto) return null;
  const ultimo = paso === PASOS.length - 1;
  const cerrar = (estado: "completado" | "omitido") => { setAbierto(false); terminarTutorial(estado); };

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 grid place-items-center px-4">
      <div role="dialog" aria-modal="true" aria-labelledby="guia-t" aria-describedby="guia-d" className="w-full max-w-[22rem] rounded-[24px] bg-white p-5 flex flex-col gap-3 shadow-[0_12px_32px_rgba(0,0,0,.35)]">
        <div className="flex gap-1.5" aria-hidden="true">
          {PASOS.map((_, i) => (<i key={i} className={`block h-1.5 flex-1 rounded-full ${i <= paso ? "bg-(--color-brand)" : "bg-(--color-line)"}`} />))}
        </div>
        <p className="text-[13px] font-bold text-(--color-muted)" aria-live="polite">{t("guia.progreso", { n: paso + 1, total: PASOS.length })}</p>
        <h2 id="guia-t" className="text-[20px] font-extrabold leading-tight">{t(`${PASOS[paso]}.t`)}</h2>
        <p id="guia-d" className="text-[15px]">{t(`${PASOS[paso]}.d`)}</p>
        <div className="flex items-center gap-2 pt-1">
          <button type="button" className="min-h-11 px-2 text-[15px] font-bold text-(--color-muted) underline" onClick={() => cerrar("omitido")}>{t("guia.omitir")}</button>
          <span className="flex-1" />
          {paso > 0 && (<button type="button" className={`${BTN} border-(--color-line) bg-white text-(--color-ink)`} onClick={() => setPaso((p) => p - 1)}>{t("tour.anterior")}</button>)}
          <button type="button" className={`${BTN} border-(--color-brand) bg-(--color-brand) text-white`} onClick={() => (ultimo ? cerrar("completado") : setPaso((p) => p + 1))}>{ultimo ? t("guia.empezar") : t("tour.siguiente")}</button>
        </div>
      </div>
    </div>
  );
}
