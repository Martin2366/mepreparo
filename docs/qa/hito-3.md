# QA · Hito 3 (nube y Premium) · 29-09-2026

Verificado contra el proyecto real de Supabase `mepreparo` y en la vista web (Expo web, viewport móvil).
Lo que requiere el teléfono o las cuentas del fundador queda marcado como **pendiente**.

## Automático
| Chequeo | Resultado |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ sin avisos |
| `npm test` | ✅ 194 tests (19 suites); nuevos: `merge-premium.test.ts` (merge, pase, oferta 48 h, avisos, PDF) |
| `npm run content:validate` | ✅ |
| `npx expo-doctor` | ✅ 21/21 (se aplicaron 4 parches de SDK 57) |

## Servidor (Supabase)
| Caso | Cómo | Resultado |
|---|---|---|
| Sesión anónima al abrir | App web limpia | ✅ usuario anónimo creado, 5 documentos subidos, cola de eventos vacía |
| Intento guardado antes del feedback y subido | Responder 1 ejercicio de práctica | ✅ fila en `step_attempts`, marcada `synced` en el teléfono |
| **Sin duplicados** | Marcar todo como no subido (cierre justo después de subir) y re-sincronizar | ✅ sigue 1 fila; `events` insertado 2 veces con el mismo id → 1 fila |
| **RLS con 2 usuarios** | Usuario B (REST) contra datos de A | ✅ no ve `user_state` ni intentos de A; insertar como A → 403; sobrescribir el progreso de A → 0 filas; autoasignarse `entitlements` → 403; sin sesión → 401 |
| Sin delete/update desde el cliente | B borra/edita sus intentos | ✅ 403 (privilegios revocados) |
| Borrar cuenta | `delete-account` con el JWT de B | ✅ usuario, estado, eventos e intentos: 0 filas (cascada); sin token → 401 |
| Webhook RevenueCat | Sin header → 401; `TEST` → 200; `INITIAL_PURCHASE` simulado | ✅ fila en `entitlements` (`monthly`, vence según el evento); ids anónimos de RevenueCat se ignoran |
| **Reinstalar y restaurar** | Borrar todo lo local salvo la sesión (= volver a entrar con la misma cuenta) | ✅ vuelven XP, intentos, racha, meta, prueba y avisos vistos; el apodo no (nunca sube); la app entra directo a Inicio |

## Interfaz (vista web)
| Pantalla | Resultado |
|---|---|
| Bienvenida: «¿Ya tienes progreso? Entrar con Google» | ✅ |
| Fin de prueba (se abre sola una vez) | ✅ tu semana, lo que conservas gratis, oferta 50 % con hora exacta, «Seguir gratis» |
| Planes y boleta | ✅ Pase recomendado, mensual, precios tachados con oferta, boleta (ítem, vigencia, renovación, total), tabla Gratis vs Premium, restaurar. Sin el build nuevo: «Compra disponible pronto» |
| Perfil | ✅ plan, «Ver planes», «Respaldar con Google», «Borrar mi cuenta y datos» |
| Inicio | ✅ indicador «Guardado en tu teléfono y en la nube»; tarjetas de día 5 y día 7 |
| Tarjetas de límite | ✅ práctica, ensayos, reto, intensivos, cuaderno: precio a la vista + camino gratis + «Ver Premium» |
| PDF con clavijero | ✅ HTML de un ensayo completo real (65 preguntas) revisado: fracciones y funciones legibles, clavijero en página aparte |

## Pendiente (teléfono y cuentas)
- [ ] Google: configurar OAuth (docs/setup/HITO_3.md §A) → respaldar, conflicto de cuenta y «Entrar con Google» en un teléfono.
- [ ] Modo avión real: responder sin red → volver a tener red → se sube sin duplicados (el mecanismo está verificado arriba).
- [ ] Build de EAS con `react-native-purchases` y `expo-print` (dev + AAB) e instalación.
- [ ] Compra de prueba con cuenta de tester (§C y §D) y restauración al reinstalar.
- [ ] Imprimir/guardar PDF desde la hoja de Android.
