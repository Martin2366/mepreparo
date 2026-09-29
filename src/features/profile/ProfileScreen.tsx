import Constants from 'expo-constants';
import { router } from 'expo-router';
import * as Updates from 'expo-updates';
import { Alert, Linking, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { PRICES } from '@/engine/entitlements';
import { AccountCard, DeleteAccountButton } from '@/features/cloud/AccountCard';
import { careerById, institutionById } from '@/features/onboarding/admission';
import { formatScore } from '@/features/onboarding/model';
import { useOnboarding } from '@/features/onboarding/store';
import { sessionOf } from '@/features/plan/context';
import { useDashboard } from '@/features/progress/derived';
import { PLAY_SUBSCRIPTIONS } from '@/features/premium/PlansScreen';
import { usePremiumStore } from '@/features/premium/store';
import { useProgress } from '@/features/progress/store';
import { Section } from '@/features/shell/TabScreen';
import { FullScreen } from '@/features/shell/FullScreen';
import { clp, longDate } from '@/lib/format';
import { colors, fonts } from '@/theme/tokens';

const MINUTES = [10, 20, 30, 45];
const TESTS: Record<string, string> = { m1: 'M1', m2: 'M2', lectora: 'Lectora', ciencias: 'Ciencias', historia: 'Historia' };

/** Perfil (PRD §12), desde el avatar: tu PAES, plan y compras, estudio, cuenta con Google y privacidad. */
export function ProfileScreen() {
  const d = useDashboard();
  const a = d.answers;
  const update = useOnboarding((s) => s.update);
  const restart = useOnboarding((s) => s.restart);
  const resetOnboarding = useOnboarding((s) => s.reset);
  const resetProgress = useProgress((s) => s.reset);
  const career = careerById(a.careerId);
  const inst = institutionById(a.institutionId);
  const session = sessionOf(a);
  const pass = usePremiumStore((st) => st.pass);
  const subscriptionUntil = usePremiumStore((st) => st.subscriptionUntil);

  const redo = () =>
    Alert.alert('Cambiar mi PAES y mi meta', 'Vuelves a las preguntas del inicio con tus respuestas marcadas. Tu progreso, tu racha y tu XP se mantienen.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Continuar',
        onPress: () => {
          restart();
          router.replace('/onboarding');
        },
      },
    ]);

  const plan = d.planState;
  const planText =
    plan.kind === 'trial'
      ? `Prueba Premium · ${plan.daysLeft === 1 ? 'último día' : `quedan ${plan.daysLeft} días`}`
      : plan.kind === 'premium'
        ? pass && pass.until === plan.until
          ? `Pase PAES hasta el ${longDate(pass.until)}`
          : `Premium mensual · se renueva el ${longDate(plan.until ?? '')}`
        : 'Plan gratis';

  return (
    <FullScreen title="Perfil">
      <View style={s.head}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{(a.name.trim()[0] ?? 'T').toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={s.h2}>{a.name.trim() || 'Estudiante'}</Text>
          <View style={s.row}>
            <Chip label={`Nivel ${d.level.level}`} tone="ink" />
            <Text style={s.caption}>{d.level.name}</Text>
          </View>
        </View>
      </View>

      <Section title="Tu PAES">
        <Card style={{ gap: 12 }}>
          <Row icon="graduation-cap" label="Meta" value={career ? `${career.name}${inst ? ` · ${inst.short ?? inst.name}` : ''}` : 'Por definir'} />
          <Row icon="target" label="Puntaje meta" value={a.target ? formatScore(a.target, 1) : 'Por definir'} />
          <Row icon="calendar" label="Fecha" value={session ? `${session.label} (${session.when})` : 'Por definir'} />
          <Row icon="book" label="Pruebas" value={a.tests?.length ? a.tests.map((t) => TESTS[t] ?? t).join(', ') : 'Por definir'} />
          <Button label="Cambiar mis respuestas" variant="secondary" onPress={redo} />
        </Card>
      </Section>

      <Section title="Tu plan">
        <Card style={{ gap: 10 }}>
          <View style={s.row}>
            <Chip label={plan.kind === 'free' ? 'Gratis' : 'Premium'} tone={plan.kind === 'free' ? 'neutral' : 'premium'} />
            <Text style={s.strong}>{planText}</Text>
          </View>
          <Text style={s.small}>
            Lo esencial es gratis para siempre: todas las lecciones y la explicación de cada error. Premium cuesta {clp(PRICES.monthly)} al
            mes o {clp(PRICES.pass)} el Pase PAES (un solo pago, sin renovación). Nunca cobramos sin que toques «Pagar».
          </Text>
          <Button label={plan.kind === 'premium' ? 'Ver mi Premium' : 'Ver planes'} variant="secondary" onPress={() => router.push('/planes')} />
          {subscriptionUntil && plan.kind === 'premium' && !(pass && pass.until === plan.until) ? (
            <Button label="Gestionar o cancelar en Google Play" variant="ghost" onPress={() => Linking.openURL(PLAY_SUBSCRIPTIONS)} />
          ) : null}
        </Card>
      </Section>

      <Section title="Estudio">
        <Card style={{ gap: 12 }}>
          <Text style={s.strong}>Meta diaria</Text>
          <View style={s.row}>
            {MINUTES.map((m) => (
              <Tappable
                key={m}
                accessibilityRole="button"
                accessibilityState={{ selected: (a.minutes ?? 20) === m }}
                onPress={() => update({ minutes: m })}
                style={[s.pill, (a.minutes ?? 20) === m && s.pillOn]}
              >
                <Text style={s.pillText}>{m} min</Text>
              </Tappable>
            ))}
          </View>
          <View style={s.row}>
            <Icon name="bell" size={20} color={colors.graphite} />
            <Text style={[s.body, { flex: 1 }]}>
              {a.reminder?.on ? `Recordatorio a las ${a.reminder.time}` : 'Sin recordatorio'}
            </Text>
            <Button
              label={a.reminder?.on ? 'Apagar' : 'Activar'}
              variant="ghost"
              onPress={() => update({ reminder: { on: !a.reminder?.on, time: a.reminder?.time ?? '19:00' } })}
            />
          </View>
        </Card>
      </Section>

      <Section title="Cuenta y respaldo">
        <AccountCard />
      </Section>

      <Section title="Ayuda y privacidad">
        <Card style={{ gap: 4 }}>
          <Row icon="flag" label="Reportar un error de contenido" value="Pronto: desde cada ejercicio" />
          <Row icon="shield-check" label="Privacidad" value="Tu apodo solo vive en este teléfono" />
          <DeleteAccountButton />
        </Card>
      </Section>

      {__DEV__ ? (
        <Section title="Desarrollo">
          <Card style={{ gap: 8 }}>
            <Button label="Ver matemática legible" variant="secondary" onPress={() => router.push('/dev/math')} />
            <Button
              label="Borrar progreso y onboarding"
              variant="ghost"
              onPress={() => {
                resetProgress();
                resetOnboarding();
                router.replace('/onboarding');
              }}
            />
          </Card>
        </Section>
      ) : null}

      <Text style={[s.caption, { textAlign: 'center' }]}>
        v{Constants.expoConfig?.version ?? '—'} · canal {Updates.channel || 'dev'}
      </Text>
    </FullScreen>
  );
}

function Row({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={[s.row, { alignItems: 'flex-start' }]}>
      <Icon name={icon} size={20} color={colors.graphite} />
      <View style={{ flex: 1 }}>
        <Text style={s.caption}>{label}</Text>
        <Text style={s.body}>{value}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts['poppins-bold'], fontSize: 26, color: colors.white },
  h2: { fontFamily: fonts['poppins-bold'], fontSize: 24, lineHeight: 30, color: colors.ink },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink },
  body: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 21, color: colors.ink },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
  caption: { fontFamily: fonts.poppins, fontSize: 12, lineHeight: 17, color: colors.graphite },
  pill: {
    flex: 1,
    minHeight: 48,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.graphite200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  pillOn: { backgroundColor: colors.sky100, borderColor: colors.sky },
  pillText: { fontFamily: fonts['poppins-semibold'], fontSize: 14, color: colors.ink },
});
