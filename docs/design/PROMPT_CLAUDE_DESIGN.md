# Prompt para Claude Design: la app después del onboarding

> Copiar desde "INICIO DEL PROMPT" hasta "FIN DEL PROMPT". El design system de MePreparo ya está adjunto en Claude Design.
> Si el resultado queda superficial, pedir por partes: "Continúa con la Parte 4 (Equis)", etc.

---

INICIO DEL PROMPT

Diseña la app completa de **MePreparo** que el estudiante ve **después de terminar el onboarding**: la navegación principal, las 5 pestañas y todas las pantallas completas que se abren desde ellas. Usa **exclusivamente el design system de MePreparo que está adjunto** (tokens, componentes, poses de Equis, íconos de temas, chispa, cuadrícula de cuaderno). El resultado es un prototipo navegable de teléfono Android.

## 0. Qué es MePreparo (contexto para decidir bien)

App Android para que estudiantes chilenos de 16–18 años **entiendan** la matemática de la PAES (M1 primero; M2, Competencia Lectora, Ciencias e Historia después). Tiene el ADN de Brilliant: se aprende **haciendo** con interactivos (gráficos con deslizadores, recta numérica, modelos de área), en pasos cortos, sin juicio. Pero **no es Brilliant**: es un **preuniversitario completo en el bolsillo**, pensado para una meta concreta: la carrera, el puntaje de corte y la fecha de la PAES de cada estudiante.

La pregunta que cada pantalla debe responder: **"¿por qué usaría esto y no ChatGPT o un preu?"** Nuestras respuestas, que el diseño tiene que hacer visibles:
1. **Te conoce**: sabe tu carrera, sus ponderaciones, el corte, tu fecha, tus errores y qué te cuesta. Todo lo que ves está personalizado.
2. **Se toca**: la matemática se mueve y se manipula; no son párrafos.
3. **Es exacta**: las respuestas las corrige un motor matemático, no una IA. Cero errores del tipo "revisado por IA".
4. **Está llena de contenido**: ruta completa del temario DEMRE 2027, mini-clases, práctica infinita, ensayos que **nunca se repiten**, intensivos. Tiene que sentirse abundante, como Preu AI ("+400 miniclases") o Prepa, pero ordenado.
5. **Te hace volver**: plan diario, racha, cuenta regresiva a tu PAES, cuaderno de errores que te recuerda lo que olvidas.
6. **Es honesta**: lo esencial es gratis para siempre; Premium es barato, con el precio siempre visible y **sin cobros sorpresa**. Es la mayor queja del mercado: paywalls escondidos, cobros después de cancelar y "Añada forma de pago" a la tercera pregunta.

## 1. Reglas del design system (obligatorias)

- **Paleta cerrada**:
  - Papel `#FBF8F2` con la cuadrícula de cuaderno de fondo.
  - Tinta `#1E2A4A` para todo el texto.
  - Celeste `#4FB3E8` para todo lo interactivo, la selección y el progreso.
  - Coral `#FF7A59` **solo** para el momento "ajá" (chispa), la llama de la racha, "Nuevo" y la etiqueta Premium (pastilla coral clara como en la pantalla de Premium del onboarding).
  - Grafito `#5B6475` para texto secundario **y para los errores**.
  - Verde `#2FBF71` **solo** para lo correcto.
  - **No existe el rojo**, ni el morado, ni los degradados, ni el glassmorphism, ni el modo oscuro.
- **Tipografía**: Poppins (700 títulos, 600 subtítulos y botones, 400 cuerpo). La matemática va en **STIX Two Text** y grande. Las notas de Equis van en **Kalam**, levemente rotadas.
- **Formas**:
  - Tarjetas blancas con radio 20, borde cálido `#E7E1D5` y sombra suave.
  - Pastillas para botones, chips, badges y tabs.
  - Botón primario con **texto tinta sobre celeste**.
  - Una sola acción primaria por pantalla; en los ejercicios va fija abajo.
