import axios from 'axios';
import type { Proyecto, ProyectoCreate } from '../types/Proyecto';
import type { Rrhh, RrhhCreate } from '../types/Rrhh';
import type { Sueldo, SueldoCreate } from '../types/Sueldo';
import type { Movimiento, MovimientoCreate } from '../types/Movimiento';
import type { CajaMenor, CajaMenorCreate } from '../types/CajaMenor';
import type { Compra, CompraCreate } from '../types/Compra';
import type { AdministracionCreate, AdministracionOut, AdministracionUpdate } from '../types/Administracion';


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- Proyectos ---
export const getProyectos = async (): Promise<Proyecto[]> => {
  const res = await api.get('/proyectos');
  return res.data;
};

export const createProyecto = async (data: ProyectoCreate): Promise<Proyecto> => {
  const res = await api.post('/proyectos', data);
  return res.data;
};

export const updateProyecto = async (id: number, data: ProyectoCreate): Promise<Proyecto> => {
  const res = await api.put(`/proyectos/${id}`, data);
  return res.data;
};

export const deleteProyecto = async (id: number): Promise<void> => {
  await api.delete(`/proyectos/${id}`);
};

// --- RRHH ---
export const getRrhh = async (): Promise<Rrhh[]> => {
  const res = await api.get('/rrhh');
  return res.data;
};

export const createRrhh = async (data: RrhhCreate): Promise<Rrhh> => {
  const res = await api.post('/rrhh', data);
  return res.data;
};

export const updateRrhh = async (id: number, data: RrhhCreate): Promise<Rrhh> => {
  const res = await api.put(`/rrhh/${id}`, data);
  return res.data;
};

export const deleteRrhh = async (id: number): Promise<void> => {
  await api.delete(`/rrhh/${id}`);
};

// --- Sueldos ---
export const getSueldos = async (): Promise<Sueldo[]> => {
  const res = await api.get('/sueldos');
  return res.data;
};

export const createSueldo = async (data: SueldoCreate): Promise<Sueldo> => {
  const res = await api.post('/sueldos', data);
  return res.data;
};

export const updateSueldo = async (id: number, data: SueldoCreate): Promise<Sueldo> => {
  const res = await api.put(`/sueldos/${id}`, data);
  return res.data;
};

export const deleteSueldo = async (id: number): Promise<void> => {
  await api.delete(`/sueldos/${id}`);
};

// --- Movimientos ---
export const getMovimientos = async (): Promise<Movimiento[]> => {
  const res = await api.get('/movimientos');
  return res.data;
};

export const createMovimiento = async (data: MovimientoCreate): Promise<Movimiento> => {
  const res = await api.post('/movimientos', data);
  return res.data;
};

export const updateMovimiento = async (id: number, data: MovimientoCreate): Promise<Movimiento> => {
  const res = await api.put(`/movimientos/${id}`, data);
  return res.data;
};

export const deleteMovimiento = async (id: number): Promise<void> => {
  await api.delete(`/movimientos/${id}`);
};

// --- Caja Menor ---
export const getCajaMenor = async (): Promise<CajaMenor[]> => {
  const res = await api.get('/caja_menor');
  return res.data;
};

export const createCajaMenor = async (data: CajaMenorCreate): Promise<CajaMenor> => {
  const res = await api.post('/caja_menor', data);
  return res.data;
};

export const updateCajaMenor = async (id: number, data: CajaMenorCreate): Promise<CajaMenor> => {
  const res = await api.put(`/caja_menor/${id}`, data);
  return res.data;
};

export const deleteCajaMenor = async (id: number): Promise<void> => {
  await api.delete(`/caja_menor/${id}`);
};

// --- Compras ---
export const getCompras = async (): Promise<Compra[]> => {
  const res = await api.get('/compras');
  return res.data;
};

export const createCompra = async (data: CompraCreate): Promise<Compra> => {
  const res = await api.post('/compras', data);
  return res.data;
};

export const updateCompra = async (id: number, data: CompraCreate): Promise<Compra> => {
  const res = await api.put(`/compras/${id}`, data);
  return res.data;
};

export const deleteCompra = async (id: number): Promise<void> => {
  await api.delete(`/compras/${id}`);
};

// --- Administración ---
export const getAdministracion = async (): Promise<AdministracionOut[]> => {
  const res = await api.get('/administracion');
  return res.data;
};

export const createAdministracion = async (data: AdministracionCreate): Promise<AdministracionOut> => {
  const res = await api.post('/administracion', data);
  return res.data;
};

export const updateAdministracion = async (id: number, data: AdministracionUpdate): Promise<AdministracionOut> => {
  const res = await api.put(`/administracion/${id}`, data);
  return res.data;
};

export const deleteAdministracion = async (id: number): Promise<void> => {
  await api.delete(`/administracion/${id}`);
};
