/**
 * Traductor de la interfaz. Sustituye, en el DOM, los textos de la app que aparecen en la tabla de frases del idioma
 * elegido (texto exacto, ignorando espacios y con números como {n}). No toca lo que no está en la tabla:
 * nombres, direcciones y lo que escriben los vecinos conservan su idioma original. Al volver a español se restauran
 * los textos originales, y no se modifica ningún dato guardado.
 */
const ATRIBUTOS = ["placeholder", "aria-label", "title", "alt"];
type Reg = { orig: string; trad: string };
const textos = new WeakMap<Node, Reg>();
const atribs = new WeakMap<Element, Record<string, Reg>>();
let tabla: Map<string, string> | null = null;
let obs: MutationObserver | null = null;

function traducir(s: string): string | null {
  if (!tabla) return null;
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s);
  const nucleo = m?.[2];
  if (!m || !nucleo) return null;
  const directo = tabla.get(nucleo);
  if (directo !== undefined) return m[1] + directo + m[3];
  const nums: string[] = [];
  const plantilla = nucleo.replace(/\d+(?:[.,]\d+)?/g, (x) => { nums.push(x); return "{n}"; });
  if (!nums.length) return null;
  const r = tabla.get(plantilla);
  if (r === undefined) return null;
  let i = 0;
  return m[1] + r.replace(/\{n\}/g, () => nums[i++] ?? "") + m[3];
}

const omitido = (el: Element | null) => !el || !!el.closest("script,style,textarea,code,pre,[data-no-traducir]");

function nodoTexto(n: Node) {
  if (omitido(n.parentElement)) return;
  const reg = textos.get(n);
  const valor = n.nodeValue ?? "";
  if (reg && valor === reg.trad) return;
  const tr = traducir(valor);
  if (tr !== null && tr !== valor) { textos.set(n, { orig: valor, trad: tr }); n.nodeValue = tr; }
  else if (reg) textos.delete(n);
}

function atributo(el: Element, nombre: string) {
  if (omitido(el)) return;
  const valor = el.getAttribute(nombre);
  if (!valor) return;
  const mapa = atribs.get(el) ?? {};
  const reg = mapa[nombre];
  if (reg && valor === reg.trad) return;
  const tr = traducir(valor);
  if (tr !== null && tr !== valor) { mapa[nombre] = { orig: valor, trad: tr }; atribs.set(el, mapa); el.setAttribute(nombre, tr); }
  else if (reg) { delete mapa[nombre]; }
}

function recorrer(raiz: Node) {
  if (raiz.nodeType === Node.TEXT_NODE) { nodoTexto(raiz); return; }
  if (raiz.nodeType !== Node.ELEMENT_NODE) return;
  const el = raiz as Element;
  if (omitido(el)) return;
  ATRIBUTOS.forEach((a) => atributo(el, a));
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    if (n.nodeType === Node.TEXT_NODE) nodoTexto(n);
    else ATRIBUTOS.forEach((a) => atributo(n as Element, a));
  }
}

function restaurar() {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    if (n.nodeType === Node.TEXT_NODE) {
      const reg = textos.get(n);
      if (reg && n.nodeValue === reg.trad) n.nodeValue = reg.orig;
      textos.delete(n);
    } else {
      const el = n as Element;
      const mapa = atribs.get(el);
      if (mapa) for (const [a, reg] of Object.entries(mapa)) if (el.getAttribute(a) === reg.trad) el.setAttribute(a, reg.orig);
      atribs.delete(el);
    }
  }
}

export function detenerTraductor() {
  obs?.disconnect();
  obs = null;
  if (tabla) restaurar();
  tabla = null;
}

/** Activa la traducción con la tabla dada y la mantiene al día mientras la interfaz cambia. */
export function iniciarTraductor(frases: Record<string, string>) {
  detenerTraductor();
  tabla = new Map(Object.entries(frases));
  recorrer(document.body);
  obs = new MutationObserver((lote) => {
    for (const r of lote) {
      if (r.type === "characterData") nodoTexto(r.target);
      else if (r.type === "attributes") atributo(r.target as Element, r.attributeName ?? "");
      else r.addedNodes.forEach((n) => recorrer(n));
    }
  });
  obs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATRIBUTOS });
}
