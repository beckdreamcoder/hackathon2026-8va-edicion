import type { Metadata, Viewport } from "next";
import "tailwindcss/index.css";

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
    <html
      lang="es-PE"
      className="[--color-brand:#c8102e] [--color-canvas:#fbf8f3] [--color-ink:#202124] [--color-line:#e3ddd7] [--color-muted:#5e6268]"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
        />
      </head>
      <body className="bg-(--color-canvas) font-sans text-[17px] leading-normal text-(--color-ink) [&_:where(h1,h2,h3)]:font-bold [&_:where(h1,h2,h3)]:tracking-[-.01em] [&_:where(:focus-visible)]:outline-3 [&_:where(:focus-visible)]:outline-offset-2 [&_:where(:focus-visible)]:outline-(--color-brand)">
        {children}
      </body>
    </html>
  );
}
