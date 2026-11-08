"use client";

/** Rutas que se guardan para abrir la zona sin conexión real. */
export const RUTAS_OFFLINE = ["/", "/inicio", "/mapa", "/emergencias", "/offline", "/comunidad", "/noticias", "/perfil"];

/**
 * Pide al service worker que guarde las rutas de la zona en Cache Storage
 * y solicita almacenamiento persistente cuando el navegador lo permite.
 */
export async function precacheZona() {
  try {
    await navigator.storage?.persist?.();
  } catch {
    /* no compatible */
  }
  const sw = navigator.serviceWorker?.controller;
  if (sw) sw.postMessage({ type: "precache", urls: RUTAS_OFFLINE });
}

export async function estimarEspacio() {
  try {
    const e = await navigator.storage?.estimate?.();
    if (!e) return null;
    return { usadoMb: Math.round((e.usage ?? 0) / 1e6), libreMb: Math.round(((e.quota ?? 0) - (e.usage ?? 0)) / 1e6) };
  } catch {
    return null;
  }
}
