// Componente profesional para Caja Menor con conexión a API, validaciones y UI lista para producción
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
  getCajaMenor,
  createCajaMenor,
  updateCajaMenor,
  deleteCajaMenor,
  getProyectos,
} from "../utils/controllers/axiosController";
import type { CajaMenor, CajaMenorCreate } from "../utils/types/CajaMenor";

export const CajaMenorComponent: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState<CajaMenor[]>([]);
  const [filtered, setFiltered] = useState<CajaMenor[]>([]);
  const [formData, setFormData] = useState<CajaMenorCreate>({
    proyecto_id: 0,
    periodo_id: 0,
    valor: 0,
    fecha: "",
    responsable: "",
    concepto: "",
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
      const [cajas, proy, per] = await Promise.all([
        getCajaMenor(),
        getProyectos(),
        // getPeriodos(),
      ]);
      setData(cajas);
      setFiltered(cajas);
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
        c.responsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.concepto?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredData);
    setPage(1);
  }, [searchTerm, data]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.proyecto_id) errs.proyecto_id = "Proyecto requerido";
    if (!formData.periodo_id) errs.periodo_id = "Periodo requerido";
    if (formData.valor <= 0) errs.valor = "Valor debe ser mayor a 0";
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
        await updateCajaMenor(editingId, formData);
      } else {
        await createCajaMenor(formData);
      }
      await fetchData();
      onClose();
      setFormData({
        proyecto_id: 0,
        periodo_id: 0,
        valor: 0,
        fecha: "",
        responsable: "",
        concepto: "",
        observaciones: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (caja: CajaMenor) => {
    setFormData({
      proyecto_id: caja.proyecto_id,
      periodo_id: caja.periodo_id,
      valor: caja.valor,
      fecha: caja.fecha ?? "",
      responsable: caja.responsable ?? "",
      concepto: caja.concepto ?? "",
      observaciones: caja.observaciones ?? "",
    });
    setEditingId(caja.id);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este registro de caja menor?")) {
      await deleteCajaMenor(id);
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
        <h1 className="text-2xl font-bold">Caja Menor</h1>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Buscar responsable o concepto..."
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
                responsable: "",
                concepto: "",
                observaciones: "",
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
          <Table aria-label="Tabla de Caja Menor" removeWrapper>
            <TableHeader>
              <TableColumn>PROYECTO</TableColumn>
              <TableColumn>PERIODO</TableColumn>
              <TableColumn>VALOR</TableColumn>
              <TableColumn>FECHA</TableColumn>
              <TableColumn>RESPONSABLE</TableColumn>
              <TableColumn>CONCEPTO</TableColumn>
              <TableColumn>OBSERVACIONES</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {paginated.map((caja) => (
                <TableRow key={caja.id}>
                  <TableCell>{caja.proyecto_id}</TableCell>
                  <TableCell>{caja.periodo_id}</TableCell>
                  <TableCell>${caja.valor.toLocaleString()}</TableCell>
                  <TableCell>{caja.fecha}</TableCell>
                  <TableCell>{caja.responsable}</TableCell>
                  <TableCell>{caja.concepto}</TableCell>
                  <TableCell>{caja.observaciones}</TableCell>
                  <TableCell>
                    <Tooltip content="Editar">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() => handleEdit(caja)}
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
                        onPress={() => handleDelete(caja.id)}
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
                {editingId !== null ? "Editar Caja Menor" : "Nueva Caja Menor"}
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
                />
                <Input
                  label="Responsable"
                  name="responsable"
                  value={formData.responsable ?? ""}
                  onChange={handleInput}
                />
                <Input
                  label="Concepto"
                  name="concepto"
                  value={formData.concepto ?? ""}
                  onChange={handleInput}
                />
                <Input
                  label="Observaciones"
                  name="observaciones"
                  value={formData.observaciones ?? ""}
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
