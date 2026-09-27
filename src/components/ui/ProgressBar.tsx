import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { easeOut } from '@/theme/motion';
import { colors } from '@/theme/tokens';

/** Barra de progreso celeste (design system → ProgressBar). Avanza con una transición calma. */
export function ProgressBar({ value, height = 8 }: { value: number; height?: number }) {
  const v = useSharedValue(value);
  useEffect(() => {
    v.value = withTiming(Math.max(0, Math.min(1, value)), { duration: 420, easing: easeOut });
  }, [value, v]);
  const fill = useAnimatedStyle(() => ({ width: `${v.value * 100}%` }));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={[s.track, { height, borderRadius: height / 2 }]}
    >
      <Animated.View style={[s.fill, { borderRadius: height / 2 }, fill]} />
    </View>
  );
}

const s = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden', backgroundColor: colors.graphite100 },
  fill: { height: '100%', backgroundColor: colors.sky },
});
