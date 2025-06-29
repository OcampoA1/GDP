import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")

import pandas as pd
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models

# Leer archivo y hoja
archivo = "data/01_Historico_Gastos_2024_v2.xlsx"
df_original = pd.read_excel(archivo, sheet_name="6. Administración", header=None)

# Buscar encabezado real
header_index = df_original[df_original.iloc[:, 0] == "Nombre del Costo"].index[0]
df = df_original.iloc[header_index + 1:, [0, 3, 4]]
df.columns = ["tipo_costo", "periodicidad", "valor"]

print("📄 Columnas formateadas:", df.columns)
print(df.head(10))

# Conexión a BD
db: Session = SessionLocal()
insertados = 0

for _, row in df.iterrows():
    if pd.isnull(row["valor"]):
        continue

    gasto = models.Administracion(
        tipo_costo=row["tipo_costo"] if not pd.isnull(row["tipo_costo"]) else None,
        descripcion=None,
        periodicidad=row["periodicidad"] if not pd.isnull(row["periodicidad"]) else None,
        valor=row["valor"],
        fecha=None
    )
    db.add(gasto)
    insertados += 1

db.commit()
print(f"✅ Registros importados: {insertados}")
