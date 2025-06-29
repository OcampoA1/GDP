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

# Rutas del archivo y hoja
EXCEL_PATH = "data/01_Historico_Gastos_2024_v2.xlsx"
SHEET_NAME = "0.1 Datos de Proyectos"

# Leer hoja (segunda fila útil como encabezado)
df = pd.read_excel(EXCEL_PATH, sheet_name=SHEET_NAME, header=1)

# Limpiar nombres de columnas
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

# Mostrar columnas para debug
print("🧩 Columnas disponibles:")
print(df.columns.tolist())

# Eliminar filas sin nombre de proyecto
df = df.dropna(subset=["proyecto"])

# Conectar a la base de datos
db: Session = SessionLocal()

# Recorrer las filas del Excel
for _, row in df.iterrows():
    try:
        # Limpiar y validar campos
        nombre = row.get("proyecto", None)
        centro_costo = row.get("centro_de_costo", None)
        subproyecto = row.get("subproyecto", None)
        estado = row.get("estado", None)
        presupuesto = row.get("presupuesto_actual", None)

        # Convertir presupuesto a float si es posible
        presupuesto = float(presupuesto) if pd.notnull(presupuesto) else None

        # Convertir centro_costo siempre a string (puede venir como número)
        centro_costo = str(centro_costo) if pd.notnull(centro_costo) else None

        proyecto = models.Proyecto(
            nombre=nombre,
            centro_costo=centro_costo,
            subproyecto=subproyecto,
            estado=estado,
            presupuesto=presupuesto
        )

        db.add(proyecto)

    except Exception as e:
        print(f"❌ Error en fila: {row.to_dict()}")
        print(f"➡️ {e}")
        continue

# Guardar cambios
db.commit()
db.close()

print("✅ Proyectos importados correctamente con validaciones")
