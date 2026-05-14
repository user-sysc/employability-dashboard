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

**Opción A — Con venv:**

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

**Opción B — Con Pipenv:**

```bash
pip install pipenv
pipenv install
pipenv shell
```

Pipenv crea y activa el entorno automáticamente. Las dependencias se instalan desde el `Pipfile`.

### 3. Instalar dependencias

Con **venv** (entorno ya activado):

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 5. Procesar datos (generar CSV)

```bash
cd etl
python etl.py
cd ..
```

**Verificar:** Se genera `data/empleabilidad_full.csv`

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

**Alternativa (VS Code):** instala la extensión **Live Server**, haz clic derecho sobre `frontend/index.html` y selecciona _"Open with Live Server"_.

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
│   └── requirements.txt        # Dependencias
├── frontend/                   # Aplicación web
│   ├── index.html              # Página principal
│   ├── css/
│   │   └── style.css           # Estilos
│   └── js/
│       ├── app.js              # Lógica principal
│       ├── chart.js            # Gráficos
│       ├── colombia-geo.js     # Datos geográficos
│       ├── map.js              # Mapa interactivo
│       └── stats.js            # Estadísticas
├── etl/                        # Procesamiento de datos
│   ├── etl.py                  # Script de transformación
│   └── anex-GEIHDepartamentos-2025.xls  # Fuente DANE
├── data/                       # Datos procesados
│   └── empleabilidad_full.csv  # Dataset principal
├── README.md
└── rubrica.md                  # Rúbrica de evaluación
```
