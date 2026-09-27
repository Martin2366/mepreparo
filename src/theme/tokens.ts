import raw from './tokens.json';

/**
 * Tokens de diseño (fuente única: tokens.json, que también alimenta tailwind.config.js).
 * Úsalos solo donde NativeWind no llega (SVG, estilos animados); en el resto, clases de Tailwind.
 */
export const colors = {
  ink: raw.colors.ink.DEFAULT,
  sky: raw.colors.sky.DEFAULT,
  sky100: raw.colors.sky['100'],
  sky50: raw.colors.sky['50'],
  sky200: raw.colors.sky['200'],
  sky600: raw.colors.sky['600'],
  sky700: raw.colors.sky['700'],
  coral: raw.colors.coral.DEFAULT,
  coral50: raw.colors.coral['50'],
  paper: raw.colors.paper.DEFAULT,
  graphite: raw.colors.graphite.DEFAULT,
  graphite100: raw.colors.graphite['100'],
  graphite200: raw.colors.graphite['200'],
  graphite300: raw.colors.graphite['300'],
  paper2: raw.colors.paper['2'],
  ink700: raw.colors.ink['700'],
  success: raw.colors.success.DEFAULT,
  success50: raw.colors.success['50'],
  success700: raw.colors.success['700'],
  line: raw.colors.line,
  white: raw.colors.white,
  gridLine: raw.grid.line,
} as const;

export const fonts = raw.fontFamily;
export const gridCell = raw.grid.cell;
export const tapMin = raw.tapMin;
