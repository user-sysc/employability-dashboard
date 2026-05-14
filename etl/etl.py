"""
ETL: Procesamiento del archivo Excel GEIH -> CSV limpio
Analizador Dinamico de Empleabilidad Nacional (datos reales GEIH)
"""
import pandas as pd
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
OUT_DIR = BASE_DIR.parent / 'data'
RAW_CANDIDATES = [
    BASE_DIR / 'anex-GEIHDepartamentos-2025.xls',
    BASE_DIR / 'anex-GEIHDepartamentos-2025.xlsx',
    BASE_DIR.parent / 'anex-GEIHDepartamentos-2025.xls',
    BASE_DIR.parent / 'anex-GEIHDepartamentos-2025.xlsx',
]
os.makedirs(OUT_DIR, exist_ok=True)

LIMITACIONES = [
    'El archivo GEIH trabaja a nivel departamental, no por ciudad.',
    'Arauca y Amazonas no aparecen en los 23 departamentos del archivo.',
    'Bogota se aproxima mediante Cundinamarca en el mapa y comparaciones.',
]


def resolve_raw_file():
    for candidate in RAW_CANDIDATES:
        if candidate.exists():
            return candidate
    checked = '\n'.join(f'- {path}' for path in RAW_CANDIDATES)
    raise FileNotFoundError(
        'No se encontro el archivo fuente GEIH. Rutas revisadas:\n'
        f'{checked}'
    )


def norm(s):
    """Normalizar encoding de caracteres especiales."""
    r = s.strip()
    r = r.replace('\u00c3\u00b3', 'o').replace('\u00c3\u00a1', 'a').replace('\u00c3\u00a9', 'e').replace('\u00c3\u00ad', 'i').replace('\u00c3\u00ba', 'u').replace('\u00c3\u00b1', 'n')
    r = r.replace('\u00f3', 'o').replace('\u00e1', 'a').replace('\u00e9', 'e').replace('\u00ed', 'i').replace('\u00fa', 'u').replace('\u00f1', 'n')
    r = r.replace('\u00d3', 'O').replace('\u00c1', 'A').replace('\u00c9', 'E').replace('\u00cd', 'I').replace('\u00da', 'U').replace('\u00d1', 'N')
    return r


def parse_sheet(xl, sheet_name, sexo='total'):
    print(f"  Leyendo hoja: {sheet_name}")
    df = pd.read_excel(xl, sheet_name=sheet_name, header=None)
    registros = []

    # Find all department start rows
    rows_raw = []
    i = 0
    while i < len(df):
        v = df.iloc[i, 0]
        if pd.notna(v) and isinstance(v, str) and v.strip():
            if i + 1 < len(df) and pd.notna(df.iloc[i+1, 0]) and norm(str(df.iloc[i+1, 0])) == 'Concepto':
                rows_raw.append(i)
                i += 18
                continue
        i += 1

    print(f"    Departamentos encontrados: {len(rows_raw)}")

    for start in rows_raw:
        depto = norm(str(df.iloc[start, 0]))
        yr_row = start + 2

        years = []
        for c in range(1, 20):
            v = df.iloc[yr_row, c]
            if pd.notna(v):
                years.append(int(float(v)))

        concept_indices = {
            'Porcentaje poblacion en edad de trabajar': 3,
            'Tasa Global de Participacion (TGP)': 4,
            'Tasa de Ocupacion (TO)': 5,
            'Tasa de Desocupacion (TD)': 6,
            'Tasa de Subocupacion (TS)': 7,
            'Poblacion total': 9,
            'Poblacion en edad de trabajar (PET)': 10,
            'Fuerza de trabajo': 11,
            'Poblacion ocupada': 12,
            'Poblacion desocupada': 13,
            'Poblacion fuera de la fuerza de trabajo': 14,
            'Poblacion subocupada': 15,
            'Fuerza de trabajo potencial': 16,
        }

        for concepto, offset in concept_indices.items():
            data_row = start + offset
            for ci, anio in enumerate(years):
                if ci + 1 < 20:
                    val = df.iloc[data_row, ci + 1]
                    if pd.notna(val):
                        registros.append({
                            'departamento': depto,
                            'anio': anio,
                            'concepto': concepto,
                            'valor': float(val),
                            'sexo': sexo,
                        })

    print(f"    Registros generados: {len(registros)}")
    return registros


def generar_proyeccion_2026(pivoted):
    """Proyecta 2026 usando la variacion 2024-2025."""
    conceptos = [c for c in pivoted.columns if c not in ['departamento','anio','sexo']]
    filas_2026 = []
    grupos = pivoted[pivoted['anio'].isin([2024, 2025])].groupby(['departamento','sexo'])
    for (depto, sexo), grupo in grupos:
        a24 = grupo[grupo['anio']==2024]
        a25 = grupo[grupo['anio']==2025]
        if a24.empty or a25.empty:
            continue
        r24 = a24.iloc[0]
        r25 = a25.iloc[0]
        proy = {'departamento': depto, 'anio': 2026, 'sexo': sexo}
        for c in conceptos:
            v24 = r24[c]
            v25 = r25[c]
            if pd.notna(v24) and pd.notna(v25):
                diff = v25 - v24
                proy[c] = max(v25 + diff, 0)
            else:
                proy[c] = v25 if pd.notna(v25) else v24 if pd.notna(v24) else None
        filas_2026.append(proy)
    if filas_2026:
        df_2026 = pd.DataFrame(filas_2026)
        pivoted = pd.concat([pivoted, df_2026], ignore_index=True)
        print(f"  Proyeccion 2026 generada: {len(filas_2026)} filas")
    return pivoted


def main():
    print("=== ETL: Procesando datos GEIH ===")
    raw_file = resolve_raw_file()
    xl = pd.ExcelFile(raw_file)
    print(f"Archivo: {raw_file}")
    print(f"Hojas disponibles: {xl.sheet_names}")
    print("\nAlcance del analisis:")
    for item in LIMITACIONES:
        print(f"  - {item}")

    todos = []
    config_sheets = [
        ('total', 'Departamentos anual'),
        ('hombres', 'Departamentos anual hombres'),
        ('mujeres', 'Departamentos anual mujeres'),
    ]
    for sexo, sheet_name in config_sheets:
        print(f"\nProcesando: sexo={sexo}")
        r = parse_sheet(xl, sheet_name, sexo)
        todos.extend(r)

    df_final = pd.DataFrame(todos)
    if df_final.empty:
        print("ERROR: No se generaron registros")
        return

    pivoted = df_final.pivot_table(
        index=['departamento', 'anio', 'sexo'],
        columns='concepto',
        values='valor'
    ).reset_index()
    pivoted.columns.name = None

    pivoted = generar_proyeccion_2026(pivoted)

    pivoted = pivoted.sort_values(['departamento', 'anio', 'sexo']).reset_index(drop=True)

    out_csv = OUT_DIR / 'empleabilidad_full.csv'
    pivoted.to_csv(out_csv, index=False, encoding='utf-8')
    print(f"\nGuardado: {out_csv} -> {len(pivoted)} filas")

    print("\n=== ETL COMPLETADO ===")
    print(f"Departamentos ({len(pivoted['departamento'].unique())}): {sorted(pivoted['departamento'].unique())}")
    cols = [c for c in pivoted.columns if c not in ['departamento','anio','sexo']]
    print(f"Conceptos: {cols}")
    print(f"Años: {sorted(pivoted['anio'].unique())}")


if __name__ == '__main__':
    main()
