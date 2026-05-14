## OPCIÓN 2

### PROYECTO: ANALIZADOR DINÁMICO DE EMPLEABILIDAD NACIONAL (2021-2026)

- **Asignatura:** Modelado y Simulación
- **Docente:** Andrés Perpiñán Reyes
- **Fecha de Entrega:** Miércoles 13 de mayo de 2026

---

### 1. CONTEXTO DEL PROYECTO

Al cierre del primer cuatrimestre de 2026, Colombia enfrenta retos significativos en la estabilización de su mercado laboral. El objetivo de este examen es desarrollar un **Simulador Geo-Estadístico** que modele la Tasa de Empleabilidad en regiones estratégicas del país, identificando comportamientos normales y anomalías estadísticas en centros urbanos y zonas de frontera.

---

### 2. DESCRIPCIÓN DEL RETO (COMPLEJIDAD 8.5/10)

En grupos máximos de 4 personas desarrollar una aplicación interactiva (preferiblemente Python) que integre un mapa de Colombia con capacidad de filtrado regional y local. La simulación debe permitir comparar la evolución de la empleabilidad desde 2021 hasta 2026.

#### A. Nodos de Análisis Obligatorios

1. **Región Caribe:** Cobertura total (Barranquilla, Cartagena, Santa Marta, Valledupar, Montería, Sincelejo y Riohacha)
2. **Triángulo de Oro:** Bogotá, Medellín y Cali.
3. **Nodo Santanderes:** Bucaramanga y Cúcuta.
4. **Nodos Fronterizos de Alta Sensibilidad:** Quibdó (Chocó), Arauca, Leticia (Amazonas) y Pasto (Nariño).

---

### 3. REQUERIMIENTOS TÉCNICOS Y ESTADÍSTICOS

#### I. Análisis de Tendencia Central y Dispersión

Para cada ciudad/región y año seleccionado, el sistema debe calcular dinámicamente:

- **Media:** Tasa promedio de empleabilidad del periodo.
- **Mediana:** Para identificar brechas de desigualdad laboral.
- **Moda:** Sector económico con mayor contratación en ese nodo (ej. Comercio, Minería, Servicios).
- **Desviación Estándar:** Para medir la estabilidad laboral. Una desviación alta en fronteras (como Cúcuta o Arauca) indicará una economía altamente volátil.

#### II. Modelado de la Campana de Gauss

El software debe generar una curva de distribución normal comparativa:

- **Reto de Distribución:** Proyectar la Campana de Gauss de la empleabilidad nacional vs. la ciudad seleccionada.
- **Análisis de Outliers:** El estudiante debe determinar si ciudades como Quibdó o Leticia se encuentran por fuera de las 2 desviaciones estándar ( σ> 2) respecto a la media nacional, justificando estadísticamente la exclusión o inclusión en la curva.

---

### 4. FUENTES DE DATOS (2021-2026)

- **DANE - GEIH:** Gran Encuesta Integrada de Hogares (Mercado Laboral).
- **Datos Abiertos Colombia:** Portal oficial del Estado para series históricas de desempleo.
- **SISRPO - MinSalud:** Datos de cotizantes activos para validar empleo formal.

---

### 5. PUNTO EXTRA (+0.5 EN LA NOTA FINAL)

**Análisis de Correlación Fronteriza:**  
El simulador debe incluir una función de comparación automática que analice si la volatilidad laboral (σ) en las ciudades fronterizas (Cúcuta, Arauca, Pasto) tiene una correlación directa con la tasa de migración reportada en el mismo periodo. El estudiante debe demostrar si la campana de estas ciudades tiende a ser más "achatada" (Platicúrtica) que la de las ciudades del Triángulo de Oro.

---

## PUNTO 2

### Modelado y Simulación de Mecanismos en Fusion 360

**Temas:** Simulación de sistemas mecánicos

---

### 2. Introducción

Para un ingeniero de sistemas, la modelación no se limita al software. Comprender cómo los parámetros físicos se traducen en movimientos lógicos y predecibles es fundamental para la robótica, la automatización y la simulación de procesos físicos. En este taller, utilizaremos Fusion 360 para transformar conceptos teóricos en un prototipo digital funcional.

---

### 3. Objetivos de Aprendizaje

- Diseñar componentes mecánicos básicos utilizando herramientas de dibujo y extrusión.
- Aplicar restricciones de movimiento (Joints) para simular la cinemática de mecanismos reales.
- Analizar la relación entre las variables de entrada (rotación) y salida (traslación/oscilación).

---

### 4. Actividades a Desarrollar

