import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { ActivityIndicator, type LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { goBack } from '@/lib/nav';
import { colors, fonts } from '@/theme/tokens';

import { frameToPhoto } from '@/engine/equis';

import { pickFromGallery, prepare } from './image';

type Mode = 'one' | 'page';

/** Marco del modo «un ejercicio», relativo a la pantalla. */
const FRAME = { x: 0.06, y: 0.3, w: 0.88, h: 0.28 };
/** Visor tipo Photomath: encuadra un ejercicio (o toda la página del cuaderno), o elige una foto de la galería. */
export function CameraScanner({ onImage }: { onImage: (base64: string, uri: string) => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [mode, setMode] = useState<Mode>('one');
  const [torch, setTorch] = useState(false);
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState({ w: 1, h: 1 });
  const insets = useSafeAreaInsets();

  const onLayout = (e: LayoutChangeEvent) => setView({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

  const shoot = async () => {
    if (!camera.current || busy) return;
    setBusy(true);
    try {
      const pic = await camera.current.takePictureAsync({ quality: 0.85 });
      if (!pic) return;
      const region = mode === 'one' ? frameToPhoto(FRAME, view, { w: pic.width, h: pic.height }) : undefined;
      onImage(await prepare(pic.uri, pic.width, pic.height, region), pic.uri);
    } finally {
      setBusy(false);
    }
  };

  const gallery = async () => {
    const img = await pickFromGallery();
    if (!img) return;
    setBusy(true);
    try {
      onImage(await prepare(img.uri, img.width, img.height), img.uri);
    } finally {
      setBusy(false);
    }
  };

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

  return (
    <View style={s.fill} onLayout={onLayout}>
      <CameraView ref={camera} style={StyleSheet.absoluteFill} facing="back" enableTorch={torch} />

      {mode === 'one' ? (
        <View pointerEvents="none" style={[s.frame, { left: `${FRAME.x * 100}%`, top: `${FRAME.y * 100}%`, width: `${FRAME.w * 100}%`, height: `${FRAME.h * 100}%` }]} />
      ) : (
        <View pointerEvents="none" style={[s.frame, { left: '4%', top: '12%', width: '92%', height: '70%' }]} />
      )}

      <View style={[s.top, { paddingTop: insets.top + 8 }]}>
        <Tappable accessibilityRole="button" accessibilityLabel="Cerrar" onPress={() => goBack()} style={s.round}>
          <Icon name="x" size={22} color={colors.white} />
        </Tappable>
        <Text style={s.tip}>{mode === 'one' ? 'Encuadra un ejercicio' : 'Encuadra la página'}</Text>
        <Tappable accessibilityRole="button" accessibilityLabel={torch ? 'Apagar la linterna' : 'Encender la linterna'} onPress={() => setTorch((t) => !t)} style={s.round}>
          <Icon name="zap" size={20} color={torch ? colors.sky : colors.white} />
        </Tappable>
      </View>

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
            {busy ? <ActivityIndicator color={colors.ink} /> : <View style={s.shutterIn} />}
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
  frame: { position: 'absolute', borderWidth: 3, borderColor: colors.sky, borderRadius: 18 },
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
