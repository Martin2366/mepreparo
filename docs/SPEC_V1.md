# MePreparo — Especificación v1 (aprobada)

## Context
App Android (Expo/React Native) para **entender** la matemática PAES con el ADN de Brilliant: aprender
haciendo con piezas interactivas, a tu ritmo y sin juicio. Nace del discovery: las apps PAES actuales
(Preu AI, PAES Quiz, Cachai Online, Paes Matemática 1, Prepa PAES; en web SimplePAES y Puntaje Nacional)
son ensayos + video + chatbot, con paywalls opacos, cobros abusivos, contenido impreciso ("revisado por IA")
y fallas que pierden el progreso. Nadie ofrece comprensión interactiva con un modelo honesto.
Restricciones: 7–10 días de construcción, presupuesto ≈ $0 restante (Play Console ya pagada), contenido revisado por el fundador.
Este documento es la **especificación**. El plan de implementación paso a paso se escribe en la siguiente fase.

---

## PRODUCT SUMMARY
MePreparo ayuda a estudiantes chilenos de enseñanza media a entender la matemática PAES manipulándola:
ecuaciones que se equilibran en una balanza y funciones que cambian en vivo al mover deslizadores.
Cada error se explica y el progreso se mide por habilidad del temario oficial.
La v1 cubre en profundidad el eje **Álgebra y funciones de M1**, el eje con más peso en la prueba
(~14 de 33 unidades según una fuente secundaria; se verificará con el PDF de DEMRE). Es **100% gratis**,
sin anuncios, sin vidas y sin cobros.

## USERS
- **Principal:** estudiante de 3.º–4.º medio que rinde la PAES (invierno o regular), le cuesta la matemática,
  estudia desde el celular (a menudo en la micro) y no puede pagar un preu o quiere complementarlo.
- **Secundario:** estudiante de 1.º–2.º medio que empieza a prepararse temprano.
- Edad declarada en Play: 13+ (no es una app para niños). Se minimiza la recolección de datos.

## V1 SCOPE
**MUST**
1. **Entrada sin registro:** sesión anónima de Supabase al primer arranque.
2. **Onboarding (≤ 60 s + diagnóstico opcional):**
   - Bienvenida con Equis.
   - Autoevaluación con opciones neutras ("Me cuesta harto / Más o menos / Bien, quiero afinar").
   - PAES objetivo (invierno o regular) → cuenta regresiva.
   - Hora del recordatorio.
   - Mini-diagnóstico opcional y saltable.
3. **Mini-diagnóstico:** 8–10 preguntas estilo PAES (4 alternativas, A–D) que mapean habilidades
   → mapa de dominio + ruta sugerida.
4. **Ruta del eje Álgebra y funciones:** ~10 lecciones de 3–5 min (6–10 pasos cada una).
   El resto de los ejes de M1 y M2 aparecen como "Próximamente".
5. **Reproductor de lecciones.** Tipos de paso:
   - explicación
   - **Balanza de ecuaciones** (interactiva)
   - **Gráfico de función con deslizadores** (interactivo)
   - alternativa múltiple
   - respuesta numérica

   Todos con **pistas graduadas** y **explicación específica de cada error**. El progreso se guarda
   **en cada paso** (a prueba de cierres).
6. **Retención:**
   - XP por paso correcto.
   - Racha diaria amable, con 1 día de descanso por semana.
   - Dominio por habilidad.
   - Insignias (set v1 de ~8).
   - Cuenta regresiva a la PAES.
   - Recordatorio diario con notificación local.
7. **"Guardar mi progreso con Google":** convierte la cuenta anónima con `linkIdentity`
   (OAuth por navegador + PKCE + deep link). También permite **recuperar el progreso** en otro teléfono.
8. **"Reportar un error"** en cada paso: guarda lección, paso, versión del contenido y mensaje.
   Es la promesa de precisión.
9. **Cumplimiento de Google Play:**
   - "Borrar mi cuenta y datos" dentro de la app.
   - Página web para solicitar el borrado.
   - Política de privacidad pública.
   - Data Safety.
10. **Observabilidad:** Sentry + tabla de eventos.

