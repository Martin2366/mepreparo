import raw from './tokens.json';

/**
 * Tokens de diseño (fuente única: tokens.json, que también alimenta tailwind.config.js).
 * Úsalos solo donde NativeWind no llega (SVG, estilos animados); en el resto, clases de Tailwind.
 */
export const colors = {
  ink: raw.colors.ink.DEFAULT,
  sky: raw.colors.sky.DEFAULT,
  sky100: raw.colors.sky['100'],
  sky200: raw.colors.sky['200'],
  coral: raw.colors.coral.DEFAULT,
  paper: raw.colors.paper.DEFAULT,
  graphite: raw.colors.graphite.DEFAULT,
  graphite200: raw.colors.graphite['200'],
  success: raw.colors.success.DEFAULT,
  line: raw.colors.line,
  white: raw.colors.white,
  gridLine: raw.grid.line,
} as const;

export const fonts = raw.fontFamily;
export const gridCell = raw.grid.cell;
export const tapMin = raw.tapMin;
