# MePreparo — PRD (Product Requirements Document)

> **Estado:** BORRADOR v0.1 · 2026-09-27 · pendiente de aprobación del fundador.
> **Relación con otros documentos:** este PRD **amplía y reemplaza el alcance** de [SPEC_V1.md](SPEC_V1.md)
> donde se contradicen (monetización, tutor IA, ejes, ensayos, otras pruebas). Los requisitos no funcionales,
> el stack y las reglas de confiabilidad de la spec **se mantienen**. Una vez aprobado, se reescribe
> [PLAN_IMPLEMENTACION.md](PLAN_IMPLEMENTACION.md) por fases (§18).
> Las marcas **[DECIDIR]** son preguntas abiertas para el fundador (resumen en §20).

---

## 1. Visión en una frase

**La app donde los estudiantes chilenos por fin *entienden* la matemática de la PAES**: la tocan, la mueven,
se equivocan sin miedo, tienen un tutor que no se cansa de explicar y ven, día a día, cómo suben su dominio
y su puntaje estimado. Lo esencial es gratis para siempre; Premium es barato, honesto y nunca cobra por sorpresa.

**Tagline:** Entiende · Practica · Avanza. **Promesa:** "Aprender haciendo. Hasta que haga clic."

## 2. Problema, mercado y principios

### 2.1 Lo que encontramos en el mercado (discovery)
Competidores: Preu AI, PAES Quiz, Cachai Online, Paes Matemática 1, Prepa PAES; en web SimplePAES y Puntaje Nacional.

| Lo que los estudiantes reclaman | Cómo responde MePreparo |
|---|---|
| Paywalls opacos y **cobros abusivos/sorpresa** | Prueba de 7 días **sin tarjeta y sin cuenta**; al terminar no se cobra nada automáticamente. Precio en formato "boleta", visible desde el inicio (§4) |
| Contenido **impreciso** ("revisado por IA") | Corrección determinista con aritmética exacta; ejercicios verificados por motor; pipeline de revisión en 4 capas (§14.4); "Reportar error" en cada paso |
| **Pierden el progreso** (fallas, reinstalar) | Guardado local en cada paso + sincronización idempotente + respaldo con Google |
| **Ejercicios muy pequeños** / ilegibles | `MathText` propio con números grandes (ya construido) |
| Solo ensayos + video + chatbot: **se memoriza, no se entiende** | Lecciones interactivas (balanza, gráficos con deslizadores, áreas, recta numérica…) y tutor socrático que guía sin dar la respuesta |

**Lo que sí funciona en el mercado y adoptamos** (evaluación propia, no de la investigación de reseñas):
ensayos cronometrados en formato real, puntaje estimado, banco grande de preguntas, rachas y metas diarias,
explicación de cada alternativa.

### 2.2 Principios de producto (no negociables)
1. **Aprender nunca se bloquea.** Sin vidas, sin corazones, sin anuncios. Las lecciones de la ruta y la explicación de cada error son gratis siempre.
2. **Cero cobros sorpresa.** Nada se cobra sin una acción explícita del usuario con el precio a la vista.
3. **Entender > memorizar.** Cada tema parte con algo que se toca; el tutor pregunta antes de responder.
4. **Precisión verificable.** Ninguna respuesta la decide un modelo de IA; la decide el motor.
5. **Desafío gradual.** Dificultad 1→5 por habilidad; el sistema sube el nivel cuando dominas y lo baja cuando te cuesta.
6. **Sin juicio.** El error es grafito, nunca rojo; el copy dice "Casi…", jamás "Incorrecto".
7. **Datos mínimos.** Sin nombre real ni teléfono; apodo opcional solo en el teléfono; email solo si vinculas Google.

## 3. Usuarios
- **Principal:** estudiante de 3.º–4.º medio (16–18) que rinde la PAES (invierno o regular), estudia desde el celular, a menudo en la micro; le cuesta matemática y no puede pagar un preu (o lo complementa).
- **Secundario:** 1.º–2.º medio que empieza temprano; egresado que vuelve a rendir.
- **Futuro (Premium):** quien rinde M2, Competencia Lectora, Ciencias o Historia.
- Play: 13+. No es una app para niños.

