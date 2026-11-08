import type { MetadataRoute } from "next";

/** Manifiesto PWA de BarrioConecta (se sirve en /manifest.webmanifest). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/inicio",
    name: "BarrioConecta",
    short_name: "BarrioConecta",
    description: "Un Perú más cercano. Conecta, ayuda, comparte: favores, cachuelos, movilidad y apoyo entre vecinos.",
    start_url: "/inicio",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fbf8f3",
    theme_color: "#c8102e",
    lang: "es-PE",
    categories: ["social", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Emergencias", short_name: "Emergencias", url: "/emergencias" },
      { name: "Mis coordinaciones", short_name: "Coordinaciones", url: "/coordinaciones" },
      { name: "Buscar", short_name: "Buscar", url: "/buscar" },
    ],
  };
}
