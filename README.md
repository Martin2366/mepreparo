# MePreparo

App Android para **entender** la matemática de la PAES (Chile) aprendiendo haciendo: ecuaciones que se
equilibran en una balanza y funciones que cambian en vivo. Gratis, sin anuncios, sin vidas.

- Especificación: [docs/SPEC_V1.md](docs/SPEC_V1.md)
- Plan e historial: [docs/PLAN_IMPLEMENTACION.md](docs/PLAN_IMPLEMENTACION.md)
- Guía para agentes: [CLAUDE.md](CLAUDE.md)

## Desarrollo

```bash
npm install
cp .env.example .env        # completar claves públicas
npx expo start              # abrir con el development build instalado en el teléfono
```

Verificación local (lo mismo que corre CI):

```bash
npm run typecheck && npm run lint && npm test && npm run content:validate
```

Builds (EAS): `development` (APK con dev client), `preview` (APK interno), `production` (AAB para Play).
