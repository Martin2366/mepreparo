# MePreparo — Plan de implementación v1

> Fuente de verdad del producto: [SPEC_V1.md](SPEC_V1.md). Este plan dice **cómo y en qué orden** construirla.
> Si algo de este plan contradice la especificación, gana la especificación salvo en los ajustes listados en §2.

---

## 0. Contexto y calendario

- **Hoy:** 2026-09-27.
- **Construcción:** 10 días de trabajo (Día 1 → Día 10). El Día 10 la app queda en **closed testing** de Google Play.
- **Closed testing obligatorio:** 12+ testers durante 14 días seguidos (cuenta personal nueva). Después se solicita acceso a producción.
- **Lanzamiento público estimado:** ~3.ª–4.ª semana de octubre de 2026.
- **Ventana de oportunidad:** la **PAES Regular 2026 se rinde el 30 nov y el 1–2 dic de 2026**
  (DEMRE, a confirmar en demre.cl). Lanzando a fines de octubre quedan ~5 semanas de máxima demanda.
  **Cada día de retraso cuesta usuarios.** Si algo amenaza el plazo, se recorta alcance (ver §9), no calidad.

### Cómo se trabaja cada día
1. La sesión de Claude parte leyendo `CLAUDE.md`, `docs/SPEC_V1.md` y este plan.
2. Se trabaja la fase del día. Cada tarea termina con su **verificación** (§8), no solo con "implementado".
3. Commit por tarea completada (Conventional Commits, en español: `feat: balanza de ecuaciones`).
4. Al cerrar el día: actualizar la sección **Bitácora** (§11) con lo hecho, lo pendiente y los bloqueos.

---

## 1. Día 0 — Preparación del fundador (antes de la primera sesión de desarrollo, ~1–2 h)

Cuentas y configuraciones que **solo tú** puedes hacer (Claude te guía en la sesión si prefieres):

| # | Tarea | Resultado |
|---|---|---|
| 0.1 | Crear repo **privado** en GitHub `mepreparo` y conectarlo en la nueva sesión | Repo vacío listo |
| 0.2 | Cuenta en **expo.dev** (plan Free) | Usuario Expo para EAS |
| 0.3 | Proyecto en **Supabase** (Free), región más cercana a Chile disponible | URL + publishable/anon key |
| 0.4 | Supabase → Auth: activar **Anonymous Sign-ins** y **Enable Manual Linking** | Requisito de `linkIdentity` |
| 0.5 | Google Cloud: pantalla de consentimiento OAuth + **OAuth Client (Web)** → pegar client id/secret en Supabase → Providers → Google | Google habilitado en Supabase |
| 0.6 | Cuenta **Sentry** (Free), proyecto React Native | DSN |
| 0.7 | Descargar PDF oficial **Temario PAES Regular M1 (Admisión 2027)** desde demre.cl y dejarlo en `docs/fuentes/` | Base del contenido |
| 0.8 | Assets: dejar originales en `assets/brand/` (ya están en `assets/`); si puedes, fondos transparentes para mascota y spots | Assets listos para optimizar |
| 0.9 | Referencias de diseño de pantallas (las que enviarás) en `docs/referencias/` | Guía visual del Día 3 |

**Nunca** subir a GitHub: `service_role` key, secretos de Google, tokens de Sentry. Van en `.env` local (ignorado)
o en variables de EAS / secretos de Supabase.

---

## 2. Ajustes técnicos respecto a la especificación (refinamientos, no cambios de producto)

| ID | Ajuste | Por qué |
|---|---|---|
| A1 | `daily_activity` pasa a ser una **vista SQL** derivada de `step_attempts`, no una tabla escrita por el cliente | `step_attempts` con UUID generado en el cliente + `insert … on conflict do nothing` = sincronización **idempotente**. XP y racha no pueden duplicarse ni perderse |
| A2 | Cada lección lleva `reviewStatus: "draft" \| "approved"`. **El build de producción falla si hay alguna lección `draft`** | Garantiza la promesa de precisión: nada sin tu aprobación llega a estudiantes |
| A3 | El validador de contenido **resuelve automáticamente** ecuaciones/funciones de cada ejercicio y compara con la respuesta declarada | Segunda red de seguridad contra errores matemáticos |
| A4 | **Todas las dependencias nativas se instalan el Día 1** y se genera un solo development build | Cuidar el cupo de 15 builds/mes de EAS; lo demás es JS y se itera con recarga/OTA |
| A5 | Aritmética **racional exacta** (fracciones) en los motores; nunca `float` para decidir si algo es correcto | Evita "0.1+0.2" en correcciones |

