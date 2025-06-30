import React, { useEffect, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody,
  ModalFooter, useDisclosure, Spinner, Input, Pagination
} from '@heroui/react';
import { Icon } from '@iconify/react';
import type { Proyecto, ProyectoCreate } from '../utils/types/Proyecto';
import { createProyecto, deleteProyecto, getProyectos, updateProyecto } from '../utils/controllers/axiosController';

export const Proyectos: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [filteredProyectos, setFilteredProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<ProyectoCreate>({ nombre: '', centro_costo: '', subproyecto: '', estado: '', presupuesto: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getProyectos();
      setProyectos(data);
      setFilteredProyectos(data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = proyectos.filter((p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.estado?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProyectos(filtered);
    setPage(1);
  }, [searchTerm, proyectos]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.centro_costo.trim()) newErrors.centro_costo = 'Centro de costo obligatorio';
    if (!formData.subproyecto.trim()) newErrors.subproyecto = 'Subproyecto obligatorio';
    if (!formData.estado.trim()) newErrors.estado = 'Estado obligatorio';
    if (formData.presupuesto <= 0) newErrors.presupuesto = 'Presupuesto debe ser mayor a 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'presupuesto' ? Number(value) : value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (onClose: () => void) => {
    if (!validate()) return;
    try {
      if (editingId !== null) {
        await updateProyecto(editingId, formData);
      } else {
        await createProyecto(formData);
      }
      await fetchData();
      onClose();
      setFormData({ nombre: '', centro_costo: '', subproyecto: '', estado: '', presupuesto: 0 });
      setEditingId(null);
      setErrors({});
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
    }
  };

  const handleEdit = (proyecto: Proyecto) => {
    setFormData({
      nombre: proyecto.nombre,
      centro_costo: proyecto.centro_costo ?? '',
      subproyecto: proyecto.subproyecto ?? '',
      estado: proyecto.estado ?? '',
      presupuesto: proyecto.presupuesto ?? 0,
    });
    setEditingId(proyecto.id);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      try {
        await deleteProyecto(id);
        await fetchData();
      } catch (error) {
        console.error('Error al eliminar proyecto:', error);
      }
    }
  };

  const paginated = filteredProyectos.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <div className="flex gap-4 items-center">
          <Input
            className="w-64"
            placeholder="Buscar por nombre o estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button color="primary" onPress={() => { setFormData({ nombre: '', centro_costo: '', subproyecto: '', estado: '', presupuesto: 0 }); setEditingId(null); onOpen(); }}>
            <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Cargando proyectos..." color="primary" />
        </div>
      ) : (
        <>
          <Table aria-label="Tabla de Proyectos" removeWrapper>
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>CENTRO DE COSTO</TableColumn>
              <TableColumn>SUBPROYECTO</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn>PRESUPUESTO</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {paginated.map((proyecto) => (
                <TableRow key={proyecto.id}>
                  <TableCell>{proyecto.nombre}</TableCell>
                  <TableCell>{proyecto.centro_costo ?? '-'}</TableCell>
                  <TableCell>{proyecto.subproyecto ?? '-'}</TableCell>
                  <TableCell>{proyecto.estado ?? '-'}</TableCell>
                  <TableCell>${proyecto.presupuesto?.toLocaleString() ?? 0}</TableCell>
                  <TableCell>
                    <Tooltip content="Editar proyecto">
                      <Button isIconOnly size="sm" variant="light" color="primary" aria-label="Editar" onPress={() => handleEdit(proyecto)}>
                        <Icon icon="lucide:edit" className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Eliminar proyecto">
                      <Button isIconOnly size="sm" variant="light" color="danger" aria-label="Eliminar" onPress={() => handleDelete(proyecto.id)}>
                        <Icon icon="lucide:trash" className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end py-4">
            <Pagination
              page={page}
              total={Math.ceil(filteredProyectos.length / itemsPerPage)}
              onChange={setPage}
            />
          </div>
        </>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{editingId !== null ? 'Editar Proyecto' : 'Nuevo Proyecto'}</ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} isInvalid={!!errors.nombre} errorMessage={errors.nombre} />
                <Input label="Centro de Costo" name="centro_costo" value={formData.centro_costo ?? ''} onChange={handleInputChange} isInvalid={!!errors.centro_costo} errorMessage={errors.centro_costo} />
                <Input label="Subproyecto" name="subproyecto" value={formData.subproyecto ?? ''} onChange={handleInputChange} isInvalid={!!errors.subproyecto} errorMessage={errors.subproyecto} />
                <Input label="Estado" name="estado" value={formData.estado ?? ''} onChange={handleInputChange} isInvalid={!!errors.estado} errorMessage={errors.estado} />
                <Input label="Presupuesto" name="presupuesto" type="number" value={formData.presupuesto.toString()} onChange={handleInputChange} isInvalid={!!errors.presupuesto} errorMessage={errors.presupuesto} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Cancelar</Button>
                <Button color="primary" onPress={() => handleSubmit(onClose)}>Guardar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
