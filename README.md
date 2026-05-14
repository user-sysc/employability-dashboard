# Analizador Dinámico de Empleabilidad Nacional (2007-2026)

Aplicación web para analizar la empleabilidad en Colombia a nivel departamental con datos DANE-GEIH 2007-2025 (proyección 2026).

---

## Requisitos

- **Python 3.10+**
- **Navegador web moderno** (Chrome, Firefox, Safari, Edge)

---

## Instalación

### 1. Clonar o descargar el proyecto

```bash
git clone https://github.com/tu-usuario/project-empleabilidad.git
cd project-empleabilidad
```

### 2. Crear entorno virtual Python

```bash
python -m venv .venv
```

**Activar entorno virtual:**

- **Windows:**

```bash
.venv\Scripts\activate
```

- **macOS/Linux:**

```bash
source .venv/bin/activate
```

### 3. Instalar dependencias

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 4. Ubicar archivo fuente GEIH

Colocar el archivo `anex-GEIHDepartamentos-2025.xls` en la carpeta `etl/`:

```
project-empleabilidad/etl/anex-GEIHDepartamentos-2025.xls
```

**Obtener el archivo:**

- Descargar desde DANE (Departamento Administrativo Nacional de Estadística)
- Dataset: Gran Encuesta Integrada de Hogares (GEIH)
- Acceso: https://www.dane.gov.co

### 5. Procesar datos (generar CSV)

```bash
cd etl
python etl.py
cd ..
```

**Tiempo:** ~15-30 segundos

**Verificar:** Se genera `data/empleabilidad_full.csv` (1,380 filas)

### 6. Iniciar servidor backend Flask

```bash
cd backend
python app.py
```

**Esperado:**

```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

**El servidor debe estar corriendo mientras usas la aplicación.**

### 7. Abrir la aplicación en navegador

Abre el archivo en tu navegador:

```
file:///ruta/absoluta/project-empleabilidad/frontend/index.html
```

O simplemente navega a la carpeta `frontend/` y abre `index.html` con doble clic.

---

## Verificación

- ✅ Mapa muestra 23 departamentos de Colombia
- ✅ Filtros cargan datos correctamente
- ✅ Gráficos se renderizan
- ✅ No hay errores en consola (F12 → Console)

---

## Solución de Problemas

### El navegador no carga datos

**Verificar que Flask está corriendo:**

```bash
cd backend
python app.py
```

El servidor debe estar en `http://localhost:5000`

### Error: "No se encontró el archivo fuente GEIH"

Confirma que el archivo existe en la ruta correcta:

```
etl/anex-GEIHDepartamentos-2025.xls
```

### Puerto 5000 ya está en uso

Busca qué proceso usa el puerto:

- **Windows:** `netstat -ano | findstr :5000`
- **Mac/Linux:** `lsof -i :5000`

Termina el proceso o usa otro puerto en `backend/app.py`

---

## Estructura del Proyecto

```
project-empleabilidad/
├── backend/                    # API Flask (Python)
│   ├── app.py                  # Servidor con 10 endpoints
│   ├── stats.py                # Cálculos estadísticos
│   └── requirements.txt         # Dependencias
├── frontend/                   # Aplicación web
│   ├── index.html              # Página principal
│   ├── css/style.css           # Estilos
│   └── js/                     # JavaScript (4 archivos)
├── etl/                        # Procesamiento de datos
│   ├── etl.py                  # Script de transformación
│   └── anex-GEIHDepartamentos-2025.xls  # Fuente DANE
├── data/                       # Datos procesados
│   └── empleabilidad_full.csv  # Dataset principal
└── docs/                       # Documentación
    └── informe.md              # Informe académico
```

---

## Notas Importantes

- El archivo Excel fuente (GEIH) **no está incluido en el repositorio** por su tamaño (1.2 MB)
- Debes ejecutar `python etl.py` una sola vez para generar el CSV
- El backend Flask debe estar corriendo en el puerto 5000 mientras usas la aplicación
- La aplicación requiere conexión a internet para cargar mapas (OpenStreetMap)

---

¿Problemas? Revisa la consola del navegador (F12) o el terminal donde ejecutas Flask.