---

## 3. Stack y dependencias

**Base:** Expo SDK 57 (RN 0.86, React 19.2) · TypeScript estricto · Expo Router · NativeWind **4.2.7** (Tailwind 3).
Instalar siempre con `npx expo install` para que Expo fije versiones compatibles con el SDK. **No inventar versiones.**

**Nativas (Día 1, un solo dev build):**
`expo-dev-client`, `expo-router`, `expo-sqlite`, `expo-notifications`, `expo-web-browser`, `expo-linking`,
`expo-haptics`, `expo-font`, `expo-splash-screen`, `expo-updates`, `expo-network`, `expo-crypto`,
`react-native-svg`, `react-native-reanimated`, `react-native-gesture-handler`, `react-native-safe-area-context`,
`react-native-screens`, `@sentry/react-native`.

**Solo JS:** `@supabase/supabase-js` (+ `react-native-url-polyfill` si la guía vigente lo pide), `zustand`, `zod`.
Fuente: `@expo-google-fonts/poppins` (o archivos Poppins locales).

**Dev:** `jest-expo`, `@testing-library/react-native`, `eslint` (config de Expo), `prettier`, `tsx` (scripts).

**Sesión de Supabase:** persistir con `expo-sqlite/localStorage/install` según la guía oficial Expo+Supabase.
Verificar la guía vigente al implementar.

---

## 4. Estructura del proyecto (propuesta)

```
C:\MePreparo\
├─ app/                         # Expo Router (solo pantallas y layouts, lógica mínima)
│  ├─ _layout.tsx               # providers, fuentes, splash, Sentry, arranque de sesión
│  ├─ (onboarding)/             # bienvenida, nivel, paes, recordatorio, ¿diagnóstico?
│  ├─ (tabs)/                   # index (Aprender), progreso, perfil
│  ├─ lesson/[id].tsx           # reproductor (pantalla completa)
│  ├─ diagnostic.tsx
│  └─ auth/callback.tsx         # deep link OAuth
├─ src/
│  ├─ content/                  # CONTENIDO (JSON) + esquema zod
│  │  ├─ lessons/L01-*.json … L10-*.json
│  │  ├─ diagnostic.json, badges.json, skills.json, paes-config.json
│  │  └─ schema.ts
│  ├─ engine/                   # LÓGICA PURA con tests: rational, math-parser, balance, graph,
│  │                            #   grading, mastery, streak, xp, badges, merge
│  ├─ features/                 # lesson-player, interactives/{balance,graph}, onboarding, progress, profile
│  ├─ components/ui/            # design system (Button, Card, MathText, Mascot, GridBackground…)
│  ├─ data/                     # supabase client, local db, outbox/sync, repositorios
│  ├─ lib/                      # auth, events, sentry, notifications, haptics
│  └─ theme/                    # tokens
├─ supabase/
│  ├─ migrations/               # SQL versionado (tablas, vista, RLS)
│  └─ functions/delete-account/
├─ scripts/                     # validate-content, content-preview (Markdown para revisión)
├─ assets/brand/ (originales)   assets/images/ (optimizadas)
├─ docs/                        # SPEC, PLAN, contenido para revisión, fuentes, referencias
├─ legal/                       # privacidad.html, borrar-cuenta.html (GitHub Pages)
└─ .github/workflows/ci.yml
```

> Si `create-expo-app` no acepta la carpeta no vacía, crear en `C:\MePreparo\_tmp` y mover el contenido a la raíz.

---

## 5. Diseño de los módulos críticos

