import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pandas as pd
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

EXCEL_PATH = "data/01_Historico_Gastos_2024_v2.xlsx"
SHEET_NAME = "2. Sueldos"

# Leer el Excel con encabezado en la fila 2 (índice 2)
df = pd.read_excel(EXCEL_PATH, sheet_name=SHEET_NAME, header=2)
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

# Normalizar nombres esperados
df = df.rename(columns={
    "rrhh": "nombre",
    "costo": "valor",
    "subproyecto": "proyecto"
})

# Conectar a la BD
db: Session = SessionLocal()

# Cache de búsquedas para evitar repetir queries
rrhh_cache = {}
proyecto_cache = {}
periodo_cache = {}

# Insertar registros
for _, row in df.iterrows():
    nombre = row.get("nombre")
    mes = row.get("mes")
    valor = row.get("valor")
    proyecto = row.get("proyecto")
    
    if pd.isnull(nombre) or pd.isnull(mes) or pd.isnull(valor) or pd.isnull(proyecto):
        continue

    # Buscar IDs relacionados
    if nombre not in rrhh_cache:
        rrhh = db.query(models.Rrhh).filter_by(nombre=nombre.strip()).first()
        rrhh_cache[nombre] = rrhh.id if rrhh else None
    rrhh_id = rrhh_cache[nombre]

    if proyecto not in proyecto_cache:
        pr = db.query(models.Proyecto).filter(models.Proyecto.nombre.ilike(f"%{proyecto.strip()}%")).first()
        proyecto_cache[proyecto] = pr.id if pr else None
    proyecto_id = proyecto_cache[proyecto]

    if mes not in periodo_cache:
        p = db.query(models.Periodo).filter_by(nombre=mes.strip()).first()
        periodo_cache[mes] = p.id if p else None
    periodo_id = periodo_cache[mes]

    if not all([rrhh_id, proyecto_id, periodo_id]):
        continue  # Si falta alguna FK, se omite

    sueldo = models.Sueldo(
        rrhh_id=rrhh_id,
        proyecto_id=proyecto_id,
        periodo_id=periodo_id,
        horas=None,  # puedes poner cálculo aquí si aplica
        valor=float(valor),
        fecha=datetime.now().date()
    )
    db.add(sueldo)

db.commit()
db.close()

print("✅ Sueldos importados correctamente")
