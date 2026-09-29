import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/ui/Mascot';
import { Text } from '@/components/ui/Text';
import { ERROR_TEXT, scanImage } from '@/features/equis/api';
import { LimitCard } from '@/features/premium/LimitCard';
import { useAllowance } from '@/features/progress/allowance';
import { FullScreen } from '@/features/shell/FullScreen';
import { goBack } from '@/lib/nav';
import { colors, fonts } from '@/theme/tokens';

import { scanAvailable, useScan } from './store';

type Phase = { kind: 'camera' } | { kind: 'reading' } | { kind: 'error'; text: string };

/** Foto de un ejercicio (PRD §10): cámara o galería → Equis lee el enunciado → resultado. */
export function ScanScreen() {
  const photo = useAllowance('photo');
  const [phase, setPhase] = useState<Phase>({ kind: 'camera' });

  if (!scanAvailable()) {
    return (
      <FullScreen title="Foto de un ejercicio">
        <View style={s.center}>
          <Mascot pose="estudiando" height={130} float={false} />
          <Text style={s.title}>Llega con la próxima versión</Text>
          <Text style={s.body}>Actualiza la app para sacarle foto a tu cuaderno y que Equis te explique.</Text>
        </View>
      </FullScreen>
    );
  }

  if (!photo.ok) {
    return (
      <FullScreen title="Foto de un ejercicio">
        <LimitCard title="Ya usaste tu foto gratis de esta semana" free="Mientras, puedes practicar cualquier tema sin límite de lecciones." />
      </FullScreen>
    );
  }

  const onImage = async (base64: string, uri: string) => {
    setPhase({ kind: 'reading' });
    const r = await scanImage(base64);
    if (!r.ok) return setPhase({ kind: 'error', text: ERROR_TEXT[r.error] });
    photo.use();
    useScan.getState().set({ imageUri: uri, result: r.data });
    router.replace('/foto-resultado');
  };

  if (phase.kind === 'reading') {
    return (
      <View style={[s.center, s.full]}>
        <Mascot pose="pensando" height={140} />
        <Text style={s.title}>Equis está leyendo tu ejercicio…</Text>
        <ActivityIndicator color={colors.sky700} />
      </View>
    );
  }
  if (phase.kind === 'error') {
    return (
      <FullScreen title="Foto de un ejercicio">
        <View style={s.center}>
          <Mascot pose="apoyo" height={120} float={false} />
          <Text style={s.body}>{phase.text}</Text>
          <Button label="Intentar de nuevo" onPress={() => setPhase({ kind: 'camera' })} />
          <Button label="Volver" variant="ghost" onPress={() => goBack()} />
        </View>
      </FullScreen>
    );
  }

  // Se carga solo si el build trae la cámara (el build anterior no la tiene y un import directo rompería la app).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { CameraScanner } = require('./CameraScanner') as typeof import('./CameraScanner');
  return <CameraScanner onImage={onImage} />;
}

const s = StyleSheet.create({
  full: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: 24 },
  center: { alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 24 },
  title: { fontFamily: fonts['poppins-bold'], fontSize: 20, lineHeight: 26, color: colors.ink, textAlign: 'center' },
  body: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 22, color: colors.graphite, textAlign: 'center' },
});