### 5.1 Contenido (R1, A2, A3)
- **Lección:** `id`, `version`, `title`, `skillIds[]`, `access: "free"`, `reviewStatus`, `estimatedMinutes`, `steps[]`.
- **Paso** (unión discriminada por `type`):
  - `explain`: texto + MathText + ilustración opcional.
  - `balance`: ecuación inicial, objetivo (`x = c`), operaciones permitidas.
  - `graph`: familia (`linear` | `quadratic`), parámetros con rango/paso, condición objetivo.
  - `choice`: 4 alternativas A–D, `correct`, `feedbackByAnswer` para **cada** alternativa incorrecta.
  - `numeric`: respuesta racional, formatos aceptados.
- **Todos los pasos evaluables:** `hints[]` (graduadas, 1–3) + `feedbackByAnswer` / `feedbackByMistake`
  (errores típicos: signo, distribuir mal, olvidar un lado de la balanza…).
- **Notación matemática en el texto:** subconjunto mínimo tipo LaTeX: `\frac{}{}`, `^{}`, `\sqrt{}`, `\cdot`, `\le`, `\ge`.
  El validador rechaza cualquier cosa fuera del subconjunto.
- **Scripts:**
  - `npm run content:validate`: esquema zod + parseo de toda la notación + verificación automática de respuestas (A3).
  - `npm run content:preview`: genera `docs/contenido/Lxx.md` legible para tu revisión.

### 5.2 Motores (`src/engine`, 100% puros y testeados)
- **`rational`:** fracciones exactas (suma, resta, multiplicación, división, simplificación, comparación).
- **`math-parser`:** notación del contenido → árbol de nodos para `MathText`.
- **`balance`:** ecuación lineal `a·x + b = c·x + d` con racionales.
  - Operaciones: sumar/restar/multiplicar/dividir **ambos lados**.
  - Detecta "despejada".
  - Detecta errores típicos (aplicar a un solo lado, dividir por 0) → código de error para el feedback.
- **`graph`:** evalúa lineal/cuadrática. Condición de éxito por parámetros exactos (en pasos discretos)
  o propiedades (pasa por un punto, vértice en, raíces en).
- **`grading`:** corrige cualquier paso → `{ correct, mistakeCode?, xp }`.
- **`mastery`:** dominio por habilidad 0–100 = promedio ponderado de los últimos 5 intentos
  (acierto sin pistas = 1; con pistas = 0,6; error = 0). El diagnóstico siembra el valor inicial.
- **`streak`:**
  - Día activo = ≥1 lección completada **o** ≥5 pasos correctos, en fecha local del dispositivo.
  - 1 día de descanso automático por semana ISO.
- **`xp`:** 10 XP por paso correcto sin pistas, 5 con pistas, +20 al completar una lección.
  Valores en config para ajustarlos por OTA.
- **`badges`:** reglas declarativas en `badges.json` evaluadas sobre el estado local.
- **`merge`:** combina el estado local con el del servidor (máximo de avance por lección + unión de intentos por UUID).

### 5.3 Persistencia y sincronización (R3, A1)
- **Fuente inmediata:** estado local en SQLite. Zustand guarda el estado de la UI y lo persiste en `expo-sqlite/kv-store`.
- **Cada paso respondido** se escribe localmente **antes** de mostrar el feedback (a prueba de cierres)
  y se encola en la **outbox** (tabla SQLite).
- **Sync:**
  - Flush de la outbox al arrancar, al volver a primer plano, al recuperar la red (expo-network) y tras completar una lección.
  - Backoff exponencial.
  - Operaciones idempotentes (upsert / insert on conflict do nothing).
- **Pull + merge:** al iniciar sesión con Google en otro teléfono.
- **Nunca** se bloquea la UI por la red. Un indicador discreto muestra "Guardado en tu teléfono" o "Respaldado".

### 5.4 Supabase
- **Migraciones SQL versionadas** en `supabase/migrations`:
  - Tablas: `profiles`, `lesson_progress`, `step_attempts`, `badges_earned`, `diagnostic_results`,
    `content_reports`, `events`.
  - Vista `daily_activity`.
  - FK a `auth.users` con `on delete cascade`.
