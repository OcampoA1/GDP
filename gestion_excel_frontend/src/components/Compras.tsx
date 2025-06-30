// Componente profesional para Compras con conexión a API, validaciones y UI lista para producción
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Spinner,
  Pagination,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  getCompras,
  createCompra,
  updateCompra,
  deleteCompra,
  getProyectos,
} from "../utils/controllers/axiosController";
import type { Compra, CompraCreate } from "../utils/types/Compra";

export const Compras: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState<Compra[]>([]);
  const [filtered, setFiltered] = useState<Compra[]>([]);
  const [formData, setFormData] = useState<CompraCreate>({
    proyecto_id: 0,
    periodo_id: 0,
    valor: 0,
    fecha: "",
    proveedor: "",
    descripcion: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [periodos, setPeriodos] = useState<any[]>([]);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [compras, proy, per] = await Promise.all([
        getCompras(),
        getProyectos(),
        // getPeriodos(),
      ]);
      setData(compras);
      setFiltered(compras);
      setProyectos(proy);
      // setPeriodos(per);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = data.filter(
      (c) =>
        c.proveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredData);
    setPage(1);
  }, [searchTerm, data]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.proyecto_id) errs.proyecto_id = "Proyecto requerido";
    if (!formData.periodo_id) errs.periodo_id = "Periodo requerido";
    if (formData.valor <= 0) errs.valor = "Valor debe ser mayor a 0";
    if (!formData.fecha?.trim()) errs.fecha = "Fecha requerida";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "valor" ? Number(value) : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (onClose: () => void) => {
    if (!validate()) return;
    try {
      if (editingId !== null) {
        await updateCompra(editingId, formData);
      } else {
        await createCompra(formData);
      }
      await fetchData();
      onClose();
      setFormData({
        proyecto_id: 0,
        periodo_id: 0,
        valor: 0,
        fecha: "",
        proveedor: "",
        descripcion: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (compra: Compra) => {
    setFormData({
      proyecto_id: compra.proyecto_id,
      periodo_id: compra.periodo_id,
      valor: compra.valor,
      fecha: compra.fecha ?? "",
      proveedor: compra.proveedor ?? "",
      descripcion: compra.descripcion ?? "",
    });
    setEditingId(compra.id);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar esta compra?")) {
      await deleteCompra(id);
      await fetchData();
    }
  };

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Compras</h1>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Buscar proveedor o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button
            color="primary"
            onPress={() => {
              setEditingId(null);
              setFormData({
                proyecto_id: 0,
                periodo_id: 0,
                valor: 0,
                fecha: "",
                proveedor: "",
                descripcion: "",
              });
              onOpen();
            }}
          >
            <Icon icon="lucide:plus" className="mr-2 h-4 w-4" /> Nueva
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Cargando..." color="primary" />
        </div>
      ) : (
        <>
          <Table aria-label="Tabla de Compras" removeWrapper>
            <TableHeader>
              <TableColumn>PROYECTO</TableColumn>
              <TableColumn>PERIODO</TableColumn>
              <TableColumn>VALOR</TableColumn>
              <TableColumn>FECHA</TableColumn>
              <TableColumn>PROVEEDOR</TableColumn>
              <TableColumn>DESCRIPCIÓN</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {paginated.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.proyecto_id}</TableCell>
                  <TableCell>{c.periodo_id}</TableCell>
                  <TableCell>${c.valor.toLocaleString()}</TableCell>
                  <TableCell>{c.fecha}</TableCell>
                  <TableCell>{c.proveedor}</TableCell>
                  <TableCell>{c.descripcion}</TableCell>
                  <TableCell>
                    <Tooltip content="Editar">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() => handleEdit(c)}
                      >
                        <Icon icon="lucide:edit" className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Eliminar">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(c.id)}
                      >
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
              total={Math.ceil(filtered.length / itemsPerPage)}
              onChange={setPage}
            />
          </div>
        </>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {editingId !== null ? "Editar Compra" : "Nueva Compra"}
              </ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                <Select
                  label="Proyecto"
                  selectedKeys={[formData.proyecto_id.toString()]}
                  onSelectionChange={(e) =>
                    setFormData({
                      ...formData,
                      proyecto_id: parseInt(Array.from(e)[0]),
                    })
                  }
                  isInvalid={!!errors.proyecto_id}
                  errorMessage={errors.proyecto_id}
                >
                  {proyectos.map((p) => (
                    <SelectItem key={p.id}>{p.nombre}</SelectItem>
                  ))}
                </Select>
                <Select
                  label="Periodo"
                  selectedKeys={[formData.periodo_id.toString()]}
                  onSelectionChange={(e) =>
                    setFormData({
                      ...formData,
                      periodo_id: parseInt(Array.from(e)[0]),
                    })
                  }
                  isInvalid={!!errors.periodo_id}
                  errorMessage={errors.periodo_id}
                >
                  {periodos.map((p) => (
                    <SelectItem key={p.id}>{p.nombre}</SelectItem>
                  ))}
                </Select>
                <Input
                  label="Valor"
                  name="valor"
                  type="number"
                  value={formData.valor.toString()}
                  onChange={handleInput}
                  isInvalid={!!errors.valor}
                  errorMessage={errors.valor}
                />
                <Input
                  label="Fecha"
                  name="fecha"
                  type="date"
                  value={formData.fecha ?? ""}
                  onChange={handleInput}
                  isInvalid={!!errors.fecha}
                  errorMessage={errors.fecha}
                />
                <Input
                  label="Proveedor"
                  name="proveedor"
                  value={formData.proveedor ?? ""}
                  onChange={handleInput}
                />
                <Input
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion ?? ""}
                  onChange={handleInput}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" color="danger" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={() => handleSubmit(onClose)}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
