# MePreparo

App Android (Expo/React Native) para **entender** la matemática PAES (Chile) con el ADN de Brilliant:
aprender haciendo con interactivos, a tu ritmo, sin juicio. v1 = eje Álgebra y funciones de M1, 100% gratis.

## Leer antes de trabajar
1. `docs/SPEC_V1.md`: especificación aprobada (qué se construye y qué no).
2. `docs/PLAN_IMPLEMENTACION.md`: plan por días, verificación, riesgos. Actualizar su **Bitácora** (§11) al cerrar cada día y sus **Decisiones** (§10) cuando se decida algo.
3. `AGENTS.md`: reglas de Expo (las APIs cambian en cada SDK: verificar en docs.expo.dev/versions/v57.0.0, no de memoria).
4. `assets/brand/design-system/`: design system (tokens, guías, componentes de referencia en HTML/JSX). `docs/referencias/`: referencias de pantallas.

## Stack (no cambiar sin avisar al fundador)
Expo SDK 57 (RN 0.86, React 19.2, React Compiler activo) · TypeScript 6 estricto (+ `noUncheckedIndexedAccess`) · Expo Router · NativeWind 4.2.7 fijo (Tailwind 3) · Reanimated 4 + worklets · Supabase (Auth anónimo + Google vía linkIdentity, Postgres + RLS) · Sentry · EAS Build/Update · development build (no Expo Go).
Instalar dependencias con `npx expo install`. No inventar versiones. **Una dependencia nativa nueva = un build de EAS nuevo** (cupo: 15/mes): evitarlas; todo lo nativo del plan ya está instalado.

## Comandos
```
npx expo start            # dev server (development build en el teléfono)
npx expo start --web      # vista rápida en navegador (solo para iterar diseño; el objetivo es Android)
npm run typecheck | lint | test | content:validate
npx expo-doctor           # salud de dependencias
npx eas-cli build --profile development|preview|production --platform android
```

## Estructura
- `src/app/`: rutas de Expo Router (pantallas delgadas). `src/app/dev/`: spikes y pantallas de desarrollo.
- `src/engine/`: lógica pura con tests (`rational`, `math-parser`, `balance`, …). Nunca `float` para corregir.
- `src/components/ui/`: design system (`Screen`, `Text`, `Button`, `MathText`, `GridBackground`…).
- `src/features/`: pantallas compuestas e interactivos. `src/lib/`: integraciones (Sentry, …).
- `src/theme/tokens.json`: **fuente única** de tokens; la leen `tailwind.config.js` y `src/theme/tokens.ts`.
- `src/content/`: contenido JSON (desde el Día 2). `scripts/`: validador y herramientas.
- `assets/brand/`: originales de marca (no se empaquetan). `assets/images/`: lo que usa la app.

## Reglas del producto
- Sin vidas, sin paywall, sin anuncios en v1. Nunca cobros sorpresa (principio central de la marca).
- El progreso se guarda **localmente en cada paso antes del feedback**; la sincronización es idempotente y nunca bloquea la UI.
- Corrección de respuestas **determinista, local y con aritmética racional exacta**.
- El contenido vive en `src/content/*.json`; solo `reviewStatus: "approved"` puede ir a producción (`content:validate` lo impone en el perfil `production`). Nada de contenido de estudiantes sin aprobación del fundador.
- Notación matemática en el contenido: `$…$` con `\frac{}{}`, `^{}`, `\sqrt{}`, `\cdot`, `\le`, `\ge`. Signo peso literal: `\$`.
- Feedback de error amable y específico por error ("Casi…"), nunca "Incorrecto ❌". Español de Chile correcto, sin faltas. Tuteo, sin emoji.
- Marca: fondo papel `#FBF8F2` + cuadrícula de cuaderno; tinta `#1E2A4A`, celeste `#4FB3E8`, coral `#FF7A59` (**solo** momento "ajá"), grafito `#5B6475`, verde `#2FBF71` (solo correcto; no hay rojo: el error es grafito). Poppins; matemática en STIX Two Text; notas de Equis en Kalam. Mascota: Equis. Solo modo claro en v1, todo por tokens (paleta cerrada en Tailwind: no existen `bg-red-500` ni similares).

## Convenciones
- Fuentes: clases `font-poppins`, `font-poppins-medium|semibold|bold`, `font-math`, `font-hand` (no usar `font-bold`/`font-semibold`: en Android rompen las fuentes personalizadas).
- Todo texto pasa por `components/ui/Text` (RN no hereda la fuente). Objetivos táctiles ≥ 48 dp (`min-h-tap`).
- Commits pequeños, Conventional Commits en español. Nunca commitear secretos (`service_role`, secretos OAuth, tokens): van en `.env` (ignorado) o en secretos de EAS/Supabase.
- "Hecho" = cumple la verificación del plan con evidencia, no solo "implementado".
- En Bash, los heredocs pueden perder las barras invertidas: escribir archivos con `\frac` etc. usando la herramienta de archivos.
