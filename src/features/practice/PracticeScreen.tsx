import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Mascot } from '@/components/ui/Mascot';
import { Text } from '@/components/ui/Text';
import { logAttempt } from '@/data/attempts';
import { dayKey } from '@/engine/dates';
import { PRICES } from '@/engine/entitlements';
import { clampDifficulty, type Difficulty, type Exercise, GENERATORS, nextDifficulty } from '@/engine/generators';
import type { Outcome } from '@/engine/xp';
import { unitRef } from '@/features/content/catalog';
import { type GradedEvent, StepView } from '@/features/lesson-player/StepView';
import { Shell } from '@/features/lesson-player/LessonScreen';
import { useAllowance } from '@/features/progress/allowance';
import { useProgress } from '@/features/progress/store';
import { clp } from '@/lib/format';
import { colors, fonts } from '@/theme/tokens';

const newSeed = () => Math.floor(Math.random() * 2_000_000_000);

/**
 * Práctica por tema (PRD §9): ejercicios generados sin fin por las plantillas de la unidad, verificados por
 * el motor, con dificultad adaptativa (3 limpios suben, 2 errores bajan). Gratis: 20 al día.
 */
export function PracticeScreen({ unitId, count }: { unitId: string; count?: number }) {
  const ref = unitRef(unitId);
  const generators = useMemo(() => (ref?.unit.generators ?? []).map((id) => GENERATORS[id]).filter((g) => !!g), [ref]);
  const savedDifficulty = useProgress((s) => s.practiceDifficulty[unitId]);
  const setDifficulty = useProgress((s) => s.setDifficulty);
  const answer = useProgress((s) => s.answer);
  const practice = useAllowance('practice');

  const [difficulty, setD] = useState<Difficulty>(savedDifficulty ?? 2);
  const [exercise, setExercise] = useState<Exercise | null>(() => make(generators, 0, savedDifficulty ?? 2));
  const [done, setDone] = useState(0);
  const [xp, setXp] = useState(0);
  // Si ya no quedan ejercicios gratis, se avisa al pasar al siguiente (nunca en medio de un ejercicio).
  const [stopped, setStopped] = useState(!practice.ok);
  const recent = useRef<Outcome[]>([]);
  const turn = useRef(0);
  const target = count && count > 0 ? count : undefined;

  if (!ref || generators.length === 0 || !exercise) {
    return (
      <Shell onClose={() => router.back()} progress={0}>
        <Text style={s.body}>Todavía no hay práctica para esta unidad. Muy pronto.</Text>
      </Shell>
    );
  }

  const onGraded = (e: GradedEvent) => {
    const gref = `gen:${exercise.ref}`;
    if (!e.first) {
      logAttempt({
        day: dayKey(new Date()),
        ref: gref,
        unitId,
        kind: 'practice',
        outcome: e.grade.correct ? 'hinted' : 'wrong',
        hints: e.hints,
        mistakeCode: e.grade.mistakeCode,
        answer: e.answer,
        xp: 0,
      });
      return 0;
    }
    practice.use();
    const gained = answer({
      ref: gref,
      kind: 'practice',
      unitId,
      skill: GENERATORS[exercise.generator]?.skill,
      outcome: e.outcome,
      hints: e.hints,
      mistakeCode: e.grade.mistakeCode,
      answer: e.answer,
      notebook: { prompt: exercise.step.prompt, feedback: e.grade.feedback },
    });
    setXp((v) => v + gained);
    // Dificultad adaptativa: se evalúa sobre los resultados desde el último cambio.
    recent.current = [...recent.current, e.outcome];
    const nd = nextDifficulty(difficulty, recent.current);
    if (nd !== difficulty) {
      recent.current = [];
      setD(nd);
      setDifficulty(unitId, nd);
    }
    return gained;
  };

  const next = () => {
    setDone((n) => n + 1);
    if (!practice.ok) {
      setStopped(true);
      return;
    }
    turn.current += 1;
    setExercise(make(generators, turn.current, difficulty));
  };

  const reachedTarget = target !== undefined && done >= target;
  const blocked = stopped;

  if (reachedTarget || blocked) {
    return (
      <Shell onClose={() => router.back()} progress={1}>
        <View style={s.center}>
          <Mascot pose={blocked ? 'descansando' : 'celebrando'} height={150} />
          <Text style={s.title}>{blocked ? 'Por hoy, suficiente práctica gratis' : '¡Buen trabajo!'}</Text>
          <Text style={s.body}>
            {done} {done === 1 ? 'ejercicio' : 'ejercicios'} · +{xp} XP · nivel de dificultad {difficulty} de 5
          </Text>
        </View>
        {blocked ? (
          <Card tone="paper" style={{ gap: 8, marginTop: 16 }}>
            <Text style={s.bodyStrong}>Hoy hiciste tus {practice.unlimited ? '' : practice.max} ejercicios gratis.</Text>
            <Text style={s.small}>
              Mañana se recargan. Mientras, las lecciones siguen siendo gratis y sin límite. Con Premium practicas sin límite por {clp(PRICES.monthly)} al mes, sin cobros
              sorpresa.
            </Text>
            <Chip label="Premium muy pronto" tone="premium" />
          </Card>
        ) : null}
        <View style={{ flex: 1 }} />
        <View style={{ gap: 8, marginTop: 16 }}>
          {!blocked ? <Button label="Seguir practicando" onPress={() => router.setParams({ count: String(done + (target ?? 5)) })} /> : null}
          <Button label="Volver" variant={blocked ? 'primary' : 'ghost'} onPress={() => router.back()} />
        </View>
      </Shell>
    );
  }

  return (
    <Shell
      onClose={() => router.back()}
      progress={target ? done / target : 0}
      label={target ? `${done + 1}/${target}` : `#${done + 1}`}
    >
      <View style={s.meta}>
        <Chip label={ref.unit.name} tone="neutral" />
        <Chip label={`Nivel ${difficulty}`} />
        {!practice.unlimited ? <Chip label={`Quedan ${practice.remaining} hoy`} tone="neutral" /> : null}
      </View>
      <StepView key={exercise.ref} step={exercise.step} onGraded={onGraded} onContinue={next} continueLabel="Siguiente" />
    </Shell>
  );
}

function make(gens: { generate: (seed: number, d: Difficulty) => Exercise }[], turn: number, d: number): Exercise | null {
  if (gens.length === 0) return null;
  const g = gens[(turn + Math.floor(Math.random() * gens.length)) % gens.length]!;
  return g.generate(newSeed(), clampDifficulty(d));
}

const s = StyleSheet.create({
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  center: { alignItems: 'center', gap: 10, paddingTop: 16 },
  title: { fontFamily: fonts['poppins-bold'], fontSize: 24, lineHeight: 30, color: colors.ink, textAlign: 'center' },
  body: { fontFamily: fonts.poppins, fontSize: 16, lineHeight: 24, color: colors.graphite, textAlign: 'center' },
  bodyStrong: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
});