- **RLS en todas las tablas:**
  - `select/insert/update` solo si `user_id = auth.uid()`.
  - `content_reports` y `events` son solo insert.
  - Sin `delete` desde el cliente.
- **Edge Function `delete-account`:** valida el JWT del llamante → `auth.admin.deleteUser(uid)` → cascada.
  La `service_role` key solo vive en los secretos de la función.
- **Aplicar migraciones:** con Supabase CLI o, para ahorrar tiempo, pegando el SQL en el SQL Editor.
  El repo es la fuente de verdad.

### 5.5 Auth
1. **Arranque:** si no hay sesión → `signInAnonymously()`.
   Si falla por falta de red, la app funciona igual y reintenta después: el progreso queda local y se asocia al crear la sesión.
2. **Guardar con Google:**
   - Paso 1: `linkIdentity({ provider: 'google', options: { redirectTo: 'mepreparo://auth/callback', skipBrowserRedirect: true } })`.
   - Paso 2: abrir con `WebBrowser.openAuthSessionAsync`.
   - Paso 3: cambiar el code por la sesión con `exchangeCodeForSession` (PKCE).
   - Resultado: se mantiene el mismo `user_id`.
3. **Cuenta Google ya vinculada a otro usuario:** se muestra un diálogo claro con dos opciones:
   - "Usar el progreso de tu cuenta Google": se hace `signInWithOAuth`, pull + merge, y se descarta la sesión anónima local.
   - "Cancelar".
4. **Teléfono nuevo:** "¿Ya tienes progreso? Entrar con Google" en la bienvenida.
5. **Plan B** (si el Día 7 a mediodía el flujo no funciona en un build real): vincular con email + código
   (`updateUser({ email })`). Se decide y se registra en §10.

### 5.6 Notificaciones
- Recordatorio diario **local** a la hora elegida (trigger diario de expo-notifications) y canal Android propio.
- El permiso (Android 13+) se pide **después de la primera lección completada**, en contexto, nunca al abrir la app.
- Texto amable y variado ("Equis te guardó la balanza donde la dejaste").
- Si la racha ya está hecha ese día, el recordatorio se omite o se suaviza.

### 5.7 Observabilidad
- **Sentry:** crashes + errores JS, con source maps vía EAS. Sin PII.
- **Eventos** (por la outbox, en lote):
  - Sesión y onboarding: `app_open`, `onboarding_completed`.
  - Diagnóstico: `diagnostic_started|completed|skipped`.
  - Lecciones: `lesson_started`, `step_answered{correct,hints,mistakeCode}`, `lesson_completed`.
  - Momento ajá: `aha` (acierto tras un error en el mismo paso).
  - Google: `link_google_started|succeeded|failed`.
  - Otros: `reminder_set`, `report_submitted`, `account_deleted`.
- **Métricas núcleo para el closed testing:**
  - % que completa la 1.ª lección el día 1.
  - % que vuelve el día 2.
  - Lecciones por usuario.
  - Pasos con más errores (para mejorar el contenido).

### 5.8 Design system (Día 3, con tus referencias de pantallas)
- Tokens de Tailwind:
  - Colores: `ink #1E2A4A`, `sky #4FB3E8`, `coral #FF7A59`, `paper #FBF8F2`, `graphite #5B6475`, `success #2FBF71`.
  - Fuente: Poppins (400/500/600/700).
  - Radios y espaciados consistentes.
- **Componentes:** `Screen` (fondo papel + cuadrícula SVG sutil), `Button` (primario celeste / secundario),
  `Card`, `ProgressBar`, `Chip`, `MathText` (números grandes), `Mascot` (poses de Equis), `AhaSpark` (animación coral),
  `HintSheet`, `FeedbackBanner`, `EmptyState`.
- Solo modo claro, pero todo por tokens (modo oscuro en v1.1 sin rehacer).
- Accesibilidad: objetivos ≥ 48 dp, contraste AA (el texto va en tinta; el celeste no se usa para texto pequeño),
  `accessibilityLabel` en los interactivos.

---

## 6. Plan por días

