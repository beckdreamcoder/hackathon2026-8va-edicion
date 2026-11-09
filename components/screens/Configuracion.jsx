"use client";

import { useRouter } from "next/navigation";
import { usePrefs, setPrefs } from "@/lib/preferencias";
import { useT, IDIOMAS } from "@/lib/i18n";
import { useTutorial, iniciarTutorial } from "@/lib/demo/tutorial";
import { useEstadoAlmacen } from "@/lib/demo/store";
import { screenStyles } from "./screen-styles";

const TEMAS = [["claro", "tema.claro"], ["oscuro", "tema.oscuro"], ["auto", "tema.auto"]];
const VERSION = "1.0 (demostración)";

/** Configuración: apariencia, idioma, ayuda (tutorial) e información de la aplicación. */
export default function Configuracion() {
  const router = useRouter();
  const { t } = useT();
  const prefs = usePrefs();
  const [tut] = useTutorial();
  const almacen = useEstadoAlmacen();
  const estadoTut = tut.estado === "completado" ? "cfg.tutorial.completado" : tut.estado === "omitido" ? "cfg.tutorial.omitido" : "cfg.tutorial.pendiente";

  return (
    <div className={screenStyles.screen}>
      <div className={screenStyles.frame}>
        <div className={screenStyles.header}>
          <button className={screenStyles.iconButton} aria-label={t("cfg.volver")} onClick={() => router.push("/perfil")}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
          <h1>{t("cfg.titulo")}</h1>
        </div>
        <div className={screenStyles.content}>
          <section className={screenStyles.card} aria-labelledby="cfg-ap" data-tour="apariencia">
            <h2 id="cfg-ap" className="text-[18px]">{t("cfg.apariencia")}</h2>
            <p className={screenStyles.muted}>{t("cfg.apariencia.desc")}</p>
            <div className={screenStyles.wrap} role="radiogroup" aria-labelledby="cfg-ap">
              {TEMAS.map(([id, clave]) => (
                <button key={id} role="radio" aria-checked={prefs.tema === id} className={prefs.tema === id ? screenStyles.chipActive : screenStyles.chip} onClick={() => setPrefs({ tema: id })}>{t(clave)}</button>
              ))}
            </div>
          </section>

          <section className={screenStyles.card} aria-labelledby="cfg-id">
            <h2 id="cfg-id" className="text-[18px]">{t("cfg.idioma")}</h2>
            <p className={screenStyles.muted}>{t("cfg.idioma.desc")}</p>
            <div className={screenStyles.wrap} role="radiogroup" aria-labelledby="cfg-id">
              {IDIOMAS.filter((i) => i.disponible).map((i) => (
                <button key={i.id} role="radio" aria-checked={prefs.idioma === i.id} lang={i.id} className={prefs.idioma === i.id ? screenStyles.chipActive : screenStyles.chip} onClick={() => setPrefs({ idioma: i.id })}>{i.nombre}</button>
              ))}
            </div>
            <p className={screenStyles.muted}>{t("cfg.idioma.qu")}</p>
          </section>

          <section className={screenStyles.card} aria-labelledby="cfg-ay">
            <h2 id="cfg-ay" className="text-[18px]">{t("cfg.ayuda")}</h2>
            <p className={screenStyles.muted}>{t("cfg.ayuda.desc")}</p>
            <p className={screenStyles.muted}>{t("cfg.tutorial.estado")}: <b>{t(estadoTut)}</b></p>
            <button className={screenStyles.button} onClick={iniciarTutorial}>{tut.estado === "pendiente" ? t("cfg.tutorial.iniciar") : t("cfg.tutorial.repetir")}</button>
          </section>

          <section className={screenStyles.card} aria-labelledby="cfg-in">
            <h2 id="cfg-in" className="text-[18px]">{t("cfg.info")}</h2>
            <p className={screenStyles.muted}><b>BarrioConecta</b> · {t("cfg.info.version")} {VERSION}</p>
            <p className={screenStyles.muted}><b>{t("cfg.info.modo")}:</b> {t("cfg.info.modo.valor")}</p>
            <p className={screenStyles.muted}><b>{t("cfg.info.almacen")}:</b> {almacen.motor === "indexeddb" ? t("cfg.info.almacen.valor") : "localStorage"}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
