# MePreparo — App UI kit

Mobile practice app for PAES M1/M2. Click-through: **Inicio → Continuar → Ejercicio (select, Pista, Revisar, retry/Siguiente) → Resumen**, plus **Progreso** tab.

Files: `index.html` (shell + phone frame + router), `Home.jsx`, `Exercise.jsx`, `Summary.jsx` (Summary + Progress).

**Source caveat:** the only product UI in the sources is the "Tarjeta de ejercicio" and primary button on the brand board. Home, Progreso and Resumen are composed from DS primitives following that board — they are extrapolations, not recreations of shipped screens. Replace with real screens when available.
