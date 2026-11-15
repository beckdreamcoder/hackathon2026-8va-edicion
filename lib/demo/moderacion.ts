"use client";

/**
 * Reglas locales para la sugerencia automática de Publicar (sin modelo de IA ni servicios externos).
 * 1) Clasifica la categoría por palabras clave.
 * 2) Revisa que el texto no tenga lenguaje ofensivo o sexual.
 * En producción esta revisión también debe hacerse en el servidor.
 */

/** Palabras clave por categoría de cachuelo. Se comparan contra el inicio de cada palabra. */
export const PALABRAS_CACHUELO: Record<string, string[]> = {
  "Reparación de computadoras": ["laptop", "pc", "computador", "formate", "software", "windows", "teclado", "impresora", "celular"],
  "Pintura de viviendas": ["pint", "brocha", "rodillo", "resan"],
  "Instalación eléctrica": ["electric", "cable", "enchufe", "tomacorriente", "foco", "breaker", "interruptor", "luz"],
  Gasfitería: ["fuga", "gasfit", "caño", "grifo", "desague", "tuberia", "inodoro", "lavatorio"],
  "Mudanzas pequeñas": ["mudanza", "mudar", "flete", "acarreo", "cargar"],
  Limpieza: ["limpi", "lavar", "aseo", "desinfect"],
  "Reparación de electrodomésticos": ["lavadora", "refrigerador", "microondas", "electrodomest", "plancha"],
  "Apoyo con entregas": ["entrega", "delivery", "recoger", "encargo", "mandado"],
};

/** Palabras clave por categoría de favor. */
export const PALABRAS_FAVOR: Record<string, string[]> = {
  Herramientas: ["escalera", "herramient", "taladro", "prest", "martillo", "destornillador", "carretilla"],
  Habilidades: ["ensen", "clase", "tramite", "aprend", "idioma", "whatsapp", "computacion"],
  "Ayuda temporal": ["cuidar", "cuidado", "compra", "acompan", "mascota", "temporal"],
  Movilidad: ["hospital", "llevar", "traslado", "viaje", "carro", "pasaje"],
};

/** Stems de lenguaje ofensivo o sexual (en minúsculas, sin tildes). */
const BLOQUEADAS = [
  "puta", "puto", "mierda", "pendej", "verga", "culer", "culo", "cabron", "imbecil", "idiota",
  "porno", "sexo", "sexu", "desnud", "tetas", "chupa", "zorra", "maric", "hijueput", "conchatu", "nude",
];

const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s" };

/** Normaliza: minúsculas, sin tildes, sin signos que separan letras y sin letras repetidas. */
function normalizar(texto: string): string[] {
  let s = texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  s = s.replace(/[.\-_*'"]/g, "");
  s = s.replace(/[013457@$]/g, (c) => LEET[c]);
  s = s.replace(/[^a-zñ ]/g, " ").replace(/ñ/g, "n");
  s = s.replace(/([a-z])\1{2,}/g, "$1");
  return s.split(/\s+/).filter(Boolean);
}

/** Devuelve null si el texto está bien, o un mensaje neutral si contiene lenguaje no permitido. */
export function revisarTexto(texto: string): string | null {
  const tokens = normalizar(texto);
  const bloqueada = tokens.some((t) => BLOQUEADAS.some((b) => t.startsWith(b)));
  return bloqueada ? "Tu publicación contiene lenguaje no permitido. Revísala e inténtalo de nuevo." : null;
}

/** Elige la categoría con más palabras clave; si ninguna coincide, devuelve "Otros". */
export function clasificar(texto: string, tabla: Record<string, string[]>): string {
  const tokens = normalizar(texto);
  let mejor = "Otros";
  let puntos = 0;
  for (const [categoria, claves] of Object.entries(tabla)) {
    const n = tokens.filter((t) => claves.some((k) => t.startsWith(k))).length;
    if (n > puntos) { puntos = n; mejor = categoria; }
  }
  return mejor;
}
