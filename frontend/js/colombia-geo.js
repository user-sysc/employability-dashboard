const COLOMBIA_DEPARTMENTS = {
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Antioquia" }, "geometry": { "type": "Polygon", "coordinates": [[[-76.5, 7.2], [-76.5, 5.5], [-75.0, 5.5], [-74.0, 6.0], [-73.5, 7.0], [-74.0, 8.5], [-75.5, 8.5], [-76.5, 7.8], [-76.5, 7.2]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Atlantico" }, "geometry": { "type": "Polygon", "coordinates": [[[-74.9, 10.8], [-74.9, 10.3], [-74.7, 10.1], [-74.4, 10.1], [-74.2, 10.3], [-74.2, 10.9], [-74.5, 11.1], [-74.9, 10.8]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Bolivar" }, "geometry": { "type": "Polygon", "coordinates": [[[-75.5, 10.0], [-75.5, 9.0], [-75.0, 8.5], [-74.0, 8.5], [-73.5, 9.0], [-73.5, 10.0], [-74.0, 10.5], [-75.0, 10.5], [-75.5, 10.0]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Boyaca" }, "geometry": { "type": "Polygon", "coordinates": [[[-74.0, 7.0], [-74.0, 5.5], [-73.0, 5.0], [-72.0, 5.0], [-71.5, 5.8], [-71.5, 6.8], [-72.0, 7.2], [-73.0, 7.2], [-74.0, 7.0]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Caldas" }, "geometry": { "type": "Polygon", "coordinates": [[[-75.7, 5.5], [-75.7, 5.0], [-75.3, 4.9], [-74.8, 5.0], [-74.8, 5.3], [-75.0, 5.6], [-75.5, 5.6], [-75.7, 5.5]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Caqueta" }, "geometry": { "type": "Polygon", "coordinates": [[[-76.0, 2.5], [-76.0, 1.0], [-74.5, 0.5], [-73.0, 0.5], [-72.0, 1.5], [-72.0, 2.5], [-73.0, 3.0], [-74.5, 3.0], [-76.0, 2.5]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Cauca" }, "geometry": { "type": "Polygon", "coordinates": [[[-78.0, 3.0], [-78.0, 2.0], [-77.0, 1.5], [-76.0, 1.5], [-75.5, 2.0], [-75.5, 3.0], [-76.0, 3.5], [-77.0, 3.5], [-78.0, 3.0]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Cesar" }, "geometry": { "type": "Polygon", "coordinates": [[[-74.0, 10.0], [-74.0, 9.2], [-73.5, 8.5], [-72.8, 8.5], [-72.5, 9.0], [-72.5, 10.0], [-73.0, 10.5], [-73.8, 10.5], [-74.0, 10.0]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Choco" }, "geometry": { "type": "Polygon", "coordinates": [[[-77.5, 7.5], [-77.5, 6.0], [-77.0, 5.0], [-76.5, 5.0], [-76.5, 5.5], [-77.0, 6.5], [-77.0, 7.5], [-77.5, 7.5]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Cordoba" }, "geometry": { "type": "Polygon", "coordinates": [[[-76.3, 9.5], [-76.3, 8.5], [-75.8, 8.2], [-75.0, 8.2], [-74.7, 8.5], [-74.7, 9.5], [-75.2, 10.0], [-75.8, 10.0], [-76.3, 9.5]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Cundinamarca" }, "geometry": { "type": "Polygon", "coordinates": [[[-74.8, 5.0], [-74.8, 4.0], [-74.0, 3.8], [-73.0, 4.0], [-73.0, 4.8], [-73.5, 5.5], [-74.3, 5.5], [-74.8, 5.0]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Huila" }, "geometry": { "type": "Polygon", "coordinates": [[[-76.0, 3.5], [-76.0, 2.5], [-75.5, 2.0], [-74.8, 2.0], [-74.5, 2.5], [-74.5, 3.5], [-75.0, 4.0], [-75.5, 4.0], [-76.0, 3.5]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "La Guajira" }, "geometry": { "type": "Polygon", "coordinates": [[[-72.5, 11.5], [-72.5, 10.5], [-73.0, 10.0], [-73.5, 10.0], [-73.5, 11.0], [-73.0, 12.0], [-72.5, 11.5]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Magdalena" }, "geometry": { "type": "Polygon", "coordinates": [[[-74.8, 10.5], [-74.8, 9.5], [-74.2, 9.0], [-73.5, 9.0], [-73.5, 10.0], [-73.8, 10.8], [-74.5, 11.0], [-74.8, 10.5]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Meta" }, "geometry": { "type": "Polygon", "coordinates": [[[-74.0, 4.5], [-74.0, 3.5], [-73.0, 3.0], [-71.5, 3.0], [-71.0, 3.8], [-71.0, 4.8], [-72.0, 5.0], [-73.5, 5.0], [-74.0, 4.5]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Narino" }, "geometry": { "type": "Polygon", "coordinates": [[[-78.5, 2.0], [-78.5, 1.0], [-78.0, 0.5], [-77.0, 0.5], [-76.5, 1.0], [-76.5, 2.0], [-77.0, 2.5], [-78.0, 2.5], [-78.5, 2.0]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Norte de Santander" }, "geometry": { "type": "Polygon", "coordinates": [[[-73.2, 9.5], [-73.2, 8.5], [-72.8, 8.0], [-72.0, 8.0], [-71.5, 8.5], [-71.5, 9.2], [-72.0, 9.5], [-72.8, 9.8], [-73.2, 9.5]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Quindio" }, "geometry": { "type": "Polygon", "coordinates": [[[-75.8, 4.8], [-75.8, 4.3], [-75.5, 4.2], [-75.2, 4.3], [-75.2, 4.7], [-75.4, 4.9], [-75.8, 4.8]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Risaralda" }, "geometry": { "type": "Polygon", "coordinates": [[[-76.0, 5.5], [-76.0, 4.9], [-75.7, 4.7], [-75.3, 4.8], [-75.3, 5.2], [-75.5, 5.5], [-75.8, 5.6], [-76.0, 5.5]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Santander" }, "geometry": { "type": "Polygon", "coordinates": [[[-74.0, 7.8], [-74.0, 6.8], [-73.5, 6.5], [-72.8, 6.5], [-72.5, 7.0], [-72.5, 7.8], [-73.0, 8.0], [-73.8, 8.0], [-74.0, 7.8]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Sucre" }, "geometry": { "type": "Polygon", "coordinates": [[[-75.7, 10.0], [-75.7, 9.2], [-75.2, 8.8], [-74.8, 9.0], [-74.5, 9.5], [-74.5, 10.0], [-75.0, 10.4], [-75.5, 10.3], [-75.7, 10.0]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Tolima" }, "geometry": { "type": "Polygon", "coordinates": [[[-75.5, 5.2], [-75.5, 4.0], [-75.0, 3.5], [-74.5, 3.8], [-74.5, 4.5], [-74.8, 5.2], [-75.2, 5.5], [-75.5, 5.2]]] } },
    { "type": "Feature", "properties": { "NOMBRE_DPT": "Valle del Cauca" }, "geometry": { "type": "Polygon", "coordinates": [[[-77.0, 4.8], [-77.0, 3.5], [-76.5, 3.0], [-76.0, 3.0], [-75.5, 3.5], [-75.5, 4.5], [-76.0, 5.0], [-76.5, 5.0], [-77.0, 4.8]]] } }
  ]
};

const DEPT_CENTERS = {
  "Antioquia": [6.2, -75.5], "Atlantico": [10.5, -74.8], "Bolivar": [9.5, -74.5],
  "Boyaca": [6.3, -72.5], "Caldas": [5.3, -75.3], "Caqueta": [1.8, -74.0],
  "Cauca": [2.5, -76.5], "Cesar": [9.3, -73.5], "Choco": [6.5, -76.8],
  "Cordoba": [9.0, -75.5], "Cundinamarca": [4.5, -74.0], "Huila": [3.0, -75.3],
  "La Guajira": [11.0, -73.0], "Magdalena": [10.0, -74.2], "Meta": [4.0, -72.5],
  "Narino": [1.5, -77.5], "Norte de Santander": [9.0, -72.5], "Quindio": [4.5, -75.5],
  "Risaralda": [5.2, -75.7], "Santander": [7.3, -73.3], "Sucre": [9.5, -75.2],
  "Tolima": [4.5, -75.0], "Valle del Cauca": [4.0, -76.5]
};
