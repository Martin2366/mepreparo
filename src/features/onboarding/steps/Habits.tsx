import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors, fonts } from '@/theme/tokens';

import { SectionLabel, StepLayout, StepTitle } from '../components';
import { useOnboarding } from '../store';
import type { StepProps } from './types';

const MINS = [
  { m: 10, sub: 'Suave' },
  { m: 20, sub: 'Constante' },
  { m: 30, sub: 'Intenso' },
  { m: 45, sub: 'A fondo' },
];
const TIMES = ['07:30', '13:30', '17:00', '19:00', '20:30', '22:00'];

const tap = () => Platform.OS !== 'web' && Haptics.selectionAsync();

export function MinutesStep({ next }: StepProps) {
  const minutes = useOnboarding((s) => s.answers.minutes);
  const update = useOnboarding((s) => s.update);
  // Preseleccionado: 20 minutos ("Constante"), lo que más se sostiene en el tiempo.
  useEffect(() => {
    if (minutes === undefined) update({ minutes: 20 });
  }, [minutes, update]);
  const m = minutes ?? 20;
  const weekly = m * 7;
  const h = Math.floor(weekly / 60);
  const rest = weekly % 60;

  return (
    <StepLayout primary={{ label: 'Continuar', onPress: next }}>
      <View style={s.hero}>
        <Image
          source={require('@/assets/images/illustrations/estudiante-micro.webp')}
          style={s.heroImg}
          contentFit="cover"
          contentPosition={{ top: '28%' }}
          accessibilityLabel="Estudiante practicando en la micro"
        />
      </View>
      <View style={{ gap: 16 }}>
        <StepTitle title="¿Cuánto tiempo al día?" subtitle="Tu meta diaria. Poco y seguido funciona mejor." />
        <View style={s.grid}>
          {MINS.map((o) => {
            const on = o.m === m;
            return (
              <Pressable
                key={o.m}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                onPress={() => {
                  tap();
                  update({ minutes: o.m });
                }}
                style={({ pressed }) => [s.minCard, on && s.on, pressed && { transform: [{ scale: 0.97 }] }]}
              >
                <Text style={s.minBig}>{o.m} min</Text>
                <Text style={s.minSub}>{o.sub}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={s.note}>
          Son {h ? `${h} h ` : ''}
          {rest ? `${rest} min ` : ''}a la semana. Lo puedes cambiar después.
        </Text>
      </View>
    </StepLayout>
  );
}

export function ReminderStep({ next }: StepProps) {
  const reminder = useOnboarding((s) => s.answers.reminder);
  const minutes = useOnboarding((s) => s.answers.minutes) ?? 20;
  const name = useOnboarding((s) => s.answers.name).trim();
  const update = useOnboarding((s) => s.update);
  useEffect(() => {
    if (!reminder) update({ reminder: { on: true, time: '19:00' } });
  }, [reminder, update]);
  const r = reminder ?? { on: true, time: '19:00' };

  return (
    <StepLayout primary={{ label: 'Continuar', onPress: next }}>
      <View style={{ gap: 16 }}>
        <StepTitle title="¿A qué hora te recordamos?" subtitle="Un aviso al día, cuando te acomode." />
        <View style={s.switchCard}>
          <Text style={s.switchLabel}>Recordatorio diario</Text>
          <Switch
            value={r.on}
            onValueChange={(on) => update({ reminder: { ...r, on } })}
            trackColor={{ false: colors.graphite200, true: colors.sky }}
            thumbColor={colors.white}
            accessibilityLabel="Recordatorio diario"
          />
        </View>
        <View style={[s.chips, !r.on && { opacity: 0.4 }]} pointerEvents={r.on ? 'auto' : 'none'}>
          {TIMES.map((t) => {
            const on = t === r.time;
            return (
              <Pressable
                key={t}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                onPress={() => {
                  tap();
                  update({ reminder: { ...r, time: t } });
                }}
                style={[s.chip, on && s.on]}
              >
                <Text style={s.chipText}>{t}</Text>
              </Pressable>
            );
          })}
        </View>
        <View>
          <SectionLabel>Así se verá</SectionLabel>
          <View style={[s.notif, !r.on && { opacity: 0.4 }]}>
            <Image
              source={require('@/assets/images/logo/mepreparo-icon.png')}
              style={s.notifIcon}
              contentFit="contain"
            />
            <View style={{ flex: 1, gap: 3 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={s.notifApp}>MePreparo</Text>
                <Text style={s.notifTime}>{r.time}</Text>
              </View>
              <Text style={s.notifText}>
                Hola{name ? `, ${name}` : ''}. Tus {minutes} minutos de hoy te esperan.
              </Text>
            </View>
          </View>
        </View>
        <Text style={s.note}>Te pediremos permiso para avisarte después de tu primer ejercicio, no antes.</Text>
      </View>
    </StepLayout>
  );
}

const s = StyleSheet.create({
  hero: { height: 230, marginHorizontal: -20, marginTop: -8, marginBottom: 12, overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  minCard: {
    width: '48%',
    flexGrow: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 2,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  on: { borderColor: colors.sky, backgroundColor: colors.sky100 },
  minBig: { fontFamily: fonts['poppins-bold'], fontSize: 24, lineHeight: 30, color: colors.ink },
  minSub: { fontFamily: fonts['poppins-medium'], fontSize: 13, lineHeight: 18, color: colors.graphite },
  note: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 21, color: colors.graphite },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  switchLabel: { fontFamily: fonts['poppins-medium'], fontSize: 16, lineHeight: 22, color: colors.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 44,
    minWidth: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
  },
  chipText: { fontFamily: fonts['poppins-medium'], fontSize: 15, lineHeight: 20, color: colors.ink },
  notif: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 14,
  },
  notifIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.paper },
  notifApp: { fontFamily: fonts['poppins-semibold'], fontSize: 13, lineHeight: 18, color: colors.ink },
  notifTime: { fontFamily: fonts.poppins, fontSize: 13, lineHeight: 18, color: colors.graphite },
  notifText: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.ink },
});