## 4. Modelo de negocio: Gratis · Prueba 7 días · Premium

### 4.1 Reglas
- **Sin paywall en el onboarding.** El onboarding termina en la app, con la **prueba Premium de 7 días activada**, sin tarjeta y sin cuenta.
- La prueba la gestiona **la app** (no Google Play), por eso no requiere tarjeta y **no puede convertirse en cobro automático**.
- Avisos de la prueba: día 5 ("Te quedan 2 días de Premium"), día 7 ("Hoy termina tu prueba") y al terminar, una pantalla que muestra **qué conservas gratis** y la oferta.
- Al terminar la prueba **no se pierde nada** del progreso, XP, racha ni logros ya ganados.
- **Oferta de fin de prueba:** 50 % de descuento el primer periodo, válida 48 h **reales** (no se reinicia al reabrir la app; si expira, expira). Recomendación: una sola vez por usuario. [DECIDIR] duración y porcentaje.
- La compra se hace con Google Play Billing (RevenueCat); se muestra el precio final en CLP, qué incluye y cómo cancelar, en una pantalla tipo **boleta** (asset ya diseñado).

### 4.2 Qué es gratis y qué es Premium (propuesta)

| Función | Gratis (para siempre) | Premium |
|---|---|---|
| Ruta de lecciones M1 (los 4 ejes) | ✅ completa | ✅ |
| Explicación específica de cada error | ✅ | ✅ |
| Pistas graduadas | 1.ª pista siempre; 2.ª y 3.ª: **5 por día** | Sin límite |
| Tutor IA "Pregúntale a Equis" | 3 conversaciones por día | Sin límite (con tope técnico anti-abuso) |
| Práctica por tema (banco paramétrico) | 20 ejercicios por día | Sin límite |
| Repaso inteligente de errores | Últimos 7 días | Todo el historial + repaso espaciado |
| Ensayos M1 completos (65 preguntas) | 1 al mes | Sin límite + análisis por habilidad |
| Mini-ensayos (15 preguntas, 20 min) | 1 por semana | Sin límite |
| M2: lecciones, práctica y ensayos | Vista previa (1 lección por eje) | ✅ |
| Reto relámpago (minijuego) | 1 partida por día | Sin límite + ligas semanales |
| Logros | Set base (rachas, primeras veces) | Colección completa + logros de maestría |
| Puntaje estimado PAES | Rango aproximado | Detalle por eje y habilidad + evolución |
| Competencia Lectora, Ciencias, Historia | — | ✅ (según fases, §18) |
| Racha, XP, recordatorios, respaldo Google | ✅ | ✅ + protector de racha extra por semana |

> La tabla prioriza que un estudiante sin dinero pueda **prepararse de verdad** gratis (ruta completa + explicaciones)
> y que Premium sea **más cómodo, más profundo y más amplio**. [DECIDIR] límites exactos (se ajustan por config remota sin build).

### 4.3 Precio (propuesta, [DECIDIR])
- **Mensual:** $3.990 CLP.
- **Pase PAES** (pago único hasta la fecha de tu PAES, sin renovación): $12.990 CLP. Encaja con la promesa "sin cobros sorpresa" porque no se renueva.
- Oferta de fin de prueba: 50 % el primer mes o el Pase PAES.
- El tablero de marca ya muestra una boleta con $4.990; los montos finales se definen antes de crear los productos en Play Console.

## 5. Arquitectura de información

```
Onboarding (16 pantallas, una vez)
└─ Tabs
   ├─ Inicio      plan de hoy · continuar · temas (ruta por eje) · cuenta regresiva · racha
   ├─ Practicar   práctica por tema · repaso de errores · ensayos · mini-ensayos · reto relámpago
   ├─ Progreso    puntaje estimado · dominio por eje/unidad/habilidad · racha · XP y nivel · logros · historial
   └─ Perfil      cuenta y respaldo · plan Premium · PAES y metas · recordatorios · privacidad · ayuda
Pantallas completas: lección · ejercicio de práctica · ensayo · resultados de ensayo · tutor · reto relámpago · boleta/compra
```

