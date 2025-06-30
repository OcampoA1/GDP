export interface Compra {
  id: number;
  proyecto_id: number;
  periodo_id: number;
  valor: number;
  fecha?: string | null;
  proveedor?: string | null;
  descripcion?: string | null;
}

export interface CompraCreate {
  proyecto_id: number;
  periodo_id: number;
  valor: number;
  fecha?: string | null;
  proveedor?: string | null;
  descripcion?: string | null;
}
