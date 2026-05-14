// Lista de conceptos que son tasas (porcentajes)
const CONCEPTOS_TASA = [
  'Tasa de Desocupacion (TD)',
  'Tasa de Ocupacion (TO)',
  'Tasa Global de Participacion (TGP)',
  'Tasa de Subocupacion (TS)',
  'Porcentaje poblacion en edad de trabajar'
];

function isTasa(concepto) {
  return CONCEPTOS_TASA.includes(concepto);
}

function renderInterpretation(data) {
  const el = document.getElementById('interpretacion');
  if (!data || !data.resumen) {
    el.innerHTML = '<p class="interp-empty">Seleccione filtros para ver la interpretacion.</p>';
    return;
  }

  const concepto = window.state ? window.state.concepto : '';
  const unidad = isTasa(concepto) ? '%' : '';
  const nivelClass = data.nivel === 'alto' ? 'nivel-alto' : data.nivel === 'bajo' ? 'nivel-bajo' : 'nivel-moderado';
  const m = data.metricas;
  const rango = (m.maximo - m.minimo).toFixed(2);

  let html = `
    <div class="interp-header">
      <span class="interp-badge ${nivelClass}">${data.nivel.toUpperCase()}</span>
      <p class="interp-resumen">${data.resumen}</p>
    </div>
    <div class="interp-metrics">
      <div class="interp-metric"><span class="im-label">Media</span><span class="im-val">${m.media}${unidad}</span></div>
      <div class="interp-metric"><span class="im-label">Mediana</span><span class="im-val">${m.mediana}${unidad}</span></div>
      <div class="interp-metric"><span class="im-label">Desv.Est</span><span class="im-val">${m.desviacion}${unidad}</span></div>
      <div class="interp-metric"><span class="im-label">Min</span><span class="im-val">${m.minimo}${unidad}</span></div>
      <div class="interp-metric"><span class="im-label">Max</span><span class="im-val">${m.maximo}${unidad}</span></div>
      <div class="interp-metric"><span class="im-label">Rango</span><span class="im-val">${rango}${unidad}</span></div>
      <div class="interp-metric"><span class="im-label">n</span><span class="im-val">${m.n}</span></div>
    </div>
    <p class="interp-comparacion">${data.comparacion}</p>
  `;

  if (data.outliers && data.outliers.length > 0) {
    html += '<div class="interp-outliers"><strong>Valores atipicos detectados (|z| &gt; 2):</strong><ul>';
    data.outliers.forEach(o => {
      html += `<li><span class="outlier-depto">${o.etiqueta}</span>: ${o.valor}${unidad} <span class="outlier-z">(z=${o.z_score})</span></li>`;
    });
    html += '</ul></div>';
  } else {
    html += '<p class="interp-no-outliers">No se detectaron valores atipicos significativos (|z| &gt; 2).</p>';
  }

  // Agregar Top 5 departamentos en dos columnas
  if (data.top_deptos) {
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px;">';
    
    if (data.top_deptos.mas_altos && data.top_deptos.mas_altos.length > 0) {
      html += '<div class="interp-top-deptos">';
      html += '<strong style="font-size:0.9rem;">Deptos con valores más altos:</strong><ul style="list-style:none;padding:0;margin:4px 0;">';
      data.top_deptos.mas_altos.forEach((d, i) => {
        html += `<li style="background:#e8f5e9;padding:4px 8px;margin-bottom:2px;border-radius:4px;border-left:3px solid #27ae60;font-size:0.85rem;"><span style="font-weight:600;">${i+1}. ${d[0]}</span>: <span style="color:#27ae60;font-weight:700;">${d[1]}${unidad}</span></li>`;
      });
      html += '</ul></div>';
    }
    
    if (data.top_deptos.mas_bajos && data.top_deptos.mas_bajos.length > 0) {
      html += '<div class="interp-top-deptos">';
      html += '<strong style="font-size:0.9rem;">Deptos con valores más bajos:</strong><ul style="list-style:none;padding:0;margin:4px 0;">';
      data.top_deptos.mas_bajos.forEach((d, i) => {
        html += `<li style="background:#fce4ec;padding:4px 8px;margin-bottom:2px;border-radius:4px;border-left:3px solid #e74c3c;font-size:0.85rem;"><span style="font-weight:600;">${i+1}. ${d[0]}</span>: <span style="color:#e74c3c;font-weight:700;">${d[1]}${unidad}</span></li>`;
      });
      html += '</ul></div>';
    }
    
    html += '</div>';
  }

  el.innerHTML = html;
}

function renderCorrelation(data) {
  const el = document.getElementById('correlacion-content');
  if (data.mensaje) {
    el.innerHTML = `<p>${data.mensaje}</p>`;
    return;
  }
  el.innerHTML = `
    <p><strong>Coeficiente de Correlacion: ${data.coeficiente_correlacion}</strong></p>
    <p>${data.interpretacion}</p>
    <p style="font-size:0.8rem;color:#7f8c8d;margin-top:4px;">
      Relacion entre la TD media (2021-2025) y su desviacion estandar (volatilidad) por departamento.
    </p>
  `;
  const deptos = Object.entries(data.departamentos);
  const labels = deptos.map(([k]) => k);
  const medias = deptos.map(([, v]) => v.media_td);
  const volatilidades = deptos.map(([, v]) => v.volatilidad_td);
  createCorrChart(document.getElementById('chart-correlacion'), labels, medias, volatilidades);
}