Tabs según la referencia de diseño: **Inicio · Practicar · Progreso · Perfil**. El tutor vive **dentro** de cada ejercicio y de la revisión de ensayos (en contexto), no como chat suelto.

## 6. Onboarding (16 pantallas)

Objetivo: en **≤ 90 s** (sin contar el diagnóstico) el estudiante siente valor, recibe un plan concreto y queda dentro de la app con Premium de prueba.
Regla: cada pregunta **cambia algo visible** del plan. Si no cambia nada, no se pregunta.

### 6.1 Implementado (2026-09-27, con los diseños del fundador)
Orden optimizado (primero el sueño, después la logística; respuestas preseleccionadas donde se puede adivinar):

| # | Pantalla | Detalle | Se salta si… |
|---|---|---|---|
| 1 | Bienvenida | Equis: "Soy Equis, tu compañero de estudio y tutor." · 3 promesas · solo **Comenzar** | — |
| 2 | Nombre | Globo de Equis; se guarda solo en el teléfono; "Prefiero no decirlo" | — |
| 3 | ¿Dónde te gustaría estudiar? | 119 instituciones oficiales por categoría (estatales, CRUCH, privadas del Sistema de Acceso, admisión propia, IP, CFT, FF.AA.); buscador destacado por nombre o sigla; atajos a las más buscadas | — |
| 4 | ¿Qué te gustaría estudiar? | Carreras **de esa institución** por área, con corte oficial cuando existe; si no eligió institución, 126 carreras genéricas | — |
| 5 | Lo que pesa | Dona animada con ponderaciones oficiales DEMRE 2027 (o promedio si es genérica); en IP/CFT explica la admisión directa | No eligió carrera |
| 6 | ¿Cuándo das la PAES? | Preseleccionado "Este año" | — |
| 7 | ¿Invierno o regular? | Cuenta regresiva real ("Faltan 64 días"); invierno 2026 deshabilitado (ya se rindió) | "En unos años" o "No sé" |
| 8 | Puntaje meta | Corte oficial con conteo animado; si no hay corte: meta ajustable (700 preseleccionado) | Sin carrera o institución sin PAES |
| 9 | ¡Vamos por tu meta! | Meta concreta + Equis celebrando: "Tengo casi todo listo… Solo unas preguntas más." | — |
| 10 | Pruebas | Las 5 pruebas + "Todavía no sé"; preseleccionadas según ponderaciones de la carrera | — |
| 11 | Temas que cuestan | Según las pruebas elegidas (M2 suma sus temas propios) | — |
| 12 | Qué te frena | Uno por prueba, con desplazamiento automático a la siguiente | — |

Datos: `src/content/admission/` (DEMRE Admisión 2027 + SIES 2026 + cortes oficiales U. de Chile y UC). Regenerar con `scripts/admission/`.
Pendientes (siguiente lote de diseños): tiempo diario, recordatorio, diagnóstico, "generando tu plan", tu plan y Premium de regalo + cuenta.

