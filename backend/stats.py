"""Modulo de calculos estadisticos para el analisis de empleabilidad."""
import pandas as pd
import numpy as np
from scipy import stats as sp_stats
import math
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'empleabilidad_full.csv')

CONCEPTOS_PORCENTAJE = [
    'Tasa de Desocupacion (TD)',
    'Tasa de Ocupacion (TO)',
    'Tasa Global de Participacion (TGP)',
    'Tasa de Subocupacion (TS)',
    'Porcentaje poblacion en edad de trabajar',
]


def es_porcentaje(concepto):
    return concepto in CONCEPTOS_PORCENTAJE


def validar_valor(valor, concepto):
    if pd.isna(valor):
        return False
    if es_porcentaje(concepto):
        return 0 <= valor <= 100
    return valor >= 0


def filtrar_serie(series, concepto):
    values = series.dropna()
    if not concepto or not es_porcentaje(concepto):
        return values[values >= 0]
    return values[(values >= 0) & (values <= 100)]


def load_data():
    return pd.read_csv(DATA_PATH)


def get_main_df(df=None):
    if df is None:
        df = load_data()
    return df[df['sexo'] == 'total'].copy()


def _to_native(obj):
    if isinstance(obj, dict):
        return {k: _to_native(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_to_native(v) for v in obj]
    elif isinstance(obj, (np.integer,)):
        return int(obj)
    elif isinstance(obj, (np.floating,)):
        v = float(obj)
        return None if (math.isnan(v) or math.isinf(v)) else v
    elif isinstance(obj, np.bool_):
        return bool(obj)
    return obj


def calcular_estadisticos(series, concepto=''):
    values = filtrar_serie(series, concepto).values
    if len(values) == 0:
        return {}
    mean = float(np.mean(values))
    median = float(np.median(values))
    std = float(np.std(values, ddof=1)) if len(values) > 1 else 0.0
    try:
        mode_result = sp_stats.mode(values)
        mode = float(mode_result.mode) if hasattr(mode_result, 'mode') else float(mode_result[0])
    except Exception:
        mode = float(values[0])
    return _to_native({
        'media': round(mean, 4),
        'mediana': round(median, 4),
        'moda': round(mode, 4),
        'desviacion_estandar': round(std, 4),
        'minimo': round(float(np.min(values)), 4),
        'maximo': round(float(np.max(values)), 4),
        'n': int(len(values)),
    })


def detectar_outliers(series):
    values = series.dropna().values
    if len(values) < 3:
        return []
    mean = np.mean(values)
    std = np.std(values, ddof=1)
    results = []
    for v in values:
        z = (v - mean) / std if std > 0 else 0
        results.append({
            'valor': round(float(v), 4),
            'z_score': round(float(z), 4),
            'es_outlier': bool(abs(z) > 2),
        })
    return results


def distribucion_normal(series, bins=10, concepto=''):
    values = series.dropna().values
    if len(values) < 3:
        return {'labels': [], 'observado': [], 'esperado': []}
    mean = float(np.mean(values))
    std = float(np.std(values, ddof=1))
    hist, edges = np.histogram(values, bins=bins)
    labels = [round(float((edges[i] + edges[i+1]) / 2), 2) for i in range(len(hist))]
    bin_width = edges[1] - edges[0] if len(edges) > 1 else 1
    x = np.linspace(mean - 3*std, mean + 3*std, 100)
    y = sp_stats.norm.pdf(x, mean, std)
    tipo = 'normal'

    return _to_native({
        'labels': labels,
        'observado': hist.tolist(),
        'esperado': (y * len(values) * bin_width).tolist(),
        'curva_x': x.tolist(),
        'curva_y': y.tolist(),
        'media': mean,
        'std': std,
        'tipo': tipo,
    })


def interpretar(series, nombre='', labels=None):
     values = series.dropna().values
     if len(values) == 0:
         return {'resumen': 'No hay datos disponibles.', 'nivel': 'neutral', 'metricas': {}, 'outliers': [], 'comparacion': '', 'top_deptos': {}}
     mean = float(np.mean(values))
     std = float(np.std(values, ddof=1))
     mini = float(np.min(values))
     maxi = float(np.max(values))

     outlier_list = []
     for i, v in enumerate(values):
         z = (v - mean) / std if std > 0 else 0
         if abs(z) > 2:
             outlier_list.append({
                 'valor': round(v, 2),
                 'z_score': round(z, 2),
                 'etiqueta': labels[i] if labels and i < len(labels) else f'#{i+1}',
             })

     above = int(sum(1 for v in values if v > mean))
     below = int(sum(1 for v in values if v < mean))

     if nombre == 'Tasa de Desocupacion (TD)':
          if mean < 8:
               nivel = 'bajo'
               resumen = f'El promedio es {mean:.1f}% — nivel BAJO de desempleo.'
          elif mean < 12:
               nivel = 'moderado'
               resumen = f'El promedio es {mean:.1f}% — nivel MODERADO de desempleo.'
          else:
               nivel = 'alto'
               resumen = f'El promedio es {mean:.1f}% — nivel ALTO de desempleo.'
     elif nombre == 'Tasa de Ocupacion (TO)':
          if mean > 58:
               nivel = 'alto'
               resumen = f'El promedio es {mean:.1f}% — nivel ALTO de ocupacion (señal positiva).'
          elif mean > 52:
               nivel = 'moderado'
               resumen = f'El promedio es {mean:.1f}% — nivel MODERADO de ocupacion.'
          else:
               nivel = 'bajo'
               resumen = f'El promedio es {mean:.1f}% — nivel BAJO de ocupacion.'
     elif nombre == 'Tasa Global de Participacion (TGP)':
          if mean > 70:
               nivel = 'alto'
               resumen = f'El promedio es {mean:.1f}% — nivel ALTO de participacion laboral.'
          elif mean > 55:
               nivel = 'moderado'
               resumen = f'El promedio es {mean:.1f}% — nivel MODERADO de participacion laboral.'
          else:
               nivel = 'bajo'
               resumen = f'El promedio es {mean:.1f}% — nivel BAJO de participacion laboral.'
     elif nombre == 'Tasa de Subocupacion (TS)':
          if mean < 8:
               nivel = 'bajo'
               resumen = f'El promedio es {mean:.1f}% — nivel BAJO de subocupacion.'
          elif mean < 15:
               nivel = 'moderado'
               resumen = f'El promedio es {mean:.1f}% — nivel MODERADO de subocupacion.'
          else:
               nivel = 'alto'
               resumen = f'El promedio es {mean:.1f}% — nivel ALTO de subocupacion.'
     elif nombre == 'Porcentaje poblacion en edad de trabajar':
          if mean > 80:
               nivel = 'alto'
               resumen = f'El promedio es {mean:.1f}% — proporcion ALTA de poblacion en edad de trabajar.'
          elif mean > 70:
               nivel = 'moderado'
               resumen = f'El promedio es {mean:.1f}% — proporcion MODERADA de poblacion en edad de trabajar.'
          else:
               nivel = 'bajo'
               resumen = f'El promedio es {mean:.1f}% — proporcion BAJA de poblacion en edad de trabajar.'
     elif es_porcentaje(nombre):
          nivel = 'moderado'
          resumen = f'El promedio es {mean:.1f}% con desviacion de {std:.2f}.'
     else:
          nivel = 'moderado'
          resumen = f'El promedio es {mean:,.1f} (en miles) con desviacion de {std:,.2f}.'

     # Calcular top 3 deptos más altos y más bajos
     top_deptos = {'mas_altos': [], 'mas_bajos': []}
     if labels:
         deptos_vals = [(labels[i], round(float(v), 2)) for i, v in enumerate(values)]
         deptos_vals_sorted_desc = sorted(deptos_vals, key=lambda x: x[1], reverse=True)
         deptos_vals_sorted_asc = sorted(deptos_vals, key=lambda x: x[1])
         
         top_deptos['mas_altos'] = deptos_vals_sorted_desc[:3]
         top_deptos['mas_bajos'] = deptos_vals_sorted_asc[:3]

     return _to_native({
         'resumen': resumen,
         'nivel': nivel,
         'metricas': {
             'media': round(mean, 2),
             'mediana': round(float(np.median(values)), 2),
             'desviacion': round(std, 2),
             'minimo': round(mini, 2),
             'maximo': round(maxi, 2),
             'n': int(len(values)),
         },
         'outliers': outlier_list,
         'comparacion': f'{above} de {len(values)} por encima de la media, {below} por debajo.',
         'top_deptos': top_deptos,
     })


def get_filtered_data(df, departamento=None, anio=None, sexo=None, concepto=None):
     mask = pd.Series(True, index=df.index)
     if departamento and departamento != 'todos':
         mask &= df['departamento'] == departamento
     if anio:
         anos = [int(a) for a in (anio if isinstance(anio, list) else [anio])]
         mask &= df['anio'].isin(anos)
     if sexo and sexo != 'todos':
         mask &= df['sexo'] == sexo
     result = df[mask].copy()
     if concepto and concepto != 'todos':
         if concepto in result.columns:
             return result[['departamento', 'anio', 'sexo', concepto]]
     return result


def correlacion_volatilidad(df):
    mask = df['sexo'] == 'total'
    deptos = df[mask]
    if 'Tasa de Desocupacion (TD)' not in deptos.columns:
        return {'mensaje': 'No se encuentra la variable TD en los datos.'}
    td_data = deptos.pivot_table(index='anio', columns='departamento', values='Tasa de Desocupacion (TD)')
    if td_data.empty or td_data.shape[1] < 3:
        return {'mensaje': 'No hay datos suficientes para calcular correlacion.'}
    medias = td_data.mean()
    stds = td_data.std()
    if len(medias) < 3:
        return {'mensaje': 'No hay suficientes departamentos para correlacion.'}
    corr = medias.corr(stds)
    return _to_native({
        'coeficiente_correlacion': round(float(corr), 4),
        'interpretacion': (
            'Correlacion positiva fuerte: a mayor TD media, mayor volatilidad.'
            if corr > 0.5 else
            'Correlacion positiva moderada.'
            if corr > 0.3 else
            'Correlacion debil o nula.'
            if abs(corr) < 0.3 else
            'Correlacion negativa.'
        ),
        'departamentos': {
            str(k): {'media_td': round(float(v), 2), 'volatilidad_td': round(float(s), 2)}
            for k, v, s in zip(medias.index, medias.values, stds.values)
        },
    })
