import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/ui/Mascot';
import { Text } from '@/components/ui/Text';
import { logAttempt } from '@/data/attempts';
import { dayKey } from '@/engine/dates';
import { useHasPremium } from '@/features/premium/store';
import { dueItems } from '@/engine/review';
import { Shell } from '@/features/lesson-player/LessonScreen';
import { type GradedEvent, StepView } from '@/features/lesson-player/StepView';
import { useProgress } from '@/features/progress/store';
import { goBack } from '@/lib/nav';
import { colors, fonts } from '@/theme/tokens';

import { freeNotebookFrom, stepFromRef } from './review';

const SESSION = 5;

/** Repaso espaciado del cuaderno de errores: hasta 5 errores que vencen hoy. */
export function ReviewScreen() {
  const today = dayKey(new Date());
  const premium = useHasPremium();
  const answer = useProgress((s) => s.answer);
  // La lista se fija al abrir: responder cambia las fechas, pero la sesión no debe saltar.
  const [items] = useState(() => {
    const st = useProgress.getState();
    const from = freeNotebookFrom(today);
    return dueItems(st.reviews, today)
      .filter((r) => premium || r.addedOn >= from)
      .map((r) => ({ ref: r.ref, unitId: st.notebook[r.ref]?.unitId, step: stepFromRef(r.ref) }))
      .filter((x): x is { ref: string; unitId: string | undefined; step: NonNullable<typeof x.step> } => !!x.step)
      .slice(0, SESSION);
  });
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const current = useMemo(() => items[i], [items, i]);

  if (!current) {
    return (
      <Shell onClose={() => goBack()} progress={1}>
        <View style={s.center}>
          <Mascot pose={items.length ? 'celebrando' : 'descansando'} height={150} />
          <Text style={s.title}>{items.length ? 'Repaso listo' : 'Nada que repasar hoy'}</Text>
          <Text style={s.body}>
            {items.length
              ? `Acertaste ${correct} de ${items.length}. Los que fallaste vuelven mañana; los que acertaste, más adelante.`
              : 'Cuando te equivoques en algo, volverá aquí justo cuando más sirve repasarlo.'}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <Button label="Volver" onPress={() => goBack()} />
      </Shell>
    );
  }

  const onGraded = (e: GradedEvent) => {
    if (!e.first) {
      logAttempt({ day: today, ref: current.ref, unitId: current.unitId, kind: 'review', outcome: e.grade.correct ? 'hinted' : 'wrong', hints: e.hints, answer: e.answer, xp: 0 });
      return 0;
    }
    if (e.grade.correct) setCorrect((n) => n + 1);
    return answer({
      ref: current.ref,
      kind: 'review',
      unitId: current.unitId,
      skill: current.step.skill,
      outcome: e.outcome,
      hints: e.hints,
      mistakeCode: e.grade.mistakeCode,
      answer: e.answer,
      notebook: 'prompt' in current.step ? { prompt: current.step.prompt, feedback: e.grade.feedback } : undefined,
    });
  };

  return (
    <Shell onClose={() => goBack()} progress={i / items.length} label={`${i + 1}/${items.length}`}>
      <Text style={s.overline}>CUADERNO DE ERRORES · REPASO</Text>
      <StepView key={current.ref} step={current.step} onGraded={onGraded} onContinue={() => setI(i + 1)} continueLabel="Siguiente" refId={current.ref} />
    </Shell>
  );
}

const s = StyleSheet.create({
  center: { alignItems: 'center', gap: 10, paddingTop: 16 },
  title: { fontFamily: fonts['poppins-bold'], fontSize: 24, lineHeight: 30, color: colors.ink, textAlign: 'center' },
  body: { fontFamily: fonts.poppins, fontSize: 16, lineHeight: 24, color: colors.graphite, textAlign: 'center' },
  overline: { fontFamily: fonts['poppins-semibold'], fontSize: 12, letterSpacing: 1.7, color: colors.sky700, marginBottom: 10 },
});
