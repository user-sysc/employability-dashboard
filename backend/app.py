from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import stats as st

app = Flask(__name__)
CORS(app)
df = st.load_data()
@app.route('/api/departamentos')
def get_departamentos():
    deptos = sorted(df['departamento'].unique())
    return jsonify({'departamentos': deptos})


@app.route('/api/anos')
def get_anos():
    return jsonify({'anos': sorted(df['anio'].unique().tolist())})


@app.route('/api/conceptos')
def get_conceptos():
    conceptos = [c for c in df.columns if c not in ['departamento', 'anio', 'sexo']]
    return jsonify({'conceptos': conceptos})


@app.route('/api/datos')
def get_datos():
    depto = request.args.get('departamento', 'todos')
    anio = request.args.get('anio')
    sexo = request.args.get('sexo', 'total')
    concepto = request.args.get('concepto', 'todos')

    mask = pd.Series(True, index=df.index)
    if depto and depto != 'todos':
        mask &= df['departamento'] == depto
    if anio:
        anos_list = [int(a.strip()) for a in anio.split(',')]
        mask &= df['anio'].isin(anos_list)
    if sexo and sexo != 'todos':
        mask &= df['sexo'] == sexo

    result = df[mask].copy()
    if concepto and concepto != 'todos' and concepto in result.columns:
        cols = ['departamento', 'anio', 'sexo', concepto]
        result = result[cols]
        result = result.rename(columns={concepto: 'valor'})
        result['concepto'] = concepto
    else:
        result = result.melt(id_vars=['departamento', 'anio', 'sexo'],
                             var_name='concepto', value_name='valor')

    result = result.dropna(subset=['valor'])
    return jsonify(result.to_dict(orient='records'))


@app.route('/api/estadisticos')
def get_estadisticos():
    depto = request.args.get('departamento', 'todos')
    anio = request.args.get('anio')
    sexo = request.args.get('sexo', 'total')
    concepto = request.args.get('concepto', 'Tasa de Desocupacion (TD)')

    filtered = st.get_filtered_data(df, departamento=depto, anio=anio, sexo=sexo)
    if filtered.empty or concepto not in filtered.columns:
        return jsonify({'error': 'No data'}), 404

    series = filtered[concepto]
    stats = st.calcular_estadisticos(series)
    outliers = st.detectar_outliers(series)
    dist = st.distribucion_normal(series)
    interp = st.interpretar(series, concepto)

    return jsonify({
        'estadisticos': stats,
        'outliers': outliers,
        'distribucion': dist,
        'interpretacion': interp,
    })


@app.route('/api/comparar')
def get_comparar():
    deptos = request.args.get('departamentos', '')
    concepto = request.args.get('concepto', 'Tasa de Desocupacion (TD)')
    anio = request.args.get('anio')

    if not deptos:
        return jsonify({'error': 'departamentos requerido'}), 400
    depto_list = [d.strip() for d in deptos.split(',')]

    mask = df['departamento'].isin(depto_list) & (df['sexo'] == 'total')
    if anio:
        mask &= df['anio'] == int(anio)
    result = df[mask][['departamento', 'anio', concepto]].dropna()
    result = result.rename(columns={concepto: 'valor'})
    return jsonify(result.to_dict(orient='records'))


@app.route('/api/correlacion')
def get_correlacion():
    main_df = st.get_main_df(df)
    corr = st.correlacion_volatilidad(main_df)
    return jsonify(corr)


@app.route('/api/mapa')
def get_mapa():
    anio = request.args.get('anio', '2024')
    sexo = request.args.get('sexo', 'total')
    concepto = request.args.get('concepto', 'Tasa de Desocupacion (TD)')
    mask = (df['anio'] == int(anio)) & (df['sexo'] == sexo)
    data = df[mask][['departamento', concepto]].dropna()
    data = data.rename(columns={concepto: 'valor'})
    return jsonify(data.to_dict(orient='records'))


@app.route('/api/interpretacion')
def get_interpretacion():
    depto = request.args.get('departamento', 'todos')
    sexo = request.args.get('sexo', 'total')
    concepto = request.args.get('concepto', 'Tasa de Desocupacion (TD)')
    anio = request.args.get('anio')
    filtered = st.get_filtered_data(df, departamento=depto, sexo=sexo, anio=anio)
    if filtered.empty or concepto not in filtered.columns:
        return jsonify({'interpretacion': 'No hay datos.'})
    labels = filtered['departamento'].tolist() if 'departamento' in filtered.columns else None
    interp = st.interpretar(filtered[concepto], concepto, labels)
    result = interp
    result['filtro_departamento'] = depto
    result['filtro_concepto'] = concepto
    result['filtro_anio'] = anio or 'todos'
    return jsonify({'interpretacion': result})


@app.route('/api/distribucion-sexo')
def get_distribucion_sexo():
    depto = request.args.get('departamento', 'todos')
    anio = request.args.get('anio')
    concepto = request.args.get('concepto', 'Tasa de Desocupacion (TD)')
    
    mask = pd.Series(True, index=df.index)
    if depto and depto != 'todos':
        mask &= df['departamento'] == depto
    if anio:
        mask &= df['anio'] == int(anio)
    
    filtered = df[mask]
    if filtered.empty or concepto not in filtered.columns:
        return jsonify({'error': 'No data'}), 404
    
    # Calcular valor promedio para cada sexo
    sexo_valores = {}
    for sexo_val in ['hombres', 'mujeres']:
        sexo_mask = filtered['sexo'] == sexo_val
        if sexo_mask.any():
            valor_medio = filtered[sexo_mask][concepto].mean()
            sexo_valores[sexo_val] = float(valor_medio) if pd.notna(valor_medio) else 0
    
    # Calcular porcentaje (proporción del total)
    total = sum(sexo_valores.values())
    sexo_dist = {}
    if total > 0:
        for sexo, valor in sexo_valores.items():
            sexo_dist[sexo] = round((valor / total) * 100, 2)
    else:
        sexo_dist = {sexo: 0 for sexo in sexo_valores.keys()}
    
    return jsonify({'distribucion_sexo': sexo_dist})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