- **Movimiento**: calmado (ease-out 120/200/320 ms, fade-up de 6 px). El único "pop" es para el correcto y el ajá. Sin confeti.
- **Mascota Equis**: poses saludo, pensando, señalando, ajá, explicando, celebrando, estudiando, descansando; expresiones curioso, ajá, tranquilo, apoyo. Es un compañero tranquilo que explica sin juzgar. Úsala con intención, no en todas las tarjetas.
- **Íconos**: Lucide con trazo de 2 px (vía el componente `Icon`) y las fichas de tema del DS (función, triángulo). **Sin emoji.**
- **Accesibilidad**:
  - Objetivos táctiles de 48 dp o más.
  - Contraste AA: el celeste nunca es texto pequeño.
  - Todo arrastre tiene una alternativa con botones.
- **Tamaño**: teléfono Android de 360–412 dp de ancho, márgenes de 16–20 dp y barra inferior de navegación del sistema.
- **Copy**:
  - Español de Chile correcto, tuteo, registro neutro (sin "po" ni garabatos), frases cortas.
  - Errores: "Casi. Revisa el signo.", jamás "Incorrecto".
  - Sin presión artificial ("vas a perderlo todo").
  - Sin vidas, corazones ni anuncios.
- **Componentes a reutilizar del DS**: BottomNav, Tabs, Card, Badge, Tag, Button, IconButton, ProgressBar, Dialog, Toast, Tooltip, ExerciseCard, AnswerOption, HintBox, FeedbackBanner, Mascot, Logo, Input, Switch, Select.
- **Componentes nuevos**: créalos en el mismo lenguaje y documéntalos al final (lista en la Parte 10).

## 2. Datos de ejemplo (úsalos en todas las pantallas; que todo sea coherente)

- **Estudiante**: "Cata", 4.º medio. Rinde la **PAES Regular 2026 (30 nov – 2 dic)**. Hoy es lunes 28 de septiembre: **faltan 63 días**.
- **Meta**: Ingeniería Comercial, Universidad de Chile.
  - Ponderaciones DEMRE 2027: NEM 10 %, Ranking 20 %, Lectora 10 %, M1 35 %, M2 15 %, Historia o Ciencias 10 %.
  - Corte 2026 (último seleccionado): **829,6**.
- **Pruebas**: M1, M2, Competencia Lectora e Historia.
- **Puntaje estimado M1**: rango **610–660** (sube desde 580–630 hace 2 semanas).
- **Meta diaria**: 20 min (≈ 60 XP). Hoy lleva 35 XP.
- **Racha**: 6 días (con un día de descanso usado el jueves). **Nivel 4, "Aprendiz de la x"**, 1.240 XP totales.
- **Plan**: Premium de prueba, **quedan 5 días**. Progreso "Guardado en tu teléfono" (todavía no vinculó Google).
- **Dominio M1 por eje**: Números 58 %, Álgebra y funciones 41 %, Geometría 22 %, Probabilidad y estadística 35 %.
- **Las 4 habilidades PAES**: Resolver problemas 55 %, Modelar 38 %, Representar 47 %, Argumentar 29 %.

**Temario M1 (DEMRE Admisión 2027), 4 ejes y 16 unidades. Úsalo tal cual en Aprender:**
- **Números**: Enteros y racionales · Porcentaje · Potencias y raíces enésimas.
- **Álgebra y funciones**: Expresiones algebraicas (productos notables y factorización) · Proporcionalidad · Ecuaciones e inecuaciones de primer grado · Sistemas de ecuaciones 2×2 · Función lineal y afín · Función cuadrática.
- **Geometría**: Figuras geométricas (Pitágoras, perímetros y áreas) · Cuerpos geométricos (área y volumen) · Transformaciones isométricas · Semejanza y proporcionalidad.
- **Probabilidad y estadística**: Tablas y gráficos · Medidas de posición (cuartiles, percentiles, diagrama de cajón) · Reglas de probabilidad.

**Volumen que muestra la app para M1** (debe verse abundante): 16 unidades · 64 lecciones interactivas · 96 mini-clases · práctica ilimitada · ensayos ilimitados que nunca se repiten · 4 intensivos.

## 3. Formatos de contenido (el vocabulario de la app; que cada uno se distinga a simple vista)

