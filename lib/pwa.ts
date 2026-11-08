"use client";

import { useSyncExternalStore } from "react";

/**
 * Estado PWA: service worker (solo en producción), instalación y actualizaciones de versión.
 * El navegador decide si ofrece instalar; no se promete nada que no admita.
 */
type EventoInstalar = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
export type EstadoPwa = { sw: "pendiente" | "activo" | "desarrollo" | "no_soportado" | "error"; puedeInstalar: boolean; instalada: boolean; actualizacionLista: boolean };

let estado: EstadoPwa = { sw: "pendiente", puedeInstalar: false, instalada: false, actualizacionLista: false };
const escuchas = new Set<() => void>();
const cambiar = (p: Partial<EstadoPwa>) => { estado = { ...estado, ...p }; escuchas.forEach((l) => l()); };
let eventoInstalar: EventoInstalar | null = null;
let esperando: ServiceWorker | null = null;
let recargando = false;
let iniciada = false;

const standalone = () => window.matchMedia?.("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;

export function iniciarPwa() {
  if (iniciada || typeof window === "undefined") return;
  iniciada = true;
  cambiar({ instalada: standalone() });
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); eventoInstalar = e as EventoInstalar; cambiar({ puedeInstalar: true }); });
  window.addEventListener("appinstalled", () => { eventoInstalar = null; cambiar({ puedeInstalar: false, instalada: true }); });

  if (!("serviceWorker" in navigator)) { cambiar({ sw: "no_soportado" }); return; }
  if (process.env.NODE_ENV !== "production") { cambiar({ sw: "desarrollo" }); return; } // en desarrollo no se instala para no ocultar cambios
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (recargando) window.location.reload(); });
  navigator.serviceWorker.register("/sw.js").then((reg) => {
    cambiar({ sw: "activo" });
    const marcar = (w: ServiceWorker | null) => { if (w && navigator.serviceWorker.controller) { esperando = w; cambiar({ actualizacionLista: true }); } };
    marcar(reg.waiting);
    reg.addEventListener("updatefound", () => {
      const nuevo = reg.installing;
      nuevo?.addEventListener("statechange", () => { if (nuevo.state === "installed") marcar(nuevo); });
    });
    // Busca versiones nuevas al volver a la app
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") reg.update().catch(() => {}); });
  }).catch(() => cambiar({ sw: "error" }));
}

/** Activa la versión nueva del service worker y recarga la app. */
export function aplicarActualizacion() {
  if (!esperando) return;
  recargando = true;
  esperando.postMessage({ type: "SKIP_WAITING" });
}

export async function instalarApp(): Promise<"aceptada" | "rechazada" | "no_disponible"> {
  if (!eventoInstalar) return "no_disponible";
  await eventoInstalar.prompt();
  const r = await eventoInstalar.userChoice;
  eventoInstalar = null;
  cambiar({ puedeInstalar: false });
  return r.outcome === "accepted" ? "aceptada" : "rechazada";
}

export function usePwa() {
  return useSyncExternalStore((l) => { escuchas.add(l); return () => { escuchas.delete(l); }; }, () => estado, () => estado);
}
