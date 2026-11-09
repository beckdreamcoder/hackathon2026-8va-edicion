"use client";

import { usePrefs, type IdiomaId } from "@/lib/preferencias";
import { es } from "./es";
import { en } from "./en";
import { qu } from "./qu";

/**
 * Internacionalización central. Las pantallas nuevas (Configuración, tutorial) usan `t(clave)`;
 * el resto de la interfaz se traduce con `frases` (lib/i18n/frases-en.ts) mediante el traductor de componentes/traductor.tsx.
 * Para añadir un idioma: crear su diccionario, registrarlo aquí y sumarlo a IDIOMAS_DISPONIBLES (solo con traducción revisada).
 */
export const DICCIONARIOS: Record<IdiomaId, Record<string, string>> = { es, en, qu };

export type InfoIdioma = { id: IdiomaId; nombre: string; disponible: boolean };
export const IDIOMAS: InfoIdioma[] = [
  { id: "es", nombre: "Español (Perú)", disponible: true },
  { id: "en", nombre: "English", disponible: true },
  { id: "qu", nombre: "Runasimi (quechua)", disponible: false },
];

export function traducir(clave: string, idioma: IdiomaId, vars?: Record<string, string | number>): string {
  let s = DICCIONARIOS[idioma]?.[clave] ?? es[clave] ?? clave;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

/** Hook: devuelve `t`, el idioma actual. */
export function useT() {
  const { idioma } = usePrefs();
  return { t: (clave: string, vars?: Record<string, string | number>) => traducir(clave, idioma, vars), idioma };
}
