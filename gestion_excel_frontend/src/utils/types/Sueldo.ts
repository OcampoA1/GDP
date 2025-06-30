export interface Sueldo {
  id: number;
  periodo_id: number;
  rrhh_id: number;
  proyecto_id: number;
  horas: number;
  valor: number;
  fecha: string; // formato ISO yyyy-mm-dd
}

export interface SueldoCreate {
  periodo_id: number;
  rrhh_id: number;
  proyecto_id: number;
  horas: number;
  valor: number;
  fecha: string;
}