**SHOULD**
- Pantalla de progreso con habilidades, racha e insignias.
- Enlace a un formulario de feedback para testers.
- Microanimación del momento "ajá" (chispa coral) y haptics suaves al acertar.

**NICE TO HAVE**
- Repaso espaciado de pasos fallados.
- Compartir un logro como imagen.

## OUT OF SCOPE (v1)
- Pagos, RevenueCat y Pase PAES (llegan en v1.1).
- IA / tutor conversacional.
- Pizarra de dibujo.
- Fichas algebraicas.
- Modo oscuro.
- Otros ejes de M1 y M2.
- Ensayos completos de 65 preguntas.
- Web/PC e iOS.
- Ranking o competencia.
- Push remotas.
- Panel de administración de contenido.

## CORE FLOWS
1. **Primer uso:**
   abrir → sesión anónima (invisible) → onboarding → ¿diagnóstico? (sí: 8–10 preguntas → mapa de dominio | no)
   → Ruta → primera lección → primer "ajá" → pedir permiso de notificaciones (en contexto, después del valor)
   → sugerir "Guardar mi progreso con Google".
2. **Retorno diario:**
   recordatorio → Ruta ("Continuar: Lección N") → lección → XP / racha / insignia → Ruta.
3. **Error en un paso:**
   respuesta incorrecta → explicación de ese error específico → pista siguiente → reintento
   (nunca "Incorrecto ❌").
4. **Vincular Google:**
   Perfil → Guardar con Google → navegador → callback → cuenta permanente (mismo user_id, progreso intacto).
   Si esa cuenta Google ya existe → ofrecer "Usar el progreso de mi cuenta Google" (inicia sesión y reemplaza el local).
5. **Teléfono nuevo:**
   onboarding → "¿Ya tienes progreso? Entrar con Google" → se restaura.
6. **Sin conexión:**
   todo el aprendizaje funciona. La sincronización se pone en cola y se reintenta al volver la red.
   Nunca se bloquea la UI.
7. **Borrar cuenta:**
   Perfil → confirmar → Edge Function borra el usuario y sus datos → estado limpio.

**Navegación (Expo Router):**
- `(onboarding)`: stack.
- `(tabs)`: **Aprender** (ruta), **Progreso**, **Perfil**.
- Pantallas completas (modales): `lesson/[id]`, `diagnostic`.
- Deep link único: el callback de OAuth.

## REQUIREMENTS (funcionales clave)
- **R1** El contenido es JSON versionado dentro de la app. Cada lección tiene `id`, `version`, `skillIds`,
  `access: "free"` (preparado para v1.1) y `steps[]`. Cada paso tiene `hints[]` y `feedbackByAnswer`.
  Se valida con un esquema en build/CI para que nunca se publique contenido malformado.
- **R2** La corrección de las respuestas es **determinista y local** (sin red). Las interacciones de balanza
  y gráfico definen su propia condición de éxito (x despejada; parámetros dentro de una tolerancia).
- **R3** El progreso se escribe localmente en cada paso (primero local) y se sincroniza con Supabase.
  El merge es monótono (el máximo de avance y la unión de pasos y XP por evento), así que no hay conflictos destructivos.
- **R4** La racha y el XP se derivan de un registro diario de actividad, no de contadores sueltos.
- **R5** Las fechas de la PAES viven en un archivo de configuración y se actualizan por OTA.
- **R6** Las correcciones de contenido se publican con EAS Update, sin pasar de nuevo por Play.
- **R7** Hay un renderizado matemático legible en celular (fracciones, potencias, raíces) con números grandes
  (queja real: "ejercicios muy pequeños").

## NON-FUNCTIONAL REQUIREMENTS
- **Fiabilidad:** cero pérdida de progreso ante cierre de la app, falta de red o reinstalación con cuenta vinculada.
- **Rendimiento:** interactivos a 60 fps en Android de gama media-baja (se prueba en tu teléfono).
  Arranque en frío a la Ruta en menos de 3 s.
- **Offline:** el 100% del aprendizaje funciona sin red.
- **Accesibilidad:** contraste AA con la paleta, objetivos táctiles de al menos 48 dp, alternativa
  con botones además del arrastre en la balanza.
