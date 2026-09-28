# QA · Hito 1 (vista web, 2026-09-28)

Verificado en la vista web (`npx expo start --web`, 375×812) con un onboarding sembrado (Cata, PAES Regular 2026, meta 830).
**Pendiente de verificar en el teléfono** (development build): SQLite de intentos, haptics, notificaciones, fluidez de la
balanza y el gráfico, y fuentes.

| Qué | Resultado |
|---|---|
| Sin onboarding completado → redirige a `/onboarding` | OK |
| Inicio: racha, anillo de XP, cuenta regresiva (63 días), prueba Premium (5 días), sesión de hoy con "por qué" | OK |
| Estimado M1 al entrar = el del onboarding (sin salto) | OK (tras corrección: se ancla a la semilla global) |
| Lección: explicación → balanza con botones → correcto (+10 XP + explicación) | OK |
| Cerrar/recargar a mitad → retoma en el mismo paso (3/9) | OK |
| Error → tarjeta grafito "Vuelve a intentarlo, vas bien" + "Casi…" específico | OK |
| Acierto después de un error → chispa coral "¡Lo entendiste!" | OK |
| Gráfico con deslizador: m = 3 pasa por (2, 6) → correcto | OK (tras corrección: la ventana incluye los puntos marcados) |
| Práctica generada: distractores por error típico con su explicación | OK |
| Cuaderno de errores: guarda los 2 errores con su explicación y fecha de repaso | OK |
| Aprender, ruta del eje (estados en curso/disponible), Practicar, Progreso, Equis, Perfil, mini-clase | OK, sin errores de consola |
| Dominio inicial desde el diagnóstico | Corregido: se suaviza y se limita al 70 % (antes mostraba 100 % con 2 preguntas) |

Automático: `typecheck`, `lint`, `test` (132 tests), `content:validate` (8 lecciones, 12 mini-clases, 3.000 ejercicios generados).
