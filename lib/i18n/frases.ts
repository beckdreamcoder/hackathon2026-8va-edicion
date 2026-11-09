import type { IdiomaId } from "@/lib/preferencias";
import { FRASES_EN } from "./frases-en";

/** Tablas «frase en español → frase traducida» para la interfaz. Español es el original (sin tabla). */
export const FRASES: Partial<Record<IdiomaId, Record<string, string>>> = { en: FRASES_EN };