### 6.2 Propuesta original (referencia)
| # | Pantalla | Pregunta / contenido | Para qué se usa |
|---|---|---|---|
| 1 | Bienvenida | Equis saluda: "Aprender haciendo. Hasta que haga clic." · botón **Empezar** · enlace "¿Ya tienes progreso? Entrar con Google" | Primera impresión; recuperar cuenta en teléfono nuevo |
| 2 | Momento ajá (interactivo) | Mini balanza de 20 s: "Deja la x sola". Equis celebra con la chispa | Demuestra el producto antes de pedir nada. Mayor palanca de conversión |
| 3 | Prueba | **¿Qué pruebas vas a rendir?** (multi) M1 · M2 · Competencia Lectora · Ciencias · Historia | Ejes del plan; marca interés en Premium (M2 y otras) |
| 4 | Cuándo | **¿Cuándo das la PAES?** Regular 2026 (30 nov) · Invierno 2027 · Regular 2027 · Aún no sé | Cuenta regresiva e intensidad del plan (fechas en `paes-config.json`) |
| 5 | Curso | **¿En qué curso estás?** 1.º–2.º medio · 3.º medio · 4.º medio · Ya egresé | Tono, profundidad del repaso de base |
| 6 | Meta | **¿Qué puntaje te gustaría lograr en M1?** deslizador 400–1000 con referencias ("Sobre 700: carreras muy exigentes") | Meta del plan y del puntaje estimado |
| 7 | Relación con la matemática | **¿Cómo te llevas con la matemática?** Me cuesta harto · Más o menos · Bien, quiero afinar | Nivel inicial si salta el diagnóstico |
| 8 | Obstáculos | **¿Qué te complica más?** (multi) No entiendo desde la base · Me bloqueo en los problemas con texto · Me pongo nervioso en las pruebas · Se me olvida lo que estudio · No tengo tiempo | Mensajes personalizados del plan (ej.: "nervios" → más ensayos cortos cronometrados; "olvido" → repaso espaciado) |
| 9 | Tiempo | **¿Cuánto tiempo al día puedes darle?** 5 · 10 · 20 · 30+ min | Meta diaria (XP/día) y largo del plan |
| 10 | Cuándo estudias | **¿A qué hora te acordamos?** hora + "No quiero recordatorios" | Recordatorio local (el permiso se pide después de la 1.ª lección, en contexto) |
| 11 | Apodo (opcional) | **¿Cómo te llamamos?** "Solo se guarda en tu teléfono" · Saltar | Saludo "Hola, Cata." sin recolectar datos personales |
| 12 | Diagnóstico: invitación | "¿5 minutos para saber desde dónde partes?" **Hacer diagnóstico** · Saltar | Transparencia: es opcional |
| 13 | Diagnóstico | 8–10 preguntas adaptativas estilo PAES (4 ejes), con Equis animando y sin mostrar si acertaste hasta el final | Dominio inicial por eje/habilidad |
| 14 | Generando tu plan | Animación: Equis arma el cuaderno; frases reales de lo que se calcula ("Ordenando tus 16 temas…") | Expectativa + percepción de personalización |
| 15 | Tu plan | Puntaje estimado actual (rango) → meta; semanas hasta la PAES; foco de las próximas 2 semanas; meta diaria | El "por qué quedarme" |
| 16 | Premium de regalo + cuenta | "Tienes **7 días de Premium gratis**. Sin tarjeta. Sin cobros." · **Guardar mi progreso con Google** · **Continuar sin cuenta** | Activa la prueba; ofrece respaldo sin obligar |

Notas:
- La pantalla 2 reutiliza el motor de balanza ya construido (Spike B).
- Eventos por pantalla para medir el embudo (`onboarding_step_viewed{n}`, abandono por pantalla).
- Todo lo respondido se puede cambiar en Perfil.

## 7. Inicio
- **Saludo** con apodo (o "Hola.") + frase del día según el plan ("Hoy toca funciones. 10 minutos, a tu ritmo.").
- **Tarjeta "Sesión de hoy":** tema, progreso "3 de 10 ejercicios", botón **Continuar** (primario, tinta sobre celeste).
- **Meta diaria:** anillo de XP del día + racha (llama coral) + cuenta regresiva "Faltan 64 días para tu PAES".
- **Tus temas:** los 4 ejes de M1 (y M2 si aplica) con ilustración, % de dominio y barra; al tocar → **ruta del eje** (unidades → lecciones con estados: bloqueada suave/sugerida/en curso/completada/dominada).
- **Sugerencias inteligentes:** "Repasa 3 errores de ayer" · "Mini-ensayo de 15 min" · "Te falta poco para dominar Porcentaje".
- Banner discreto del estado de Premium de prueba ("Premium: te quedan 5 días").
- Indicador de respaldo: "Guardado en tu teléfono" / "Respaldado".

## 8. Aprender: lecciones interactivas

### 8.1 Estructura
Eje → Unidad temática (las del temario DEMRE) → Lecciones (3–6 min, 6–12 pasos) → Pasos.
Cada paso tiene: `skillIds`, **habilidad PAES** (Resolver problemas / Modelar / Representar / Argumentar), dificultad 1–5, pistas graduadas (1–3), feedback por error típico.

