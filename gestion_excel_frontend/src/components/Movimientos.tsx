// Componente profesional para Movimientos con conexión a API, validaciones y UI lista para producción
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
import type { Movimiento, MovimientoCreate } from "../utils/types/Movimiento";
import {
  createMovimiento,
  deleteMovimiento,
  getMovimientos,
  getProyectos,
  updateMovimiento,
} from "../utils/controllers/axiosController";
export const Movimientos: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState<Movimiento[]>([]);
  const [filtered, setFiltered] = useState<Movimiento[]>([]);
  const [formData, setFormData] = useState<MovimientoCreate>({
    periodo_id: null,
    proyecto_id: 0,
    tipo: "Gasto",
    valor: 0,
    fecha: "",
    observaciones: "",
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
      const [movs, proy, pers] = await Promise.all([
        getMovimientos(),
        getProyectos(),
        // getPeriodos()
      ]);
      setData(movs);
      setFiltered(movs);
      setProyectos(proy);
      // setPeriodos(pers);
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
      (m) =>
        m.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.observaciones?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredData);
    setPage(1);
  }, [searchTerm, data]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.periodo_id && formData.periodo_id !== 0)
      errs.periodo_id = "Periodo requerido";
    if (!formData.proyecto_id) errs.proyecto_id = "Proyecto requerido";
    if (!formData.tipo) errs.tipo = "Tipo requerido";
    if (formData.valor <= 0) errs.valor = "Valor debe ser mayor a 0";
    if (!formData.fecha.trim()) errs.fecha = "Fecha requerida";
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
        await updateMovimiento(editingId, formData);
      } else {
        await createMovimiento(formData);
      }
      await fetchData();
      onClose();
      setFormData({
        periodo_id: null,
        proyecto_id: 0,
        tipo: "Gasto",
        valor: 0,
        fecha: "",
        observaciones: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (mov: Movimiento) => {
    setFormData({
      periodo_id: mov.periodo_id ?? null,
      proyecto_id: mov.proyecto_id,
      tipo: mov.tipo,
      valor: mov.valor,
      fecha: mov.fecha,
      observaciones: mov.observaciones ?? "",
    });
    setEditingId(mov.id);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este movimiento?")) {
      await deleteMovimiento(id);
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
        <h1 className="text-2xl font-bold">Movimientos</h1>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Buscar por tipo u observación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button
            color="primary"
            onPress={() => {
              setEditingId(null);
              setFormData({
                periodo_id: null,
                proyecto_id: 0,
                tipo: "Gasto",
                valor: 0,
                fecha: "",
                observaciones: "",
              });
              onOpen();
            }}
          >
            <Icon icon="lucide:plus" className="mr-2 h-4 w-4" /> Nuevo
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner label="Cargando..." color="primary" />
        </div>
      ) : (
        <>
          <Table aria-label="Tabla de Movimientos" removeWrapper>
            <TableHeader>
              <TableColumn>PERIODO</TableColumn>
              <TableColumn>PROYECTO</TableColumn>
              <TableColumn>VALOR</TableColumn>
              <TableColumn>TIPO</TableColumn>
              <TableColumn>FECHA</TableColumn>
              <TableColumn>OBSERVACIONES</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {paginated.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.periodo_id}</TableCell>
                  <TableCell>{m.proyecto_id}</TableCell>
                  <TableCell>${m.valor.toLocaleString()}</TableCell>
                  <TableCell>{m.tipo}</TableCell>
                  <TableCell>{m.fecha}</TableCell>
                  <TableCell>{m.observaciones}</TableCell>
                  <TableCell>
                    <Tooltip content="Editar">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() => handleEdit(m)}
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
                        onPress={() => handleDelete(m.id)}
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
                {editingId !== null ? "Editar Movimiento" : "Nuevo Movimiento"}
              </ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                <Select
                  label="Periodo"
                  selectedKeys={[formData.periodo_id?.toString() ?? ""]}
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
                  label="Tipo"
                  selectedKeys={[formData.tipo]}
                  onSelectionChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo: Array.from(e)[0] as string,
                    })
                  }
                >
                  <SelectItem key="Ingreso">Ingreso</SelectItem>
                  <SelectItem key="Gasto">Gasto</SelectItem>
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
                  value={formData.fecha}
                  onChange={handleInput}
                  isInvalid={!!errors.fecha}
                  errorMessage={errors.fecha}
                />
                <Input
                  label="Observaciones"
                  name="observaciones"
                  value={formData.observaciones}
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
