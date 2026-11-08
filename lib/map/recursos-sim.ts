import type { VecinoId } from "@/lib/demo/shared";

/**
 * Recursos comunitarios SIMULADOS (agua, alimentos, herramientas, botiquines, transporte y otros).
 * Datos de demostración: no hay inventario ni entregas reales.
 */
export const CLASES_RECURSO: Record<string, string> = { agua: "Agua", alimentos: "Alimentos", herramientas: "Herramientas", botiquines: "Botiquines", transporte: "Transporte", otros: "Otros" };

export type RecursoSim = { key: string; vecino: VecinoId; modo: "ofrezco" | "pido"; clase: keyof typeof CLASES_RECURSO; titulo: string; descripcion: string; cantidad: number; unidad: string; distrito: string; zona: string };

export const RECURSOS_SIM: RecursoSim[] = [
  { key: "rc-01", vecino: "diego", modo: "ofrezco", clase: "agua", titulo: "Bidones de agua de 20 litros", descripcion: "Tengo bidones llenos para compartir con familias sin servicio de agua.", cantidad: 6, unidad: "bidones", distrito: "San Juan de Lurigancho", zona: "Campoy · zona aproximada" },
  { key: "rc-02", vecino: "valeria", modo: "pido", clase: "agua", titulo: "Necesito agua para mi familia", descripcion: "Corte de agua desde ayer. Necesitamos bidones para cinco personas.", cantidad: 3, unidad: "bidones", distrito: "Jicamarca Anexo 22", zona: "Anexo 22 · zona aproximada" },
  { key: "rc-03", vecino: "miguel", modo: "ofrezco", clase: "alimentos", titulo: "Canastas de víveres", descripcion: "Arroz, menestras, aceite y atún. Entrega en el local comunal.", cantidad: 8, unidad: "canastas", distrito: "El Agustino", zona: "El Agustino · zona aproximada" },
  { key: "rc-04", vecino: "rocio", modo: "pido", clase: "alimentos", titulo: "Alimentos para comedor popular", descripcion: "Buscamos aportes de víveres no perecibles para 40 raciones semanales.", cantidad: 10, unidad: "kilos", distrito: "Rímac", zona: "Rímac · zona aproximada" },
  { key: "rc-05", vecino: "hugo", modo: "ofrezco", clase: "botiquines", titulo: "Botiquines de primeros auxilios", descripcion: "Botiquines básicos armados: gasas, alcohol, vendas y curitas.", cantidad: 5, unidad: "botiquines", distrito: "Cercado de Lima", zona: "Cercado de Lima · zona aproximada" },
  { key: "rc-06", vecino: "elena", modo: "pido", clase: "botiquines", titulo: "Botiquín para la junta vecinal", descripcion: "Necesitamos un botiquín completo para el local comunal.", cantidad: 1, unidad: "botiquín", distrito: "Santa Anita", zona: "Santa Anita · zona aproximada" },
  { key: "rc-07", vecino: "raul", modo: "ofrezco", clase: "herramientas", titulo: "Palas y carretillas para limpieza", descripcion: "Presto herramientas para faenas de limpieza después de lluvias.", cantidad: 4, unidad: "herramientas", distrito: "Ate", zona: "Ate · zona aproximada" },
  { key: "rc-08", vecino: "patricia", modo: "ofrezco", clase: "transporte", titulo: "Flete pequeño para llevar donaciones", descripcion: "Camioneta disponible los sábados para trasladar donaciones.", cantidad: 3, unidad: "viajes", distrito: "San Borja", zona: "San Borja · zona aproximada" },
];
