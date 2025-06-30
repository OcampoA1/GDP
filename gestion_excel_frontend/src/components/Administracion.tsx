// Componente profesional para Administración con conexión a API, validaciones, paginación y UI productiva
import React, { useEffect, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, useDisclosure, Input, Spinner, Pagination, Select, SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import {
  getAdministracion,
  createAdministracion,
  updateAdministracion,
  deleteAdministracion
} from '../utils/controllers/axiosController';
import type { AdministracionCreate, AdministracionOut } from '../utils/types/Administracion';

export const Administracion: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState<AdministracionOut[]>([]);
  const [formData, setFormData] = useState<AdministracionCreate>({
    tipo_costo: '',
    descripcion: '',
    periodicidad: '',
    valor: 0,
    fecha: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdministracion();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.tipo_costo.trim()) errs.tipo_costo = 'Tipo de costo requerido';
    if (!formData.descripcion.trim()) errs.descripcion = 'Descripción requerida';
    if (!formData.periodicidad.trim()) errs.periodicidad = 'Periodicidad requerida';
    if (formData.valor <= 0) errs.valor = 'Valor debe ser mayor a 0';
    if (!formData.fecha.trim()) errs.fecha = 'Fecha requerida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'valor' ? Number(value) : value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (onClose: () => void) => {
    if (!validate()) return;
    try {
      if (editingId !== null) {
        await updateAdministracion(editingId, formData);
      } else {
        await createAdministracion(formData);
      }
      await fetchData();
      onClose();
      setEditingId(null);
      setFormData({ tipo_costo: '', descripcion: '', periodicidad: '', valor: 0, fecha: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: AdministracionOut) => {
    setFormData({
      tipo_costo: item.tipo_costo,
      descripcion: item.descripcion,
      periodicidad: item.periodicidad,
      valor: item.valor,
      fecha: item.fecha
    });
    setEditingId(item.id);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este costo administrativo?')) {
      await deleteAdministracion(id);
      await fetchData();
    }
  };

  const filtered = data.filter((d) =>
    d.tipo_costo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Administración</h1>
        <div className="flex gap-4 items-center">
          <Input placeholder="Buscar por tipo o descripción..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64" />
          <Button color="primary" onPress={() => { setEditingId(null); setFormData({ tipo_costo: '', descripcion: '', periodicidad: '', valor: 0, fecha: '' }); onOpen(); }}>
            <Icon icon="lucide:plus" className="mr-2 h-4 w-4" /> Nuevo
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Spinner label="Cargando..." color="primary" /></div>
      ) : (
        <>
          <Table aria-label="Tabla de Administración" removeWrapper>
            <TableHeader>
              <TableColumn>TIPO DE COSTO</TableColumn>
              <TableColumn>DESCRIPCIÓN</TableColumn>
              <TableColumn>PERIODICIDAD</TableColumn>
              <TableColumn>VALOR</TableColumn>
              <TableColumn>FECHA</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {paginated.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.tipo_costo}</TableCell>
                  <TableCell>{item.descripcion}</TableCell>
                  <TableCell>{item.periodicidad}</TableCell>
                  <TableCell>${item.valor.toLocaleString()}</TableCell>
                  <TableCell>{item.fecha}</TableCell>
                  <TableCell>
                    <Tooltip content="Editar">
                      <Button isIconOnly size="sm" variant="light" color="primary" onPress={() => handleEdit(item)}>
                        <Icon icon="lucide:edit" className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Eliminar">
                      <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(item.id)}>
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
              <ModalHeader>{editingId !== null ? 'Editar Costo' : 'Nuevo Costo'}</ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                <Input label="Tipo de Costo" name="tipo_costo" value={formData.tipo_costo} onChange={handleInput} isInvalid={!!errors.tipo_costo} errorMessage={errors.tipo_costo} />
                <Input label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleInput} isInvalid={!!errors.descripcion} errorMessage={errors.descripcion} />
                <Input label="Periodicidad" name="periodicidad" value={formData.periodicidad} onChange={handleInput} isInvalid={!!errors.periodicidad} errorMessage={errors.periodicidad} />
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
