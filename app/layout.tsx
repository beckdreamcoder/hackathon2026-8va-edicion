import type { Metadata, Viewport } from "next";
import "tailwindcss/index.css";
import { SwRegister } from "@/components/sw-register";
import { HScroll } from "@/components/h-scroll";
import { Hidratacion } from "@/components/hidratacion";
import { Conexion } from "@/components/conexion";

export const metadata: Metadata = {
  title: "BarrioConecta",
  applicationName: "BarrioConecta",
  appleWebApp: { capable: true, title: "BarrioConecta", statusBarStyle: "default" },
  icons: { icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }], apple: "/icons/apple-touch-icon.png" },
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
      suppressHydrationWarning
      className="[--color-brand:#c8102e] [--color-canvas:#fbf8f3] [--color-ink:#202124] [--color-line:#e3ddd7] [--color-muted:#5e6268]"
    >
      <head>
        <style>{`*{scrollbar-width:none;-ms-overflow-style:none}*::-webkit-scrollbar{display:none;width:0;height:0}nav[aria-label="Principal"]{max-width:26rem;margin-inline:auto}`}</style>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
        />
      </head>
      <body className="bg-(--color-canvas) font-sans text-[17px] leading-normal text-(--color-ink) [&_:where(h1,h2,h3)]:font-bold [&_:where(h1,h2,h3)]:tracking-[-.01em] [&_:where(:focus-visible)]:outline-3 [&_:where(:focus-visible)]:outline-offset-2 [&_:where(:focus-visible)]:outline-(--color-brand)">
        <Hidratacion>
          {children}
          <Conexion />
        </Hidratacion>
        <SwRegister />
        <HScroll />
      </body>
    </html>
  );
}
