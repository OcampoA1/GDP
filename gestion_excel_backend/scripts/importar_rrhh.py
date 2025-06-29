import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pandas as pd
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Ruta y hoja del archivo Excel
EXCEL_PATH = "data/01_Historico_Gastos_2024_v2.xlsx"
SHEET_NAME = "Dedicación RRHH"

# Leer hoja (segunda fila como encabezado)
df = pd.read_excel(EXCEL_PATH, sheet_name=SHEET_NAME, header=1)

# Normalizar nombres de columnas
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

# Separar columnas clave
datos_fijos = df[["nombre", "equipo"]]
proyectos = df.drop(columns=["nombre", "equipo", "dedicación_actual_total"], errors="ignore")

# Conectar a la base de datos
db: Session = SessionLocal()

# Recorrer personas y proyectos
for idx, row in datos_fijos.iterrows():
    for proyecto in proyectos.columns:
        dedicacion = df.at[idx, proyecto]
        if pd.notnull(dedicacion) and dedicacion > 0:
            rrhh = models.Rrhh(
                nombre=row["nombre"],
                equipo=row["equipo"],
                proyecto=proyecto,
                dedicacion_total=float(dedicacion)  # ← CAMBIADO AQUÍ
            )
            db.add(rrhh)

db.commit()
db.close()

print("✅ Dedicación RRHH importada exitosamente")
