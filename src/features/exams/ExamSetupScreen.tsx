import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip, PremiumTag } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { type ExamKind, type ExamSpec, PRESETS, realMinutes } from '@/engine/exam';
import type { Feature } from '@/engine/entitlements';
import { curriculum } from '@/features/content/catalog';
import { useAllowance } from '@/features/progress/allowance';
import { Section } from '@/features/shell/TabScreen';
import { FullScreen } from '@/features/shell/FullScreen';
import { colors, fonts } from '@/theme/tokens';

import { useExams } from './store';

const FEATURE: Record<ExamKind, Feature> = { full: 'fullExam', mini: 'miniExam', thematic: 'customExam', custom: 'customExam' };

const INFO: Record<ExamKind, { title: string; lines: string[] }> = {
  full: {
    title: 'Ensayo completo M1',
    lines: ['65 preguntas de los 4 ejes, en la proporción de la PAES', '2 h 20 min, como el día de la prueba', 'Sin feedback hasta terminar'],
  },
  mini: { title: 'Mini-ensayo', lines: ['15 preguntas mezcladas', '30 minutos: ideal para la micro', 'Sin feedback hasta terminar'] },
  thematic: { title: 'Ensayo temático', lines: ['20 preguntas de un eje', '30 minutos', 'Para enfocarte en lo que más te cuesta'] },
  custom: { title: 'Ensayo a tu medida', lines: ['Tú eliges los temas, la cantidad y el tiempo'] },
};

type TimeMode = 'real' | 'none' | 'own';

