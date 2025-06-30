export interface CajaMenor {
  id: number;
  proyecto_id: number;
  periodo_id: number;
  valor: number;
  fecha?: string | null;
  responsable?: string | null;
  concepto?: string | null;
  observaciones?: string | null;
}

export interface CajaMenorCreate {
  proyecto_id: number;
  periodo_id: number;
  valor: number;
  fecha?: string | null;
  responsable?: string | null;
  concepto?: string | null;
  observaciones?: string | null;
}
