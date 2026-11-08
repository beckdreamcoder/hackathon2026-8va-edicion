"use client";

import { useSyncExternalStore } from "react";
import { getDemo } from "./store";
import { SESION_INICIAL, useSesion } from "./shared";

/** Conexión real del dispositivo (eventos online/offline del navegador). */
const suscribir = (l: () => void) => {
  window.addEventListener("online", l);
  window.addEventListener("offline", l);
  return () => { window.removeEventListener("online", l); window.removeEventListener("offline", l); };
};
export function useEnLinea() {
  return useSyncExternalStore(suscribir, () => navigator.onLine, () => true);
}

/** Sin conexión real o simulada desde la consola/Offline (senal «Sin datos»). */
export function useSinConexion() {
  const enLinea = useEnLinea();
  const [sesion] = useSesion();
  return !enLinea || sesion.senal === "Sin datos";
}

export const sinConexionReal = () => typeof navigator !== "undefined" && navigator.onLine === false;
/** Para manejadores de eventos fuera de React. */
export const sinConexionAhora = () => sinConexionReal() || getDemo("sesion", SESION_INICIAL).senal === "Sin datos";
