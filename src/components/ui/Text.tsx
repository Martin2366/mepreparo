import { Text as RNText, type TextProps } from 'react-native';

/** Tipografía por variante; el color va aparte para que `className` pueda reemplazarlo sin conflictos. */
const VARIANTS = {
  display: ['font-poppins-bold text-display', 'text-ink'],
  h1: ['font-poppins-bold text-h1', 'text-ink'],
  h2: ['font-poppins-semibold text-h2', 'text-ink'],
  h3: ['font-poppins-semibold text-h3', 'text-ink'],
  lead: ['font-poppins text-lead', 'text-ink'],
  body: ['font-poppins text-body', 'text-ink'],
  small: ['font-poppins text-small', 'text-graphite'],
  caption: ['font-poppins text-caption', 'text-graphite'],
  overline: ['font-poppins-semibold text-overline uppercase tracking-[1.7px]', 'text-ink'],
  hand: ['font-hand text-h3', 'text-ink'],
} as const;

export type TextVariant = keyof typeof VARIANTS;

type Props = TextProps & { variant?: TextVariant; className?: string };

const HAS_COLOR = /(^|\s)text-(ink|white|graphite|sky|coral|success|paper)(-\d+)?(\s|$)/;
const HAS_FONT = /(^|\s)font-/;

/**
 * Texto de marca: Poppins siempre (RN no hereda la fuente, así que todo texto pasa por aquí).
 * Con `style` explícito y sin variante ni clases, no se aplican clases: en NativeWind las clases
 * pisan al `style`, y los componentes con StyleSheet ya traen su tipografía completa.
 */
export function Text({ variant, className = '', ...rest }: Props) {
  if (!variant && !className && rest.style) {
    return <RNText maxFontSizeMultiplier={1.4} {...rest} />;
  }
  const [type, color] = VARIANTS[variant ?? 'body'];
  const typeClasses = HAS_FONT.test(className) ? type.replace(/font-\S+/, '') : type;
  const classes = [typeClasses, HAS_COLOR.test(className) ? '' : color, className].join(' ');
  return <RNText className={classes} maxFontSizeMultiplier={1.4} {...rest} />;
}
