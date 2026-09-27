# MePreparo Design System

**MePreparo** es la app chilena que ayuda a estudiantes de 16–18 años a *entender* la matemática de la PAES (M1 y M2) de forma visual e interactiva — "Aprender haciendo. Hasta que haga clic." Tagline: **Entiende · Practica · Avanza**. Footer line: "Tu PAES, paso a paso." Mascot: **Equis**, "la incógnita que aprendes a resolver" — a calm, curious classmate who explains without judging.

## Sources
All provided as images (no codebase, no Figma). Copies kept in `assets/reference/`:
- `uploads/ChatGPT Image 27 sept 2026, 01_38_01 p.m..png` → `brand-board.png` — logo, palette, Poppins, icon examples, grid pattern, primary button, sparkle, sample exercise card.
- `uploads/Imagen de ChatGPT 27 sept 2026, 01_33_17 p.m..png` → `equis-character-sheet.png` — Equis turnaround, proportions (5×4 heads), expressions, 32px version.
- `uploads/Imagen de ChatGPT 27 sept 2026, 01_37_23 p.m..png` → `equis-poses.png` — 8 poses (transparent).
- Brief (fixed brand style): flat vector illustration, rounded shapes, uniform clean stroke, no noisy textures or strong gradients; exact palette; notebook-grid motif; calm, close, never childish. **Forbidden:** purple, astronauts, green blobs, sprouts/plants, aggressive gamer aesthetics.

## Products
- **MePreparo app** (mobile-first practice app) → `ui_kits/app/`. Only the exercise card is defined in the sources; other screens are extrapolated from the board.

---
## CONTENT FUNDAMENTALS
- **Language:** Chilean Spanish, neutral register (no heavy slang, no "po"). Always **tú** ("Estudia a tu ritmo", "Tú puedes"). The app speaks as a companion; Equis may speak in first person in notes.
- **Tone:** tranquilo, cercano, nada infantil. Encouraging without hype; never mocking or pressuring ("No se burla, no presiona"). Errors are framed as part of the process: "Casi. Revisa el signo." not "Incorrecto".
- **Casing:** sentence case for titles and buttons ("Comenzar ejercicio"). UPPERCASE with wide tracking only for overlines/section labels ("PALETA DE COLORES") and the tagline.
- **Punctuation:** proper Spanish ¡! and ¿? ("¡Correcto!", "¿cuál es su vértice?"). Short sentences, periods for calm cadence ("Aprender haciendo. Hasta que haga clic.").
- **Key vocabulary:** entender, paso a paso, a tu ritmo, momento ajá, pista, practicar, avanzar. Math is written properly (x², −, fractions) in the math serif.
- **Emoji:** not used. The "ajá" moment is expressed with the coral chispa (sparkle), not emoji.
- **Examples:** "Hola, Cata. Hoy toca funciones." · "Vuelve a intentarlo, vas bien." · "Tú puedes. Vamos paso a paso. — Equis" · "Un paso a la vez".

