
-- Esquema de base de datos para proyecto de gestión de Excel

CREATE TABLE rrhh (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    rol TEXT,
    equipo TEXT,
    dedicacion_total NUMERIC
);

CREATE TABLE proyectos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    centro_costo TEXT,
    subproyecto TEXT,
    estado TEXT,
    presupuesto NUMERIC
);

CREATE TABLE periodos (
    id SERIAL PRIMARY KEY,
    nombre TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    es_consolidado BOOLEAN DEFAULT FALSE
);

CREATE TABLE movimientos (
    id SERIAL PRIMARY KEY,
    periodo_id INTEGER REFERENCES periodos(id),
    proyecto_id INTEGER REFERENCES proyectos(id),
    centro_costo TEXT,
    subproyecto TEXT,
    tipo TEXT,
    fecha DATE,
    valor NUMERIC,
    descripcion TEXT,
    observaciones TEXT
);

CREATE TABLE sueldos (
    id SERIAL PRIMARY KEY,
    periodo_id INTEGER REFERENCES periodos(id),
    rrhh_id INTEGER REFERENCES rrhh(id),
    proyecto_id INTEGER REFERENCES proyectos(id),
    horas INT,
    valor NUMERIC,
    fecha DATE
);

CREATE TABLE compras (
    id SERIAL PRIMARY KEY,
    periodo_id INTEGER REFERENCES periodos(id),
    proyecto_id INTEGER REFERENCES proyectos(id),
    proveedor TEXT,
    descripcion TEXT,
    valor NUMERIC,
    forma_pago TEXT,
    estado TEXT,
    fecha DATE
);

CREATE TABLE caja_menor (
    id SERIAL PRIMARY KEY,
    periodo_id INTEGER REFERENCES periodos(id),
    proyecto_id INTEGER REFERENCES proyectos(id),
    descripcion TEXT,
    valor NUMERIC,
    responsable TEXT,
    fecha DATE
);

CREATE TABLE administracion (
    id SERIAL PRIMARY KEY,
    tipo_costo TEXT,
    descripcion TEXT,
    periodicidad TEXT,
    valor NUMERIC,
    fecha DATE
);

CREATE TABLE presupuesto (
    id SERIAL PRIMARY KEY,
    proyecto_id INTEGER REFERENCES proyectos(id),
    año INT,
    total_aprobado NUMERIC,
    total_ejecutado NUMERIC,
    ejecucion_porcentaje NUMERIC
);

CREATE TABLE presupuesto_vs_gasto (
    id SERIAL PRIMARY KEY,
    proyecto_id INTEGER REFERENCES proyectos(id),
    concepto TEXT,
    presupuesto NUMERIC,
    ejecutado NUMERIC,
    diferencia NUMERIC
);

CREATE TABLE gasto_x_proyecto (
    id SERIAL PRIMARY KEY,
    proyecto_id INTEGER REFERENCES proyectos(id),
    total_gastos NUMERIC,
    categoria TEXT,
    fecha DATE
);