- **Privacidad:**
  - Datos mínimos: sin nombre ni teléfono; solo el email si vincula Google.
  - Sin anuncios ni SDK de terceros aparte de Sentry.
  - RLS en todas las tablas.
- **Idioma:** español de Chile correcto, cercano y sin faltas.
- **Mantenibilidad:** TypeScript estricto, tokens de diseño centralizados y contenido separado del código.

## DATA MODEL (Supabase)
**Auth:** el usuario anónimo pasa a permanente con Google; `user_id = auth.uid()` es estable al vincular.

**Tablas (todas con RLS `user_id = auth.uid()`):**
- `profiles` (id PK = auth.uid, exam_kind: 'invierno'|'regular', exam_year, self_level, reminder_time, created_at, updated_at)
- `lesson_progress` (user_id, lesson_id, content_version, status: 'not_started'|'in_progress'|'completed', last_step, best_score, completed_at, updated_at) — PK (user_id, lesson_id)
- `step_attempts` (id, user_id, lesson_id, step_id, correct, answer jsonb, hints_used, created_at) → fuente para el dominio por habilidad
- `daily_activity` (user_id, day date, xp, steps_completed) — PK (user_id, day) → racha y XP derivados
- `badges_earned` (user_id, badge_id, earned_at) — PK (user_id, badge_id)
- `diagnostic_results` (id, user_id, answers jsonb, mastery jsonb, created_at)
- `content_reports` (id, user_id, lesson_id, step_id, content_version, message, created_at): solo insert
- `events` (id, user_id, name, props jsonb, created_at): solo insert

**Otros componentes:**
- **Derivados en cliente:** dominio por habilidad, racha, XP total y ruta sugerida.
- **Edge Function:** `delete-account` (service role; borra `auth.users` y en cascada).
- **Storage:** no se usa en v1.
- **Contenido:** no está en la base de datos (vive en el bundle).
- **Local:** SUPOSICIÓN: expo-sqlite (kv/tablas) como copia local y cola de sincronización.

## TECHNICAL DECISIONS
- Expo **SDK 57** (RN 0.86, React 19.2), TypeScript estricto, Expo Router, development build con EAS Build.
- **NativeWind v4.2.7** (Tailwind 3; soporta SDK 57). Se descarta NativeWind v5 porque sigue en RC.
- Supabase: Auth (anónimo + Google vía `linkIdentity`/OAuth con PKCE), Postgres + RLS, 1 Edge Function.
- Interactivos: react-native-svg + react-native-gesture-handler + Reanimated (incluidos en Expo). Sin Skia en v1.
- Estado: SUPOSICIÓN: store ligero (Zustand) persistido en SQLite para progreso, XP y racha. Sin librería de server-state.
- Notificaciones: expo-notifications (locales, programadas).
- Tipografía Poppins (expo-font).
- Tokens de color del brand board en la configuración de Tailwind:
  - Tinta #1E2A4A
  - Celeste #4FB3E8
  - Coral #FF7A59
  - Papel #FBF8F2
  - Grafito #5B6475
  - Verde #2FBF71
- EAS Update para contenido y fixes de JS. Builds nativos solo cuando cambian dependencias nativas.
- **Dependencias exactas:** se fijan con `npx expo install` en la fase de implementación. No se afirman versiones no verificadas.

## INTEGRATIONS
| Servicio | Propósito | Costo | Si falla |
|---|---|---|---|
| Supabase | Auth, sync, reportes, eventos, borrado | Free (el proyecto se pausa tras ~1 semana sin actividad) | La app sigue offline y hace cola |
| Google OAuth | Vincular / recuperar progreso | $0 | Se reintenta. El progreso local no se toca |
| EAS Build/Update | Builds y OTA | Free: 15 builds Android/mes; Update hasta 1.000 MAU | Usar OTA para ahorrar builds |
| Sentry | Crashes y errores | Free | Sin impacto en el usuario |
| Google Play | Distribución, closed testing | $25 (pagado) | — |
| RevenueCat | Pagos | **v1.1** | — |

