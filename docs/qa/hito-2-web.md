# QA · Hito 2 (vista web, 2026-09-28)

Verificado en la vista web (`npx expo start --web`). **Pendiente de verificar en el teléfono** (development build):
SQLite de intentos, haptics, notificaciones, fluidez y fuentes, igual que en el [Hito 1](hito-1-web.md).

| Qué | Resultado |
|---|---|
| Ensayo: configuración (completo, mini, temático, a tu medida), reglas claras y cupo gratis visible ("Te queda 1 esta semana") | OK |
| Ensayo en curso: temporizador, grilla, marcar para revisar, anterior/siguiente | OK |
| **Pausar y retomar**: responder 2 preguntas y marcar una → salir → recargar la página → vuelve a la pregunta 2 con la respuesta y la marca, y el tiempo no se reinicia | OK |
| Resultados: rango del puntaje y desglose por eje y habilidad · revisión con la explicación de cada alternativa | OK |
| Preguntas nuevas en cada intento (semilla nueva por ensayo) | OK |
| Logros: se ganan una sola vez (test `badges.test.ts`) · medalla al ganarlo · premium solo con Premium | OK |
| Intensivo: ensayo de entrada registrado, día 1 desbloqueado, día a día por fecha local | OK |
| Reto relámpago y fórmulas (buscar, guardar) | OK |
| Detalle de unidad → "Ensayo de esta unidad" abre "a tu medida" con la unidad preseleccionada | OK (nuevo) |
| Lecciones nuevas (Geometría, Probabilidad y estadística): fracciones, notación y teclado; 2/6 se acepta como 1/3 | OK |
| Alternativas: la correcta ya no queda siempre en la A (se mezcla en pantalla, con semilla estable por paso). Reparto en las 166 preguntas redactadas: A 37 · B 50 · C 34 · D 45. El feedback específico sigue a la alternativa elegida | OK (corregido) |
| Volver sin historial (recarga, enlace, notificación): la X del ensayo, la lección y la práctica ahora salen a una pantalla segura | OK (corregido: antes no hacía nada) |

**Contenido M1 completo en draft:** 16 unidades, 64 lecciones, 54 mini-clases, 59 fórmulas y 29 generadores
(7.500 ejercicios generados revisados por el validador). `content:validate -- --production` bloquea todo lo que está en
`draft`. Falta la revisión del fundador (`docs/contenido/*.md`).

Automático: `typecheck`, `lint`, `test` (181 tests) y `content:validate` en verde.
