import { router } from 'expo-router';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GridBackground } from '@/components/ui/GridBackground';
import { IconButton } from '@/components/ui/IconButton';
import { Mascot } from '@/components/ui/Mascot';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import { logAttempt } from '@/data/attempts';
import { dayKey } from '@/engine/dates';
import { pct } from '@/engine/mastery';
import { hasPractice, lessonById, lessonsOf } from '@/features/content/catalog';
import { useOnboarding } from '@/features/onboarding/store';
import { unitMastery } from '@/features/progress/derived';
import { useProgress } from '@/features/progress/store';
import { goBack } from '@/lib/nav';
import { maybeAskForReminder, syncReminders } from '@/lib/notifications';
import { colors, fonts } from '@/theme/tokens';

import { type GradedEvent, StepView } from './StepView';

export function LessonScreen({ lessonId }: { lessonId: string }) {
  const found = lessonById(lessonId);
  const saved = useProgress((s) => s.lessons[lessonId]);
  const answer = useProgress((s) => s.answer);
  const setLessonStep = useProgress((s) => s.setLessonStep);
  const completeLesson = useProgress((s) => s.completeLesson);
  const answers = useOnboarding((s) => s.answers);

  // Retoma en el mismo paso si la lección quedó a medias (regla del producto).
  const [index, setIndex] = useState(() => (saved?.status === 'in-progress' ? Math.min(saved.step, (found?.lesson.steps.length ?? 1) - 1) : 0));
  const [done, setDone] = useState<null | { xp: number; bonus: number; before: number; after: number }>(null);
  const xpRef = useRef(0);
  const masteryBefore = useRef(found ? unitMastery(useProgress.getState(), answers, found.unit.id) : 0);

  // Marca la lección como "en curso" al abrirla, para ofrecer "continúa donde quedaste".
  useEffect(() => {
    if (found && useProgress.getState().lessons[lessonId]?.status !== 'completed') setLessonStep(lessonId, index);
    // Solo al abrir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  if (!found) {
    return (
      <Shell onClose={() => goBack()} progress={0}>
        <Text style={s.body}>No encontramos esta lección.</Text>
      </Shell>
    );
  }
  const { lesson, unit } = found;
  const step = lesson.steps[index]!;

  const onGraded = (e: GradedEvent) => {
    const ref = `lesson:${lesson.id}:${step.id}`;
    if (e.first) {
      const xp = answer({
        ref,
        kind: 'lesson',
        unitId: unit.id,
        lessonId: lesson.id,
        stepIndex: index,
        skill: step.skill,
        outcome: e.outcome,
        hints: e.hints,
        mistakeCode: e.grade.mistakeCode,
        answer: e.answer,
        notebook: 'prompt' in step ? { prompt: step.prompt, feedback: e.grade.feedback } : undefined,
      });
      xpRef.current += xp;
      return xp;
    }
    // Reintentos: se registran para mejorar el contenido, sin volver a contar para el dominio.
    logAttempt({
      day: dayKey(new Date()),
      ref,
      unitId: unit.id,
      lessonId: lesson.id,
      stepIndex: index,
      kind: 'lesson',
      outcome: e.grade.correct ? 'hinted' : 'wrong',
      hints: e.hints,
      mistakeCode: e.grade.mistakeCode,
      answer: e.answer,
      xp: 0,
    });
    return 0;
  };

  const next = () => {
    if (index + 1 < lesson.steps.length) {
      setLessonStep(lesson.id, index + 1);
      setIndex(index + 1);
      return;
    }
    const bonus = completeLesson(lesson.id);
    const after = unitMastery(useProgress.getState(), answers, unit.id);
    setDone({ xp: xpRef.current, bonus, before: masteryBefore.current, after });
    const reminder = answers.reminder;
    maybeAskForReminder(reminder, () => reminder && syncReminders({ ...reminder, activeToday: true }));
  };

  if (done) {
    const list = lessonsOf(unit.id);
    const nextLesson = list[list.findIndex((l) => l.id === lesson.id) + 1];
    return (
      <Shell onClose={() => goBack()} progress={1}>
        <Animated.View entering={FadeIn.duration(320)} style={s.doneWrap}>
          <Mascot pose="celebrando" height={170} pop cheer label="Equis celebra" />
          <Text style={s.doneTitle}>¡Lección completada!</Text>
          <Text style={s.body}>{lesson.title}</Text>
          <View style={s.stats}>
            <Card style={s.stat}>
              <Text style={s.statBig}>+{done.xp + done.bonus}</Text>
              <Text style={s.caption}>XP</Text>
            </Card>
            <Card style={s.stat}>
              <Text style={s.statBig}>
                {pct(done.before)} → {pct(done.after)} %
              </Text>
              <Text style={s.caption}>Dominio de la unidad</Text>
            </Card>
          </View>
        </Animated.View>
        <View style={{ flex: 1 }} />
        <View style={{ gap: 8 }}>
          {nextLesson ? (
            <Button label="Siguiente lección" arrow onPress={() => router.replace(`/leccion/${nextLesson.id}`)} />
          ) : null}
          {hasPractice(unit.id) ? (
            <Button
              label="Practicar 5 más"
              variant={nextLesson ? 'secondary' : 'primary'}
              onPress={() => router.replace({ pathname: '/practica/[unit]', params: { unit: unit.id, count: '5' } })}
            />
          ) : null}
          <Button label="Volver" variant="ghost" onPress={() => goBack()} />
        </View>
      </Shell>
    );
  }

  return (
    <Shell onClose={() => goBack()} progress={index / lesson.steps.length} label={`${index + 1}/${lesson.steps.length}`}>
      <StepView key={step.id} step={step} onGraded={onGraded} onContinue={next} refId={`lesson:${lesson.id}:${step.id}`} />
    </Shell>
  );
}

/** Marco del reproductor: cerrar (el progreso ya está guardado), barra de pasos y contenido con scroll. */
export function Shell({
  children,
  onClose,
  progress,
  label,
}: {
  children: ReactNode;
  onClose: () => void;
  progress: number;
  label?: string;
}) {
  return (
    <View style={s.root}>
      <GridBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={s.header}>
          <IconButton icon="x" label="Cerrar (tu avance queda guardado)" onPress={onClose} />
          <View style={{ flex: 1 }}>
            <ProgressBar value={progress} height={10} />
          </View>
          <Text style={s.counter}>{label ?? ''}</Text>
        </View>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, minHeight: 56 },
  counter: { fontFamily: fonts['poppins-semibold'], fontSize: 14, color: colors.graphite, minWidth: 44, textAlign: 'right', paddingRight: 8 },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, width: '100%', maxWidth: 720, alignSelf: 'center' },
  body: { fontFamily: fonts.poppins, fontSize: 16, lineHeight: 24, color: colors.graphite, textAlign: 'center' },
  doneWrap: { alignItems: 'center', gap: 10, paddingTop: 12 },
  doneTitle: { fontFamily: fonts['poppins-bold'], fontSize: 28, lineHeight: 34, color: colors.ink },
  stats: { flexDirection: 'row', gap: 10, marginTop: 10, alignSelf: 'stretch' },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statBig: { fontFamily: fonts['poppins-bold'], fontSize: 22, lineHeight: 28, color: colors.ink },
  caption: { fontFamily: fonts.poppins, fontSize: 13, lineHeight: 18, color: colors.graphite, textAlign: 'center' },
});