/** Antes de empezar: formato, reglas claras y (en temático / a tu medida) la configuración. */
export function ExamSetupScreen({ kind }: { kind: ExamKind }) {
  const allowance = useAllowance(FEATURE[kind]);
  const active = useExams((s) => s.active);
  const start = useExams((s) => s.start);
  const discard = useExams((s) => s.discard);
  const [axisId, setAxisId] = useState(curriculum.axes[0]!.id);
  const [units, setUnits] = useState<string[]>([]);
  const [count, setCount] = useState(20);
  const [timeMode, setTimeMode] = useState<TimeMode>('real');
  const [ownMinutes, setOwnMinutes] = useState(30);
  const info = INFO[kind];

  const spec = (): ExamSpec | null => {
    if (kind === 'full' || kind === 'mini') return { ...PRESETS[kind], title: info.title };
    if (kind === 'thematic') {
      const axis = curriculum.axes.find((a) => a.id === axisId)!;
      return { ...PRESETS.thematic, title: `Ensayo temático · ${axis.name}`, unitIds: axis.units.map((u) => u.id) };
    }
    if (units.length === 0) return null;
    const minutes = timeMode === 'none' ? null : timeMode === 'own' ? ownMinutes : realMinutes(count);
    return { kind: 'custom', title: 'Ensayo a tu medida', count, minutes, unitIds: units };
  };

  const begin = () => {
    const s = spec();
    if (!s || !allowance.ok) return;
    const go = () => {
      allowance.use();
      start(s);
      router.replace('/ensayo/en-curso');
    };
    if (active) {
      Alert.alert('Tienes un ensayo en curso', 'Si empiezas uno nuevo, el anterior se descarta.', [
        { text: 'Retomar el anterior', onPress: () => router.replace('/ensayo/en-curso') },
        {
          text: 'Empezar uno nuevo',
          style: 'destructive',
          onPress: () => {
            discard();
            go();
          },
        },
      ]);
    } else go();
  };

  const s = spec();
  const limitText = allowance.unlimited
    ? null
    : allowance.max === 0
      ? 'Incluido en Premium'
      : `Te ${allowance.remaining === 1 ? 'queda' : 'quedan'} ${allowance.remaining} ${allowance.per === 'month' ? 'este mes' : allowance.per === 'week' ? 'esta semana' : 'hoy'}`;

  return (
    <FullScreen
      title={info.title}
      footer={
        <View style={{ gap: 6 }}>
          <Button label={allowance.ok ? 'Empezar' : 'No disponible por ahora'} arrow={allowance.ok} disabled={!s || !allowance.ok} onPress={begin} />
          {limitText ? <Text style={[s2.caption, { textAlign: 'center' }]}>{limitText}</Text> : null}
        </View>
      }
    >
      <Card style={{ gap: 10 }}>
        {info.lines.map((l) => (
          <View key={l} style={s2.row}>
            <Icon name="check" size={18} color={colors.sky700} />
            <Text style={s2.body}>{l}</Text>
          </View>
        ))}
        <View style={s2.row}>
          <Icon name="shield-check" size={18} color={colors.sky700} />
          <Text style={s2.body}>Cada respuesta se guarda al instante: si sales, retomas donde quedaste.</Text>
        </View>
        <View style={s2.row}>
          <Icon name="shuffle" size={18} color={colors.sky700} />
          <Text style={s2.body}>Preguntas nuevas en cada intento: nunca se repite el mismo ensayo.</Text>
        </View>
      </Card>

      {!allowance.ok ? (
        <Card tone="paper" style={{ gap: 6 }}>
          <View style={s2.row}>
            <PremiumTag />
            <Text style={s2.strong}>{allowance.max === 0 ? 'Este formato es de Premium' : 'Ya usaste el de este periodo'}</Text>
          </View>
          <Text style={s2.small}>
            Las lecciones, la práctica y la explicación de cada error siguen gratis. Premium incluye ensayos sin límite, sin cobros sorpresa.
          </Text>
        </Card>
      ) : null}

      {kind === 'thematic' ? (
        <Section title="Elige el eje">
          <View style={s2.wrap}>
            {curriculum.axes.map((a) => (
              <Pill key={a.id} label={a.name} on={axisId === a.id} onPress={() => setAxisId(a.id)} />
            ))}
          </View>
        </Section>
      ) : null}

      {kind === 'custom' ? (
        <>
          <Section title="Temas">
            <View style={{ gap: 12 }}>
              {curriculum.axes.map((a) => (
                <View key={a.id} style={{ gap: 6 }}>
                  <Text style={s2.caption}>{a.name}</Text>
                  <View style={s2.wrap}>
                    {a.units.map((u) => (
                      <Pill
                        key={u.id}
                        label={u.name}
                        on={units.includes(u.id)}
                        onPress={() => setUnits((cur) => (cur.includes(u.id) ? cur.filter((x) => x !== u.id) : [...cur, u.id]))}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </Section>
          <Section title="Cantidad de preguntas">
            <Card style={s2.row}>
              <IconButton icon="minus" label="Menos preguntas" onPress={() => setCount((c) => Math.max(10, c - 5))} />
              <Text style={[s2.big, { flex: 1, textAlign: 'center' }]}>{count}</Text>
              <IconButton icon="plus" label="Más preguntas" onPress={() => setCount((c) => Math.min(65, c + 5))} />
            </Card>
          </Section>
          <Section title="Tiempo">
            <View style={s2.wrap}>
              <Pill label={`Real (${realMinutes(count)} min)`} on={timeMode === 'real'} onPress={() => setTimeMode('real')} />
              <Pill label="Sin tiempo" on={timeMode === 'none'} onPress={() => setTimeMode('none')} />
              <Pill label="Mi tiempo" on={timeMode === 'own'} onPress={() => setTimeMode('own')} />
            </View>
            {timeMode === 'own' ? (
              <Card style={s2.row}>
                <IconButton icon="minus" label="Menos minutos" onPress={() => setOwnMinutes((m) => Math.max(5, m - 5))} />
                <Text style={[s2.big, { flex: 1, textAlign: 'center' }]}>{ownMinutes} min</Text>
                <IconButton icon="plus" label="Más minutos" onPress={() => setOwnMinutes((m) => Math.min(180, m + 5))} />
              </Card>
            ) : null}
          </Section>
          {units.length === 0 ? <Chip label="Elige al menos un tema" tone="neutral" /> : null}
        </>
      ) : null}
    </FullScreen>
  );
}

export function Pill({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      onPress={onPress}
      style={[s2.pill, on && s2.pillOn]}
      pressedStyle={{ transform: [{ scale: 0.97 }] }}
    >
      <Text style={s2.pillText}>{label}</Text>
    </Tappable>
  );
}

const s2 = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  body: { flex: 1, fontFamily: fonts.poppins, fontSize: 15, lineHeight: 21, color: colors.ink },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 15, color: colors.ink },
  caption: { fontFamily: fonts.poppins, fontSize: 12, lineHeight: 17, color: colors.graphite },
  big: { fontFamily: fonts['poppins-bold'], fontSize: 24, lineHeight: 30, color: colors.ink },
  pill: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.graphite200,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  pillOn: { backgroundColor: colors.sky100, borderColor: colors.sky },
  pillText: { fontFamily: fonts['poppins-medium'], fontSize: 14, color: colors.ink },
});
