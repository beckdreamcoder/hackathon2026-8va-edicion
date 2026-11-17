"use client";

import { getDemo, setDemo, useDemoState } from "./store";

/** Estado del tutorial interactivo (se guarda con el resto de datos locales). */
export type EstadoTutorial = { estado: "pendiente" | "completado" | "omitido"; activo: boolean; paso: number };
export const TUTORIAL_INICIAL: EstadoTutorial = { estado: "pendiente", activo: false, paso: 0 };
export const useTutorial = () => useDemoState("tutorial", TUTORIAL_INICIAL);

export const iniciarTutorial = () => setDemo("tutorial", TUTORIAL_INICIAL, { activo: true, paso: 0 });
export const estadoTutorial = () => getDemo("tutorial", TUTORIAL_INICIAL).estado;