### 8.2 Tipos de paso (catálogo)
| Tipo | Qué hace el estudiante | Habilidad que entrena |
|---|---|---|
| `explain` | Lee una idea corta con ilustración/animación | — |
| `balance` ✅ (spike) | Mantiene el equilibrio aplicando operaciones a ambos lados | Resolver |
| `graph` | Mueve deslizadores (m, n / a, b, c) o arrastra puntos y ve la función cambiar | Representar, Modelar |
| `numberline` | Ubica/arrastra valores e intervalos en la recta (enteros, fracciones, inecuaciones) | Representar |
| `area-model` | Arma rectángulos para productos notables y factorización | Representar |
| `fraction-bars` | Divide y compara barras/círculos para fracciones y porcentajes | Representar |
| `table-builder` | Completa tablas (proporcionalidad, frecuencias, función) y ve el gráfico | Modelar |
| `match` | Une representaciones: expresión ↔ tabla ↔ gráfico ↔ enunciado | Representar |
| `order` | Ordena pasos de una resolución o números | Argumentar |
| `find-error` | Encuentra el paso equivocado en una resolución ajena y explica por qué | **Argumentar** (poco cubierto por la competencia) |
| `choice` | Alternativa múltiple A–D (A–E en M2) con explicación por alternativa | Todas |
| `numeric` | Respuesta con teclado matemático (fracciones, negativos, decimales con coma) | Resolver |
| `expression` | Escribe una expresión algebraica; se compara por equivalencia simbólica | Modelar |
| `sufficiency` | Suficiencia de datos (formato M2) | Argumentar |
| `geo-construct` | Arrastra/rota/refleja figuras en el plano; Pitágoras con cuadrados sobre los lados | Representar |
| `simulate` | Lanza dados/monedas miles de veces y compara con la probabilidad teórica | Modelar |
| `boxplot` | Construye un diagrama de cajón arrastrando cuartiles | Representar |

### 8.3 Profundidad y desafío gradual
- Cada lección: **descubrir** (interactivo sin presión) → **formalizar** (la regla, con Equis) → **practicar** (3 niveles) → **desafío PAES** (pregunta en formato real) → cierre con XP.
- **Motor de dominio adaptativo:** si aciertas 3 seguidos sin pistas sube la dificultad; 2 errores seguidos baja un nivel y ofrece el interactivo de nuevo.
- **Momento ajá:** acierto después de un error en el mismo paso → chispa coral + haptic + "¡Lo entendiste!".

## 9. Practicar
1. **Práctica por tema:** elige eje/unidad/habilidad; ejercicios generados por **plantillas paramétricas** (§14.3): variedad prácticamente infinita, siempre verificada.
2. **Repaso de errores:** cada error queda en tu "cuaderno de errores"; repaso espaciado (1, 3, 7, 14 días).
3. **Ensayos:**
   - **M1:** 65 preguntas, 4 alternativas, 2 h 20 min (formato DEMRE 2027).
   - **M2:** 55 preguntas, 4 o 5 alternativas, incluye suficiencia de datos, 2 h 20 min.
   - **Mini-ensayos** de 15 preguntas / 20 min para practicar en la micro.
   - Pausa/retomar (se guarda cada respuesta), revisión posterior con explicación de **cada alternativa** y tutor en contexto.
   - Resultado: puntaje estimado (rango, con aviso honesto: "estimación orientativa, no es el puntaje oficial"), desglose por eje, unidad y habilidad, tiempo por pregunta, y "tu plan se ajustó".
4. **Reto relámpago (minijuego):** 60 s de cálculo mental y ecuaciones rápidas con dificultad creciente; combo, récord personal, XP. Premium: ligas semanales anónimas (apodo opcional).

## 10. Tutor IA: "Pregúntale a Equis"

**Qué es:** un tutor socrático en contexto que ayuda a **entender**, no entrega respuestas.

