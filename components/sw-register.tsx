"use client";

import { useEffect } from "react";
import { iniciarPwa } from "@/lib/pwa";

/** Inicia la PWA: service worker (solo en producción), captura de «instalar» y avisos de nueva versión. */
export function SwRegister() {
  useEffect(() => { iniciarPwa(); }, []);
  return null;
}
