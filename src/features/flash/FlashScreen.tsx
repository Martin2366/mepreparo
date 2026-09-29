import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Mascot } from '@/components/ui/Mascot';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { DURATION_MS, flashQuestion, flashXp, levelFor, pointsFor } from '@/engine/flash';
import { Shell } from '@/features/lesson-player/LessonScreen';
import { LimitCard } from '@/features/premium/LimitCard';
import { useAllowance } from '@/features/progress/allowance';
import { useProgress } from '@/features/progress/store';
import { goBack } from '@/lib/nav';
import { colors, fonts } from '@/theme/tokens';

type Phase = 'intro' | 'play' | 'end';
const newSeed = () => Math.floor(Math.random() * 2_000_000_000);

/** Reto relámpago: 60 s de cálculo mental, combo y récord personal. Gratis: 1 partida al día. */
export function FlashScreen() {
  const best = useProgress((s) => s.flashBest);
  const setBest = useProgress((s) => s.setFlashBest);
  const addXp = useProgress((s) => s.addXp);
  const allowance = useAllowance('flash');
  const [phase, setPhase] = useState<Phase>('intro');
  const [seed, setSeed] = useState(newSeed);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [misses, setMisses] = useState(0);
  const [left, setLeft] = useState(DURATION_MS);
  const [flash, setFlash] = useState<'ok' | 'no' | null>(null);
  const endAt = useRef(0);
  const [prevBest, setPrevBest] = useState(best);

  useEffect(() => {
    if (phase !== 'play') return;
    const t = setInterval(() => {
      const ms = Math.max(0, endAt.current - Date.now());
      setLeft(ms);
      if (ms === 0) setPhase('end');
    }, 200);
    return () => clearInterval(t);
  }, [phase]);

  // Al terminar: récord y XP, una sola vez.
  const saved = useRef(false);
  useEffect(() => {
    if (phase !== 'end' || saved.current) return;
    saved.current = true;
    setBest(score);
    addXp(flashXp(score));
  }, [phase, score, setBest, addXp]);

  const start = () => {
    if (!allowance.ok) return;
    allowance.use();
    setPrevBest(best);
    saved.current = false;
    endAt.current = Date.now() + DURATION_MS;
    setScore(0);
    setCombo(0);
    setCorrect(0);
    setMisses(0);
    setLeft(DURATION_MS);
    setSeed(newSeed());
    setPhase('play');
  };

  const q = flashQuestion(seed, levelFor(correct));

  const pick = (n: number) => {
    const ok = n === q.answer;
    if (ok) {
      setScore((v) => v + pointsFor(combo));
      setCombo((c) => c + 1);
      setCorrect((c) => c + 1);
      if (Platform.OS !== 'web') Haptics.selectionAsync();
    } else {
      setCombo(0);
      setMisses((m) => m + 1);
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFlash(ok ? 'ok' : 'no');
    setTimeout(() => setFlash(null), 180);
    setSeed(newSeed());
  };

  if (phase === 'intro') {
    return (
      <Shell onClose={() => goBack()} progress={0}>
        <View style={s.center}>
          <Mascot pose="senalando" height={140} />
          <Text style={s.title}>Reto relámpago</Text>
          <Text style={s.body}>60 segundos de cálculo mental. Cada 3 aciertos seguidos, tu multiplicador sube.</Text>
          <Chip label={`Tu récord: ${best}`} />
        </View>
        <View style={{ flex: 1, minHeight: 24 }} />
        {allowance.ok ? (
          <Button label="¡Partir!" arrow onPress={start} />
        ) : (
          <LimitCard title="Hoy ya jugaste tu partida gratis" free="Mañana tienes otra. Mientras, puedes practicar o seguir tu lección." compact />
        )}
      </Shell>
    );
  }

  if (phase === 'end') {
    const record = score > prevBest;
    return (
      <Shell onClose={() => goBack()} progress={1}>
        <View style={s.center}>
          <Mascot pose={record ? 'celebrando' : 'aja'} height={140} pop={record} />
          <Text style={s.title}>{record ? '¡Nuevo récord!' : 'Tiempo'}</Text>
          <Text style={s.huge}>{score}</Text>
          <Text style={s.body}>
            {correct} aciertos · {misses} errores · +{flashXp(score)} XP
          </Text>
          <Chip label={`Récord: ${Math.max(score, prevBest)}`} />
        </View>
        <View style={{ flex: 1, minHeight: 24 }} />
        <View style={{ gap: 8 }}>
          {allowance.ok ? <Button label="Jugar otra vez" onPress={start} /> : null}
          <Button label="Volver" variant={allowance.ok ? 'ghost' : 'primary'} onPress={() => goBack()} />
        </View>
      </Shell>
    );
  }

  const mult = Math.min(4, 1 + Math.floor(combo / 3));
  return (
    <Shell onClose={() => setPhase('end')} progress={1 - left / DURATION_MS} label={`${Math.ceil(left / 1000)} s`}>
      <View style={s.row}>
        <Text style={s.score}>{score}</Text>
        <View style={{ flex: 1 }} />
        {mult > 1 ? <Chip label={`×${mult}`} tone="new" /> : null}
        <Chip label={`Combo ${combo}`} tone="neutral" />
      </View>
      <View style={{ marginTop: 8 }}>
        <ProgressBar value={left / DURATION_MS} />
      </View>
      <Animated.View key={seed} entering={ZoomIn.duration(140)} style={[s.question, flash === 'ok' && s.ok, flash === 'no' && s.no]}>
        <Text style={s.qText}>{q.text}</Text>
      </Animated.View>
      <View style={s.grid}>
        {q.options.map((n) => (
          <Tappable
            key={`${seed}-${n}`}
            accessibilityRole="button"
            accessibilityLabel={String(n)}
            onPress={() => pick(n)}
            style={s.option}
            pressedStyle={{ backgroundColor: colors.sky100, transform: [{ scale: 0.96 }] }}
          >
            <Text style={s.optText}>{n}</Text>
          </Tappable>
        ))}
      </View>
    </Shell>
  );
}

const s = StyleSheet.create({
  center: { alignItems: 'center', gap: 10, paddingTop: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontFamily: fonts['poppins-bold'], fontSize: 26, lineHeight: 32, color: colors.ink, textAlign: 'center' },
  huge: { fontFamily: fonts['poppins-bold'], fontSize: 56, lineHeight: 64, color: colors.ink },
  body: { fontFamily: fonts.poppins, fontSize: 16, lineHeight: 24, color: colors.graphite, textAlign: 'center' },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 15, color: colors.ink },
  score: { fontFamily: fonts['poppins-bold'], fontSize: 32, lineHeight: 38, color: colors.ink },
  question: {
    marginTop: 24,
    marginBottom: 24,
    minHeight: 130,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ok: { backgroundColor: colors.success50, borderColor: colors.success },
  no: { backgroundColor: colors.graphite100, borderColor: colors.graphite },
  qText: { fontFamily: fonts['math-upright'], fontSize: 40, lineHeight: 48, color: colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  option: {
    width: '47%',
    flexGrow: 1,
    height: 84,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.graphite200,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optText: { fontFamily: fonts['poppins-bold'], fontSize: 28, color: colors.ink },
});
