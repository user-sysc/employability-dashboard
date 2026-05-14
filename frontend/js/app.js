const API = 'http://localhost:5000/api';
let state = { anio: '2025', depto: 'todos', concepto: 'Tasa de Desocupacion (TD)', sexo: 'total' };

async function apiFetch(endpoint) {
  try {
    const r = await fetch(`${API}${endpoint}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch (e) {
    console.warn(`API error: ${endpoint}`, e);
    return null;
  }
}

const CONCEPTOS_DESC = {
  'Porcentaje poblacion en edad de trabajar': 'Relacion porcentual entre la poblacion en edad de trabajar (PET) y la poblacion total (PT).',
  'Tasa Global de Participacion (TGP)': 'Porcentaje de la poblacion en edad de trabajar que participa activamente en el mercado laboral (ocupados + buscando empleo).',
  'Tasa de Desocupacion (TD)': 'Porcentaje de la fuerza de trabajo que esta desempleada, es decir, no tiene trabajo pero esta buscando activamente.',
  'Tasa de Ocupacion (TO)': 'Porcentaje de la poblacion en edad de trabajar que actualmente tiene un empleo.',
  'Tasa de Subocupacion (TS)': 'Porcentaje de ocupados que desean y estan disponibles para trabajar mas horas, mejorar ingresos o tener una labor acorde a sus competencias.',
  'Poblacion total': 'Poblacion civil no institucional residente en hogares particulares (en miles).',
  'Poblacion en edad de trabajar (PET)': 'Personas de 15 años y mas, base de la poblacion economicamente activa (en miles).',
  'Fuerza de trabajo': 'Personas en edad de trabajar que trabajan o buscan trabajo activamente (en miles).',
  'Poblacion ocupada': 'Personas de 15 años y mas que trabajaron al menos una hora remunerada en la semana de referencia (en miles).',
  'Poblacion desocupada': 'Personas sin empleo que buscaron trabajo activamente en las ultimas 4 semanas y estan disponibles (en miles).',
  'Poblacion fuera de la fuerza de trabajo': 'Personas en edad de trabajar que no trabajan ni buscan trabajo (estudiantes, hogar, pensionados, etc.) (en miles).',
  'Poblacion subocupada': 'Ocupados que manifiestan querer y poder trabajar mas horas, mejorar ingresos o cambiar a una labor acorde a sus competencias (en miles).',
  'Fuerza de trabajo potencial': 'Personas fuera de la fuerza laboral que tienen interes en trabajar pero no estan disponibles o no buscaron activamente (en miles).',
};

function actualizarDescripcion() {
  const sel = document.getElementById('filter-concepto');
  const desc = document.getElementById('concepto-desc');
  const texto = CONCEPTOS_DESC[sel.value];
  desc.textContent = texto || '';
}

async function loadFilters() {
  const [anos, conceptos] = await Promise.all([
    apiFetch('/anos'),
    apiFetch('/conceptos'),
  ]);
  if (anos) {
    const sel = document.getElementById('filter-anio');
    anos.anos.forEach(a => { const o = document.createElement('option'); o.value = a; o.textContent = a; sel.appendChild(o); });
    sel.value = '2025';
  }
  if (conceptos) {
    const sel = document.getElementById('filter-concepto');
    conceptos.conceptos.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; sel.appendChild(o); });
    sel.value = 'Tasa de Desocupacion (TD)';
    actualizarDescripcion();
  }
}

async function loadDeptos() {
  const data = await apiFetch('/departamentos');
  if (!data) return;
  const sel = document.getElementById('filter-depto');
  data.departamentos.forEach(d => {
    const o = document.createElement('option');
    o.value = d; o.textContent = d; sel.appendChild(o);
  });
}

async function updateAll() {
  state.anio = document.getElementById('filter-anio').value;
  state.depto = document.getElementById('filter-depto').value;
  state.concepto = document.getElementById('filter-concepto').value;
  state.sexo = document.getElementById('filter-sexo').value;

  const deptoParam = state.depto;
  const anioParam = state.anio;

  const [statsData, mapData, trendData, interpData, corrData, nacionalData, sexoData] = await Promise.all([
    apiFetch(`/estadisticos?departamento=${deptoParam}&anio=${anioParam}&concepto=${state.concepto}&sexo=${state.sexo}`),
    apiFetch(`/mapa?anio=${anioParam}&concepto=${state.concepto}&sexo=${state.sexo}`),
    apiFetch(`/datos?concepto=${state.concepto}&sexo=${state.sexo}`),
    apiFetch(`/interpretacion?departamento=${deptoParam}&concepto=${state.concepto}&anio=${anioParam}&sexo=${state.sexo}`),
    apiFetch('/correlacion'),
    apiFetch(`/mapa?anio=${anioParam}&concepto=Tasa%20de%20Desocupacion%20(TD)&sexo=${state.sexo}`),
    apiFetch(`/distribucion-sexo?departamento=${deptoParam}&anio=${anioParam}&concepto=${state.concepto}`),
  ]);

  updateKPIs(statsData);
  updateNacionalTD(nacionalData);
  updateMapData(mapData);
  updateBarChart(mapData);
  updateTrendChart(trendData);
  updateDistChart(statsData);
  updatePieChart(sexoData);
  if (interpData) renderInterpretation(interpData.interpretacion || interpData);
  if (corrData) renderCorrelation(corrData);
}

const tooltipConfig = {
  'kpi-media': {
    label: 'Media',
    desc: 'Promedio aritmetico de todos los valores del indicador para los filtros aplicados.',
    detail: n => `Calculado sobre ${n} registros. Suma total dividida entre la cantidad de datos.`,
  },
  'kpi-mediana': {
    label: 'Mediana',
    desc: 'Valor central de la distribucion. El 50% de los datos esta por debajo y el 50% por encima.',
    detail: n => `Ordenando los ${n} valores, es el que queda exactamente en la posicion central.`,
  },
  'kpi-moda': {
    label: 'Moda',
    desc: 'Valor que aparece con mayor frecuencia en el conjunto de datos.',
    detail: n => `De ${n} registros, es el valor que mas veces se repite.`,
  },
  'kpi-desviacion': {
    label: 'Desviacion Estandar',
    desc: 'Mide la dispersion de los datos respecto a la media. A mayor valor, mayor variabilidad.',
    detail: n => `Raiz cuadrada de la varianza muestral (${n} datos).`,
  },
  'kpi-minimo': {
    label: 'Minimo',
    desc: 'Valor mas bajo registrado para los filtros seleccionados.',
    detail: n => `El menor valor encontrado entre los ${n} registros analizados.`,
  },
  'kpi-maximo': {
    label: 'Maximo',
    desc: 'Valor mas alto registrado para los filtros seleccionados.',
    detail: n => `El mayor valor encontrado entre los ${n} registros analizados.`,
  },
};

function setupKpiTooltips() {
  const tooltip = document.getElementById('kpi-tooltip');
  function showTip(html) {
    tooltip.innerHTML = html;
    tooltip.classList.add('visible');
  }
  function moveTip(e) {
    tooltip.style.left = (e.clientX + 16) + 'px';
    tooltip.style.top = (e.clientY - 10) + 'px';
  }
  function hideTip() {
    tooltip.classList.remove('visible');
  }

  Object.keys(tooltipConfig).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const card = el.closest('.kpi-card');
    if (!card) return;
    card.addEventListener('mouseenter', () => {
      const cfg = tooltipConfig[id];
      const val = el.textContent;
      const conteo = window._kpiN || 0;
      showTip(`
        <div class="tt-title">${cfg.label}</div>
        <div class="tt-value">${val}</div>
        <div class="tt-desc">${cfg.desc}</div>
        <div class="tt-detail">${cfg.detail(conteo)}</div>
      `);
    });
    card.addEventListener('mousemove', moveTip);
    card.addEventListener('mouseleave', hideTip);
  });

  const nacCard = document.getElementById('kpi-nacional-card');
  if (nacCard) {
    nacCard.addEventListener('mouseenter', () => {
      const c = window._nacTip;
      if (!c) return;
      showTip(`
        <div class="tt-title">${c.title}</div>
        <div class="tt-value">${c.value}</div>
        <div class="tt-desc">${c.desc}</div>
        <div class="tt-detail">${c.detail}</div>
      `);
    });
    nacCard.addEventListener('mousemove', moveTip);
    nacCard.addEventListener('mouseleave', hideTip);
  }
}

function updateKPIs(data) {
  if (!data || !data.estadisticos) return;
  const e = data.estadisticos;
  const concepto = document.getElementById('filter-concepto').value;
  const unidad = isTasa(concepto) ? '%' : '';
  window._kpiN = e.n ?? 0;
  document.getElementById('kpi-media').textContent = (e.media?.toFixed(2) ?? '-') + unidad;
  document.getElementById('kpi-mediana').textContent = (e.mediana?.toFixed(2) ?? '-') + unidad;
  document.getElementById('kpi-moda').textContent = (e.moda?.toFixed(2) ?? '-') + unidad;
  document.getElementById('kpi-desviacion').textContent = (e.desviacion_estandar?.toFixed(2) ?? '-') + unidad;
  document.getElementById('kpi-minimo').textContent = (e.minimo?.toFixed(2) ?? '-') + unidad;
  document.getElementById('kpi-maximo').textContent = (e.maximo?.toFixed(2) ?? '-') + unidad;
}

function updateNacionalTD(data) {
  const el = document.getElementById('kpi-nacional');
  const label = document.getElementById('kpi-nacional-label');
  const depto = document.getElementById('filter-depto').value;
  const sexo = document.getElementById('filter-sexo').value;
  if (!data || !Array.isArray(data) || data.length === 0) {
    el.textContent = '-'; label.textContent = 'Desempleo Nacional'; return;
  }
  if (depto && depto !== 'todos') {
    const match = data.find(d => d.departamento === depto);
    if (match) {
      el.textContent = `${match.valor.toFixed(1)}%`;
      label.textContent = `Desempleo ${depto}`;
      window._nacTip = {
        title: `Tasa de Desocupacion - ${depto}`,
        value: `${match.valor.toFixed(2)}%`,
        desc: `Tasa de desempleo de ${depto} en ${state.anio} para sexo=${sexo}.`,
        detail: `Fuente: DANE GEIH ${state.anio}`,
      };
    } else {
      el.textContent = '-'; label.textContent = `Desempleo ${depto}`;
    }
  } else {
    const avg = data.reduce((s, d) => s + d.valor, 0) / data.length;
    const high = data.reduce((a, b) => a.valor > b.valor ? a : b);
    const low = data.reduce((a, b) => a.valor < b.valor ? a : b);
    el.textContent = `${avg.toFixed(1)}%`;
    label.textContent = 'Desempleo Nacional';
    window._nacTip = {
      title: 'Tasa de Desocupacion Nacional',
      value: `${avg.toFixed(2)}%`,
      desc: `Promedio simple de los ${data.length} departamentos en ${state.anio} para sexo=${sexo}.`,
      detail: `Mayor: ${high.departamento} (${high.valor.toFixed(1)}%) | Menor: ${low.departamento} (${low.valor.toFixed(1)}%)`,
    };
  }
}

function updateMapData(data) {
  if (!data || !Array.isArray(data)) return;
  updateMap(data, state.concepto, state.depto);
}

function updateBarChart(mapData) {
  if (!mapData || !Array.isArray(mapData) || mapData.length === 0) return;
  const sorted = [...mapData].sort((a, b) => a.valor - b.valor);
  const labels = sorted.map(d => d.departamento);
  const values = sorted.map(d => d.valor);
  createBarChart(document.getElementById('chart-bar'), labels, values, `${state.concepto} - ${state.anio}`, state.concepto);
}

function updateTrendChart(data) {
  if (!data || !Array.isArray(data) || data.length === 0) return;
  
  // Agrupar por departamento (no por región)
  const grouped = {};
  data.forEach(d => {
    if (!grouped[d.departamento]) grouped[d.departamento] = [];
    grouped[d.departamento].push({ anio: d.anio, valor: d.valor });
  });
  
  const anos = [...new Set(data.map(d => d.anio))].sort();
  
  // Palette de 23 colores para los departamentos
  const deptoColors = {
    'Atlantico': '#e74c3c',
    'Bogota': '#3498db',
    'Bolivar': '#2ecc71',
    'Boyaca': '#f39c12',
    'Caldas': '#9b59b6',
    'Cauca': '#1abc9c',
    'Cesar': '#e67e22',
    'Cordoba': '#34495e',
    'Cundinamarca': '#c0392b',
    'Choco': '#16a085',
    'Huila': '#8e44ad',
    'La Guajira': '#27ae60',
    'Magdalena': '#2980b9',
    'Meta': '#d35400',
    'Narino': '#c0392b',
    'Norte de Santander': '#16a085',
    'Quindio': '#8e44ad',
    'Risaralda': '#27ae60',
    'Santander': '#2980b9',
    'Sucre': '#d35400',
    'Tolima': '#e74c3c',
    'Valle': '#3498db',
    'Vichada': '#2ecc71',
  };
  
  const datasets = Object.entries(grouped).map(([depto, vals]) => {
    const porAnio = {};
    vals.forEach(v => {
      porAnio[v.anio] = v.valor;  // Valor directo del departamento
    });
    const datos = anos.map(a => porAnio[a] || null);
    
    return {
      label: depto,
      data: datos,
      borderColor: deptoColors[depto] || '#95a5a6',
      backgroundColor: (deptoColors[depto] || '#95a5a6').replace(')', ', 0.05)'),
      borderWidth: 2,
      tension: 0.3,
      spanGaps: true,
      pointRadius: 2,
      pointHoverRadius: 5,
    };
  }).sort((a, b) => a.label.localeCompare(b.label));
  
  createLineChart(document.getElementById('chart-line'), anos.map(String), datasets, state.concepto);
}

function updateDistChart(statsData) {
  if (!statsData || !statsData.distribucion) return;
  const d = statsData.distribucion;
  if (!d.labels || d.labels.length === 0) return;
  createDistChart(
    document.getElementById('chart-dist'),
    d.labels, d.observado, d.esperado,
    d.curva_x, d.curva_y,
    d.media || 0, d.std || 0,
    state.concepto
  );
}

function updatePieChart(sexoData) {
  if (!sexoData || !sexoData.distribucion_sexo) return;
  const dist = sexoData.distribucion_sexo;
  const labels = Object.keys(dist).map(s => s === 'hombres' ? 'Hombres' : 'Mujeres');
  const values = Object.values(dist);
  if (labels.length === 0 || values.length === 0) return;
  createPieChart(document.getElementById('chart-pie'), labels, values);
}

function setupEventListeners() {
  const selectors = ['filter-anio', 'filter-depto', 'filter-concepto', 'filter-sexo'];
  selectors.forEach(id => {
    document.getElementById(id).addEventListener('change', updateAll);
  });
  document.getElementById('filter-concepto').addEventListener('change', actualizarDescripcion);
}

async function init() {
  initMap();
  setupKpiTooltips();
  await Promise.all([loadFilters(), loadDeptos()]);
  setupEventListeners();
  setTimeout(updateAll, 500);
}

document.addEventListener('DOMContentLoaded', init);
