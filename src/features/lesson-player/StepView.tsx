import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { HandNote, Mascot } from '@/components/ui/Mascot';
import { MathText } from '@/components/ui/MathText';
import { Text } from '@/components/ui/Text';
import type { Step } from '@/content/schema';
import {
  equationOf,
  type Grade,
  gradeBalance,
  gradeChoice,
  gradeFindError,
  gradeGraph,
  gradeNumeric,
  gradeOrder,
} from '@/engine/grading';
import type { Outcome } from '@/engine/xp';
import { Balance, type BalanceState } from '@/features/interactives/balance/Balance';
import { Graph, type GraphValues } from '@/features/interactives/graph/Graph';
import { useAllowance } from '@/features/progress/allowance';
import { dur, easeOut } from '@/theme/motion';
import { colors, fonts } from '@/theme/tokens';

import { ChoiceInput, FindErrorInput, NumericInput, OrderInput, type Reveal, useShuffledOrder } from './inputs';

export type GradedEvent = {
  grade: Grade;
  /** Resultado del primer intento del paso: es el que cuenta para el dominio y la XP. */
  outcome: Outcome;
  first: boolean;
  hints: number;
  answer: string;
  aha: boolean;
};

type Props = {
  step: Step;
  /** Guarda la respuesta (síncrono) y devuelve la XP ganada. Se llama ANTES de mostrar el feedback. */
  onGraded: (e: GradedEvent) => number;
  onContinue: () => void;
  continueLabel?: string;
};

/**
 * Un paso de lección o de práctica: responder → comprobar → feedback específico ("Casi…") → continuar.
 * Aprender nunca se bloquea: tras un error se puede reintentar o ver la resolución.
 */
