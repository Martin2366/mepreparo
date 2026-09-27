/** @type {import('tailwindcss').Config} */
const tokens = require('./src/theme/tokens.json');

const px = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, `${v}px`]));

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  // Solo modo claro en v1: el tema se controla por clase (evita que el sistema fuerce el oscuro).
  darkMode: 'class',
  theme: {
    // Paleta cerrada: solo colores de marca (no se mezclan con la paleta por defecto de Tailwind).
    colors: tokens.colors,
    fontFamily: Object.fromEntries(Object.entries(tokens.fontFamily).map(([k, v]) => [k, [v]])),
    fontSize: Object.fromEntries(
      Object.entries(tokens.fontSize).map(([k, [size, lh]]) => [k, [`${size}px`, { lineHeight: `${lh}px` }]]),
    ),
    extend: {
      borderRadius: px(tokens.radius),
      minHeight: { tap: `${tokens.tapMin}px` },
      minWidth: { tap: `${tokens.tapMin}px` },
      maxWidth: { content: `${tokens.contentMax}px` },
    },
  },
  plugins: [],
};