| Formato | Qué es | Duración |
|---|---|---|
| **Lección** | El corazón, estilo Brilliant: descubrir con un interactivo → formalizar con Equis → practicar en 3 niveles → desafío en formato PAES → XP | 4–6 min |
| **Mini-clase** | Repaso rápido de **un** concepto en 4–6 tarjetas deslizables con diagrama animado, fórmula y un ejemplo resuelto. Para refrescar antes de un ensayo | 90 s |
| **Práctica** | Ejercicios generados sin fin por tema o habilidad, con dificultad adaptativa 1–5 y corrección exacta | Libre |
| **Ensayo completo** | Formato oficial M1: 65 preguntas, 4 alternativas, 2 h 20 min | 140 min |
| **Mini-ensayo** | 15 preguntas mezcladas | 30 min |
| **Ensayo temático** | 20 preguntas de un eje | 30 min |
| **Ensayo a tu medida** | Eliges temas, cantidad (10–65) y tiempo (o sin tiempo). Pedido directo de los estudiantes | Libre |
| **Intensivo** | Programa guiado de 7, 14 o 30 días con una sesión diaria, ensayo de entrada y ensayo de salida que muestran cuánto subiste. Ejemplos: "Recta final: 60 días a la PAES", "Intensivo Funciones · 7 días", "Intensivo Geometría · 14 días", "Álgebra desde cero · 30 días" | Días |
| **Cuaderno de errores** | Cada error queda guardado con su explicación; vuelve en repaso espaciado (1, 3, 7 y 14 días) | — |
| **Reto relámpago** | 60 s de cálculo mental y ecuaciones rápidas; combo y récord personal | 60 s |
| **Fórmulas** | Tarjetas de fórmulas por unidad, para guardar y repasar | — |

Motivación v1: **XP, niveles con nombre, racha y logros**. **No** hay diamantes, gemas, tienda ni regalos.

## 4. Gratis vs Premium (cómo se ve en el diseño)

Principio: **gratis = aprender** (nunca se bloquea una lección). **Premium = prepararte como en un preu** (plan, ensayos sin límite, tutor sin límite, análisis y simulador).

| Función | Gratis | Premium |
|---|---|---|
| Lecciones y mini-clases de M1 (ruta completa) | Todas | Todas |
| Explicación de cada error + 1.ª pista | Siempre | Siempre |
| 2.ª y 3.ª pista | 5 al día | Sin límite |
| Resolución completa paso a paso | 3 al día | Sin límite |
| Equis (tutor) | 3 conversaciones al día | Sin límite |
| Foto de un ejercicio a Equis | 1 a la semana | Sin límite |
| Práctica por tema | 20 ejercicios al día | Sin límite |
| Ensayo completo M1 | 1 al mes | Sin límite |
| Mini-ensayo | 1 a la semana | Sin límite |
| Ensayos temáticos y a tu medida | — | Sin límite |
| Revisión de ensayos | Respuesta correcta + explicación de cada alternativa | + tiempo por pregunta, análisis por habilidad, Equis en cada pregunta |
| Intensivos | Día 1 de cada uno | Completos |
| Plan de estudio | "Sesión de hoy" | Plan semanal adaptativo hasta tu PAES |
| Cuaderno de errores | Últimos 7 días | Todo el historial + repaso espaciado automático |
| Puntaje estimado | Rango global | Por eje y habilidad + evolución |
| Simulador de postulación | Tu carrera meta | Compara hasta 10 carreras + qué subir en cada prueba |
| M2 | Diagnóstico + 1.ª lección de cada eje | Completo |
| Lectora, Ciencias, Historia | Diagnóstico (cuando estén) | Completas |
| Imprimir ensayo en PDF con clavijero | — | Sí |
| Racha, XP, niveles, logros base, fórmulas, respaldo con Google | Sí | + 1 protector de racha extra a la semana y logros de maestría |
| Reto relámpago | 1 partida al día | Sin límite |

**Precio**:
- **Mensual $3.990**.
- **Pase PAES $12.990**: pago único hasta tu próxima PAES, **no se renueva**.
- Oferta al terminar la prueba: 50 % de descuento durante 48 h reales.