export function StepView({ step, onGraded, onContinue, continueLabel = 'Continuar' }: Props) {
  const [reveal, setReveal] = useState<Reveal>('none');
  const [feedback, setFeedback] = useState<string | undefined>();
  const [xp, setXp] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [wrongBefore, setWrongBefore] = useState(false);
  const [aha, setAha] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionShown, setSolutionShown] = useState(false);
  const extraHints = useAllowance('extraHints');
  const solutions = useAllowance('solutions');

  // Estado de cada tipo de respuesta
  const [choice, setChoice] = useState<number | null>(null);
  const [numeric, setNumeric] = useState('');
  const initialOrder = useShuffledOrder(step.type === 'order' ? step.items.length : 0, step.id);
  const [order, setOrder] = useState<number[]>(initialOrder);
  const [balance, setBalance] = useState<BalanceState | null>(null);
  const [graph, setGraph] = useState<GraphValues | null>(null);
  const onBalance = useCallback((b: BalanceState) => setBalance(b), []);
  const onGraph = useCallback((g: GraphValues) => setGraph(g), []);

  if (step.type === 'explain') {
    return (
      <View style={s.wrap}>
        <Animated.View entering={FadeInUp.duration(dur.slow).easing(easeOut)} style={{ gap: 16 }}>
          {step.mascot ? (
            <View style={{ alignItems: 'center' }}>
              <Mascot pose={step.mascot} height={130} />
            </View>
          ) : null}
          {step.title ? <Text style={s.title}>{step.title}</Text> : null}
          <MathText source={step.body} size={18} />
          {step.note ? (
            <Card tone="sky" style={{ alignItems: 'flex-start' }}>
              <HandNote>{step.note.replace(/\$([^$]*)\$/g, '$1')}</HandNote>
            </Card>
          ) : null}
        </Animated.View>
        <View style={{ flex: 1 }} />
        <Button label={continueLabel} arrow onPress={onContinue} />
      </View>
    );
  }

  const answered =
    (step.type === 'choice' && choice !== null) ||
    (step.type === 'numeric' && numeric.length > 0) ||
    step.type === 'order' ||
    (step.type === 'find-error' && choice !== null) ||
    (step.type === 'balance' && balance !== null) ||
    (step.type === 'graph' && graph !== null);

  const check = () => {
    let grade: Grade;
    let answer = '';
    switch (step.type) {
      case 'choice':
        grade = gradeChoice(step, choice!);
        answer = String(choice);
        break;
      case 'numeric':
        grade = gradeNumeric(step, numeric);
        answer = numeric;
        break;
      case 'order':
        grade = gradeOrder(step, order);
        answer = order.join(',');
        break;
      case 'find-error':
        grade = gradeFindError(step, choice!);
        answer = String(choice);
        break;
      case 'balance':
        grade = gradeBalance(step, !!balance?.solved);
        answer = balance?.solved ? 'solved' : 'unsolved';
        break;
      case 'graph':
        grade = gradeGraph(step, graph ?? {});
        answer = Object.entries(graph ?? {})
          .map(([k, v]) => `${k}=${v.n}/${v.d}`)
          .join(';');
        break;
    }
    const first = attempts === 0;
    const outcome: Outcome = !grade.correct ? 'wrong' : hintsShown > 0 || solutionShown ? 'hinted' : 'clean';
    const isAha = grade.correct && wrongBefore;
    // Guardar primero (regla del producto), después mostrar el feedback.
    const gained = onGraded({ grade, outcome, first, hints: hintsShown, answer, aha: isAha });
    setAttempts((n) => n + 1);
    setXp(gained);
    setFeedback(grade.feedback);
    if (grade.correct) {
      setReveal('correct');
      setAha(isAha);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setReveal('wrong');
      setWrongBefore(true);
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  /** Al cambiar la respuesta después de un error, el feedback anterior desaparece. */
  const clearFeedback = () => {
    setReveal('none');
    setFeedback(undefined);
  };

  const hints = step.hints ?? [];
  const canHint = hintsShown < hints.length && reveal !== 'correct' && reveal !== 'solution';
  const nextHintNeedsAllowance = hintsShown >= 1;
  const showHint = () => {
    if (nextHintNeedsAllowance) {
      if (!extraHints.ok) return;
      extraHints.use();
    }
    setHintsShown((n) => n + 1);
  };

  const solutionLines = step.solution ?? [];
  const explanation = 'explanation' in step ? step.explanation : undefined;
  const hasSolution = solutionLines.length > 0 || !!explanation;
  const showSolution = () => {
    if (!solutions.ok) return;
    solutions.use();
    setSolutionShown(true);
    setReveal('solution');
  };

  const locked = reveal === 'correct' || reveal === 'solution';

  return (
    <View style={s.wrap}>
      <View style={{ gap: 16 }}>
        <MathText source={step.prompt} size={18} />

        {step.type === 'choice' ? (
          <ChoiceInput
            options={step.options}
            selected={choice}
            onSelect={(i) => {
              if (reveal === 'wrong') clearFeedback();
              setChoice(i);
            }}
            reveal={reveal}
            answer={step.answer}
          />
        ) : null}
        {step.type === 'numeric' ? (
          <NumericInput
            value={numeric}
            onChange={(v) => {
              if (reveal === 'wrong') clearFeedback();
              setNumeric(v);
            }}
            suffix={step.suffix}
            disabled={locked}
          />
        ) : null}
        {step.type === 'order' ? (
          <OrderInput
            items={step.items}
            order={order}
            onChange={(o) => {
              if (reveal === 'wrong') clearFeedback();
              setOrder(o);
            }}
            disabled={locked}
          />
        ) : null}
        {step.type === 'find-error' ? (
          <FindErrorInput
            lines={step.lines}
            selected={choice}
            onSelect={(i) => {
              if (reveal === 'wrong') clearFeedback();
              setChoice(i);
            }}
            reveal={reveal}
            wrong={step.wrong}
          />
        ) : null}
        {step.type === 'balance' ? <Balance start={equationOf(step)} onChange={onBalance} disabled={locked} /> : null}
        {step.type === 'graph' ? <Graph step={step} onChange={onGraph} disabled={locked} /> : null}

        {hints.slice(0, hintsShown).map((h, i) => (
          <Animated.View key={i} entering={FadeInUp.duration(dur.base)}>
            <Card tone="sky" padding={12} style={s.row}>
              <Icon name="lightbulb" size={18} color={colors.sky700} />
              <View style={{ flex: 1 }}>
                <MathText source={h} size={15} />
              </View>
            </Card>
          </Animated.View>
        ))}

        {reveal === 'correct' ? (
          <Animated.View entering={ZoomIn.springify().damping(14)}>
            <Card tone="success" style={{ gap: 8 }}>
              <View style={s.row}>
                {aha ? <Spark /> : <Icon name="check" size={22} color={colors.success700} />}
                <Text style={s.okTitle}>{aha ? '¡Lo entendiste!' : '¡Correcto!'}</Text>
                <View style={{ flex: 1 }} />
                {xp > 0 ? <Chip label={`+${xp} XP`} tone="success" /> : null}
              </View>
              {explanation ? <MathText source={explanation} size={15} /> : null}
            </Card>
          </Animated.View>
        ) : null}

        {reveal === 'wrong' ? (
          <Animated.View entering={FadeInUp.duration(dur.base)}>
            <Card tone="paper" style={{ gap: 6, borderColor: colors.graphite200 }}>
              <View style={s.row}>
                <Mascot pose="apoyo" height={36} float={false} />
                <Text style={s.retryTitle}>Vuelve a intentarlo, vas bien.</Text>
              </View>
              {feedback ? <MathText source={feedback} size={15} /> : null}
            </Card>
          </Animated.View>
        ) : null}

        {reveal === 'solution' ? (
          <Animated.View entering={FadeInUp.duration(dur.base)}>
            <Card tone="sky" style={{ gap: 8 }}>
              <Text style={s.okTitle}>Resolución paso a paso</Text>
              {solutionLines.map((l, i) => (
                <MathText key={i} source={l} size={16} />
              ))}
              {explanation ? <MathText source={explanation} size={15} /> : null}
            </Card>
          </Animated.View>
        ) : null}
      </View>

      <View style={{ flex: 1, minHeight: 16 }} />

      <View style={{ gap: 8 }}>
        {locked ? (
          <Button label={continueLabel} arrow onPress={onContinue} />
        ) : reveal === 'wrong' && (step.type === 'balance' || step.type === 'graph') ? (
          <Button label="Comprobar de nuevo" onPress={check} disabled={!answered} />
        ) : (
          <Button label="Comprobar" onPress={check} disabled={!answered || reveal === 'wrong'} />
        )}
        {!locked ? (
          <View>
            {canHint ? (
              <View>
                <Button
                  variant="ghost"
                  label={nextHintNeedsAllowance && !extraHints.unlimited ? `Pista (${extraHints.remaining} hoy)` : 'Pista'}
                  disabled={nextHintNeedsAllowance && !extraHints.ok}
                  onPress={showHint}
                />
              </View>
            ) : null}
            {reveal === 'wrong' && hasSolution ? (
              <View>
                <Button
                  variant="ghost"
                  label={solutions.unlimited ? 'Ver resolución' : `Ver resolución (${solutions.remaining})`}
                  disabled={!solutions.ok}
                  onPress={showSolution}
                />
              </View>
            ) : null}
          </View>
        ) : null}
        {reveal === 'wrong' && hasSolution && !solutions.ok ? (
          <Text style={s.limit}>
            Hoy usaste tus 3 resoluciones gratis; mañana se recargan. Las pistas y la explicación de cada error siguen siendo gratis.
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/** La chispa coral: el momento "ajá" (el único uso del coral en un ejercicio). */
function Spark() {
  return (
    <Animated.View entering={ZoomIn.springify().damping(8)}>
      <Svg width={26} height={26} viewBox="0 0 24 24">
        <Path d="M12 2 Q13.5 10.5 22 12 Q13.5 13.5 12 22 Q10.5 13.5 2 12 Q10.5 10.5 12 2Z" fill={colors.coral} />
      </Svg>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, gap: 12 },
  title: { fontFamily: fonts['poppins-bold'], fontSize: 24, lineHeight: 30, color: colors.ink },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  okTitle: { fontFamily: fonts['poppins-semibold'], fontSize: 17, lineHeight: 22, color: colors.ink },
  retryTitle: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink, flex: 1 },
  limit: { fontFamily: fonts.poppins, fontSize: 13, lineHeight: 18, color: colors.graphite, textAlign: 'center' },
});
