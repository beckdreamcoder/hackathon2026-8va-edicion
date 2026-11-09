"use client";

import { useSyncExternalStore } from "react";

/**
 * Preferencias de apariencia e idioma. Se guardan en localStorage (clave `bc-prefs`) y no en IndexedDB porque
 * un script mínimo en <head> las lee de forma síncrona antes de pintar, evitando el parpadeo de tema.
 * Son datos pequeños y no personales. El servidor y la primera pintura del cliente usan siempre los valores
 * por defecto (claro/automático, español) y la preferencia se aplica justo después de hidratar: sin diferencias SSR/cliente.
 */
export type Tema = "claro" | "oscuro" | "auto";
export type IdiomaId = "es" | "en" | "qu";
export type Prefs = { tema: Tema; idioma: IdiomaId };

export const CLAVE_PREFS = "bc-prefs";
const POR_DEFECTO: Prefs = { tema: "auto", idioma: "es" };
/** Idiomas con traducción revisada. Quechua (qu) está preparado en la arquitectura, pero aún no se ofrece. */
export const IDIOMAS_DISPONIBLES: IdiomaId[] = ["es", "en"];

let prefs: Prefs = POR_DEFECTO;
let leidas = false;
const escuchas = new Set<() => void>();

function leer() {
  if (leidas || typeof window === "undefined") return;
  leidas = true;
  try {
    const p = JSON.parse(window.localStorage.getItem(CLAVE_PREFS) || "{}");
    prefs = {
      tema: p.tema === "claro" || p.tema === "oscuro" ? p.tema : "auto",
      idioma: IDIOMAS_DISPONIBLES.includes(p.idioma) ? p.idioma : "es",
    };
  } catch { /* sin acceso: valores por defecto */ }
}

export function getPrefs(): Prefs { leer(); return prefs; }

export function setPrefs(parche: Partial<Prefs>) {
  leer();
  prefs = { ...prefs, ...parche };
  try { window.localStorage.setItem(CLAVE_PREFS, JSON.stringify(prefs)); } catch { /* solo en esta sesión */ }
  escuchas.forEach((l) => l());
}

function suscribir(l: () => void) {
  escuchas.add(l);
  const alt = (e: StorageEvent) => { if (e.key === CLAVE_PREFS) { leidas = false; leer(); l(); } };
  window.addEventListener("storage", alt);
  return () => { escuchas.delete(l); window.removeEventListener("storage", alt); };
}

export function usePrefs(): Prefs {
  return useSyncExternalStore(suscribir, getPrefs, () => POR_DEFECTO);
}

/** ¿El tema efectivo es oscuro? (resuelve «auto» con la preferencia del sistema) */
export function esOscuro(tema: Tema): boolean {
  return tema === "oscuro" || (tema === "auto" && typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
}

/** Aplica tema e idioma al documento. */
export function aplicarAlDocumento(p: Prefs) {
  const r = document.documentElement;
  const oscuro = esOscuro(p.tema);
  r.dataset.theme = oscuro ? "dark" : "light";
  r.style.colorScheme = oscuro ? "dark" : "light";
  r.lang = p.idioma === "en" ? "en" : p.idioma === "qu" ? "qu" : "es-PE";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", oscuro ? "#1c1917" : "#c8102e");
}

/** Script que se ejecuta antes de pintar (inline en <head>) para evitar el parpadeo de tema. */
export const SCRIPT_TEMA = `(function(){try{var p=JSON.parse(localStorage.getItem('${CLAVE_PREFS}')||'{}');var o=p.tema==='oscuro'||(p.tema!=='claro'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.dataset.theme=o?'dark':'light';r.style.colorScheme=o?'dark':'light';r.lang=p.idioma==='en'?'en':'es-PE';}catch(e){}})();`;
