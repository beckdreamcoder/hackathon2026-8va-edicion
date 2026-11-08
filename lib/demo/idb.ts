/**
 * Capa mínima de IndexedDB de BarrioConecta.
 * Base «barrioconecta»: almacén `kv` (datos de la app, una fila por clave) y `meta` (banderas de migración y versión).
 * Todas las funciones devuelven `null`/`false` si IndexedDB no está disponible: el llamador usa su alternativa.
 */
export const BD_NOMBRE = "barrioconecta";
export const BD_VERSION = 1;

export type Fila = { key: string; value: unknown; esquema: number; actualizado: number };

let abriendo: Promise<IDBDatabase | null> | null = null;

export function abrir(): Promise<IDBDatabase | null> {
  if (abriendo) return abriendo;
  abriendo = new Promise((resolver) => {
    if (typeof indexedDB === "undefined") { resolver(null); return; }
    try {
      const rq = indexedDB.open(BD_NOMBRE, BD_VERSION);
      // Las versiones futuras del esquema se aplican aquí (crear almacenes, índices o transformar filas)
      rq.onupgradeneeded = () => {
        const db = rq.result;
        if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv", { keyPath: "key" });
        if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta", { keyPath: "key" });
      };
      rq.onsuccess = () => {
        const db = rq.result;
        // Otra pestaña actualiza la versión: se cierra para no bloquearla y se reabre en la próxima operación
        db.onversionchange = () => { db.close(); abriendo = null; };
        db.onclose = () => { abriendo = null; };
        resolver(db);
      };
      rq.onerror = () => resolver(null);
      rq.onblocked = () => resolver(null);
    } catch {
      resolver(null);
    }
  });
  return abriendo;
}

function promesa<T>(rq: IDBRequest<T>): Promise<T> {
  return new Promise((ok, mal) => { rq.onsuccess = () => ok(rq.result); rq.onerror = () => mal(rq.error); });
}

async function conAlmacen<T>(nombre: "kv" | "meta", modo: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T | null> {
  const db = await abrir();
  if (!db) return null;
  try {
    const tx = db.transaction(nombre, modo);
    const r = await promesa(fn(tx.objectStore(nombre)));
    return r;
  } catch {
    return null;
  }
}

/** Todas las filas guardadas, o `null` si IndexedDB no funciona. */
export async function leerTodo(): Promise<Fila[] | null> {
  const r = await conAlmacen("kv", "readonly", (s) => s.getAll() as IDBRequest<Fila[]>);
  return r ?? null;
}
export async function leerUna(key: string): Promise<Fila | null> {
  const r = await conAlmacen("kv", "readonly", (s) => s.get(key) as IDBRequest<Fila | undefined>);
  return r ?? null;
}
export async function guardar(f: Fila): Promise<boolean> {
  const r = await conAlmacen("kv", "readwrite", (s) => s.put(f));
  return r !== null;
}
export async function borrar(key: string): Promise<boolean> {
  const r = await conAlmacen("kv", "readwrite", (s) => s.delete(key));
  return r !== null;
}
export async function limpiarKv(): Promise<boolean> {
  const r = await conAlmacen("kv", "readwrite", (s) => s.clear());
  return r !== null;
}
export async function metaLeer<T = unknown>(key: string): Promise<T | null> {
  const r = await conAlmacen("meta", "readonly", (s) => s.get(key) as IDBRequest<{ key: string; value: T } | undefined>);
  return r?.value ?? null;
}
export async function metaGuardar(key: string, value: unknown): Promise<boolean> {
  const r = await conAlmacen("meta", "readwrite", (s) => s.put({ key, value }));
  return r !== null;
}
