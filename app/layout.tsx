import type { Metadata, Viewport } from "next";
import "./globals.css";

// Cada pantalla del diseño trae su propia navegación inferior (.nav),
// por eso el layout ya no monta el BottomNav global.
export const metadata: Metadata = {
  title: "BarrioConecta",
  description: "Un Perú más cercano. Conecta, ayuda, comparte.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c8102e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