**Reglas visuales de lo Premium**:
- Etiqueta "Premium" como pastilla coral clara. **Nunca candados agresivos** ni contenido borroso para "tentar".
- Nunca se interrumpe un ejercicio o ensayo en curso con un paywall.
- Al llegar a un límite, una **tarjeta amable** (no un modal que bloquea), con el precio a la vista y siempre un camino gratis: "Hoy usaste tus 3 resoluciones paso a paso. Mañana se recargan. — Desbloquear sin límite · $3.990/mes · Seguir gratis".
- Durante la prueba, un chip discreto "Premium · 5 días" en la cabecera de Inicio.

## 5. Navegación

**Barra inferior (BottomNav), 5 pestañas:** Inicio · Aprender · **Equis** (al centro, destacada con el ícono de Equis en un círculo celeste) · Practicar · Progreso.
- **Perfil** se abre desde el avatar (inicial del apodo) arriba a la derecha de cada pestaña.
- Las pantallas completas (lección, ensayo, chat, etc.) **ocultan** la barra inferior.

**Cabecera de Inicio**, compacta y siempre visible:
- Logo-ícono.
- Chip de racha (llama coral + "6").
- Anillo de meta diaria (35/60 XP).
- Chip de cuenta regresiva ("63 días").
- Avatar.

Cada chip abre su detalle en Progreso.

## 6. Las pantallas (qué diseñar)

### Parte 1 · Inicio ("¿qué hago hoy?")
1. **Saludo**: "Hola, Cata." + frase del plan ("Hoy toca Función cuadrática. 20 minutos, a tu ritmo.") + Equis saludando.
2. **Sesión de hoy** (tarjeta héroe): lista corta del plan de hoy con checks (1 lección · 8 ejercicios de práctica · repasar 3 errores), barra "1 de 3" y botón **Continuar**. Explica en una línea **por qué** eso hoy: "Porque M1 pesa 35 % en tu carrera y Funciones es tu eje más bajo".
3. **Cuenta regresiva a tu PAES**: "Faltan 63 días · PAES Regular 2026" con una línea de tiempo del plan (semanas → hoy → PAES) y el hito siguiente ("Ensayo completo este sábado").
4. **Tu meta**: rango estimado 610–660 → meta; "Ingeniería Comercial · U. de Chile · corte 829,6". Lleva al Simulador.
5. **Para ti** (carrusel de sugerencias inteligentes): "Repasa 3 errores de ayer" · "Mini-ensayo de 30 min" · "Te falta 1 lección para dominar Porcentaje" · "Nuevo intensivo: Recta final".
6. **Continuar donde quedaste** (la lección a medias, con miniatura del interactivo).
7. Estado de respaldo discreto al final: "Guardado en tu teléfono · Respaldar con Google".

**Estados**: primer día (sin racha, "Tu primera lección te espera"), meta cumplida (Equis celebrando, "Hoy ya cumpliste. Si quieres, un reto relámpago"), prueba Premium en su día 5 y en su día 7, y usuario gratis.

### Parte 2 · Aprender (el catálogo; tiene que verse lleno)
1. **Selector de prueba** (Tabs tipo píldora): M1 · M2 · Lectora · Ciencias · Historia. Las que aún no existen dicen "Pronto" con honestidad y ofrecen "Avísame". M2 muestra "Premium" pero la 1.ª lección de cada eje abierta.
2. **Resumen de la prueba**: "M1 · 16 unidades · 64 lecciones · 96 mini-clases" + dominio global.
3. **Ejes** (4 tarjetas grandes con la ficha de tema, % de dominio, barra y lecciones hechas; ej. Álgebra y funciones "9 de 24 lecciones", 4 por unidad).
4. **Buscador** ("Busca un tema: factorización, Pitágoras, porcentaje…").
5. **Ruta de un eje**: camino vertical tipo cuaderno. Unidades como secciones; lecciones como nodos con estados:
   - sugerida (celeste con Equis señalando);
   - en curso (anillo parcial);
   - completada (check);
   - dominada (check + chispa coral);
   - "más adelante" (suave, se puede abrir igual, **nunca bloqueada**).

   Al inicio de cada unidad, una fila de **mini-clases** y el botón "Practicar esta unidad".
