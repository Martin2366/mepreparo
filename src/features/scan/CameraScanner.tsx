import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { ActivityIndicator, type LayoutChangeEvent, Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import type { Region } from '@/engine/equis';
import { goBack } from '@/lib/nav';
import { colors, fonts } from '@/theme/tokens';

import { type ImageSource, pickFromGallery, type Prepared, prepare } from './image';

type Mode = 'one' | 'page';

/** Centro vertical del marco (relativo a la pantalla) y límites de tamaño. */
const CENTER_Y = 0.42;
const LIMITS = { minW: 0.4, maxW: 0.96, minH: 0.1, maxH: 0.62 };
const PAGE: Region = { x: 0.04, y: 0.12, w: 0.92, h: 0.7 };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const centered = (w: number, h: number): Region => ({ x: (1 - w) / 2, y: CENTER_Y - h / 2, w, h });

/**
 * Visor tipo Photomath: se envía SOLO lo que queda dentro del marco. El marco se agranda o achica arrastrando la
 * esquina. La foto se toma en memoria (sin guardar un archivo completo), así la captura es casi inmediata.
 */
export function CameraScanner({ onImage }: { onImage: (img: Prepared) => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [mode, setMode] = useState<Mode>('one');
  const [size, setSize] = useState({ w: 0.9, h: 0.24 });
  const [torch, setTorch] = useState(false);
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState({ w: 1, h: 1 });
  const flash = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const frame = mode === 'one' ? centered(size.w, size.h) : PAGE;

  const onLayout = (e: LayoutChangeEvent) => setView({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

  // Esquina inferior derecha: el marco crece o se achica desde el centro.
  const resize = Gesture.Pan()
    .runOnJS(true)
    .onChange((e) => {
      setSize((cur) => ({
        w: clamp(cur.w + (2 * e.changeX) / view.w, LIMITS.minW, LIMITS.maxW),
        h: clamp(cur.h + (2 * e.changeY) / view.h, LIMITS.minH, LIMITS.maxH),
      }));
    });

  const shoot = async () => {
    if (!camera.current || busy) return;
    setBusy(true);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    flash.value = withSequence(withTiming(0.7, { duration: 60 }), withTiming(0, { duration: 220 }));
    try {
      const pic = await camera.current.takePictureAsync({ pictureRef: true, shutterSound: false });
      onImage(await prepare(pic as unknown as ImageSource, { frame, view }));
    } catch {
      setBusy(false);
    }
  };

  const gallery = async () => {
    const uri = await pickFromGallery();
    if (!uri) return;
    setBusy(true);
    try {
      onImage(await prepare(uri));
    } catch {
      setBusy(false);
    }
  };

  const flashStyle = useAnimatedStyle(() => ({ opacity: flash.value }));

  if (!permission) return <View style={s.fill} />;
  if (!permission.granted) {
    return (
      <View style={[s.fill, s.ask, { paddingTop: insets.top + 24 }]}>
        <Mascot pose="curioso" height={120} float={false} />
        <Text style={s.askTitle}>Déjame ver tu ejercicio</Text>
        <Text style={s.askBody}>Uso la cámara solo para leer el ejercicio. La foto no se guarda.</Text>
        <Button label="Permitir la cámara" onPress={requestPermission} />
        <Button label="Elegir de la galería" variant="secondary" onPress={gallery} />
        <Button label="Volver" variant="ghost" onPress={() => goBack()} />
      </View>
    );
  }

  const box = { left: frame.x * view.w, top: frame.y * view.h, width: frame.w * view.w, height: frame.h * view.h };

  return (
    <View style={s.fill} onLayout={onLayout}>
      <CameraView ref={camera} style={StyleSheet.absoluteFill} facing="back" enableTorch={torch} animateShutter={false} />

      {/* Lo de afuera del marco se oscurece: queda claro qué se va a leer. */}
      <View pointerEvents="none" style={[s.shade, { left: 0, right: 0, top: 0, height: box.top }]} />
      <View pointerEvents="none" style={[s.shade, { left: 0, right: 0, top: box.top + box.height, bottom: 0 }]} />
      <View pointerEvents="none" style={[s.shade, { left: 0, width: box.left, top: box.top, height: box.height }]} />
      <View pointerEvents="none" style={[s.shade, { left: box.left + box.width, right: 0, top: box.top, height: box.height }]} />
      <View pointerEvents="none" style={[s.frame, box]} />
      {mode === 'one' ? (
        <GestureDetector gesture={resize}>
          <View
            accessibilityLabel="Arrastra para cambiar el tamaño del marco"
            style={[s.handle, { left: box.left + box.width - 28, top: box.top + box.height - 28 }]}
          >
            <Icon name="chevron-down" size={20} color={colors.ink} />
          </View>
        </GestureDetector>
      ) : null}

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, s.flash, flashStyle]} />

      <View style={[s.top, { paddingTop: insets.top + 8 }]}>
        <Tappable accessibilityRole="button" accessibilityLabel="Cerrar" onPress={() => goBack()} style={s.round}>
          <Icon name="x" size={22} color={colors.white} />
        </Tappable>
        <Text style={s.tip}>{mode === 'one' ? 'Solo lo del marco' : 'Encuadra la página'}</Text>
        <Tappable accessibilityRole="button" accessibilityLabel={torch ? 'Apagar la linterna' : 'Encender la linterna'} onPress={() => setTorch((t) => !t)} style={s.round}>
          <Icon name="zap" size={20} color={torch ? colors.sky : colors.white} />
        </Tappable>
      </View>
      {mode === 'one' ? (
        <Text pointerEvents="none" style={[s.hint, { top: box.top + box.height + 10 }]}>
          Arrastra la esquina para ajustar el marco
        </Text>
      ) : null}

      <View style={[s.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <View style={s.modes}>
          {(['one', 'page'] as const).map((m) => (
            <Tappable key={m} accessibilityRole="radio" accessibilityState={{ selected: mode === m }} onPress={() => setMode(m)} style={[s.mode, mode === m && s.modeOn]}>
              <Text style={[s.modeText, mode === m && { color: colors.ink }]}>{m === 'one' ? 'Un ejercicio' : 'Página del cuaderno'}</Text>
            </Tappable>
          ))}
        </View>
        <View style={s.controls}>
          <Tappable accessibilityRole="button" accessibilityLabel="Elegir de la galería" onPress={gallery} style={s.round}>
            <Icon name="book" size={22} color={colors.white} />
          </Tappable>
          <Tappable accessibilityRole="button" accessibilityLabel="Sacar la foto" onPress={shoot} style={s.shutter}>
            {busy ? <ActivityIndicator color={colors.white} /> : <View style={s.shutterIn} />}
          </Tappable>
          <View style={{ width: 48 }} />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.ink },
  ask: { alignItems: 'center', gap: 12, paddingHorizontal: 24, backgroundColor: colors.paper },
  askTitle: { fontFamily: fonts['poppins-bold'], fontSize: 22, color: colors.ink, textAlign: 'center' },
  askBody: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 22, color: colors.graphite, textAlign: 'center', marginBottom: 8 },
  shade: { position: 'absolute', backgroundColor: 'rgba(20,28,51,0.5)' },
  frame: { position: 'absolute', borderWidth: 3, borderColor: colors.sky, borderRadius: 14 },
  handle: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  flash: { backgroundColor: colors.white },
  hint: { position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: fonts['poppins-medium'], fontSize: 13, color: colors.white },
  top: { position: 'absolute', left: 16, right: 16, top: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tip: { fontFamily: fonts['poppins-semibold'], fontSize: 15, color: colors.white },
  round: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(20,28,51,0.55)', alignItems: 'center', justifyContent: 'center' },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, gap: 16, alignItems: 'center' },
  modes: { flexDirection: 'row', gap: 8, backgroundColor: 'rgba(20,28,51,0.55)', borderRadius: 999, padding: 4 },
  mode: { minHeight: 40, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center' },
  modeOn: { backgroundColor: colors.white },
  modeText: { fontFamily: fonts['poppins-semibold'], fontSize: 13, color: colors.white },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 32 },
  shutter: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  shutterIn: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.sky },
});
