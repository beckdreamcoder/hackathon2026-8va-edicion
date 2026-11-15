"use client";

import { getDemo, setDemo, useDemoState } from "./store";

/**
 * Guía de bienvenida: se muestra una sola vez, al primer ingreso a inicio.
 * "pendiente" = aún no se vio; "completado" o "omitido" = ya no vuelve a aparecer.
 */
export type EstadoTutorial = { estado: "pendiente" | "completado" | "omitido" };
export const TUTORIAL_INICIAL: EstadoTutorial = { estado: "pendiente" };
const CLAVE = "guia-inicio";

export const useTutorial = () => useDemoState(CLAVE, TUTORIAL_INICIAL);
export const estadoTutorial = () => getDemo(CLAVE, TUTORIAL_INICIAL).estado;

/** Vuelve a mostrar la guía (Configuración → Repetir tutorial). */
export const iniciarTutorial = () => setDemo(CLAVE, TUTORIAL_INICIAL, { estado: "pendiente" });

/** Cierra la guía: "completado" si llegó al final, "omitido" si la saltó. */
export const terminarTutorial = (estado: "completado" | "omitido") => setDemo(CLAVE, TUTORIAL_INICIAL, { estado });
