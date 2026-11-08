"use client";

import { useEffect, useState, type ReactNode } from "react";
import { hidratar } from "@/lib/demo/store";

/**
 * Espera a que los datos locales (IndexedDB) estén cargados antes de mostrar la app.
 * Así ninguna pantalla escribe un valor inicial encima de datos ya guardados.
 */
export function Hidratacion({ children }: { children: ReactNode }) {
  const [listo, setListo] = useState(false);
  useEffect(() => {
    let vivo = true;
    hidratar().finally(() => { if (vivo) setListo(true); });
    return () => { vivo = false; };
  }, []);
  if (!listo) return <div role="status" aria-live="polite" className="min-h-dvh grid place-items-center text-(--color-muted) text-[15px]">Cargando tus datos…</div>;
  return <>{children}</>;
}
