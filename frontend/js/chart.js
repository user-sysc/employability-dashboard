let chartBar, chartLine, chartDist, chartCorr, chartPie;

const CONCEPTOS_TASA_CHART = [
  'Tasa de Desocupacion (TD)',
  'Tasa de Ocupacion (TO)',
  'Tasa Global de Participacion (TGP)',
  'Tasa de Subocupacion (TS)',
  'Porcentaje poblacion en edad de trabajar'
];

function isTasaChart(concepto) {
  return CONCEPTOS_TASA_CHART.includes(concepto);
}

function createBarChart(ctx, labels, values, label, concepto) {
  if (chartBar) chartBar.destroy();
  const unidad = isTasaChart(concepto) ? '%' : '';
  chartBar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: label || 'Valor',
        data: values,
        backgroundColor: values.map(v => {
          const m = values.reduce((a, b) => a + b, 0) / values.length;
          return v > m ? 'rgba(231, 76, 60, 0.7)' : 'rgba(46, 134, 193, 0.7)';
        }),
        borderColor: values.map(v => {
          const m = values.reduce((a, b) => a + b, 0) / values.length;
          return v > m ? '#e74c3c' : '#2e86c1';
        }),
        borderWidth: 1.5,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const ds = ctx.dataset.label || '';
              return `${ctx.parsed.y.toFixed(2)}${unidad} (${ds})`;
            }
          }
        }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: unidad } },
        x: { ticks: { maxRotation: 45, font: { size: 10 } } }
      }
    }
  });
}

function createLineChart(ctx, labels, datasets, concepto) {
  if (chartLine) chartLine.destroy();
  const unidad = isTasaChart(concepto) ? '%' : '';
  chartLine = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 10 } } },
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}${unidad}` } }
      },
      scales: {
        y: { beginAtZero: false, title: { display: true, text: unidad } },
        x: { title: { display: true, text: 'Año' } }
      }
    }
  });
}

function createDistChart(ctx, labels, observed, expected, curvaX, curvaY, media, std, concepto) {
  if (chartDist) chartDist.destroy();
  
  const unidad = isTasaChart(concepto) ? '%' : '';
  
  // Calcular el bin_width correcto del histograma
  // (distancia entre los puntos medios de los bins)
  const bin_width = labels.length > 1 ? labels[1] - labels[0] : 1;
  
  // Total de datos
  const total_datos = observed.reduce((a, b) => a + b, 0);
  
  // Factor de escala correcto para la PDF: total * bin_width
  const scale_factor = total_datos * bin_width;
  
  // Escalar la curva de Gauss correctamente
  const curvaYEscalada = curvaY.map(y => y * scale_factor);
  
  // Interpolar curva escalada en las posiciones del histograma
  const curvaYInterpolada = labels.map(label => {
    const xTarget = parseFloat(label);
    
    // Encontrar dos puntos cercanos en curvaX para interpolar
    let idx = -1;
    for (let i = 0; i < curvaX.length - 1; i++) {
      if (curvaX[i] <= xTarget && xTarget <= curvaX[i + 1]) {
        idx = i;
        break;
      }
    }
    if (idx === -1) {
      // Si no está dentro, usa el más cercano
      idx = Math.abs(curvaX[0] - xTarget) < Math.abs(curvaX[curvaX.length - 1] - xTarget) ? 0 : curvaX.length - 2;
    }
    
    const x1 = curvaX[idx];
    const y1 = curvaYEscalada[idx];
    const x2 = curvaX[idx + 1];
    const y2 = curvaYEscalada[idx + 1];
    
    // Interpolación lineal
    const yInterp = x1 === x2 ? y1 : y1 + (y2 - y1) * (xTarget - x1) / (x2 - x1);
    return Math.max(0, yInterp);
  });
  
  chartDist = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Frecuencia observada',
          data: observed,
          backgroundColor: 'rgba(46, 134, 193, 0.6)',
          borderColor: '#2e86c1',
          borderWidth: 1,
          order: 2,
        },
        {
          label: 'Campana de Gauss (esperada)',
          data: curvaYInterpolada,
          type: 'line',
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231, 76, 60, 0.15)',
          borderWidth: 3,
          fill: true,
          tension: 0.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          order: 1,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 10 } } },
        title: {
          display: true,
          text: `Media: ${media.toFixed(2)} | Desv.Est: ${std.toFixed(2)}`,
          font: { size: 11 }
        }
      },
      scales: {
        y: { title: { display: true, text: 'Frecuencia' } },
        x: { title: { display: true, text: `Valor ${unidad ? '(%)' : ''}` } }
      }
    }
  });
}

function createCorrChart(ctx, labels, medias, volatilidades) {
  if (chartCorr) chartCorr.destroy();
  chartCorr = new Chart(ctx, {
    type: 'scatter',
    data: {
      labels: labels,
      datasets: [{
        label: 'TD Media vs Volatilidad',
        data: labels.map((l, i) => ({ x: medias[i], y: volatilidades[i] })),
        backgroundColor: 'rgba(46, 134, 193, 0.7)',
        borderColor: '#1a5276',
        pointRadius: 6,
        pointHoverRadius: 9,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => {
              const idx = ctx.dataIndex;
              const nombre = ctx.chart.data.labels[idx] || `Depto #${idx+1}`;
              return `${nombre}: TD media ${ctx.raw.x.toFixed(2)}%, volatilidad ${ctx.raw.y.toFixed(2)}%`;
            }
          }
        },
        legend: { display: false }
      },
      scales: {
        x: { title: { display: true, text: 'TD Media (%)' } },
        y: { title: { display: true, text: 'Volatilidad (std)' } }
      }
    }
  });
}

function createPieChart(ctx, labels, values) {
  if (chartPie) chartPie.destroy();
  chartPie = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: ['#3498db', '#e74c3c'],
        borderColor: ['#2980b9', '#c0392b'],
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 15 } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  });
}
