// Componente profesional para Sueldos con conexión a API, validaciones y UI lista
import React, { useEffect, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, useDisclosure, Input, Spinner, Pagination
} from '@heroui/react';
import { Icon } from '@iconify/react';
import type { Sueldo, SueldoCreate } from '../utils/types/Sueldo';
import { createSueldo, deleteSueldo, getSueldos, updateSueldo } from '../utils/controllers/axiosController';

export const Sueldos: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState<Sueldo[]>([]);
  const [filtered, setFiltered] = useState<Sueldo[]>([]);
  const [formData, setFormData] = useState<SueldoCreate>({
    proyecto_id: 0,
    rrhh_id: 0,
    periodo_id: 0,
    horas: 0,
    valor: 0,
    fecha: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getSueldos();
      setData(res);
      setFiltered(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const filteredData = data.filter((e) =>
      e.fecha.includes(searchTerm) || e.proyecto_id.toString().includes(searchTerm)
    );
    setFiltered(filteredData);
    setPage(1);
  }, [searchTerm, data]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.fecha.trim()) errs.fecha = 'Fecha requerida';
    if (!formData.proyecto_id) errs.proyecto_id = 'Proyecto requerido';
    if (!formData.rrhh_id) errs.rrhh_id = 'Empleado requerido';
    if (!formData.periodo_id) errs.periodo_id = 'Periodo requerido';
    if (formData.horas <= 0) errs.horas = 'Horas deben ser mayores a 0';
    if (formData.valor <= 0) errs.valor = 'Valor debe ser mayor a 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'horas' || name === 'valor' || name.includes('_id') ? Number(value) : value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (onClose: () => void) => {
    if (!validate()) return;
    try {
      if (editingId !== null) {
        await updateSueldo(editingId, formData);
      } else {
        await createSueldo(formData);
      }
      await fetchData();
      onClose();
      setFormData({ proyecto_id: 0, rrhh_id: 0, periodo_id: 0, horas: 0, valor: 0, fecha: '' });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (sueldo: Sueldo) => {
    setFormData({
      proyecto_id: sueldo.proyecto_id,
      rrhh_id: sueldo.rrhh_id,
      periodo_id: sueldo.periodo_id,
      horas: sueldo.horas,
      valor: sueldo.valor,
      fecha: sueldo.fecha
    });
    setEditingId(sueldo.id);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este sueldo?')) {
      await deleteSueldo(id);
      await fetchData();
    }
  };

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sueldos</h1>
        <div className="flex gap-4 items-center">
          <Input placeholder="Buscar por fecha o proyecto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64" />
          <Button color="primary" onPress={() => { setEditingId(null); setFormData({ proyecto_id: 0, rrhh_id: 0, periodo_id: 0, horas: 0, valor: 0, fecha: '' }); onOpen(); }}>
            <Icon icon="lucide:plus" className="mr-2 h-4 w-4" /> Nuevo
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Spinner label="Cargando..." color="primary" /></div>
      ) : (
        <>
          <Table aria-label="Tabla Sueldos" removeWrapper>
            <TableHeader>
              <TableColumn>PERIODO</TableColumn>
              <TableColumn>EMPLEADO</TableColumn>
              <TableColumn>PROYECTO</TableColumn>
              <TableColumn>HORAS</TableColumn>
              <TableColumn>VALOR</TableColumn>
              <TableColumn>FECHA</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {paginated.map((sueldo) => (
                <TableRow key={sueldo.id}>
                  <TableCell>{sueldo.periodo_id}</TableCell>
                  <TableCell>{sueldo.rrhh_id}</TableCell>
                  <TableCell>{sueldo.proyecto_id}</TableCell>
                  <TableCell>{sueldo.horas}</TableCell>
                  <TableCell>${sueldo.valor.toLocaleString()}</TableCell>
                  <TableCell>{sueldo.fecha}</TableCell>
                  <TableCell>
                    <Tooltip content="Editar">
                      <Button isIconOnly size="sm" variant="light" color="primary" onPress={() => handleEdit(sueldo)}>
                        <Icon icon="lucide:edit" className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Eliminar">
                      <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(sueldo.id)}>
                        <Icon icon="lucide:trash" className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end py-4">
            <Pagination page={page} total={Math.ceil(filtered.length / itemsPerPage)} onChange={setPage} />
          </div>
        </>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{editingId !== null ? 'Editar Sueldo' : 'Nuevo Sueldo'}</ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                <Input label="ID Proyecto" name="proyecto_id" value={formData.proyecto_id.toString()} onChange={handleInput} isInvalid={!!errors.proyecto_id} errorMessage={errors.proyecto_id} />
                <Input label="ID Empleado" name="rrhh_id" value={formData.rrhh_id.toString()} onChange={handleInput} isInvalid={!!errors.rrhh_id} errorMessage={errors.rrhh_id} />
                <Input label="ID Periodo" name="periodo_id" value={formData.periodo_id.toString()} onChange={handleInput} isInvalid={!!errors.periodo_id} errorMessage={errors.periodo_id} />
                <Input label="Horas" name="horas" type="number" value={formData.horas.toString()} onChange={handleInput} isInvalid={!!errors.horas} errorMessage={errors.horas} />
                <Input label="Valor" name="valor" type="number" value={formData.valor.toString()} onChange={handleInput} isInvalid={!!errors.valor} errorMessage={errors.valor} />
                <Input label="Fecha" name="fecha" type="date" value={formData.fecha} onChange={handleInput} isInvalid={!!errors.fecha} errorMessage={errors.fecha} />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" color="danger" onPress={onClose}>Cancelar</Button>
                <Button color="primary" onPress={() => handleSubmit(onClose)}>Guardar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
