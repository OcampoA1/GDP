import React, { useEffect, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, useDisclosure, Input, Spinner, Pagination
} from '@heroui/react';
import { Icon } from '@iconify/react';
import type { Rrhh, RrhhCreate } from '../utils/types/Rrhh';
import { createRrhh, deleteRrhh, getRrhh, updateRrhh } from '../utils/controllers/axiosController';

export const RRHH: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState<Rrhh[]>([]);
  const [filtered, setFiltered] = useState<Rrhh[]>([]);
  const [formData, setFormData] = useState<RrhhCreate>({ nombre: '', equipo: '', proyecto: '', dedicacion_total: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getRrhh();
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
      e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.equipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.proyecto?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredData);
    setPage(1);
  }, [searchTerm, data]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.nombre.trim()) errs.nombre = 'Nombre requerido';
    if (!formData.proyecto.trim()) errs.proyecto = 'Proyecto requerido';
    if (!formData.equipo.trim()) errs.equipo = 'Equipo requerido';
    if (formData.dedicacion_total <= 0 || formData.dedicacion_total > 100) errs.dedicacion_total = 'Dedicación debe estar entre 1 y 100';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'dedicacion_total' ? Number(value) : value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (onClose: () => void) => {
    if (!validate()) return;
    try {
      if (editingId !== null) {
        await updateRrhh(editingId, formData);
      } else {
        await createRrhh(formData);
      }
      await fetchData();
      onClose();
      setFormData({ nombre: '', equipo: '', proyecto: '', dedicacion_total: 0 });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (emp: Rrhh) => {
    setFormData({
      nombre: emp.nombre,
      equipo: emp.equipo ?? '',
      proyecto: emp.proyecto ?? '',
      dedicacion_total: emp.dedicacion_total ?? 0
    });
    setEditingId(emp.id);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este empleado?')) {
      await deleteRrhh(id);
      await fetchData();
    }
  };

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Recursos Humanos</h1>
        <div className="flex gap-4 items-center">
          <Input placeholder="Buscar por nombre, proyecto o equipo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64" />
          <Button color="primary" onPress={() => { setEditingId(null); setFormData({ nombre: '', equipo: '', proyecto: '', dedicacion_total: 0 }); onOpen(); }}>
            <Icon icon="lucide:plus" className="mr-2 h-4 w-4" /> Nuevo
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Spinner label="Cargando..." color="primary" /></div>
      ) : (
        <>
          <Table aria-label="Tabla RRHH" removeWrapper>
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>ROL</TableColumn>
              <TableColumn>EQUIPO</TableColumn>
              <TableColumn>DEDICACIÓN</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {paginated.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.nombre}</TableCell>
                  <TableCell>{emp.proyecto}</TableCell>
                  <TableCell>{emp.equipo}</TableCell>
                  <TableCell>{emp.dedicacion_total}%</TableCell>
                  <TableCell>
                    <Tooltip content="Editar">
                      <Button isIconOnly size="sm" variant="light" color="primary" onPress={() => handleEdit(emp)}>
                        <Icon icon="lucide:edit" className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Eliminar">
                      <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(emp.id)}>
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
              <ModalHeader>{editingId !== null ? 'Editar Empleado' : 'Nuevo Empleado'}</ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleInput} isInvalid={!!errors.nombre} errorMessage={errors.nombre} />
                <Input label="Proyecto" name="proyecto" value={formData.proyecto} onChange={handleInput} isInvalid={!!errors.proyecto} errorMessage={errors.proyecto} />
                <Input label="Equipo" name="equipo" value={formData.equipo} onChange={handleInput} isInvalid={!!errors.equipo} errorMessage={errors.equipo} />
                <Input label="Dedicación Total (%)" name="dedicacion_total" type="number" value={formData.dedicacion_total.toString()} onChange={handleInput} isInvalid={!!errors.dedicacion_total} errorMessage={errors.dedicacion_total} />
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
