import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { easeOut } from '@/theme/motion';

/** Barra de progreso celeste (design system → ProgressBar). Avanza con una transición calma. */
export function ProgressBar({ value, height = 8 }: { value: number; height?: number }) {
  const v = useSharedValue(value);
  useEffect(() => {
    v.value = withTiming(Math.max(0, Math.min(1, value)), { duration: 480, easing: easeOut });
  }, [value, v]);
  const fill = useAnimatedStyle(() => ({ width: `${v.value * 100}%` }));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      className="w-full overflow-hidden rounded-full bg-graphite-100"
      style={{ height }}
    >
      <Animated.View className="h-full rounded-full bg-sky" style={fill} />
    </View>
  );
}
