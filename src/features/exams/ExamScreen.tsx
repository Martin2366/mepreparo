import { Redirect, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AppState, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { GridBackground } from '@/components/ui/GridBackground';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { MathText } from '@/components/ui/MathText';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { questionOf } from '@/engine/exam';
import { ChoiceInput } from '@/features/lesson-player/inputs';
import { useProgress } from '@/features/progress/store';
import { confirm } from '@/lib/confirm';
import { colors, fonts } from '@/theme/tokens';

import { useExams } from './store';

const fmt = (ms: number) => {
  const t = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

/**
 * Ensayo en curso: sin feedback hasta terminar, marcar para revisar, grilla de preguntas y pausa.
 * El tiempo corre solo con esta pantalla abierta y cada respuesta se guarda al tocarla.
 */
export function ExamScreen() {
  const exam = useExams((s) => s.active);
  const answer = useExams((s) => s.answer);
  const toggleFlag = useExams((s) => s.toggleFlag);
  const goTo = useExams((s) => s.goTo);
  const addTime = useExams((s) => s.addTime);
  const finish = useExams((s) => s.finish);
  const recordExam = useProgress((s) => s.recordExam);
  const [now, setNow] = useState(() => Date.now());
  const [gridOpen, setGridOpen] = useState(false);
  const resumedAt = useRef(0); // se fija al montar (en el efecto del reloj)
  // Copia en estado del último punto de guardado, para calcular el reloj al renderizar.
  const [since, setSince] = useState(() => Date.now());
  const finishing = useRef(false);

  // Reloj: suma el tiempo al guardar (cada 15 s, al salir o al ir al fondo).
  useEffect(() => {
    resumedAt.current = Date.now();
    const flush = () => {
      const t = Date.now();
      addTime(t - resumedAt.current);
      resumedAt.current = t;
      setSince(t);
    };
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const save = setInterval(flush, 15000);
    const sub = AppState.addEventListener('change', (st) => {
      if (st === 'active') {
        resumedAt.current = Date.now();
        setSince(resumedAt.current);
      } else flush();
    });
    return () => {
      clearInterval(tick);
      clearInterval(save);
      sub.remove();
      flush();
    };
  }, [addTime]);

  const limitMs = exam?.spec.minutes ? exam.spec.minutes * 60_000 : null;
  const used = exam ? exam.elapsedMs + Math.max(0, now - since) : 0;
  const remaining = limitMs !== null ? limitMs - used : null;

  const doFinish = () => {
    if (finishing.current) return;
    finishing.current = true;
    addTime(Date.now() - resumedAt.current);
    resumedAt.current = Date.now();
    const record = finish();
    if (!record) return;
    // Cada respuesta cuenta para tu dominio y los errores van al cuaderno.
    recordExam(
      record.questions.map((q, i) => {
        const ex = questionOf(q);
        const chosen = record.answers[i];
        const ok = !!ex && chosen === ex.step.answer;
        return {
          ref: `gen:${q.ref}`,
          kind: 'exam' as const,
          unitId: q.unitId,
          skill: q.skill,
          outcome: ok ? ('clean' as const) : ('wrong' as const),
          hints: 0,
          answer: chosen === null || chosen === undefined ? 'blank' : String(chosen),
          notebook: ex ? { prompt: ex.step.prompt, feedback: chosen !== null && chosen !== undefined ? ex.step.feedback[String(chosen)] : undefined } : undefined,
        };
      }),
    );
    router.replace({ pathname: '/ensayo/resultado/[id]', params: { id: record.id } });
  };

  useEffect(() => {
    if (remaining !== null && remaining <= 0 && exam) doFinish();
  });

  if (!exam) return <Redirect href="/(tabs)/practicar" />;
  const q = exam.questions[exam.index];
  const ex = q ? questionOf(q) : null;
  const answered = exam.answers.filter((a) => a !== null).length;

  const confirmFinish = async () => {
    const blank = exam.questions.length - answered;
    const ok = await confirm(
      'Terminar ensayo',
      blank > 0 ? `Te ${blank === 1 ? 'queda 1 pregunta' : `quedan ${blank} preguntas`} en blanco. ¿Terminar igual?` : '¿Quieres ver tus resultados?',
      'Terminar',
      'Seguir',
    );
    if (ok) doFinish();
  };

  return (
    <View style={s.root}>
      <GridBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={s.header}>
          <IconButton icon="x" label="Pausar y salir (tu avance queda guardado)" onPress={() => router.back()} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={s.title} numberOfLines={1}>
              {exam.spec.title}
            </Text>
            <Text style={[s.timer, remaining !== null && remaining < 5 * 60_000 && { color: colors.coral700 }]}>
              {remaining !== null ? fmt(remaining) : `Sin tiempo · ${fmt(used)}`}
            </Text>
          </View>
          <IconButton icon="list-checks" label="Ver todas las preguntas" onPress={() => setGridOpen(true)} />
        </View>

        <ScrollView contentContainerStyle={s.content}>
          <View style={s.row}>
            <Text style={s.counter}>
              Pregunta {exam.index + 1} de {exam.questions.length}
            </Text>
            <View style={{ flex: 1 }} />
            <Tappable
              accessibilityRole="button"
              accessibilityState={{ selected: exam.flagged[exam.index] }}
              accessibilityLabel="Marcar para revisar"
              onPress={() => toggleFlag(exam.index)}
              style={[s.flag, exam.flagged[exam.index] && s.flagOn]}
            >
              <Icon name="flag" size={16} color={exam.flagged[exam.index] ? colors.ink : colors.graphite} />
              <Text style={s.flagText}>{exam.flagged[exam.index] ? 'Marcada' : 'Marcar'}</Text>
            </Tappable>
          </View>
          {ex ? (
            <View style={{ gap: 16 }}>
              <MathText source={ex.step.prompt} size={18} />
              <ChoiceInput
                options={ex.step.options}
                selected={exam.answers[exam.index] ?? null}
                onSelect={(i) => answer(exam.index, i)}
                reveal="none"
                answer={ex.step.answer}
              />
            </View>
          ) : (
            <Text style={s.counter}>No pudimos cargar esta pregunta.</Text>
          )}
        </ScrollView>

        <View style={s.footer}>
          <View style={{ flex: 1 }}>
            <Button label="Anterior" variant="secondary" disabled={exam.index === 0} onPress={() => goTo(exam.index - 1)} />
          </View>
          <View style={{ flex: 1 }}>
            {exam.index < exam.questions.length - 1 ? (
              <Button label="Siguiente" onPress={() => goTo(exam.index + 1)} />
            ) : (
              <Button label="Terminar" onPress={confirmFinish} />
            )}
          </View>
        </View>
      </SafeAreaView>

      <Modal visible={gridOpen} transparent animationType="fade" onRequestClose={() => setGridOpen(false)}>
        <View style={s.scrim}>
          <View style={s.sheet}>
            <View style={s.row}>
              <Text style={s.sheetTitle}>
                {answered} de {exam.questions.length} respondidas
              </Text>
              <View style={{ flex: 1 }} />
              <IconButton icon="x" label="Cerrar" onPress={() => setGridOpen(false)} />
            </View>
            <ScrollView contentContainerStyle={s.grid}>
              {exam.questions.map((_, i) => {
                const done = exam.answers[i] !== null;
                return (
                  <Tappable
                    key={i}
                    accessibilityRole="button"
                    accessibilityLabel={`Pregunta ${i + 1}${done ? ', respondida' : ', en blanco'}${exam.flagged[i] ? ', marcada' : ''}`}
                    onPress={() => {
                      goTo(i);
                      setGridOpen(false);
                    }}
                    style={[s.cell, done && s.cellDone, exam.flagged[i] && s.cellFlag, i === exam.index && s.cellNow]}
                  >
                    <Text style={s.cellText}>{i + 1}</Text>
                  </Tappable>
                );
              })}
            </ScrollView>
            <Text style={s.legend}>Celeste: respondida · Borde grafito: marcada para revisar</Text>
            <Button label="Terminar ensayo" onPress={() => { setGridOpen(false); confirmFinish(); }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, minHeight: 60 },
  title: { fontFamily: fonts['poppins-medium'], fontSize: 13, color: colors.graphite },
  timer: { fontFamily: fonts['poppins-bold'], fontSize: 20, lineHeight: 26, color: colors.ink },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 14, width: '100%', maxWidth: 720, alignSelf: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  counter: { fontFamily: fonts['poppins-semibold'], fontSize: 14, color: colors.graphite },
  flag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.graphite200,
  },
  flagOn: { backgroundColor: colors.graphite100, borderColor: colors.graphite },
  flagText: { fontFamily: fonts['poppins-medium'], fontSize: 13, color: colors.ink },
  footer: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.line },
  scrim: { flex: 1, backgroundColor: 'rgba(30,42,74,0.36)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.paper, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, gap: 12, maxHeight: '80%' },
  sheetTitle: { fontFamily: fonts['poppins-semibold'], fontSize: 17, color: colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.graphite200,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellDone: { backgroundColor: colors.sky100, borderColor: colors.sky },
  cellFlag: { borderColor: colors.graphite, borderWidth: 2.5 },
  cellNow: { transform: [{ scale: 1.08 }] },
  cellText: { fontFamily: fonts['poppins-semibold'], fontSize: 15, color: colors.ink },
  legend: { fontFamily: fonts.poppins, fontSize: 12, color: colors.graphite },
});