> Formato: **Objetivo** · Tareas · ✅ Verificación (criterio de "hecho"). El contenido avanza **en paralelo** (§7).

### Día 1 — Fundaciones y "spikes" de riesgo
**Objetivo:** proyecto corriendo en tu teléfono con la marca, y los dos riesgos técnicos más grandes probados.
- Crear la app Expo SDK 57 + TS estricto + Expo Router. Configurar `app.json`:
  - nombre MePreparo
  - `package` Android `cl.mepreparo.app`
  - `scheme: mepreparo`
  - `runtimeVersion` y `updates`
- Instalar **todas** las dependencias nativas (A4) + NativeWind 4.2.7 + fuentes Poppins + tokens.
- `eas.json` con perfiles:
  - `development`: dev client, APK.
  - `preview`: APK interno.
  - `production`: AAB.
- **Build #1 (development)** e instalación en tu teléfono.
- `CLAUDE.md` del repo actualizado · `.gitignore` · `.env.example` · CI en GitHub Actions (typecheck, lint, test, `content:validate`).
- **Spike A, MathText:** renderizar fracciones, potencias y raíces legibles a tamaño grande.
- **Spike B, Balanza:** prototipo táctil (arrastrar/soltar + botones de operación) a 60 fps en tu teléfono.
- ✅ La app abre en tu teléfono con fondo papel + cuadrícula + Poppins.
  Los spikes se ven y se sienten bien en el dispositivo (captura o video).
  CI en verde en GitHub.

### Día 2 — Contenido y motores
**Objetivo:** el "cerebro" de la app, probado sin UI.
- Esquema zod del contenido + `content:validate` + `content:preview`.
- `engine/`: `rational`, `math-parser`, `balance`, `graph`, `grading`, `xp`, `streak`, `mastery`, `badges`, `merge`,
  con **tests unitarios** (casos normales, errores típicos, bordes: división por 0, fracciones negativas, cambio de semana en la racha).
- Mapa final de lecciones y habilidades (`skills.json`) según el PDF de DEMRE.
- Claude redacta **L01–L03 + diagnóstico** → preview para tu revisión.
- ✅ `npm test` en verde con cobertura de todos los motores.
  `content:validate` pasa con L01–L03.
  Tienes los Markdown de revisión.

### Día 3 — Reproductor de lecciones e interactivos
**Objetivo:** vivir una lección completa en el teléfono.
- Design system base (§5.8) aplicando tus **referencias de pantallas**.
- `lesson/[id]`: barra de progreso, pasos, feedback por error, pistas graduadas, animación ajá + haptics,
  pantalla de lección completada (XP).
- Interactivos finales: **Balanza** (con alternativa de botones) y **Gráfico con deslizadores** (SVG sobre cuadrícula).
  También `choice` y `numeric`.
- Guardado local **en cada paso** (sin servidor todavía).
- ✅ L01 jugable de punta a punta en el teléfono.
  Si cierras la app a mitad y la reabres, retomas en el mismo paso.
  Cada alternativa incorrecta muestra su explicación específica.

### Día 4 — Datos locales, Supabase y sincronización
**Objetivo:** el progreso queda respaldado sin que el usuario haga nada.
- SQLite local + outbox. Migraciones de Supabase (tablas, vista, RLS). Sesión anónima al arrancar.
- Sync idempotente con backoff. Indicador discreto de estado de respaldo.
- Script de prueba de RLS: dos usuarios anónimos; B no puede leer ni escribir los datos de A.
- Claude redacta **L04–L07**.
- ✅ Una lección completada en modo avión se sube sola al volver la red, sin duplicados.
  La prueba de RLS pasa.
  Los datos se ven en el dashboard de Supabase.

### Día 5 — Onboarding, diagnóstico y ruta
**Objetivo:** el primer uso completo, hasta el primer "ajá" en menos de 5 minutos.
- Onboarding: bienvenida (Equis) → nivel (opciones neutras) → PAES invierno/regular (`paes-config.json`)
  → hora del recordatorio → ¿diagnóstico?
