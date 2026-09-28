import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip, PremiumTag } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import { dayKey } from '@/engine/dates';
import { hasPremium, planState } from '@/engine/entitlements';
import { isFreeDay, nextStep } from '@/engine/intensive';
import { unitRef } from '@/features/content/catalog';
import { useExams } from '@/features/exams/store';
import { useOnboarding } from '@/features/onboarding/store';
import { FullScreen } from '@/features/shell/FullScreen';
import { confirm } from '@/lib/confirm';
import { colors, fonts } from '@/theme/tokens';

import { PROGRAMS, programById, useIntensives } from './store';

function usePremium() {
  const trialStartedAt = useOnboarding((s) => s.answers.trialStartedAt);
  return hasPremium(planState({ trialStartedAt }, dayKey(new Date())));
}

/** Lista de intensivos. */
export function IntensivesScreen() {
  const active = useIntensives((s) => s.active);
  return (
    <FullScreen title="Intensivos">
      <Text style={s.body}>Un plan guiado, una sesión al día, con un mini-ensayo de entrada y otro de salida para ver cuánto subiste.</Text>
      {PROGRAMS.map((p) => (
        <Card key={p.id} onPress={() => router.push({ pathname: '/intensivo/[id]', params: { id: p.id } })} style={{ gap: 6 }} accessibilityLabel={p.title}>
          <View style={s.row}>
            <Text style={[s.strong, { flex: 1 }]}>{p.title}</Text>
            {active?.id === p.id ? <Chip label="En curso" /> : <PremiumTag />}
          </View>
          <Text style={s.small}>{p.summary}</Text>
          <Text style={s.caption}>
            {p.days} días · {p.dailyPractice} ejercicios al día · día 1 gratis
          </Text>
        </Card>
      ))}
    </FullScreen>
  );
}

