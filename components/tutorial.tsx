"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n";
import { consejoPendiente, marcarVista, omitirTutorial } from "@/lib/demo/tutorial";
import { hidratar } from "@/lib/demo/store";

/** Un consejo corto por pantalla (ruta → número de `tour.pN` en lib/i18n). Solo se muestra la primera vez. */
const CONSEJOS: Record<string, string> = {
  "/inicio": "tour.junta", // lo primero que se sugiere: unirse a una junta de tu localidad
  "/mapa": "tour.p2",
  "/publicar": "tour.p5",
  "/emergencias": "tour.p10",
  "/perfil": "tour.p13",
};

const BTN = "min-h-11 rounded-[14px] px-4 font-bold text-[15px] border-2";

/**
 * Consejo de primera visita: aparece al entrar por primera vez a una pantalla con consejo.
 * Se puede cerrar con "Entendido" o omitir todos los consejos con "Omitir".
 */
export function Tutorial() {
  const { t } = useT();
  const pathname = usePathname();
  const [consejo, setConsejo] = useState<string | null>(null);

  useEffect(() => {
    setConsejo(null);
    const n = CONSEJOS[pathname];
    if (!n) return undefined;
    // Se espera a que carguen los datos guardados para saber si ya se vio esta pantalla
    let vivo = true;
    hidratar().then(() => {
      if (!vivo || !consejoPendiente(pathname)) return;
      marcarVista(pathname);
      setConsejo(n);
    });
    return () => { vivo = false; };
  }, [pathname]);

  if (consejo === null) return null;

  return (
    <div role="dialog" aria-labelledby="tip-t" aria-describedby="tip-d" className="fixed inset-x-3 bottom-24 z-60 mx-auto max-w-[26rem] rounded-[20px] border border-(--color-line) bg-white p-4 shadow-[0_8px_28px_rgba(32,33,36,.28)] flex flex-col gap-2.5">
      <h2 id="tip-t" className="text-[17px] font-extrabold leading-tight">{t(`${consejo}.t`)}</h2>
      <p id="tip-d" className="text-[14px]">{t(`${consejo}.d`)}</p>
      <div className="flex items-center gap-2">
        <button className="min-h-11 px-2 text-[15px] font-bold text-(--color-muted) underline" onClick={() => { omitirTutorial(); setConsejo(null); }}>{t("tour.omitir")}</button>
        <span className="flex-1" />
        <button className={`${BTN} border-(--color-brand) bg-(--color-brand) text-white`} onClick={() => setConsejo(null)}>{t("tour.entendido")}</button>
      </div>
    </div>
  );
}