- **Dónde:** botón "No entiendo" / "Pregúntale a Equis" en cada ejercicio, en la revisión de ensayos y tras 2 errores seguidos.
- **Qué recibe (contexto):** enunciado, respuesta del estudiante, código de error del motor, solución canónica verificada del contenido, pistas ya vistas, nivel del estudiante.
- **Cómo responde:**
  1. Pregunta primero qué intentó ("¿Qué hiciste con el 3 del lado izquierdo?").
  2. Da la **siguiente** idea mínima, nunca toda la solución de golpe.
  3. Si el estudiante lo pide 3 veces o se frustra, muestra la resolución completa paso a paso, **generada desde la solución verificada** (no inventada).
  4. Cierra verificando comprensión con una pregunta parecida (generada por plantilla y corregida por el motor).
- **Paciencia infinita:** nunca dice "ya te lo expliqué"; cambia de representación (balanza → gráfico → ejemplo con plata).
- **Precisión:** el tutor **no decide** si algo es correcto; eso lo hace el motor. Cualquier número que el tutor afirme sobre la respuesta sale de la solución verificada.
- **Seguridad (13+):** sin datos personales en el prompt; se limita a temas de estudio; derivación amable si aparece angustia ("Si te sientes sobrepasado, habla con alguien de confianza").
- **Técnica:** Supabase Edge Function → API de Claude (la clave vive solo en los secretos de la función). Modelo rápido y económico por defecto (familia Haiku), uno más capaz solo para explicaciones largas. Respuestas en streaming. Tope diario por usuario (gratis/Premium) y tope global de gasto mensual con alerta. Sin red: mensaje amable + pistas locales.
- **Costos:** [DECIDIR] tope de gasto mensual del tutor; se estima con precios vigentes antes de implementar.

## 11. Progreso
- **Puntaje estimado M1 (y M2):** rango + tendencia semanal; se calcula con dominio por unidad ponderado por peso en la prueba y resultados de ensayos. Siempre con aviso de estimación.
- **Mapa de dominio:** 4 ejes → 16 unidades (M1) → habilidades; colores de marca (sin rojo).
- **Las 4 habilidades PAES** (Resolver, Modelar, Representar, Argumentar) con su dominio: nadie más lo muestra.
- **Racha:** calendario, día de descanso semanal automático, protector de racha.
- **XP y nivel** (niveles con nombre, ej. "Aprendiz de la x" → "Maestro del vértice").
- **Logros:** 12 insignias ya ilustradas (rachas 3/7/30, idea, números, x, geometría, estadística, ensayo, 100, repaso de errores, desbloquear M2) + logros de maestría Premium.
- **Historial de ensayos** con evolución.

## 12. Perfil
- Cuenta: "Guardar mi progreso con Google" / "Entrar con Google" / resolución de conflicto de cuenta.
- Plan: estado de la prueba/Premium, boleta, gestionar o cancelar (enlace a Play), restaurar compras.
- Mi PAES: pruebas, fecha, meta de puntaje, tiempo diario.
- Recordatorios (hora, desactivar).
- Privacidad: política, **Borrar mi cuenta y datos**, descargar mis datos (opcional).
- Ayuda: reportar un error, formulario de feedback, preguntas frecuentes.

## 13. Motivación y retorno
- **XP:** 10 por paso correcto sin pistas, 5 con pistas, +20 lección completada, bonos por ensayo y reto (valores en config remota).
- **Meta diaria** según tiempo elegido; **racha amable** con 1 descanso automático por semana.
- **Recordatorio local** diario con textos variados de Equis; se suaviza si ya cumpliste.
- **Resumen semanal** en la app ("Esta semana subiste 30 puntos estimados en Álgebra").
- Nada de presión artificial: sin "vas a perder todo", sin vidas.

## 14. Contenido

### 14.1 Alcance por prueba
**M1 (16 unidades, temario DEMRE Admisión 2027):**
- **Números:** enteros y racionales · porcentaje · potencias y raíces enésimas.
- **Álgebra y funciones:** expresiones algebraicas (productos notables, factorización) · proporcionalidad · ecuaciones e inecuaciones de primer grado · sistemas 2×2 · función lineal y afín · función cuadrática.
- **Geometría:** figuras (Pitágoras, perímetros y áreas) · cuerpos (área y volumen) · transformaciones isométricas · semejanza y proporcionalidad.
- **Probabilidad y estadística:** tablas y gráficos · medidas de posición (cuartiles, percentiles, cajón) · reglas de probabilidad.