- Diagnóstico (8–10 preguntas, saltable) → mapa de dominio + lección sugerida.
- Tab **Aprender**: ruta del eje con estados (bloqueada/sugerida/en curso/completada), "Continuar",
  otros ejes de M1 y M2 como **Próximamente**, cuenta regresiva a la PAES.
- ✅ Instalación limpia → primera lección completada sin registrarse, cronometrado en menos de 5 minutos.
  Saltar el diagnóstico también funciona.

### Día 6 — Motivación y retorno
**Objetivo:** razones para volver mañana.
- Tab **Progreso**: dominio por habilidad, racha (con día de descanso), XP, insignias (~8, con assets de Equis o insignias).
- Recordatorio diario local + permiso en contexto (§5.6).
- Animaciones de logro e insignia desbloqueada.
- Claude redacta **L08–L10**.
- ✅ Cambiando la fecha del teléfono se verifica: la racha sube, el día de descanso la protege y un segundo día sin actividad la corta.
  La notificación llega a la hora elegida.
  Las insignias se otorgan una sola vez.

### Día 7 — Cuenta, confianza y cumplimiento
**Objetivo:** "nunca pierdes tu progreso" + requisitos de Google Play.
- Tab **Perfil**:
  - Guardar con Google (`linkIdentity`), entrar con Google (teléfono nuevo), resolución del conflicto de cuenta existente.
  - Cambiar PAES y recordatorio.
  - Enlaces a privacidad y feedback.
- **Borrar mi cuenta y datos** → Edge Function `delete-account`.
- **Reportar un error** en cada paso → `content_reports`.
- Sentry integrado con source maps. Eventos del funnel.
- `legal/privacidad.html` y `legal/borrar-cuenta.html` publicados con GitHub Pages ($0).
- ✅ En un **build real**: vincular Google conserva el `user_id` y el progreso.
  Desinstalar → reinstalar → entrar con Google restaura todo.
  Borrar la cuenta elimina las filas en Supabase.
  Un crash de prueba aparece en Sentry.
  **Punto de decisión:** si Google falla a mediodía → plan B con email (§5.5).

### Día 8 — Integración total de contenido y pulido
**Objetivo:** las 10 lecciones aprobadas funcionando.
- Integrar todas las correcciones de tu revisión. Marcar `approved`.
- Pase de UX con tus referencias: textos, espaciados, estados vacíos/carga/error (usando las ilustraciones de estados).
- Rendimiento en tu teléfono (interactivos a 60 fps, arranque en menos de 3 s) y accesibilidad.
- Optimizar assets (WebP, tamaños), ícono adaptativo, splash.
- ✅ `content:validate` pasa con las 10 lecciones `approved` y respuestas verificadas automáticamente.
  Recorrido completo del eje sin errores.

### Día 9 — QA contra la Definición de Hecho
**Objetivo:** evidencia de que funciona, no solo "funciona en mi teléfono".
- Recorrer la checklist de §8.2 con capturas y logs guardados en `docs/qa/`.
- Corregir bugs. Build `preview` (APK) para 2–3 personas de confianza.
- Ficha de Play: título, descripción corta y larga (tono honesto, sin claims no verificables),
  feature graphic, 4–6 capturas, clasificación de contenido, público 13+, **Data Safety**, URL de privacidad y de borrado.
- ✅ Todos los ítems de §8.2 marcados con evidencia. Ficha de Play completa en borrador.

### Día 10 — Release a closed testing
**Objetivo:** app en manos de los testers.
- Build `production` (AAB) → subir a Play Console → track **Prueba cerrada** → lista de 12+ testers (emails o Google Group).
- Enlace de inscripción + formulario de feedback (Google Forms, $0) dentro de la app para testers.
- Canal `production` de EAS Update listo para corregir contenido sin build nuevo.
- ✅ La app aparece instalable desde Play para los testers. 12+ testers inscritos. Arranca el contador de 14 días.

