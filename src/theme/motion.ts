import { Easing } from 'react-native-reanimated';

/**
 * Movimiento de marca (design system → guidelines/motion): calmo, ease-out, 120/200/320 ms.
 * Un solo "pop" elástico, reservado para la selección y el momento ajá.
 */
export const dur = { fast: 120, base: 200, slow: 320 } as const;
export const easeOut = Easing.bezier(0.2, 0.7, 0.2, 1);
export const easeOutFn = Easing.out(Easing.cubic);
export const popSpring = { damping: 11, stiffness: 260, mass: 0.6 } as const;
export const softSpring = { damping: 18, stiffness: 180, mass: 0.8 } as const;

/** Retraso escalonado para listas: rápido y con tope, para que nada espere más de ~400 ms. */
export const stagger = (i: number, step = 45) => Math.min(i, 8) * step;