## VISUAL FOUNDATIONS
- **Color:** six exact colors (tokens/colors.css). Ink #1E2A4A for all text and every illustration outline; Celeste #4FB3E8 = anything interactive (buttons, selection, progress); Coral #FF7A59 = accent reserved for the ajá/insight moment (sparkle, streak flame, "Nuevo"); Papel cálido #FBF8F2 page background; Grafito #5B6475 secondary text/icons; Verde #2FBF71 **only** for correct. There is no red: wrong answers use calm graphite (`--retry`). No purple anywhere.
- **Type:** Poppins throughout (700 display/h1, 600 h2/h3/buttons, 400 body). Math in STIX Two Text italic. Kalam (substitute) only for Equis' handwritten margin notes, slightly rotated (−3°/−4°).
- **Backgrounds:** warm paper, often with the subtle 24px notebook grid (`.mp-grid` / `--bg-grid`, ink at 7% opacity). No photos, no full-bleed imagery, no gradients, no textures.
- **Illustration:** flat vector, rounded, uniform ink outline (~2px at UI scale), sky-blue fills, navy clothing, coral as the single warm accent. Equis is the only character besides the student hero.
- **Corner radii:** everything rounded. 6 (checkbox) · 10 · 14 (inputs, answer rows) · 20 (cards) · 28 (dialogs) · pill for buttons, badges, tabs, chips.
- **Cards:** white on paper, 20px radius, 1px warm border (#E7E1D5), soft ink-tinted shadow (`--shadow-card`). Tinted flat variant (sky-50) for tips. No colored left-border cards.
- **Borders/strokes:** 2px ink/graphite-200 for controls; 1.5px for letter circles/chips; 1px hairlines for dividers.
- **Shadows:** three levels, all low-opacity ink (xs / card / raised). No inner shadows, no glows.
- **Hover:** backgrounds shift to sky-50 (ghost/secondary) or one step darker (primary → sky-600). **Press:** scale .97. **Focus:** 3px Celeste ring at 40%.
- **Selection:** sky-100 fill + Celeste letter circle (as on the sample card).
- **Motion:** calm. ease-out cubic-bezier(.2,.7,.2,1), 120/200/320ms; fade-up 6px for new content. One springy pop (`--ease-pop`) only for correct/ajá badges. No bounces elsewhere, no confetti.
- **Transparency/blur:** only the ink scrim behind dialogs (36%). No glassmorphism.
- **Layout:** mobile-first, 16–20px gutters, max content 720px on larger screens; one primary action per screen, pinned at the bottom of exercise views; bottom tab nav.
- **Imagery vibe:** cool (sky/navy) with warm paper and a single coral spark. Clean, no grain.

## ICONOGRAPHY
- **UI glyphs:** the board shows thin, uniform-stroke line icons (bookmark, lightbulb, check, arrow). No icon files were supplied, so the system uses **Lucide** (2px stroke, rounded caps) via CDN (`lucide-static@0.460.0`) through the `Icon` component — **substitution, flagged**.
- **Illustrative topic icons** (PNG, cropped from the board): `assets/icons/balanza`, `funcion`, `triangulo` (transparent) and `*-tile.png` (on their sky-50 rounded tile). Ink line + coral accent fill.
- **Chispa / destello** (`assets/icons/chispa.png`): coral sparkle = the ajá moment. In UI, the Lucide `sparkle`/`sparkles` tinted coral stands in at small sizes.
- **No emoji, no unicode-as-icon** (except math symbols in content).

## Assets
- `assets/logo/` mepreparo-lockup.png (icon + name + tagline), mepreparo-icon.png (notebook "M" app icon with coral spark), mepreparo-wordmark.png (hand-drawn wordmark with Celeste underline). Raster crops — vector originals requested.
- `assets/mascot/` Equis: 8 poses (saludo, pensando, senalando, aja, explicando, celebrando, estudiando, descansando), turnaround (frontal, 3-4, perfil), expressions (curioso, aja, tranquilo, apoyo), equis-32.
- `assets/illustrations/estudiante-hero.png` — student studying (includes its grid background).
- `fonts/` Poppins 400–800, Kalam 400/700, STIX Two Text (self-hosted Google Fonts, latin).

## Index
- `styles.css` → imports `tokens/` (fonts, colors, typography, spacing, effects, base).
- `guidelines/` — foundation cards (Colors, Type, Spacing, Brand).
- `components/` — React primitives:
  - core: **Button, IconButton, Icon, Badge, Tag, Card**
  - forms: **Input, Select, Checkbox, Radio, Switch**
  - navigation: **Tabs, BottomNav**
  - feedback: **Dialog, Toast, Tooltip, ProgressBar**
  - practice: **ExerciseCard, AnswerOption, HintBox, FeedbackBanner**
  - brand: **Logo, Mascot**
- `ui_kits/app/` — mobile app click-through.
- `SKILL.md` — Agent Skill entry.

### Intentional additions
No source defined a component inventory, so a standard set sized to the brand was authored. Brand-specific: AnswerOption, HintBox, FeedbackBanner, ExerciseCard (from the board's sample card), Logo & Mascot (asset wrappers), BottomNav (mobile app shell), Icon (Lucide wrapper).
