// Genera los iconos PNG de la PWA (sin dependencias): pin de ubicación blanco sobre el rojo de BarrioConecta.
// Uso: node scripts/generar-iconos.mjs
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";

const ROJO = [200, 16, 46];
const BLANCO = [255, 255, 255];

const tabla = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = tabla[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(tipo, datos) {
  const t = Buffer.from(tipo, "ascii");
  const len = Buffer.alloc(4); len.writeUInt32BE(datos.length);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(Buffer.concat([t, datos])));
  return Buffer.concat([len, t, datos, c]);
}
function png(w, h, rgba) {
  const cab = Buffer.alloc(13); cab.writeUInt32BE(w, 0); cab.writeUInt32BE(h, 4); cab[8] = 8; cab[9] = 6;
  const filas = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { filas[y * (w * 4 + 1)] = 0; rgba.copy(filas, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4); }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", cab), chunk("IDAT", deflateSync(filas, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

/** Dibuja el icono. `margen`: fracción de borde vacío (maskable usa más); `redondeo`: esquinas redondeadas (0 = a sangre). */
function icono(tam, margen, redondeo) {
  const img = Buffer.alloc(tam * tam * 4);
  const S = 3; // muestreo para suavizar bordes
  const cx = tam / 2;
  const u = (tam * (1 - 2 * margen)) / 100; // unidad del dibujo (el pin ocupa ~60 unidades)
  const ox = cx, oy = tam / 2 - 6 * u;
  const dentroPin = (x, y) => {
    const dx = (x - ox) / u, dy = (y - oy) / u;
    const cabeza = Math.hypot(dx, dy) <= 25; // círculo
    // cola del pin: triángulo hacia abajo
    const cola = dy >= 5 && dy <= 42 && Math.abs(dx) <= (42 - dy) * 0.62;
    const hueco = Math.hypot(dx, dy) <= 10;
    return (cabeza || cola) && !hueco;
  };
  const dentroFondo = (x, y) => {
    if (!redondeo) return true;
    const r = tam * redondeo;
    const px = Math.min(x, tam - x), py = Math.min(y, tam - y);
    if (px >= r || py >= r) return true;
    return Math.hypot(r - px, r - py) <= r;
  };
  for (let y = 0; y < tam; y++) for (let x = 0; x < tam; x++) {
    let fondo = 0, pin = 0;
    for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
      const X = x + (sx + 0.5) / S, Y = y + (sy + 0.5) / S;
      if (dentroFondo(X, Y)) { fondo++; if (dentroPin(X, Y)) pin++; }
    }
    const n = S * S;
    const a = fondo / n;
    const k = fondo ? pin / fondo : 0;
    const i = (y * tam + x) * 4;
    img[i] = Math.round(ROJO[0] * (1 - k) + BLANCO[0] * k);
    img[i + 1] = Math.round(ROJO[1] * (1 - k) + BLANCO[1] * k);
    img[i + 2] = Math.round(ROJO[2] * (1 - k) + BLANCO[2] * k);
    img[i + 3] = Math.round(255 * a);
  }
  return png(tam, tam, img);
}

mkdirSync("public/icons", { recursive: true });
writeFileSync("public/icons/icon-192.png", icono(192, 0.18, 0.2));
writeFileSync("public/icons/icon-512.png", icono(512, 0.18, 0.2));
writeFileSync("public/icons/icon-maskable-512.png", icono(512, 0.3, 0)); // zona segura mayor y a sangre
writeFileSync("public/icons/apple-touch-icon.png", icono(180, 0.18, 0)); // iOS aplica sus propias esquinas
console.log("Iconos generados en public/icons");
