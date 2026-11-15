"use client";

import { getDemo, setDemo, useDemoState } from "./store";

/**
 * Consejos por pantalla: cada pantalla muestra su consejo solo la primera vez que se entra a ella.
 * `vistas` guarda las rutas ya vistas; `estado` "omitido" apaga todos los consejos.
 */
export type EstadoTutorial = { estado: "pendiente" | "completado" | "omitido"; vistas: string[] };
export const TUTORIAL_INICIAL: EstadoTutorial = { estado: "pendiente", vistas: [] };
// Clave nueva ("consejos"): el estado del tutorial anterior no se arrastra a los consejos por pantalla.
const CLAVE = "consejos";
export const useTutorial = () => useDemoState(CLAVE, TUTORIAL_INICIAL);

/** Vuelve a mostrar los consejos desde el principio (Configuración → Repetir tutorial). */
export const iniciarTutorial = () => setDemo(CLAVE, TUTORIAL_INICIAL, { estado: "pendiente", vistas: [] });
export const estadoTutorial = () => getDemo(CLAVE, TUTORIAL_INICIAL).estado;

/** true si la pantalla aún no tiene su consejo visto y no se omitieron los consejos. */
export const consejoPendiente = (ruta: string) => {
  const st = getDemo(CLAVE, TUTORIAL_INICIAL);
  return st.estado !== "omitido" && !st.vistas.includes(ruta);
};
export const marcarVista = (ruta: string) => {
  const st = getDemo(CLAVE, TUTORIAL_INICIAL);
  if (!st.vistas.includes(ruta)) setDemo(CLAVE, TUTORIAL_INICIAL, { vistas: [...st.vistas, ruta] });
};
export const omitirTutorial = () => setDemo(CLAVE, TUTORIAL_INICIAL, { estado: "omitido" });
