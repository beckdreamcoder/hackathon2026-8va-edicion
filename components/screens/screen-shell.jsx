"use client";

import { screenStyles } from "./screen-styles";

const back = (
  <svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
);

/** Marco común de pantalla: cabecera con volver, contenido desplazable y barra inferior. */
export function ScreenShell({ title, onBack, children, active }) {
  const cls = (k) => (active === k ? "text-(--color-brand)! font-bold" : "");
  return (
    <div className={screenStyles.screen}>
      <div className={screenStyles.frame}>
        <div className={screenStyles.header}>
          <button className={screenStyles.iconButton} aria-label="Volver" onClick={onBack}>{back}</button>
          <h1>{title}</h1>
        </div>
        <div className={screenStyles.content}>{children}</div>
        <nav className={screenStyles.navigation} aria-label="Principal">
          <a className={cls("inicio")} href="/inicio"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
          <a className={cls("mapa")} href="/mapa"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
          <a className={cls("perfil")} href="/perfil"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
        </nav>
      </div>
    </div>
  );
}