## RISKS
1. **Plazo de Play:** una cuenta personal nueva exige 12 testers × 14 días. El lanzamiento público es hacia
   el día ~24 o más. Con testers de "amigos y familia" la validación del producto es débil, así que se
   recomienda incluir al menos 3–5 estudiantes reales.
2. **Precisión del contenido:** yo redacto y tú revisas. Tu revisión es el cuello de botella del plazo.
   Mitigación: esquema estricto, "Reportar error" y corrección por OTA.
3. **Calidad de los interactivos** en gama baja (arrastre y rendimiento). Mitigación: probar temprano en tu
   teléfono y dar alternativa con botones.
4. **Flujo linkIdentity en RN:** es delicado (deep link, PKCE, cuenta Google ya existente). Mitigación:
   construirlo temprano y dejar el email como plan B.
5. **Renderizado matemático:** sin una librería madura verificada. SUPOSICIÓN: componente propio para el
   subconjunto necesario, a validar el día 1.
6. **Abuso de sesiones anónimas** (spam de cuentas). Bajo en v1. Se vigilan los límites de Supabase.
7. **Cupo de 15 builds/mes de EAS.** Mitigación: pocos builds nativos + EAS Update.
8. **Distribución:** Preu AI gana por marketing en TikTok. Está fuera de esta especificación, pero es
   crítico para el lanzamiento.

## ASSUMPTIONS
- TypeScript estricto.
- Todo con free tiers (presupuesto restante ≈ $0).
- expo-sqlite como almacenamiento local y Zustand para el estado.
- Mapa tentativo de ~10 lecciones (se ajustará al PDF oficial de DEMRE):
  1. Expresiones algebraicas y reducción
  2. Productos notables
  3. Factorización
  4. Ecuaciones lineales (balanza)
  5. Problemas con ecuaciones lineales
  6. Inecuaciones lineales
  7. Sistemas 2×2 (gráfico + balanza)
  8. Proporcionalidad directa e inversa
  9. Función lineal y afín (deslizadores m, n)
  10. Función cuadrática (deslizadores a, b, c; vértice y raíces)
- Formato PAES M1: 65 preguntas de 4 alternativas (fuente secundaria; se verificará).
- Racha con 1 día de descanso por semana.
- El personaje-cuaderno "M" del onboarding se usa como logo, no como mascota (la mascota es Equis).
- Los PNG con fondo de color se limpian a transparente.
- Edad objetivo en Play: 13+.

## OPEN QUESTIONS
- Temario oficial exacto del eje (confirmar con el PDF de DEMRE Admisión 2027) → define la lista final de lecciones.
- Set exacto de insignias v1 y si los assets ya existen en `C:\MePreparo\assets`.
- Dónde alojar la política de privacidad y la página de borrado (GitHub Pages o Notion, $0).
- ¿Tienes un dominio (mepreparo.cl) o usamos una URL gratuita?
- Reclutamiento de los 12 testers y formulario de feedback.

## DEFINITION OF DONE (v1)
- Un usuario nuevo llega a su primer "ajá" (primera lección completada) sin registrarse, en menos de 5 minutos.
- Las ~10 lecciones y el diagnóstico están **aprobados por el fundador** y pasan la validación del esquema.
- Balanza y gráfico funcionan fluidos en tu teléfono Android real, con alternativa accesible.
- El progreso sobrevive a: cerrar la app a mitad de lección, modo avión, y reinstalar + entrar con Google.
- Vincular y recuperar con Google funciona de punta a punta en un build real (no en Expo Go).
- XP, racha, insignias, cuenta regresiva y recordatorio verificados en el dispositivo.
- Reportar error, borrar cuenta, política de privacidad y página de borrado están operativos.
  Data Safety completado.
- Sentry recibe un crash de prueba y la tabla de eventos registra el funnel onboarding → lección.
- RLS verificado: un usuario no puede leer ni escribir datos de otro.
- AAB subido a **closed testing** en Play con 12+ testers inscritos.
- Distinción de estados: "implementado" ≠ "funciona en mi dispositivo" ≠ "verificado" (con evidencia: capturas y logs).

---
**Estado:** especificación aprobada por el fundador el 2026-09-27.
Plan de implementación: [PLAN_IMPLEMENTACION.md](PLAN_IMPLEMENTACION.md).
