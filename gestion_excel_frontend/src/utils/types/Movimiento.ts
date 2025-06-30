export interface Movimiento {
  id: number;
  periodo_id?: number | null;
  proyecto_id: number;
  valor: number;
  tipo?: string | null;
  fecha: string;
  observaciones?: string | null;
}

export interface MovimientoCreate {
  periodo_id?: number | null;
  proyecto_id: number;
  valor: number;
  tipo?: string | null;
  fecha: string;
  observaciones?: string | null;
}
