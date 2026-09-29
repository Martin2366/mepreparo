# Hito 3 · Configuración que hace el fundador

> Lo técnico ya está hecho y verificado (migraciones, RLS, Edge Functions, sync, compras en el código).
> Estos pasos requieren tus cuentas y secretos: nunca los pegues en el chat ni en el repo.
> Orden recomendado: **A → B → C → D**. Cada paso dice cómo comprobar que quedó bien.

## Estado actual (29-09-2026)

| Pieza | Estado |
|---|---|
| Supabase: tablas + RLS (`supabase/migrations/`) | ✅ Aplicadas en `mepreparo` |
| Edge Function `delete-account` | ✅ Desplegada y probada (borra en cascada) |
| Edge Function `revenuecat-webhook` | ✅ Desplegada; secreto `REVENUECAT_WEBHOOK_AUTH` cargado (el valor está en tu `.env`) |
| Variables públicas en EAS (URL, clave publicable, Sentry) | ✅ development · preview · production |
| Login con Google | ⏳ Paso A |
| App en Play Console + primer AAB | ⏳ Paso B (el build lo lanza Claude cuando lo apruebes) |
| Productos de Play + RevenueCat | ⏳ Pasos C y D |

---

## A · Google (respaldo del progreso) · ~15 min

1. **Google Cloud Console** → crea (o elige) un proyecto → *APIs y servicios* → **Pantalla de consentimiento de OAuth**:
   - Tipo *Externo* · nombre **MePreparo** · correo de asistencia · logo opcional.
   - Permisos: solo `openid`, `email` y `profile` (no requieren verificación de Google).
   - Publica la app (*En producción*). Si la dejas en *Prueba*, solo entran los correos que agregues como testers.
2. *Credenciales* → **Crear ID de cliente de OAuth** → tipo **Aplicación web**:
   - URI de redireccionamiento autorizado: `https://mxtyfzgjytwcntmmrqbt.supabase.co/auth/v1/callback`
   - Copia el **ID de cliente** y el **secreto**.
3. **Supabase** → *Authentication* → *Sign In / Providers* → **Google** → activar → pega ID y secreto → guardar.
   (Deben seguir activos *Allow anonymous sign-ins* y *Allow manual linking*: ya los tienes.)
4. **Supabase** → *Authentication* → *URL Configuration* → **Redirect URLs** → agrega:
   - `mepreparo://**`
   - `http://localhost:8081/**` (vista web de desarrollo)

**Comprobar:** en la app → Perfil → *Respaldar con Google* → eliges tu cuenta → vuelve a la app y dice
«Respaldado con Google · tu…@gmail.com».

## B · Play Console: crear la app · ~20 min

1. *Crear app*: nombre **MePreparo** · idioma predeterminado **Español (Latinoamérica)** · App · **Gratis** · acepta las declaraciones.
2. El paquete (`cl.mepreparo.app`) queda fijado con el **primer AAB** que subas. Claude lanza el build de producción
   (`eas build --profile production`) cuando lo apruebes; lo subes a **Pruebas internas** (o Claude lo sube con `eas submit`
   si creas una cuenta de servicio para Play; ver D.1).
3. *Configuración → Pruebas de licencias*: agrega tu correo y el de quienes prueben: **compran sin que se les cobre**.
4. Para la ficha y *Seguridad de los datos* necesitarás (lo prepara Claude cuando llegues ahí):
   - URL de la política de privacidad.
   - **URL para pedir el borrado de la cuenta** (Play la exige además del botón en la app).

## C · Productos en Play (después de subir el primer AAB) · ~15 min

*Monetizar → Productos*:

| Tipo | ID | Precio | Detalle |
|---|---|---|---|
| Suscripción | `premium` | — | Plan base **`mensual`**: renovación automática, mensual, **$3.990 CLP** |
| Oferta de la suscripción | `fin-prueba` (etiqueta **`fin-prueba`**) | 50 % el 1.er mes ($1.995) | Elegibilidad: *determinada por el desarrollador*. La app la muestra solo 48 h después de la prueba, una vez |
| Producto único | `pase_paes` | **$12.990 CLP** | «Pase PAES: Premium hasta tu próxima PAES, sin renovación» |
| Producto único | `pase_paes_oferta` | **$6.495 CLP** | Igual, con el 50 % de fin de prueba |

La vigencia del Pase la calcula la app (`engine/premium.passUntil`: 7 días después de la próxima PAES con fecha; si no hay fecha publicada, 1 año).

## D · RevenueCat · ~25 min

1. **Cuenta de servicio de Google** para que RevenueCat valide compras: sigue la guía
   «Creating Play Service Credentials» de RevenueCat (Google Cloud → cuenta de servicio → clave JSON →
   Play Console → *Usuarios y permisos* → invitar al correo de la cuenta de servicio con permisos de ver datos
   financieros y gestionar pedidos/suscripciones). Puede tardar hasta 36 h en activarse.
2. RevenueCat → **Create project** «MePreparo» → *Apps* → **Play Store** → paquete `cl.mepreparo.app` → sube el JSON.
3. *Products*: importa `premium:mensual`, `pase_paes` y `pase_paes_oferta`.
4. *Entitlements*: crea **`premium`** y adjunta **solo** `premium:mensual` (los pases NO: su vigencia es propia).
5. *Offerings*:
   - **`default`** (marcada como *current*): paquete **Monthly** → `premium:mensual`; paquete personalizado con
     identificador **`pase`** → `pase_paes`.
   - **`fin_prueba`**: paquete personalizado **`pase`** → `pase_paes_oferta`.
6. *Integrations → Webhooks* → **Add**:
   - URL: `https://mxtyfzgjytwcntmmrqbt.supabase.co/functions/v1/revenuecat-webhook`
   - *Authorization header*: el valor de `REVENUECAT_WEBHOOK_AUTH` que está en tu `.env` (empieza con `Bearer `).
   - *Send test event* → debe responder 200.
7. *Project settings → API keys* → copia la **Public app-specific key de Android** (empieza con `goog_`; es pública)
   y ponla en `.env` como `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=`. Claude la carga en EAS y la publica por OTA
   (no hace falta otro build: el módulo nativo ya va en el build del Hito 3).

**Comprobar:** en el teléfono (instalado desde Pruebas internas, con tu cuenta de tester) → Perfil → *Ver planes* →
elige un plan → *Pagar* → la hoja de Google Play muestra «Pedido de prueba» → al volver dice «¡Listo! Ya tienes Premium»
y el webhook deja la fila en la tabla `entitlements` de Supabase.
