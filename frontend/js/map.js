let map, geoLayer, legend;

const COLOR_PALETTE = ['#1a9850', '#66bd63', '#a6d96a', '#d9ef8b', '#ffffbf', '#fee08b', '#fdae61', '#f46d43', '#d73027'];

function getColor(val, min, max) {
  if (max === min) return COLOR_PALETTE[4];
  const idx = Math.round(((val - min) / (max - min)) * (COLOR_PALETTE.length - 1));
  return COLOR_PALETTE[Math.max(0, Math.min(COLOR_PALETTE.length - 1, idx))];
}

function initMap() {
  map = L.map('map', { zoomControl: true }).setView([4.5, -74.0], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OSM</a>',
    maxZoom: 10,
  }).addTo(map);

  geoLayer = L.geoJSON(COLOMBIA_DEPARTMENTS, {
    style: { color: '#fff', weight: 1, fillOpacity: 0.7, fillColor: '#bdc3c7' },
    onEachFeature: (feature, layer) => {
      const name = feature.properties.NOMBRE_DPT;
      layer.bindTooltip(name, { sticky: true });
      layer.on('click', () => {
        document.getElementById('filter-depto').value = name;
        document.getElementById('filter-depto').dispatchEvent(new Event('change'));
      });
      layer.on('mouseover', () => layer.setStyle({ weight: 2.5, color: '#2c3e50' }));
      layer.on('mouseout', () => {
        if (name !== document.getElementById('filter-depto').value) {
          layer.setStyle({ weight: 1, color: '#fff' });
        }
      });
    }
  }).addTo(map);

  legend = L.control({ position: 'bottomleft' });
  legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = '<div class="legend-title">Bajo</div><div class="legend-gradient"></div><div class="legend-title" style="text-align:right">Alto</div>';
    return div;
  };
  legend.addTo(map);
}

function updateMap(data, concepto, selectedDepto) {
  if (!geoLayer) return;
  const values = data.map(d => d.valor);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  const grad = document.querySelector('.legend-gradient');
  if (grad) {
    const stops = COLOR_PALETTE.map((c, i) => `${c} ${(i / (COLOR_PALETTE.length - 1)) * 100}%`).join(', ');
    grad.style.background = `linear-gradient(to right, ${stops})`;
    grad.title = `${minVal.toFixed(1)}% - ${maxVal.toFixed(1)}%`;
  }

  geoLayer.eachLayer(layer => {
    const name = layer.feature.properties.NOMBRE_DPT;
    const match = data.find(d => d.departamento === name);
    const isSelected = selectedDepto && selectedDepto !== 'todos' && name === selectedDepto;
    const isOthers = selectedDepto && selectedDepto !== 'todos' && !isSelected;

    if (match) {
      const color = getColor(match.valor, minVal, maxVal);
      layer.setStyle({
        fillColor: isOthers ? '#e8e8e8' : color,
        fillOpacity: isSelected ? 0.95 : isOthers ? 0.25 : 0.8,
        color: isSelected ? '#2c3e50' : isOthers ? '#ddd' : '#fff',
        weight: isSelected ? 2.5 : 1,
      });
      layer.bindTooltip(
        `<b>${name}</b><br>${match.valor.toFixed(2)}%<br><small>${concepto}</small>`,
        { sticky: true }
      );
    } else {
      layer.setStyle({ fillColor: '#e8e8e8', fillOpacity: 0.2, color: '#ddd', weight: 0.8 });
    }
  });
}