**Fase 1: Diseño de Partes (CAD)**  
Utilizando la herramienta de Extrusión, cada estudiante debe dibujar y modelar los eslabones necesarios:

- Mecanismo 4 barras: Bancada, manivela, biela y balancín.
- Biela-Manivela: Manivela, biela y pistón (corredera).
- Pistón y Cilindro

**Fase 2: Ensamblaje y Juntas (Joints)**  
Configurar las relaciones de movimiento:

- Asignar una unión de Revolute para los ejes de rotación.
- Asignar una unión de Slider para el movimiento de la corredera.
- Verificar que el mecanismo cumple con la ley de Grashof (en el caso de las 4 barras).

**Fase 3: Simulación**  
Animar el modelo y observar el comportamiento. Identificar los "puntos muertos" del sistema y cómo la longitud de cada eslabón afecta la trayectoria final.

---

### 5. Preguntas de Análisis y Reflexión

1. **Lógica de Sistemas:** Si estuviéramos programando un sensor para medir la posición del pistón, ¿en qué puntos del ciclo de la manivela la velocidad es cero? Explique la relación lógica.
2. **Abstracción:** ¿Cómo se comparan las restricciones de movimiento en CAD (Joints) con las restricciones (constraints) en un modelo de base de datos o de objetos en programación?
3. **Optimización:** ¿Qué sucede con el sistema biela-manivela si la biela es demasiado corta en relación con el radio de la manivela? Describa el fallo lógico del modelo.

---

### 6. Rúbrica de Calificación

| **Criterio**           | **Excelente (5.0)**                                                          | **Bueno (4.0)**                                                      | **Básico (3.0)**                                 | **Insuficiente (1.0)**                   |
| ---------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------- |
| Precisión del Modelo   | Todas las piezas están correctamente extruidas y dimensionadas.              | Las piezas están completas pero presentan errores menores de escala. | Faltan componentes o la extrusión es incorrecta. | No realizó el modelado de las piezas.    |
| Funcionalidad (Joints) | El mecanismo se mueve fluidamente sin interferencias.                        | El mecanismo se mueve, pero las uniones no son óptimas.              | El movimiento es errático o limitado.            | No hay relación de movimiento funcional. |
| Análisis Crítico       | Respuestas profundas que vinculan la mecánica con la ingeniería de sistemas. | Respuestas correctas pero con poco análisis técnico.                 | Respuestas superficiales o incompletas.          | No respondió las preguntas de reflexión. |
| Presentación           | Documentación clara de la simulación y capturas de pantalla.                 | Entrega organizada pero falta detalle visual.                        | Entrega desordenada.                             | No entregó evidencia del trabajo.        |

> _"La simulación es el puente entre la teoría matemática y la realidad física."_

---

### Reglas de juego

- En grupos de hasta 4 estudiantes se debe entregar antes del **14 de mayo a las 11:59 p.m.** al correo electrónico **arperpinan@unicesar.edu.co**:
  1. Un documento en PDF donde se dé respuesta a todos los puntos del enunciado.  
     El archivo debe llamarse de acuerdo a las iniciales de los integrantes del grupo. Se recomienda utilizar el formato IEEE.  
     **Ejemplo:** `AP_BO_AX_CY.pdf`
  2. El asunto del correo electrónico debe decir: `Parcial 2 MyS 2026 - 1`
  3. Un video de máximo 15 minutos donde se explique la solución a todas las preguntas del enunciado.
  4. El código fuente de la solución. El programa puede desarrollarse en el lenguaje de su elección.
  5. Cualquier incumplimiento en las reglas tendrá una evaluación final de 1.5
  6. No se permite anexar estudiantes una vez realizada la entrega.
  7. A continuación, se presenta un ejemplo de como podría quedar la aplicación:
     - [https://ccvalledupar.org.co/estadisticas/#boletines](https://ccvalledupar.org.co/estadisticas/#boletines)
     - [https://app.powerbi.com/view?r=eyJrIjoiMzQzNGM4ZjktNDQ1My00ZTA1LWEyNWEtOTNiZDg5Y2NmYTg4IiwidCI6ImE2MmQ2YzdiLTlmNTktNDQ2OS05MzU5LTM1MzcxNDc1OTRiYiIsImMiOjR9&pageName=ReportSection](https://app.powerbi.com/view?r=eyJrIjoiMzQzNGM4ZjktNDQ1My00ZTA1LWEyNWEtOTNiZDg5Y2NmYTg4IiwidCI6ImE2MmQ2YzdiLTlmNTktNDQ2OS05MzU5LTM1MzcxNDc1OTRiYiIsImMiOjR9&pageName=ReportSection)