### Días 11–24 — Closed testing (en paralelo: marketing)
- Revisar a diario Sentry, eventos y reportes de error de contenido → corregir por OTA.
- Medir: % que completa la 1.ª lección, retorno al día 2, pasos con más errores.
- **Mantener a los 12 testers inscritos los 14 días** (si alguien se sale, reemplazarlo).
- Al día 14: solicitar acceso a producción en Play Console (responde las preguntas sobre la prueba con datos reales).
- Preparar la distribución (TikTok con clips de la balanza y el gráfico: son muy visuales y compartibles).
- Siguiente: v1.1 (Pase PAES con RevenueCat, más ejes, modo oscuro) según lo aprendido.

---

## 7. Flujo de contenido (en paralelo al desarrollo)

| Lote | Claude redacta | Tú revisas | Integración |
|---|---|---|---|
| 1 | Día 2: L01–L03 + diagnóstico | Días 2–3 | Día 3 |
| 2 | Día 4: L04–L07 | Días 4–5 | Día 5–6 |
| 3 | Día 6: L08–L10 | Días 6–7 | Día 8 |

- **Revisión:** lees `docs/contenido/Lxx.md` (o la lección en el teléfono) y respondes "aprobada" o correcciones.
  Claude aplica los cambios y marca `approved`.
- **Criterios de revisión:** exactitud matemática, alineación al temario, que cada error típico tenga explicación,
  español de Chile correcto, 3–5 min de duración.
- **Tu tiempo estimado:** ~30–45 min por lección. **Es el cuello de botella del plan**: si un lote se atrasa,
  se mueve su integración, no el resto del desarrollo.

---

## 8. Verificación

### 8.1 Automática (CI en cada push)
- `tsc --noEmit` · ESLint · `jest` (motores + esquema) · `content:validate` (esquema + notación + respuestas verificadas).
- En el perfil `production`: falla si hay contenido `draft` (A2).

### 8.2 Checklist de dispositivo (Definición de Hecho de la especificación)
- [ ] Instalación limpia → 1.ª lección completada sin registro en menos de 5 minutos.
- [ ] Cerrar la app a mitad de lección → retoma en el mismo paso.
- [ ] Modo avión: lección completa offline → sincroniza al volver, sin duplicados.
- [ ] Vincular Google conserva el progreso. Reinstalar + entrar con Google lo restaura.
- [ ] Conflicto "cuenta Google ya usada" resuelto con el diálogo.
- [ ] Balanza y gráfico fluidos en tu Android. La alternativa con botones funciona.
- [ ] Racha (incluido el día de descanso), XP, insignias, cuenta regresiva y recordatorio verificados.
- [ ] Reportar error crea la fila en `content_reports`.
- [ ] Borrar cuenta elimina los datos. La página web de borrado y la política de privacidad están accesibles.
- [ ] RLS: la prueba de dos usuarios pasa.
- [ ] Sentry recibe un crash de prueba. Los eventos del funnel llegan.
- [ ] 10 lecciones + diagnóstico `approved`.
- [ ] AAB en closed testing con 12+ testers.

**Estados:** marcar cada ítem como *implementado* → *funciona en mi dispositivo* → *verificado (con evidencia en `docs/qa/`)*.

---

## 9. Riesgos, disparadores y recortes

| Riesgo | Disparador | Acción |
|---|---|---|
| Revisión de contenido atrasada | Lote sin aprobar 48 h después de entregado | Lanzar con 7–8 lecciones aprobadas. Las demás llegan por OTA durante el closed testing |
| `linkIdentity` no funciona | Día 7 mediodía | Plan B con email + código |
| Balanza lenta o torpe en gama baja | Spike B del Día 1 | Simplificar la animación. Priorizar los botones sobre el arrastre |
| MathText insuficiente | Spike A del Día 1 | Reducir la notación del contenido a lo que se renderice bien |
| Cupo de EAS agotado | Más de 10 builds usados | Solo OTA. Build local con Android Studio como respaldo |
| Supabase pausado por inactividad | Aviso en el dashboard | Actividad diaria durante el testing. Reactivar manualmente |
| Plazo total en riesgo | Día 6 sin reproductor + sync estables | Recortar SHOULD (animaciones, insignias extra), nunca los MUST de confiabilidad |

