import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pandas as pd
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from dotenv import load_dotenv
from datetime import datetime

# Cargar variables de entorno
load_dotenv()

EXCEL_PATH = "data/01_Historico_Gastos_2024_v2.xlsx"
SHEET_NAME = "1. GastosXProyecto"

# Leer hoja con encabezados desde la fila 3 (índice 2)
df = pd.read_excel(EXCEL_PATH, sheet_name=SHEET_NAME, header=2)

# Normalizar columnas
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

# Renombrar columnas relevantes
df = df.rename(columns={
    "subproyecto": "nombre_proyecto",
    "total": "valor",
    "mes": "mes",
    "fecha_inicio": "fecha"
})

# Conectar a la base de datos
db: Session = SessionLocal()

# Insertar movimientos
for _, row in df.iterrows():
    if pd.isnull(row["nombre_proyecto"]) or pd.isnull(row["valor"]):
        continue

    # Buscar proyecto por nombre
    proyecto = db.query(models.Proyecto).filter_by(nombre=row["nombre_proyecto"]).first()
    if not proyecto:
        print(f"⚠️ Proyecto no encontrado: {row['nombre_proyecto']}")
        continue

    movimiento = models.Movimiento(
        proyecto_id=proyecto.id,
        fecha=row["fecha"] if not pd.isnull(row["fecha"]) else datetime.now().date(),
        valor=row["valor"]
    )
    db.add(movimiento)

db.commit()
db.close()
print("✅ Movimientos importados exitosamente")
