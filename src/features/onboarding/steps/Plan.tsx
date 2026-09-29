import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import { enterGoogle } from '@/features/cloud/AccountCard';
import { linkGoogle } from '@/features/cloud/auth';
import { planOf } from '@/features/plan/context';
import { confirm } from '@/lib/confirm';
import { dur, easeOut } from '@/theme/motion';
import { colors, fonts } from '@/theme/tokens';

import { CountUp, StepLayout } from '../components';
import { formatScore, ONBOARDING_XP } from '../model';
import { useOnboarding } from '../store';
import { QUESTIONS } from './Diagnostic';
import type { StepProps } from './types';

export function GeneratingStep({ next }: StepProps) {
  const a = useOnboarding((st) => st.answers);
  const p = planOf(a);
  const [gen, setGen] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setGen((g) => g + 1), 800);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (gen > 4) next();
  }, [gen, next]);

  const items = [
    p.done ? 'Revisando tu diagnóstico' : 'Leyendo tus respuestas',
    `Ajustando a tu meta de ${formatScore(p.target, 0)}`,
    `Priorizando ${p.focus.slice(0, 2).join(' y ')}`,
    `Repartiendo ${p.weeks} semanas`,
  ];
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <View style={s.center}>
        <Mascot pose="estudiando" height={200} />
        <Text style={s.title}>Generando tu plan</Text>
        <View style={{ width: 240 }}>
          <ProgressBar value={Math.min(1, gen / 4)} />
        </View>
        <View style={{ gap: 10, alignItems: 'flex-start', marginTop: 6 }}>
          {items.map((label, i) => {
            const ok = gen > i;
            return (
              <View key={label} style={s.genRow}>
                <Icon name={ok ? 'check' : 'circle-dashed'} size={18} color={ok ? colors.sky700 : colors.graphite300} />
                <Text style={[s.genText, { color: ok ? colors.ink : colors.graphite300 }]}>{label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

export function PlanStep({ next }: StepProps) {
  const a = useOnboarding((st) => st.answers);
  const update = useOnboarding((st) => st.update);
  const p = planOf(a);
  const name = a.name.trim();

  // Recompensa por completar el inicio: se entrega una sola vez (idempotente).
  useEffect(() => {
    if (a.xp === undefined) {
      update({ xp: ONBOARDING_XP });
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [a.xp, update]);

  const pct = (n: number) => `${Math.max(0, Math.min(100, ((n - 400) / 600) * 100))}%` as const;
  const gap = Math.max(0, p.target - p.est);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={[]}>
      <StepLayout primary={{ label: 'Continuar', onPress: next }}>
        <View style={s.planHead}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={s.overline}>TU PLAN M1</Text>
            <Text style={s.h2}>{name ? `${name}, tu plan está listo.` : 'Tu plan está listo.'}</Text>
          </View>
          <Image
            source={require('@/assets/images/illustrations/equis-cuaderno-coral.webp')}
            style={{ height: 110, aspectRatio: 519 / 640 }}
            contentFit="contain"
            accessibilityLabel="Equis con su cuaderno"
          />
        </View>

        {/* Recompensa */}
        <Animated.View entering={ZoomIn.springify().damping(13).delay(200)}>
          <View style={s.reward}>
            <View style={s.gem}>
              <Icon name="gem" size={24} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rewardTitle}>¡Primer logro desbloqueado!</Text>
              <Text style={s.rewardSub}>Por armar tu plan. Tu racha parte hoy.</Text>
            </View>
            <CountUp to={ONBOARDING_XP} format={(n) => `+${Math.round(n)} XP`} delay={450} style={s.rewardXp} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(dur.slow).delay(250).easing(easeOut)} style={s.card}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={s.small}>Estimado M1</Text>
              <CountUp to={p.est} format={(n) => String(Math.round(n))} style={s.big} />
            </View>
            <View style={{ marginBottom: 8 }}>
              <Icon name="arrow-right" size={22} color={colors.graphite} />
            </View>
            <View style={{ flex: 1, gap: 4, alignItems: 'flex-end' }}>
              <Text style={s.small}>Tu meta</Text>
              <Text style={[s.big, { color: colors.sky700 }]}>{formatScore(p.target, 0)}</Text>
            </View>
          </View>
          <View style={s.track}>
            <View style={[s.fill, { width: pct(p.est) }]} />
            <View style={[s.mark, { left: pct(p.target) }]} />
          </View>
          <Text style={s.caption}>
            {p.done
              ? `Según tu diagnóstico: ${p.correct} de ${QUESTIONS.length} correctas. Es orientativo y se afina a medida que practicas.`
              : 'Estimado inicial. Cuando hagas el diagnóstico lo afinamos.'}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(dur.slow).delay(350).easing(easeOut)} style={s.stats}>
          <View style={s.stat}>
            <Text style={s.statBig}>{p.weeks}</Text>
            <Text style={s.small}>{p.hasDate ? 'semanas hasta tu PAES' : 'semanas (fecha estimada)'}</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.statBig}>{p.minutes} min</Text>
            <Text style={s.small}>{a.reminder?.on ? `al día · aviso ${a.reminder.time}` : 'al día'}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(dur.slow).delay(450).easing(easeOut)} style={s.focus}>
          <Text style={[s.overline, { color: colors.graphite }]}>FOCO</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {p.focus.map((f) => (
              <Text key={f} style={s.badge}>
                {f}
              </Text>
            ))}
          </View>
          <Text style={s.body}>
            {gap > 0
              ? `Para subir ${gap} puntos, apuntamos a unos ${Math.max(1, Math.round(gap / p.weeks))} por semana. Un paso a la vez.`
              : 'Ya estás en tu meta. Vamos a asegurarla con práctica constante.'}
          </Text>
        </Animated.View>
      </StepLayout>
    </SafeAreaView>
  );
}

const PERKS: { icon: IconName; text: string }[] = [
  { icon: 'calendar-check', text: 'Tu plan completo, semana a semana' },
  { icon: 'lightbulb', text: 'Explicaciones paso a paso en cada ejercicio' },
  { icon: 'timer', text: 'Ensayos PAES con tiempo real' },
];

export function PremiumStep({ next }: StepProps) {
  const update = useOnboarding((st) => st.update);
  const startedAt = useOnboarding((st) => st.answers.trialStartedAt);
  // La prueba la gestiona la app: sin tarjeta y sin cobro automático al terminar. Se activa una sola vez.
  const start = () => {
    update({ trialStartedAt: startedAt ?? new Date().toISOString() });
    next();
  };
  const [busy, setBusy] = useState(false);
  // Respaldo con Google (mismo flujo que el Perfil). Si esa cuenta ya tenía progreso, se ofrece entrar a ella.
  const google = async () => {
    update({ trialStartedAt: startedAt ?? new Date().toISOString() });
    setBusy(true);
    const r = await linkGoogle();
    setBusy(false);
    if (r === 'ok') return next();
    if (r === 'cancelled') return;
    if (r === 'conflict') {
      const ok = await confirm(
        'Esa cuenta de Google ya tiene progreso',
        'Puedes entrar a esa cuenta: juntamos lo de este teléfono con lo que ya tenías respaldado.',
        'Usar mi cuenta de Google',
      );
      if (ok && (await enterGoogle())) next();
      return;
    }
    Alert.alert('No se pudo conectar con Google', 'Puedes continuar sin cuenta y respaldar después desde tu perfil.');
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={[]}>
      <StepLayout
        primary={{ label: busy ? 'Conectando…' : 'Iniciar con Google', onPress: google, arrow: false, disabled: busy }}
        secondary={{ label: 'Continuar sin cuenta', onPress: start, variant: 'secondary' }}
      >
        <View style={{ alignItems: 'center', gap: 6, paddingTop: 16 }}>
          <Image
            source={require('@/assets/images/illustrations/equis-cuaderno-abrazo.webp')}
            style={{ height: 200, aspectRatio: 475 / 640 }}
            contentFit="contain"
            accessibilityLabel="Equis abrazando su cuaderno"
          />
          <Text style={s.premiumBadge}>Premium</Text>
          <Text style={[s.h2, { textAlign: 'center', fontSize: 28, lineHeight: 34 }]}>
            7 días de Premium gratis. Sin tarjeta.
          </Text>
        </View>
        <View style={[s.card, { marginTop: 18, gap: 12 }]}>
          {PERKS.map((pk) => (
            <View key={pk.text} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={s.perkIcon}>
                <Icon name={pk.icon} size={16} color={colors.sky700} />
              </View>
              <Text style={[s.body, { flex: 1, fontFamily: fonts['poppins-medium'] }]}>{pk.text}</Text>
            </View>
          ))}
        </View>
        <Text style={[s.caption, { textAlign: 'center', marginTop: 14 }]}>
          Al terminar los 7 días no se cobra nada. Sin cuenta, tu progreso queda solo en este teléfono.
        </Text>
      </StepLayout>
    </SafeAreaView>
  );
}

export function DoneStep({ next }: StepProps) {
  const a = useOnboarding((st) => st.answers);
  const p = planOf(a);
  const name = a.name.trim();
  return (
    <SafeAreaView style={{ flex: 1 }} edges={[]}>
      <StepLayout primary={{ label: 'Ir a hoy', onPress: next, arrow: false }}>
        <View style={s.center}>
          <Mascot pose="celebrando" height={230} pop cheer label="Equis celebra" />
          <Animated.View entering={FadeIn.duration(dur.slow).delay(200)} style={{ alignItems: 'center', gap: 10 }}>
            <Text style={[s.title, { fontSize: 30, lineHeight: 36 }]}>
              {name ? `Todo listo, ${name}.` : 'Todo listo.'}
            </Text>
            <Text style={[s.sub, { maxWidth: 300 }]}>
              Hoy toca {p.focus[0]!.toLowerCase()}. {p.minutes} minutos, a tu ritmo.
            </Text>
            <Text style={s.xpNote}>Llevas {a.xp ?? ONBOARDING_XP} XP</Text>
          </Animated.View>
        </View>
      </StepLayout>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, paddingHorizontal: 20 },
  title: { fontFamily: fonts['poppins-bold'], fontSize: 26, lineHeight: 32, color: colors.ink, textAlign: 'center' },
  sub: { fontFamily: fonts.poppins, fontSize: 16, lineHeight: 24, color: colors.graphite, textAlign: 'center' },
  genRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  genText: { fontFamily: fonts['poppins-medium'], fontSize: 15, lineHeight: 20 },
  planHead: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 12 },
  overline: {
    fontFamily: fonts['poppins-semibold'],
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.7,
    color: colors.sky700,
  },
  h2: { fontFamily: fonts['poppins-bold'], fontSize: 26, lineHeight: 32, color: colors.ink },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.coral50,
    borderWidth: 1.5,
    borderColor: colors.coral,
  },
  gem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardTitle: { fontFamily: fonts['poppins-semibold'], fontSize: 15, lineHeight: 21, color: colors.ink },
  rewardSub: { fontFamily: fonts.poppins, fontSize: 13, lineHeight: 18, color: colors.graphite },
  rewardXp: { fontFamily: fonts['poppins-bold'], fontSize: 22, lineHeight: 28, color: colors.ink },
  card: {
    marginTop: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  small: { fontFamily: fonts['poppins-medium'], fontSize: 13, lineHeight: 17, color: colors.graphite },
  big: { fontFamily: fonts['poppins-bold'], fontSize: 40, lineHeight: 44, color: colors.ink },
  track: { height: 10, borderRadius: 999, backgroundColor: colors.graphite100, justifyContent: 'center' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 999, backgroundColor: colors.sky },
  mark: { position: 'absolute', width: 4, height: 20, marginLeft: -2, borderRadius: 2, backgroundColor: colors.ink },
  caption: { fontFamily: fonts.poppins, fontSize: 13, lineHeight: 19, color: colors.graphite },
  stats: { flexDirection: 'row', gap: 10, marginTop: 10 },
  stat: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 2,
  },
  statBig: { fontFamily: fonts['poppins-bold'], fontSize: 28, lineHeight: 32, color: colors.ink },
  focus: {
    marginTop: 10,
    backgroundColor: colors.sky50,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
  },
  badge: {
    fontFamily: fonts['poppins-semibold'],
    fontSize: 13,
    lineHeight: 18,
    color: colors.sky700,
    backgroundColor: colors.sky100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  body: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 21, color: colors.ink },
  premiumBadge: {
    fontFamily: fonts['poppins-semibold'],
    fontSize: 12,
    lineHeight: 16,
    color: colors.coral700,
    backgroundColor: colors.coral50,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  perkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.sky100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpNote: { fontFamily: fonts['poppins-semibold'], fontSize: 14, lineHeight: 20, color: colors.sky700 },
});