/** Detalle de un intensivo: calendario, entrada vs. salida y la sesión de hoy. */
export function IntensiveScreen({ id }: { id: string }) {
  const program = programById(id);
  const active = useIntensives((s) => s.active);
  const finished = useIntensives((s) => s.finished.find((f) => f.id === id));
  const start = useIntensives((s) => s.start);
  const abandon = useIntensives((s) => s.abandon);
  const startExam = useExams((s) => s.start);
  const premium = usePremium();
  if (!program) return <FullScreen title="Intensivo">{null}</FullScreen>;

  const mine = active?.id === id ? active : null;
  const today = dayKey(new Date());
  const step = mine ? nextStep(program, mine, today) : null;
  const doneDays = mine?.doneDates.length ?? (finished ? program.days : 0);

  const begin = async () => {
    if (active && active.id !== id) {
      const ok = await confirm('Ya tienes un intensivo en curso', 'Si empiezas este, el otro se abandona.', 'Empezar este', 'Cancelar');
      if (!ok) return;
    }
    start(id);
  };

  const exam = (stage: 'entry' | 'exit') => {
    startExam(
      {
        kind: 'thematic',
        title: `${stage === 'entry' ? 'Entrada' : 'Salida'} · ${program.title}`,
        count: program.exam.count,
        minutes: program.exam.minutes,
        unitIds: program.unitIds,
      },
      { id, stage },
    );
    router.push('/ensayo/en-curso');
  };

  const lockedDay = step?.kind === 'day' && !isFreeDay(step.day) && !premium;

  return (
    <FullScreen title={program.title}>
      <Text style={s.body}>{program.summary}</Text>

      <Card style={{ gap: 10 }}>
        <View style={s.row}>
          <Text style={[s.strong, { flex: 1 }]}>
            Día {Math.min(doneDays + (step?.kind === 'day' || step?.kind === 'wait' ? 1 : 0), program.days)} de {program.days}
          </Text>
          <Text style={s.caption}>{doneDays} completados</Text>
        </View>
        <ProgressBar value={doneDays / program.days} />
        <View style={s.days}>
          {Array.from({ length: program.days }, (_, i) => {
            const done = i < doneDays;
            const current = i === doneDays && !!mine;
            return (
              <View
                key={i}
                style={[s.day, done && s.dayDone, current && s.dayNow]}
                accessibilityLabel={`Día ${i + 1}: ${done ? 'completado' : current ? 'hoy' : 'pendiente'}`}
              >
                {done ? <Icon name="check" size={12} color={colors.success700} /> : <Text style={s.dayText}>{i + 1}</Text>}
              </View>
            );
          })}
        </View>
      </Card>

      {(mine?.entry || finished?.entry) ? (
        <View style={s.row}>
          <Card style={[s.half, { alignItems: 'center' }]}>
            <Text style={s.caption}>Entrada</Text>
            <Text style={s.big}>{(mine ?? finished)!.entry!.score}</Text>
          </Card>
          <Icon name="arrow-right" size={20} color={colors.graphite} />
          <Card style={[s.half, { alignItems: 'center' }]}>
            <Text style={s.caption}>Salida</Text>
            <Text style={s.big}>{finished?.exit?.score ?? '—'}</Text>
          </Card>
        </View>
      ) : null}

      {!mine ? (
        finished ? (
          <Card tone="success" style={[s.row, { gap: 12 }]}>
            <Mascot pose="celebrando" height={60} float={false} />
            <Text style={[s.body, { flex: 1 }]}>
              Terminaste este intensivo{finished.exit && finished.entry ? `: ${finished.exit.score - finished.entry.score >= 0 ? 'subiste' : 'cambiaste'} ${Math.abs(finished.exit.score - finished.entry.score)} puntos` : ''}.
            </Text>
          </Card>
        ) : (
          <Button label="Empezar intensivo" arrow onPress={begin} />
        )
      ) : step?.kind === 'entry' ? (
        <SessionCard
          title="Ensayo de entrada"
          text={`${program.exam.count} preguntas en ${program.exam.minutes} minutos, para saber desde dónde partes.`}
          action="Empezar ensayo de entrada"
          onPress={() => exam('entry')}
        />
      ) : step?.kind === 'day' ? (
        lockedDay ? (
          <Card tone="paper" style={{ gap: 8 }}>
            <View style={s.row}>
              <PremiumTag />
              <Text style={s.strong}>El día {step.day} es parte de Premium</Text>
            </View>
            <Text style={s.small}>
              El día 1 es gratis. Para seguir el intensivo completo necesitas Premium, sin cobros sorpresa. Las lecciones y la práctica
              diaria siguen gratis.
            </Text>
          </Card>
        ) : (
          <SessionCard
            title={`Sesión del día ${step.day}`}
            text={`${step.count} ejercicios de ${unitRef(step.unitId)?.unit.name.toLowerCase() ?? 'práctica'}.`}
            action="Empezar sesión de hoy"
            onPress={() =>
              router.push({ pathname: '/practica/[unit]', params: { unit: step.unitId, count: String(step.count), intensive: id, day: String(step.day) } })
            }
          />
        )
      ) : step?.kind === 'wait' ? (
        <Card tone="sky" style={[s.row, { gap: 12 }]}>
          <Mascot pose="descansando" height={60} float={false} />
          <Text style={[s.body, { flex: 1 }]}>Hoy ya hiciste tu sesión. Vuelve mañana para el día {step.day}: así se construye el hábito.</Text>
        </Card>
      ) : step?.kind === 'exit' ? (
        <SessionCard
          title="Ensayo de salida"
          text="El último paso: mide cuánto subiste desde el ensayo de entrada."
          action="Empezar ensayo de salida"
          onPress={() => exam('exit')}
        />
      ) : null}

      {mine ? (
        <Button
          label="Abandonar intensivo"
          variant="ghost"
          onPress={async () => {
            if (await confirm('Abandonar intensivo', 'Tu progreso en lecciones y práctica se mantiene; solo se cierra este plan.', 'Abandonar', 'Seguir')) abandon();
          }}
        />
      ) : null}
    </FullScreen>
  );
}

function SessionCard({ title, text, action, onPress }: { title: string; text: string; action: string; onPress: () => void }) {
  return (
    <Card style={{ gap: 10 }}>
      <Text style={s.strong}>{title}</Text>
      <Text style={s.small}>{text}</Text>
      <Button label={action} arrow onPress={onPress} />
    </Card>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  body: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 22, color: colors.ink },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
  caption: { fontFamily: fonts.poppins, fontSize: 12, lineHeight: 17, color: colors.graphite },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink },
  big: { fontFamily: fonts['poppins-bold'], fontSize: 26, lineHeight: 32, color: colors.ink },
  half: { flex: 1 },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  day: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.graphite200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  dayDone: { backgroundColor: colors.success50, borderColor: colors.success },
  dayNow: { borderColor: colors.sky, borderWidth: 2.5 },
  dayText: { fontFamily: fonts['poppins-medium'], fontSize: 11, color: colors.graphite },
});