**M2 (todo M1 +):** reales · matemática financiera · logaritmos · sistemas (casos de solución) · función potencia/exponencial/logarítmica · trigonométricas · homotecia · razones trigonométricas · circunferencia · esfera · rectas en el plano · dispersión · probabilidad condicional · combinatoria · binomial y normal.

**Premium, otras pruebas (fases posteriores):** Competencia Lectora, Ciencias, Historia. Requieren tipos de ejercicio distintos (lectura con textos, subrayado, inferencia) y otro pipeline de contenido; se diseñan aparte.

### 14.2 Volumen objetivo al lanzamiento
- **M1:** 16 unidades × ~3 lecciones = ~48 lecciones interactivas + **1 plantilla paramétrica por habilidad de cada unidad** (≥ 60 plantillas) + 3 ensayos M1 completos + 10 mini-ensayos.
- **M2:** ensayos y práctica paramétrica primero; lecciones profundas por OTA.

### 14.3 Cómo lograr variedad y profundidad sin revisar miles de ítems
**Plantillas paramétricas** en `src/engine/generators/`: cada plantilla define la estructura del ejercicio, rangos de parámetros,
cómo calcular la respuesta **con el motor exacto**, cómo generar distractores a partir de errores típicos reales
(ej.: olvidar cambiar el signo, sumar denominadores) y el feedback de cada uno.
El fundador revisa **la plantilla una vez** (con 10 ejemplos generados); el motor garantiza que los miles de variantes sean correctas.

### 14.4 Revisión de calidad sin estudiantes (4 capas)
1. **Verificación automática (motor):** toda respuesta se recalcula; `content:validate` falla ante cualquier discrepancia, notación inválida o ítem con más de una alternativa correcta.
2. **Revisión cruzada por IA independiente:** una segunda pasada con checklist (una sola respuesta correcta, distractores plausibles, enunciado sin ambigüedad, español de Chile, alineación con el temario) genera un informe; solo lo marcado va a revisión humana.
3. **Revisión humana:**
   - El fundador revisa plantillas, lecciones clave y todo lo marcado (no cada ítem).
   - **Recomendado:** un **profesor(a) de matemática** freelance revisa por lotes (ej. vía Workana o contactos de liceos); costo acotado por lote. [DECIDIR]
   - Referencia de estilo y dificultad: modelos de prueba y preguntas liberadas oficiales de DEMRE (como referencia, **sin copiar** ítems).
4. **Pilotaje:** closed testing (12+ testers), "Reportar error" en cada paso, métrica "pasos con más errores" → corrección por OTA.

Solo `reviewStatus: "approved"` llega a producción (se mantiene la regla A2).

## 15. Requisitos no funcionales (se mantienen de la spec)
Fiabilidad (cero pérdida de progreso), 60 fps en interactivos en gama media-baja, arranque en frío < 3 s, 100 % del aprendizaje offline
(el tutor y la compra requieren red, con mensaje amable), accesibilidad AA (texto tinta sobre celeste), objetivos ≥ 48 dp,
alternativa con botones en todo interactivo de arrastre, privacidad y datos mínimos, RLS en todas las tablas, español de Chile.

## 16. Datos (cambios respecto de la spec)
Nuevas tablas (todas con RLS por `auth.uid()`):
- `entitlements` (user_id, plan: 'free'|'trial'|'premium', trial_started_at, trial_ends_at, source, updated_at) — la prueba se registra en servidor cuando hay sesión; localmente siempre.
- `exam_attempts` (id, user_id, exam_id, kind 'M1'|'M2'|'mini', started_at, finished_at, answers jsonb, score_estimate jsonb).
- `tutor_usage` (user_id, day, conversations, tokens) — límites y control de costo.
- `review_queue` (user_id, item_ref, due_at, interval) — repaso espaciado.
- `onboarding_answers` (user_id, answers jsonb) — sin datos personales; el apodo **no** se sube.
Webhook de RevenueCat → Edge Function → `entitlements`.