6. **Detalle de unidad**: descripción, habilidades que entrena, lecciones, mini-clases, fórmulas de la unidad, "Practicar", "Ensayo temático" (Premium) y tu dominio.
7. **Reproductor de lección** (pantalla completa):
   - barra de progreso de pasos + X para salir;
   - enunciado con matemática grande;
   - el interactivo (diseña 3 ejemplos: **teclado matemático** para responder una ecuación; **gráfico** de una parábola con deslizadores a, b, c; **modelo de área** para (x + 4)(x + 2));
   - botón "Comprobar";
   - pistas graduadas (HintBox);
   - feedback: correcto en verde con +10 XP; error en grafito "Casi…" con explicación específica y "Pregúntale a Equis";
   - **momento ajá** (acierto después de un error): chispa coral + Equis ajá + "¡Lo entendiste!".
8. **Tipos de paso** que el reproductor debe mostrar coherentes: explicación, alternativas A–D con explicación por alternativa, respuesta numérica con **teclado matemático propio** (fracción, negativo, coma decimal, potencia, raíz), escribir expresión, unir representaciones (expresión ↔ gráfico ↔ tabla), ordenar pasos, **encontrar el error** en una resolución ajena y recta numérica.
9. **Lección completada**: XP ganada, dominio que subió ("Función cuadrática 41 % → 48 %"), racha, Equis celebrando, y "Siguiente lección" o "Practicar 5 más".
10. **Mini-clase**: tarjetas deslizables con diagrama, fórmula grande, ejemplo resuelto paso a paso, "Guardar fórmula" y al final "Probar con 3 ejercicios".

### Parte 3 · Equis (el tutor que te conoce; **no** un chat en blanco)
1. **Portada de Equis**: Equis grande (pose explicando) + "Hola, Cata. Ayer te equivocaste 3 veces con el signo al despejar. ¿Lo repasamos paso a paso?". Luego **atajos**:
   - "Explícame mi último error"
   - "¿Qué estudio hoy?"
   - "Quiz de 5 min de lo que me cuesta"
   - "Sácale foto a un ejercicio"
   - "¿Me alcanza para Ingeniería Comercial?"
   - "No entiendo un concepto"

   Debajo, conversaciones recientes y el contador honesto de uso gratis ("Te quedan 2 conversaciones hoy"), o "Sin límite" en Premium.
2. **Conversación**:
   - Equis pregunta antes de responder ("¿Qué hiciste con el 3 del lado izquierdo?"), da la siguiente idea mínima y **responde con interactivos embebidos** (un gráfico o una recta numérica dentro de la burbuja) y matemática bien escrita.
   - Cierra con una pregunta de comprobación que **corrige el motor** (etiqueta "Verificado").
   - Botones rápidos bajo el campo: "Dame otra pista", "Muéstrame paso a paso", "Otro ejemplo", "Ya entendí".
   - Mensaje en su contexto cuando se abre desde un ejercicio (la tarjeta del ejercicio fijada arriba).
3. **Foto de un ejercicio**:
   - cámara con marco guía;
   - recorte;
   - Equis reconoce el enunciado ("¿Leí bien?" y se puede editar);
   - lo resuelven juntos paso a paso;
   - al final, "Te armé 5 ejercicios parecidos", que se corrigen con el motor.
4. **Estados**: sin conexión ("Equis necesita internet para conversar. Mientras, tienes las pistas de cada ejercicio"), límite gratis alcanzado (tarjeta amable) y un mensaje de apoyo si el estudiante escribe algo angustiado ("Si te sientes sobrepasado, habla con alguien de confianza").

### Parte 4 · Practicar
1. **Portada**, en secciones:
   - **Ensayos**: completo, mini, temático, a tu medida; con el contador gratis ("Te queda 1 ensayo completo este mes").
   - **Intensivos**: tarjetas horizontales con duración, días y "Empezar". Destaca "Recta final: 60 días a la PAES".
   - **Práctica por tema**: por eje, unidad o habilidad PAES.
   - **Cuaderno de errores**: "12 errores por repasar · 3 vencen hoy".
   - **Reto relámpago**: récord personal.
   - **Fórmulas**.
