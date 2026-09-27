import { cssInterop } from 'nativewind';
import Animated from 'react-native-reanimated';

/**
 * NativeWind solo conoce los componentes base de React Native. Los animados de Reanimated se
 * registran aquí para que `className` funcione en ellos (filas, centrado, bordes redondeados…).
 * Regla: nunca combinar `className` con un `style` animado en el mismo elemento (en Android se pierde
 * uno de los dos). Animación afuera, clases adentro. Se importa una vez desde el layout raíz.
 */
cssInterop(Animated.View, { className: 'style' });
cssInterop(Animated.Text, { className: 'style' });
cssInterop(Animated.ScrollView, { className: 'style', contentContainerClassName: 'contentContainerStyle' });
