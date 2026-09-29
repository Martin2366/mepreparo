import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { Text } from '@/components/ui/Text';
import { dayKey } from '@/engine/dates';
import { PRICES } from '@/engine/entitlements';
import { endOfTrialOffer, trialEndsAt } from '@/engine/premium';
import { useExams } from '@/features/exams/store';
import { useOnboarding } from '@/features/onboarding/store';
import { useProgress } from '@/features/progress/store';
import { FullScreen } from '@/features/shell/FullScreen';
import { dateTime, lastMinute } from '@/lib/format';
import { goBack } from '@/lib/nav';
import { colors, fonts } from '@/theme/tokens';

import { TRIAL_DAYS, usePremiumStore } from './store';

const KEEP = ['Todas las lecciones y mini-clases', 'La explicación de cada error', 'Tu racha, tu XP y tu nivel', 'Tus logros y tu cuaderno de errores', 'Práctica diaria y un ensayo completo al mes'];

/**
 * Fin de la prueba (PRD §4.1): en tono amable, qué te dio Premium esta semana, qué conservas gratis y la oferta de
 * 48 h reales con su hora exacta. «Seguir gratis» igual de visible. Se muestra una sola vez.
 */
export function TrialEndScreen() {
  const trialStartedAt = useOnboarding((s) => s.answers.trialStartedAt);
  const offerUsed = usePremiumStore((s) => s.offerUsed);
  const markNotice = usePremiumStore((s) => s.markNotice);
  const lessons = useProgress((s) => s.lessons);
  const xpByDay = useProgress((s) => s.xpByDay);
  const history = useExams((s) => s.history);

  useEffect(() => markNotice('ended'), [markNotice]);

  const from = trialStartedAt ? dayKey(new Date(trialStartedAt)) : '';
  const to = trialStartedAt ? dayKey(trialEndsAt(trialStartedAt, TRIAL_DAYS)) : '';
  const inTrial = (d?: string) => !!d && d.slice(0, 10) >= from && d.slice(0, 10) < to;
  const week = {
    lessons: Object.values(lessons).filter((l) => l.status === 'completed' && inTrial(l.completedAt)).length,
    exams: history.filter((h) => inTrial(dayKey(new Date(h.finishedAt)))).length,
    xp: Object.entries(xpByDay)
      .filter(([d]) => inTrial(d))
      .reduce((a, [, v]) => a + v, 0),
  };
  const offer = endOfTrialOffer(trialStartedAt, new Date(), { trialDays: TRIAL_DAYS, offerHours: PRICES.offerHours, used: offerUsed });

  const footer = (
    <View style={{ gap: 8 }}>
      {offer?.active ? <Button label={`Ver la oferta del ${PRICES.offerPct} %`} onPress={() => router.replace('/planes')} /> : null}
      <Button label="Seguir gratis" variant={offer?.active ? 'secondary' : 'primary'} onPress={() => goBack()} />
    </View>
  );

  return (
    <FullScreen title="Tu prueba terminó" footer={footer}>
      <View style={s.center}>
        <Mascot pose="apoyo" height={130} float={false} />
        <Text style={s.h1}>Gracias por probar Premium</Text>
        <Text style={s.body}>No se cobró nada y no se cobrará. Sigues con el plan gratis.</Text>
      </View>

      <Card padding={14} style={{ gap: 6 }}>
        <Text style={s.strong}>Tu semana</Text>
        <Text style={s.body}>
          {week.lessons} {week.lessons === 1 ? 'lección' : 'lecciones'} · {week.exams} {week.exams === 1 ? 'ensayo' : 'ensayos'} · {week.xp} XP
        </Text>
      </Card>

      <Card padding={14} style={{ gap: 10 }}>
        <Text style={s.strong}>Esto sigue siendo tuyo, gratis</Text>
        {KEEP.map((k) => (
          <View key={k} style={s.row}>
            <Icon name="check" size={20} color={colors.success700} />
            <Text style={[s.body, { flex: 1 }]}>{k}</Text>
          </View>
        ))}
      </Card>

      {offer?.active ? (
        <Card tone="coral" padding={14} style={{ gap: 4 }}>
          <Text style={s.strong}>{PRICES.offerPct} % de descuento, una sola vez</Text>
          <Text style={s.small}>En el primer mes o en el Pase PAES. Vale hasta el {dateTime(lastMinute(offer.endsAt))}.</Text>
        </Card>
      ) : null}
    </FullScreen>
  );
}

const s = StyleSheet.create({
  center: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  h1: { fontFamily: fonts['poppins-bold'], fontSize: 24, lineHeight: 30, color: colors.ink, textAlign: 'center' },
  body: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 22, color: colors.ink, textAlign: 'left' },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
});
