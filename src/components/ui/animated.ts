import { cssInterop } from 'nativewind';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

/**
 * NativeWind solo conoce los componentes base de React Native. Los animados de Reanimated se
 * registran aquí para que `className` funcione en ellos (filas, centrado, bordes redondeados…).
 * Se importa una vez desde el layout raíz.
 */
export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

cssInterop(Animated.View, { className: 'style' });
cssInterop(Animated.Text, { className: 'style' });
cssInterop(Animated.ScrollView, { className: 'style', contentContainerClassName: 'contentContainerStyle' });
cssInterop(AnimatedPressable, { className: 'style' });