## 17. Métricas
- Embudo del onboarding por pantalla; % que termina el momento ajá (pantalla 2).
- Activación: % que completa la 1.ª lección el día 1. Retención D1, D7, D30.
- Uso del tutor (conversaciones/usuario, % que "entendió" en la pregunta de verificación).
- Conversión prueba → Premium; uso de la oferta; cancelaciones.
- Calidad: pasos con más errores, reportes de error por 1.000 pasos.
- Aprendizaje: variación de dominio y de puntaje estimado por semana.

## 18. Fases (propuesta realista)

La PAES Regular 2026 es el **30 nov – 2 dic**. El cuello de botella no es el código sino **revisar contenido** y el closed testing de Play (12 testers × 14 días).

| Fase | Fecha objetivo | Qué incluye |
|---|---|---|
| **F1 · Base jugable** | ~1 semana | Onboarding de 16 pantallas (con los diseños del fundador) · tabs Inicio/Practicar/Progreso/Perfil con datos reales · reproductor de lecciones · 6+ tipos de paso · Álgebra y funciones completo · práctica paramétrica · guardado + sync · racha/XP/logros base |
| **F2 · Lanzamiento a closed testing** | ~1,5–2 semanas | 4 ejes de M1 con lecciones · ensayos M1 + mini-ensayos · tutor IA · prueba 7 días + Premium (RevenueCat) · puntaje estimado · cumplimiento Play → **AAB en closed testing** |
| **F3 · Durante el closed testing (OTA)** | 14 días | Correcciones de contenido · M2 (práctica + ensayos) · reto relámpago · más plantillas |
| **F4 · Público** | ~fin de octubre / inicio de noviembre | Producción en Play · marketing (TikTok con clips de balanza y gráficos) |
| **F5 · Temporada invierno 2027** | dic 2026 – mar 2027 | M2 profundo · Competencia Lectora · Ciencias · Historia (Premium) |

Los pagos (RevenueCat) agregan una dependencia nativa → **un build nuevo** (con plan Starter no es problema).

## 19. Riesgos
| Riesgo | Mitigación |
|---|---|
| Revisión de contenido (fundador sin estudiantes ni profesor) | Plantillas paramétricas + 4 capas (§14.4) + profesor freelance |
| Costo del tutor IA | Modelo económico, topes diarios, tope global mensual con alerta, cache de explicaciones frecuentes |
| Alucinaciones del tutor | El tutor nunca decide correcto/incorrecto; se alimenta de la solución verificada |
| Abuso de la prueba (reinstalar) | Aceptable (Premium barato); se registra en servidor al haber sesión |
| Alcance demasiado grande para noviembre | Fases §18; M2 y otras pruebas por OTA/versiones |
| Políticas de Play (suscripciones, menores 13+) | Precio y condiciones claras, gestión y cancelación visibles, Data Safety actualizado (incluye procesamiento IA) |
| Puntaje estimado mal calibrado | Rango + aviso honesto; calibración con ensayos |

## 20. Decisiones abiertas para el fundador
1. Límites exactos Gratis vs Premium (§4.2).
2. Precios: mensual y/o Pase PAES; montos (§4.3).
3. Oferta de fin de prueba: % y duración real (§4.1).
4. Tope mensual de gasto del tutor IA (§10).
5. ¿Contratar un profesor de matemática freelance para revisar lotes? (§14.4).
6. Orden de las otras pruebas Premium (Lectora, Ciencias, Historia) (§18 F5).
7. Aprobación de las 16 preguntas/pantallas del onboarding (§6).

## 21. Qué se conserva de lo ya construido
Todo sirve: proyecto y build, marca y tokens, `MathText` (toda la matemática de la app), motor racional y balanza
(lecciones de ecuaciones y la pantalla 2 del onboarding), validador de contenido, CI, Supabase (anónimo + Google) y Sentry.
