"use client";

import { useEffect } from "react";
import { usePrefs, aplicarAlDocumento } from "@/lib/preferencias";
import { iniciarTraductor, detenerTraductor } from "@/lib/i18n/traductor";
import { FRASES } from "@/lib/i18n/frases";

/** ¿Ya terminó React de hidratar el HTML del servidor? (los nodos hidratados tienen su fibra asociada) */
function hidratada() {
  const raiz = document.querySelector("[data-app-raiz]");
  if (!raiz) return false;
  const els = raiz.querySelectorAll("*");
  const ok = (el: Element | undefined) => !!el && Object.keys(el).some((k) => k.startsWith("__reactFiber$"));
  return els.length > 0 && ok(els[0]) && ok(els[els.length - 1]);
}

const avisarListo = () => {
  (window as unknown as { __bcI18nListo?: boolean }).__bcI18nListo = true;
  window.dispatchEvent(new Event("bc-i18n-listo"));
};

/** Aplica el tema (incluido «automático», que sigue al sistema) y el idioma elegidos. No pinta nada. */
export function Personalizacion() {
  const prefs = usePrefs();

  useEffect(() => {
    aplicarAlDocumento(prefs);
    if (prefs.tema !== "auto") return undefined;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const alCambiar = () => aplicarAlDocumento(prefs);
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, [prefs]);

  // El traductor modifica el DOM, así que espera a que React termine de hidratar para no provocar diferencias SSR/cliente
  useEffect(() => {
    const frases = FRASES[prefs.idioma];
    if (!frases) { detenerTraductor(); avisarListo(); return undefined; }
    let vivo = true;
    let t: ReturnType<typeof setTimeout>;
    const esperar = (n: number) => {
      if (!vivo) return;
      if (hidratada() || n > 80) { iniciarTraductor(frases); avisarListo(); }
      else t = setTimeout(() => esperar(n + 1), 50);
    };
    esperar(0);
    return () => { vivo = false; clearTimeout(t); detenerTraductor(); };
  }, [prefs.idioma]);

  return null;
}
