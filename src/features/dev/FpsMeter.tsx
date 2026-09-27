import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFrameCallback } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Text } from '@/components/ui/Text';

type UiStats = { fps: number; min: number; samples: number };

/** Las dos primeras muestras (arranque de la pantalla) no cuentan para el mínimo. */
const WARMUP = 2;

/**
 * Evidencia del Spike B: FPS del hilo de UI (donde corren las animaciones de Reanimated)
 * y del hilo JS (donde corre React). Solo para pantallas de desarrollo.
 */
export function FpsMeter() {
  const [ui, setUi] = useState<UiStats>({ fps: 0, min: Infinity, samples: 0 });
  const [js, setJs] = useState(0);

  const onUiSample = (fps: number) =>
    setUi((s) => ({ fps, samples: s.samples + 1, min: s.samples >= WARMUP ? Math.min(s.min, fps) : s.min }));

  useFrameCallback((frame) => {
    'worklet';
    const g = globalThis as unknown as { __fpsFrames?: number; __fpsStart?: number };
    g.__fpsFrames = (g.__fpsFrames ?? 0) + 1;
    g.__fpsStart ??= frame.timestamp;
    const elapsed = frame.timestamp - g.__fpsStart;
    if (elapsed >= 500) {
      const fps = Math.round((g.__fpsFrames * 1000) / elapsed);
      g.__fpsFrames = 0;
      g.__fpsStart = frame.timestamp;
      scheduleOnRN(onUiSample, fps);
    }
  });

  useEffect(() => {
    let frames = 0;
    let start = performance.now();
    let raf = 0;
    const loop = () => {
      frames++;
      const now = performance.now();
      if (now - start >= 500) {
        setJs(Math.round((frames * 1000) / (now - start)));
        frames = 0;
        start = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <View className="flex-row gap-4 self-start rounded-full bg-ink px-4 py-1">
      <Text className="font-poppins-medium text-caption text-white">UI {ui.fps} fps</Text>
      <Text className="font-poppins-medium text-caption text-white">mín. {Number.isFinite(ui.min) ? ui.min : '—'}</Text>
      <Text className="font-poppins-medium text-caption text-white">JS {js} fps</Text>
    </View>
  );
}