**Orden de recorte (de primero a último):**
1. Insignias extra.
2. Animaciones.
3. Pantalla de Progreso detallada.
4. Diagnóstico → autoevaluación.

**Nunca se recortan:** guardado por paso, sync, precisión, cumplimiento de Play.

---

## 10. Registro de decisiones de implementación
| ID | Fecha | Decisión | Razón |
|---|---|---|---|
| D1 | 2026-09-27 | Rutas en `src/app/` (no `app/` en la raíz) | Es la convención del template de SDK 57; todo el código queda bajo `src/` |
| D2 | 2026-09-27 | Fuentes con `@expo-google-fonts`: Poppins (UI), **STIX Two Text** (matemática) y **Kalam** (notas de Equis), cargadas con `useFonts` | Así lo define el design system; `useFonts` funciona igual en el dev build y en la vista web |
| D3 | 2026-09-27 | `src/theme/tokens.json` = fuente única de tokens; paleta **cerrada** en Tailwind; familias `font-poppins-*` | Impide colores fuera de marca; `font-bold` con fuentes personalizadas falla en Android |
| D4 | 2026-09-27 | Supabase sin `react-native-url-polyfill`; sesión en `expo-sqlite/localStorage` | La guía vigente de Expo + Supabase ya no pide el polyfill |
| D5 | 2026-09-27 | `MathText` propio (Views + SVG) sobre `engine/math-parser`; matemática entre `$…$` y `\$` para pesos | Spike A; ninguna librería madura verificada. El signo `$` es común en problemas con pesos chilenos |
| D6 | 2026-09-27 | TypeScript 6 con `noUncheckedIndexedAccess` y `types: ["jest","node"]` | TS 6 cambió defaults; el índice sin chequear es fuente típica de bugs en motores |
| D7 | 2026-09-27 | Ícono de app redibujado en vector (cuaderno + M + chispa) | El PNG del board mide 152 px; la versión final se revisa el Día 8 |
| D8 | 2026-09-27 | Proyecto EAS en la cuenta `unkownnigga17` (confirmado por el fundador) · CI con Node 24 | — |
| D9 | 2026-09-27 | `.easignore` excluye `assets/brand/` y `docs/` | La primera subida pesaba 59 MB por los originales de marca |
| D10 | 2026-09-27 | Botón primario: **texto tinta sobre celeste** (6:1, AA). Decidido por el fundador | Blanco sobre `#4FB3E8` daba 2,4:1 (no cumple AA) |
| D11 | 2026-09-27 | Plan **Starter** de Expo (lo contrató el fundador) | Cupo Free agotado; el Build #1 no podía esperar al 1 de octubre |

## 11. Bitácora diaria
| Día | Hecho | Pendiente | Bloqueos |
|---|---|---|---|
| 0 | Repo GitHub creado y conectado · cuenta Expo · temarios DEMRE (regular + invierno) en `docs/temarios/` · assets movidos a `assets/brand/` · design system descomprimido en `assets/brand/design-system/source/` | Repo a **privado** (lo hace el fundador) · Supabase (0.3–0.4) · Google OAuth (0.5) · Sentry DSN (0.6) · referencias de pantallas (0.9) | — |
| 1 | App Expo SDK 57 + TS estricto + Router · `app.json` (`cl.mepreparo.app`, `mepreparo://`, runtimeVersion, EAS Update) · **todas** las dependencias nativas (A4) · NativeWind 4.2.7 + tokens · ícono adaptativo, splash y notificación · `eas.json` (development/preview/production) · CI en verde · `content:validate` (notación + bloqueo de `draft` en producción) · motores `rational`, `math-parser`, `balance` (21 tests) · **Spike A** (`MathText`) y **Spike B** (balanza con arrastre + botones + FPS) verificados en vista web · bundle Android compila | **Build #1** en EAS e instalación en el teléfono · validar en el dispositivo: Poppins, arrastre táctil y 60 fps (captura/video) | **Cupo de EAS agotado** (15/15) hasta el **jue 1 oct**. El keystore ya está creado. Mientras tanto: Expo Go o build local con Android Studio (§9) |
