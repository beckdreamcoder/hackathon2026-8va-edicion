"use client";

import { useEffect, useState, type ReactNode } from "react";
import { hidratar } from "@/lib/demo/store";

/** Espera (con tope) a que el traductor haya hecho su primera pasada, para no mostrar un instante el texto en español. */
const esperarIdioma = () => new Promise<void>((res) => {
  if ((window as unknown as { __bcI18nListo?: boolean }).__bcI18nListo) { res(); return; }
  window.addEventListener("bc-i18n-listo", () => res(), { once: true });
  setTimeout(res, 4000);
});

/**
 * Las pantallas se renderizan siempre (también en el servidor, para que la navegación sea instantánea), pero quedan
 * tapadas e inertes hasta que los datos locales (IndexedDB) están cargados. Mientras tanto, lo que escriban en el
 * almacén es temporal y se descarta al hidratar (ver `write` en lib/demo/store.ts): así ninguna pantalla pisa datos guardados.
 */
export function Hidratacion({ children }: { children: ReactNode }) {
  const [listo, setListo] = useState(false);
  useEffect(() => {
    let vivo = true;
    Promise.all([hidratar(), esperarIdioma()]).finally(() => { if (vivo) setListo(true); });
    return () => { vivo = false; };
  }, []);
  return (
    <>
      {!listo && (
        <div role="status" aria-live="polite" className="fixed inset-0 z-70 grid place-items-center bg-(--color-canvas) text-(--color-muted) text-[15px]">
          Cargando tus datos…
        </div>
      )}
      <div data-app-raiz="" style={{ display: "contents" }} inert={!listo}>{children}</div>
    </>
  );
}
