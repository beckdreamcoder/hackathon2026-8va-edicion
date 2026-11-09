"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useCheckbox } from "@/lib/hooks/use-checkbox";
import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment, useState } from "react";
import { useSesion, chip, logEvento } from "@/lib/demo/shared";
import { usePublicaciones, LIMITE_CACHUELOS } from "@/lib/demo/publicaciones";

const TIPOS = [{id: "favor", name: "Favor gratuito", sub: "Préstamos, habilidades, ayuda temporal y movilidad", tag: "Gratis", tagCls: screenStyles.badgeFavor}, {id: "cachuelo", name: "Cachuelo", sub: "Trabajo o servicio remunerado", tag: "Con precio", tagCls: screenStyles.badgeCachuelo}, {id: "emergencia", name: "Emergencia", sub: "Reporte con cámara y ubicación", tag: "Urgente", tagCls: screenStyles.badgeEmergency}, {id: "campana", name: "Campaña de apoyo", sub: "Causas solidarias con responsable y plazo", tag: "Solidaridad", tagCls: screenStyles.badgeSolidarity}];
const TIPO_ON = "flex items-center gap-3.5 min-h-19 rounded-[20px] border-2 border-(--color-brand) bg-[#fff5f6] px-3.5 py-3 text-left w-full [&_.ic]:w-8.5 [&_.ic]:h-8.5 [&_.ic]:text-(--color-brand) [&_b]:block [&_b]:text-[18px] on";
const TIPO_OFF = "flex items-center gap-3.5 min-h-19 rounded-[20px] border-2 border-(--color-line) bg-white px-3.5 py-3 text-left w-full [&_.ic]:w-8.5 [&_.ic]:h-8.5 [&_.ic]:text-(--color-brand) [&_b]:block [&_b]:text-[18px]";
const CATS = ["Herramientas", "Habilidades", "Ayuda temporal", "Movilidad"];
const DISTRITOS = ["San Juan de Lurigancho", "Jicamarca Anexo 22", "El Agustino", "Cercado de Lima", "San Borja", "Ate", "Santa Anita", "La Victoria", "Rímac", "Otro distrito de Lima"];
const CACH_CATS = ["Reparación de computadoras", "Pintura de viviendas", "Instalación eléctrica", "Gasfitería", "Mudanzas pequeñas", "Limpieza", "Reparación de electrodomésticos", "Apoyo con entregas", "Otros"];
const FORMAS = ["Bienes", "Dinero", "Compra solidaria", "Tiempo", "Logística"];
/** Reglas de la sugerencia automática (sin modelo de IA). */
const SUGERENCIAS = [
  [["escalera", "taladro", "herramienta", "martillo", "carretilla", "prest"], "Herramientas"],
  [["enseñ", "clase", "whatsapp", "trámite", "tramite", "celular"], "Habilidades"],
  [["llevar", "traslado", "hospital", "carro", "movilidad"], "Movilidad"],
  [["cuidar", "acompañ", "ayuda", "recoger", "compras"], "Ayuda temporal"],
  [["fuga", "gasfit", "caño", "grifo"], "Gasfitería"],
  [["pintar", "pintura"], "Pintura"],
  [["abrigo", "colecta", "víveres", "alimentos", "pollada"], "Campaña solidaria"],
];
import { screenStyles } from "./screen-styles";