2. **Configurar ensayo a tu medida**: temas (chips), cantidad (deslizador 10–65), tiempo (con tiempo real, tiempo propio o sin tiempo) y "Empezar".
3. **Antes del ensayo completo**: formato (65 preguntas, 2 h 20 min), "Se guarda cada respuesta: si sales, retomas donde quedaste", "Puedes pausarlo" y "Imprimir en PDF con clavijero" (Premium).
4. **Ensayo en curso**:
   - cabecera con el tiempo restante y el número de pregunta (12/65);
   - pregunta con matemática grande y AnswerOption A–D;
   - marcar para revisar;
   - grilla de navegación de preguntas (respondida, marcada, en blanco);
   - pausar;
   - **sin feedback** hasta terminar.
5. **Resultados del ensayo**:
   - puntaje estimado en rango, con el aviso "Estimación orientativa, no es el puntaje oficial";
   - comparación con el ensayo anterior;
   - desglose por eje y por las 4 habilidades PAES;
   - tiempo por pregunta;
   - "Tu plan se ajustó: +1 sesión de Geometría esta semana";
   - Equis con un comentario concreto.
6. **Revisión de pregunta**: tu respuesta, la correcta, **explicación de cada alternativa**, "Resolución paso a paso", "Pregúntale a Equis" y "Guardar en el cuaderno".
7. **Detalle de intensivo**: objetivo, calendario de días (día 3 de 7), ensayo de entrada vs salida, sesión de hoy.
8. **Cuaderno de errores**: lista por tema con el error típico ("Olvidaste cambiar el signo al pasar restando"), filtro por eje, "Repasar ahora" (sesión de 5) y el estado del repaso espaciado.
9. **Reto relámpago**: pantalla de juego (60 s, combo y respuestas rápidas en botones grandes) + resultado con récord.
10. **Práctica por tema en curso**: el mismo reproductor, con un indicador de dificultad 1–5 que sube y baja, y el contador de ejercicios gratis del día.

### Parte 5 · Progreso ("¿estoy avanzando de verdad?")
1. **Puntaje estimado M1**: rango actual, tendencia semanal (gráfico de línea simple), meta y aviso honesto. Premium: por eje.
2. **Simulador de postulación** (el diferenciador más fuerte):
   - tu puntaje ponderado estimado para Ingeniería Comercial U. de Chile vs el corte 829,6;
   - aporte de cada prueba según su ponderación (NEM y Ranking editables, con calculadora NEM);
   - "Si subes 40 puntos en M1, ganas 14 ponderados: es tu mejor palanca";
   - Premium: comparar varias carreras en una lista con semáforo de celestes y grafitos (**sin rojo**).
3. **Mapa de dominio**: 4 ejes → 16 unidades (grilla tipo cuaderno con intensidad celeste; dominada = verde con chispa).
4. **Las 4 habilidades PAES** (Resolver, Modelar, Representar, Argumentar) con barras y una frase de qué significa cada una. Ninguna otra app las muestra.
5. **Racha**: número grande, calendario del mes con días activos, días de descanso y protector de racha. Explica la regla amable: "1 día de descanso automático por semana".
6. **XP y nivel**: nivel con nombre ("Aprendiz de la x" → "Domador de fracciones" → "Maestro del vértice"…), barra al siguiente nivel, XP de la semana.
7. **Logros**: grilla de insignias (rachas 3/7/30, primera lección, primer ensayo, 100 ejercicios, repaso de errores, dominar un eje, desbloquear M2…), con las ganadas a color, las no ganadas en contorno grafito y las de maestría con la etiqueta Premium.
8. **Historial**: ensayos rendidos con puntaje y fecha, y el **resumen semanal** ("Esta semana: 5 días activos, 23 errores corregidos, +30 puntos estimados en Álgebra").

### Parte 6 · Perfil (desde el avatar)
- **Encabezado**: apodo, nivel, "Estudiando desde septiembre".
- **Tu PAES**: fecha, pruebas, carrera, institución y meta (editables; al cambiar, "Tu plan se recalculará").
- **Tu plan**: estado (Prueba Premium · 5 días / Gratis / Premium mensual / Pase PAES hasta el 2 dic), "Ver lo que incluye", "Ver mi boleta", "Gestionar o cancelar en Google Play", "Restaurar compras".
- **Cuenta y respaldo**: "Guardar mi progreso con Google" / "Respaldado · cata…@gmail.com".
- **Estudio**: meta diaria (5/10/20/30 min), recordatorio (hora + interruptor), sonidos y vibración.
- **Ayuda**: reportar un error de contenido, preguntas frecuentes, enviar comentarios.
- **Privacidad**: política, descargar mis datos, **Borrar mi cuenta y datos** (con Dialog de confirmación).
- **Pie**: versión de la app.

### Parte 7 · Premium y fin de la prueba (honestidad como diseño)
1. **Aviso del día 5** (tarjeta en Inicio) y **del día 7** ("Hoy termina tu prueba. No se cobra nada automáticamente").
2. **Fin de la prueba**, en pantalla completa y tono amable:
   - resumen de lo que Premium le dio esa semana ("4 ensayos, 23 explicaciones paso a paso, 11 conversaciones con Equis");
   - **qué conservas gratis** (lista con checks: todas las lecciones, tu racha, tu XP, tus logros);
   - la oferta de 50 % por 48 h con la hora exacta de vencimiento;
   - "Seguir gratis" igual de visible.
3. **Planes**: comparación Gratis vs Premium (tabla limpia) y 2 opciones (mensual $3.990 · Pase PAES $12.990 "sin renovación, hasta tu PAES"), con la frase "Nunca cobramos sin que toques Pagar" y "Cancela cuando quieras desde Google Play".
4. **Boleta** (antes de pagar): detalle tipo boleta de papel con el ítem, el precio final en CLP, la fecha de término y si se renueva o no. Botón "Pagar $12.990".
5. **Compra lista**: Equis celebrando y la boleta resumida.
6. **Tarjeta de límite alcanzado**: 3 variantes (Equis, resoluciones paso a paso, ensayo completo del mes).

### Parte 8 · Momentos transversales
- **Primer ingreso después del onboarding**: un recorrido de 3 globos de Equis sobre la barra ("Aquí está tu plan de hoy", "Aquí aprendes", "Aquí estoy yo") que se puede saltar.
- **Permiso de notificaciones en contexto**, después de la primera lección: Equis con "¿Te aviso a las 19:00 para no cortar la racha?".
- **Racha en riesgo** (tarjeta suave a las 21:00, sin culpa).
- **Subida de nivel** y **logro desbloqueado** (sheet con el pop de la insignia).
- **Estados vacíos** (cuaderno de errores sin errores, historial sin ensayos) con Equis descansando.
- **Carga y sin red**: las lecciones funcionan sin red, así que solo Equis, la compra y la sincronización lo avisan.
- **Reportar un error** en cualquier paso (sheet con motivos).

### Parte 9 · Entregables
- Prototipo navegable de todas las partes, en el orden 1 → 8, con los datos de ejemplo.
- Variantes de estado donde se indican (gratis / prueba / Premium; vacío; sin red).

### Parte 10 · Componentes nuevos a documentar
StreakChip, CountdownChip, DailyGoalRing, PlanTodayCard, SuggestionCard, SubjectTabs, AxisCard, PathNode (5 estados), UnitHeader, MiniClassCard, LessonPlayerShell, MathKeypad, InteractiveFrame, AhaSpark, XPToast, MasteryGrid, SkillBars, ScoreRangeGauge, AdmissionSimulator, StreakCalendar, LevelBar, BadgeTile, ExamTimerHeader, QuestionGrid, ExamResultBreakdown, IntensiveCard, ErrorNotebookItem, ChatBubble (Equis / estudiante / con interactivo embebido / verificado), QuickReplyChips, CameraFrame, LimitCard, PremiumTag, PlanCompare, Receipt, CoachMark.

**Que no se te olvide**:
- La app tiene que sentirse **llena, personal y honesta**.
- Si una pantalla podría existir igual en ChatGPT, rediséñala para que use lo que sabemos de Cata o para que la matemática se pueda tocar.

FIN DEL PROMPT