/**
 * Pantalla Publicar del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Publicar() {
  const nav = useViewStack("tipo");
  const responsable = useTextInput("");
  const plazo = useTextInput("");
  const desc = useTextInput("");
  const title = useTextInput("");
  const precio = useTextInput("");
  const benef = useCheckbox(false);
  const sinRed = useCheckbox(false);
  const [sesion] = useSesion();
  const [pubs, setPubs] = usePublicaciones();
  const [tipo, setTipo] = useState("favor");
  const [modo, setModo] = useState("pido");
  const [cat, setCat] = useState("Herramientas");
  const [catCach, setCatCach] = useState("Otros");
  const [distrito, setDistrito] = useState("San Juan de Lurigancho");
  const meta = useTextInput("100");
  const [inicio, setInicio] = useState("");
  const [imagen, setImagen] = useState("");
  const [imgMsg, setImgMsg] = useState("");
  /** Reduce la imagen a 640 px y la guarda como data URL (almacenamiento local, sin subir a ningún servidor). */
  const elegirImagen = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { setImgMsg("Elige un archivo de imagen."); return; }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 640 / Math.max(img.width, img.height));
      const cv = document.createElement("canvas");
      cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
      cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
      setImagen(cv.toDataURL("image/jpeg", 0.72)); setImgMsg("Imagen lista (se guarda solo en este dispositivo)."); URL.revokeObjectURL(url);
    };
    img.onerror = () => { setImgMsg("No se pudo leer la imagen."); URL.revokeObjectURL(url); };
    img.src = url;
  };
  const [disp, setDisp] = useState("Hoy");
  const [forma, setForma] = useState(["Bienes"]);
  const [alcance, setAlcance] = useState("junta");
  const [catSug, setCatSug] = useState("Otros");
  const [hasSug, setHasSug] = useState(false);
  const [falta, setFalta] = useState(false);
  const [faltaMsg, setFaltaMsg] = useState("");
  const [limite, setLimite] = useState(false);
  const [listo, setListo] = useState(null); // null | "publicado" | "pendiente"

  const esFavor = tipo === "favor";
  const esCach = tipo === "cachuelo";
  const esEmerg = tipo === "emergencia";
  const esCamp = tipo === "campana";
  const noEmerg = !esEmerg;
  const esMov = esFavor && cat === "Movilidad";
  const tipos = TIPOS.map((t) => ({ ...t, cls: t.id === tipo ? TIPO_ON : TIPO_OFF, pick: () => setTipo(t.id) }));
  const chipPido = chip(modo === "pido");
  const chipOfrezco = chip(modo === "ofrezco");
  const setPido = () => setModo("pido");
  const setOfrezco = () => setModo("ofrezco");
  const cats = CATS.map((c) => ({ name: c, cls: chip(c === cat), pick: () => setCat(c) }));
  const formas = FORMAS.map((f) => ({ name: f, cls: chip(forma.includes(f)), pick: () => setForma((x) => (x.includes(f) ? x.filter((y) => y !== f) : [...x, f])) }));
  const alJunta = chip(alcance === "junta");
  const alCom = chip(alcance === "comunidad");
  const setJunta = () => setAlcance("junta");
  const setCom = () => setAlcance("comunidad");

  const tipoNombre = esMov ? `Movilidad solidaria · ${modo === "pido" ? "Necesito un traslado" : "Puedo llevar a alguien"}` : esFavor ? `Favor gratuito · ${modo === "pido" ? "Necesito ayuda" : "Ofrezco ayuda"}` : esCach ? `Cachuelo · ${modo === "pido" ? "Necesito un servicio" : "Ofrezco mi servicio"}` : "Campaña de apoyo";
  const placeholder = esFavor ? "Ejemplo: necesito una escalera prestada para el sábado" : esCach ? "Ejemplo: necesito arreglar una fuga en el baño" : "Ejemplo: colecta de abrigo para familias de la parte alta";

  const suggest = () => {
    const text = desc.value.trim();
    if (!text) { setFalta(true); setFaltaMsg("Escribe primero una descripción para sugerirte un título."); return; }
    const low = text.toLowerCase();
    const hit = SUGERENCIAS.find(([words]) => words.some((w) => low.includes(w)));
    const c = hit ? hit[1] : "Otros";
    setCatSug(c);
    if (esFavor && CATS.includes(c)) setCat(c);
    const words = text.replace(/\s+/g, " ").split(" ").slice(0, 8).join(" ");
    title.setValue(words.charAt(0).toUpperCase() + words.slice(1));
    setHasSug(true);
    setFalta(false);
  };

  const next = () => {
    if (desc.value.trim().length < 8) { setFalta(true); setFaltaMsg("Cuéntanos en pocas palabras qué necesitas u ofreces."); return; }
    if (esCamp && (!responsable.value.trim() || !plazo.value.trim() || forma.length === 0)) { setFalta(true); setFaltaMsg("Completa responsable, plazo y al menos una forma de apoyo."); return; }
    if (esCach && !precio.value.trim()) { setFalta(true); setFaltaMsg("Indica el pago referencial en soles o «A convenir»."); return; }
    if (esCamp && !(Number(meta.value) >= 1)) { setFalta(true); setFaltaMsg("Indica la meta de la campaña (al menos 1 unidad)."); return; }
    if (esCamp && !benef.checked) { setFalta(true); setFaltaMsg("Confirma que la persona beneficiaria autorizó la campaña."); return; }
    setFalta(false);
    if (!title.value.trim()) title.setValue(desc.value.trim().split(" ").slice(0, 8).join(" "));
    setLimite(false);
    nav.go("revisar");
  };

  const hoy = sesion.fecha;
  const cachuelosHoy = pubs.items.filter((p) => p.tipo === "cachuelo" && p.autor === sesion.userId && p.fecha === hoy).length;
  const publish = () => {
    if (esCach && cachuelosHoy >= LIMITE_CACHUELOS) { setLimite(true); return; }
    const pendiente = sinRed.checked || sesion.senal === "Sin datos";
    const now = Date.now();
    const item = {
      id: `pub-${now}`,
      clientActionId: `ca-${now}`,
      tipo, modo, autor: sesion.userId, fecha: hoy,
      titulo: title.value.trim(), descripcion: desc.value.trim(),
      categoria: esFavor ? cat : esCach ? catCach : "Campaña",
      disponibilidad: disp, precio: esCach ? precio.value.trim() || "A convenir" : null,
      responsable: responsable.value.trim(), plazo: plazo.value.trim(), formas: forma,
      alcance, zona: `${sesion.localidad} · zona aproximada`, distrito,
      ...(esCamp ? { meta: Math.floor(Number(meta.value)), inicio: inicio || hoy, imagen: imagen || undefined } : {}),
      estado: pendiente ? "pendiente" : "publicado",
    };
    setPubs((p) => ({ items: [item, ...p.items] }));
    logEvento(pendiente ? `Publicación guardada como pendiente: «${item.titulo}»` : `Publicado: «${item.titulo}» (${tipo})`);
    setListo(pendiente ? "pendiente" : "publicado");
    nav.go("listo");
  };
  const is_revisar = nav.is("revisar");
  const is_listo = nav.is("listo");
  const listoEstado = listo === "pendiente" ? "Pendiente de enviar" : "Publicado";
  const listoTitle = listo === "pendiente" ? "Guardado sin conexión" : "¡Listo!";
  const listoText = listo === "pendiente" ? "Se enviará cuando vuelvas a tener conexión. Aún no está visible." : alcance === "junta" ? "Tu publicación ya está visible para tu junta." : "Tu publicación ya está visible para tu comunidad.";
  const pubLabel = sinRed.checked ? "Guardar como pendiente" : "Publicar";
  const resTag = esFavor ? "Gratis" : esCach ? precio.value.trim() || "A convenir" : "Solidaridad";
  const resTagCls = esFavor ? screenStyles.badgeFavor : esCach ? screenStyles.badgeCachuelo : screenStyles.badgeSolidarity;
  const resTitle = title.value.trim() || "Mi publicación";
  const muroHref = listo === "pendiente" ? "/offline?vista=pend" : esMov ? `/movilidad?tab=${modo === "pido" ? "nec" : "paso"}` : esCach ? `/cachuelos?tab=${modo === "pido" ? "trab" : "serv"}` : esCamp ? "/campanas" : `/favores?tab=${modo === "pido" ? "nec" : "ofr"}`;
  const reset = () => window.location.reload();
  return (
    <div className="m-0 bg-white text-(--color-ink) font-[Nunito,system-ui,sans-serif] text-[17px] leading-[1.4] [&_h1]:font-[Nunito,system-ui,sans-serif] [&_h1]:m-0 [&_h1]:leading-[1.15] [&_h1]:tracking-[-.01em] [&_h2]:font-[Nunito,system-ui,sans-serif] [&_h2]:m-0 [&_h2]:leading-[1.15] [&_h2]:tracking-[-.01em] [&_h3]:font-[Nunito,system-ui,sans-serif] [&_h3]:m-0 [&_h3]:leading-[1.15] [&_h3]:tracking-[-.01em] [&_h4]:font-[Nunito,system-ui,sans-serif] [&_h4]:m-0 [&_h4]:leading-[1.15] [&_h4]:tracking-[-.01em] [&_.t]:font-[Nunito,system-ui,sans-serif] [&_.t]:m-0 [&_.t]:leading-[1.15] [&_.t]:tracking-[-.01em] [&_p]:m-0 [&_button]:cursor-pointer [&_:focus-visible]:outline-3 [&_:focus-visible]:outline-(--color-ink) [&_:focus-visible]:outline-offset-2 [&_textarea.in]:px-3.5 [&_textarea.in]:py-3 [&_textarea.in]:min-h-26 [&_textarea.in]:resize-none">
      <div className="w-full md:max-w-[46rem] mx-auto h-dvh md:border-x md:border-(--color-line) flex flex-col bg-white overflow-hidden">
      
      {nav.is("tipo") && (<>
      <div className={screenStyles.header}><a className={screenStyles.iconButton} href="/inicio" aria-label="Cerrar"><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></a><h1>¿Qué quieres publicar?</h1></div>
      <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand)" aria-hidden="true"><i className="on"></i><i></i><i></i></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={`${screenStyles.muted} font-bold!`}>Paso 1 de 3 · Elige el tipo</p>
        {(tipos ?? []).map((t, __i1) => (<Fragment key={__i1}>
          <button className={t.cls} onClick={t.pick}><div className={screenStyles.grow}><b>{t.name}</b><span className={screenStyles.muted}>{t.sub}</span></div><span className={t.tagCls}>{t.tag}</span></button>
        </Fragment>))}
        {esFavor && (<>
          <div className={screenStyles.field}><p className={screenStyles.label}>¿Pides o ofreces?</p><div className={screenStyles.wrap}><button className={chipPido} onClick={setPido}>{esCach ? "Necesito un servicio" : "Necesito ayuda"}</button><button className={chipOfrezco} onClick={setOfrezco}>{esCach ? "Ofrezco mi servicio" : "Ofrezco ayuda"}</button></div>
          <p className={screenStyles.muted}>Movilidad solidaria es un tipo de favor: la eliges en el siguiente paso.</p></div>
        </>)}
        {esEmerg && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 bg-[#fff1e6]! border-[#f0c8a8]!"><p className="font-bold!">Para una emergencia, primero llama</p><p className={screenStyles.muted}>Policía 105 · Bomberos 116 · SAMU 106. La evidencia nueva se toma con la cámara, no desde la galería.</p><a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/emergencias?vista=reportar">Reportar con cámara</a></div>
        </>)}
        {noEmerg && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("datos")}>Continuar</button></>)}
      </div>
      </>)}
      
      {nav.is("datos") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Cuéntalo en pocas palabras</h1></div>
      <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand)" aria-hidden="true"><i className="on"></i><i className="on"></i><i></i></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={`${screenStyles.muted} font-bold!`}>Paso 2 de 3 · {tipoNombre}</p>
        <div className={screenStyles.field}><label htmlFor="desc">Descripción</label><textarea id="desc" className="min-h-26 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-3 bg-white w-full resize-none" placeholder={`${placeholder ?? ""}`} {...desc.props}></textarea></div>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={suggest}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /></svg>Sugerencia automática</button>
        <span className={`${screenStyles.badge} mt-[-8px]!`}>Sugerencia automática · revísala antes de publicar</span>
        {hasSug && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 border-(--color-brand)!"><p className={screenStyles.label}>Propuesta (puedes editarla)</p><label htmlFor="tit" className="absolute left-[-9999px]!">Título</label><input id="tit" className={screenStyles.input} {...title.props} /><p className={screenStyles.muted}>Categoría sugerida: {catSug}</p></div>
        </>)}
        {esFavor && (<>
          <div className={screenStyles.field}><p className={screenStyles.label}>Categoría</p><div className={screenStyles.wrap}>{(cats ?? []).map((c, __i1) => (<Fragment key={__i1}><button className={c.cls} onClick={c.pick}>{c.name}</button></Fragment>))}</div></div>
          {esMov && (<><div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2" role="note"><p className={screenStyles.muted}>Movilidad solidaria avisa primero a tu junta. Si es una urgencia médica, llama al 106; no esperes respuestas de vecinos.</p><a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/movilidad">Ir al flujo de movilidad</a></div></>)}
          <div className={screenStyles.field}><p className={screenStyles.label}>Disponibilidad</p><div className={screenStyles.wrap}><button className={chip(disp === "Hoy")} onClick={() => setDisp("Hoy")}>Hoy</button><button className={chip(disp === "Esta semana")} onClick={() => setDisp("Esta semana")}>Esta semana</button><button className={chip(disp === "Fines de semana")} onClick={() => setDisp("Fines de semana")}>Fines de semana</button></div></div>
        </>)}
        {esCach && (<>
          <div className={screenStyles.field}><p className={screenStyles.label}>Categoría del trabajo</p><div className={screenStyles.wrap}>{CACH_CATS.map((k) => (<button key={k} className={chip(catCach === k)} onClick={() => setCatCach(k)}>{k}</button>))}</div></div>
          <div className={screenStyles.field}><label htmlFor="precio">Precio referencial</label><input id="precio" className={screenStyles.input} placeholder="S/ o \u00abA convenir\u00bb" {...precio.props} /><p className={screenStyles.muted}>Los pagos no se hacen en la app: el precio se acuerda entre ustedes.</p></div>
        </>)}
        {esCamp && (<>
          <div className={screenStyles.field}><label htmlFor="meta">Meta de la campaña (unidades)</label><input id="meta" className={screenStyles.input} inputMode="numeric" {...meta.props} /><p className={screenStyles.muted}>1 unidad = 1 bien, 1 turno, 1 artículo o S/ 10.</p></div>
          <div className={screenStyles.field}><label htmlFor="ini">Fecha de inicio (opcional)</label><input id="ini" type="date" className={screenStyles.input} value={inicio} onChange={(e) => setInicio(e.target.value)} /><p className={screenStyles.muted}>Si es posterior a hoy, la campaña aparece como «Próxima».</p></div>
          <div className={screenStyles.field}><label htmlFor="img">Imagen de la campaña (opcional)</label><input id="img" type="file" accept="image/*" className={screenStyles.input} onChange={elegirImagen} />{imgMsg && (<p className={screenStyles.muted} role="status">{imgMsg}</p>)}{imagen && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagen} alt="Vista previa de la imagen de la campaña" className="w-full max-h-40 object-cover rounded-[14px]" />
          )}</div>
          <div className={screenStyles.field}><label htmlFor="resp">Responsable</label><input id="resp" className={screenStyles.input} placeholder="Nombre de la persona u organizaci\u00f3n" {...responsable.props} /></div>
          <div className={screenStyles.field}><label htmlFor="plazo">Plazo</label><input id="plazo" className={screenStyles.input} placeholder="Fecha l\u00edmite" {...plazo.props} /></div>
          <div className={screenStyles.field}><p className={screenStyles.label}>Formas de apoyo</p><div className={screenStyles.wrap}>{(formas ?? []).map((f, __i1) => (<Fragment key={__i1}><button className={f.cls} onClick={f.pick}>{f.name}</button></Fragment>))}</div></div>
          <div className={screenStyles.checkboxRow}><input id="benef" type="checkbox" {...benef.props} /><label htmlFor="benef"><b>La persona beneficiaria autorizó esta campaña</b><br /><span className={screenStyles.muted}>Obligatorio si la campaña es sobre otra persona.</span></label></div>
        </>)}
        {falta && (<><p className={screenStyles.error} role="alert">{faltaMsg}</p></>)}
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={next}>Revisar</button>
      </div>
      </>)}
      
      {is_revisar && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Revisa y publica</h1></div>
      <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand)" aria-hidden="true"><i className="on"></i><i className="on"></i><i className="on"></i></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={`${screenStyles.muted} font-bold!`}>Paso 3 de 3 · Confirmación</p>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2"><span className={resTagCls}>{resTag}</span><h2 className="text-[22px]!">{resTitle}</h2><p className={screenStyles.muted}>{desc.value}</p></div>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2"><p className={screenStyles.label}>Zona aproximada</p><div className={screenStyles.row}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic text-(--color-brand)!" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg><p>{sesion.localidad} · zona aproximada <span className={screenStyles.muted}>(no se muestra tu dirección exacta)</span></p></div></div>
        <div className={screenStyles.field}><p className={screenStyles.label}>Distrito</p><div className="flex gap-2 overflow-x-auto pb-0.5 [&>*]:shrink-0" role="group" aria-label="Distrito">{DISTRITOS.map((d) => (<button key={d} className={chip(distrito === d)} aria-pressed={distrito === d} onClick={() => setDistrito(d)}>{d}</button>))}</div></div>
        <div className={screenStyles.field}><p className={screenStyles.label}>¿Quién lo verá?</p><div className={screenStyles.wrap}><button className={alJunta} onClick={setJunta}>Mi junta primero</button><button className={alCom} onClick={setCom}>Mi comunidad</button></div></div>
        <div className={screenStyles.checkboxRow}><input id="off" type="checkbox" {...sinRed.props} /><label htmlFor="off"><b>Publicar cuando tenga conexión</b><br /><span className={screenStyles.muted}>Se guarda como pendiente y se envía al reconectar.</span></label></div>
        {limite && (<><p className={screenStyles.error} role="alert">Llegaste al límite de 3 solicitudes de cachuelos por día. Puedes seguir respondiendo mensajes. Vuelve mañana para publicar otra.</p></>)}
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={publish}>{pubLabel}</button>
        <p className={`${screenStyles.muted} text-center!`}>Nada se publica hasta que tú confirmes.</p>
      </div>
      </>)}
      
      {is_listo && (<>
      <div className={screenStyles.header}><h1 className="pl-2">{listoTitle}</h1></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-5 justify-center! text-center! items-center!">
        <svg className="w-6 h-6 fill-none stroke-current stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round] flex-none ic w-24! h-24! text-[#2f5a2d]!" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8 12.500l3 3 5-6" /></svg>
        <p role="status" className="text-[19px]!">{listoText}</p>
        <span className={screenStyles.badgeDemo}>Estado: {listoEstado}</span>
        <a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href={muroHref}>{listo === "pendiente" ? "Ver pendientes" : "Ver en el muro"}</a>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={reset}>Publicar otra</button>
        <a className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/inicio">Volver al inicio</a>
      </div>
      </>)}
      
      </div>
    </div>
  );
}
