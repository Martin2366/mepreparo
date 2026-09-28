import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Chip, PremiumTag } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { SKILL_LABEL, SKILLS } from '@/content/schema';
import { BADGES } from '@/engine/badges';
import { addDays, dayKey, weekStart } from '@/engine/dates';
import { pct } from '@/engine/mastery';
import { levers, type ScoreKey, weightedScore } from '@/engine/weighted';
import { careerById, institutionById, isGeneric } from '@/features/onboarding/admission';
import { formatScore } from '@/features/onboarding/model';
import { Section, TabScreen } from '@/features/shell/TabScreen';
import { colors, fonts } from '@/theme/tokens';

import { useExams } from '@/features/exams/store';

import { BadgeMedal } from './badges';
import { useDashboard } from './derived';
import { useProgress } from './store';

const SKILL_HINT: Record<(typeof SKILLS)[number], string> = {
  resolver: 'Aplicar procedimientos para llegar a un resultado.',
  modelar: 'Pasar de una situación real a una expresión o función.',
  representar: 'Moverte entre tablas, gráficos, expresiones y palabras.',
  argumentar: 'Justificar, detectar errores y decidir si algo es verdadero.',
};

export function ProgressTab() {
  const d = useDashboard();

  return (
    <TabScreen title="Progreso">
      <Card padding={18} style={{ gap: 10 }}>
        <Text style={s.caption}>Puntaje estimado M1</Text>
        <Text style={s.huge}>
          {d.estimate.low}–{d.estimate.high}
        </Text>
        <ScoreBar low={d.estimate.low} high={d.estimate.high} target={d.answers.target ?? d.plan.target} />
        <Text style={s.caption}>
          Estimación orientativa según tu diagnóstico y tu práctica; no es el puntaje oficial. Se afina con cada ejercicio (y con los
          ensayos, cuando lleguen).
        </Text>
      </Card>

      <Simulator point={d.estimate.point} />

      <Section title="Dominio por eje">
        <Card style={{ gap: 14 }}>
          {d.axes.map(({ axis, mastery }) => (
            <View key={axis.id} style={{ gap: 6 }}>
              <View style={s.row}>
                <Text style={[s.strong, { flex: 1 }]}>{axis.name}</Text>
                <Text style={s.strong}>{pct(mastery)} %</Text>
              </View>
              <ProgressBar value={mastery} height={8} />
            </View>
          ))}
        </Card>
      </Section>

      <Section title="Las 4 habilidades PAES">
        <Card style={{ gap: 14 }}>
          {SKILLS.map((sk) => (
            <View key={sk} style={{ gap: 4 }}>
              <View style={s.row}>
                <Text style={[s.strong, { flex: 1 }]}>{SKILL_LABEL[sk]}</Text>
                <Text style={s.strong}>{pct(d.skills[sk])} %</Text>
              </View>
              <ProgressBar value={d.skills[sk]} height={8} />
              <Text style={s.caption}>{SKILL_HINT[sk]}</Text>
            </View>
          ))}
        </Card>
      </Section>

      <Section title="Racha">
        <Card style={{ gap: 12 }}>
          <View style={s.row}>
            <Icon name="flame" size={30} color={d.streak.current ? colors.coral : colors.graphite300} />
            <Text style={s.huge}>{d.streak.current}</Text>
            <Text style={[s.body, { flex: 1 }]}>{d.streak.current === 1 ? 'día seguido' : 'días seguidos'}</Text>
          </View>
          <StreakCalendar active={new Set(d.progress.activeDays)} rest={new Set(d.streak.restDays)} today={d.today} />
          <Text style={s.caption}>Tienes 1 día de descanso automático por semana: si un día no alcanzas, tu racha no se corta.</Text>
        </Card>
      </Section>

      <Section title="Nivel">
        <Card style={{ gap: 8 }}>
          <View style={s.row}>
            <Chip label={`Nivel ${d.level.level}`} tone="ink" />
            <Text style={[s.strong, { flex: 1 }]}>{d.level.name}</Text>
            <Text style={s.caption}>{d.progress.xp} XP</Text>
          </View>
          {d.level.toNext ? (
            <>
              <ProgressBar value={d.level.into / d.level.toNext} />
              <Text style={s.caption}>
                Te faltan {d.level.toNext - d.level.into} XP para «{d.level.nextName}».
              </Text>
            </>
          ) : null}
        </Card>
      </Section>

      <WeekSummary />

      <ExamHistory />

      <Section title="Logros">
        <Card style={{ gap: 12 }}>
          <View style={s.badgeGrid}>
            {BADGES.map((b) => {
              const earned = b.id in d.progress.badges;
              return (
                <View key={b.id} style={s.badgeCell} accessible accessibilityLabel={`${b.title}: ${earned ? 'ganado' : b.description}`}>
                  <BadgeMedal badge={b} earned={earned} />
                  <Text style={[s.badgeTitle, !earned && { color: colors.graphite }]} numberOfLines={2}>
                    {b.title}
                  </Text>
                  {b.premium ? <PremiumTag /> : null}
                </View>
              );
            })}
          </View>
          <Text style={s.caption}>
            {Object.keys(d.progress.badges).length} de {BADGES.length} logros. Los que ganas son tuyos para siempre.
          </Text>
        </Card>
      </Section>

      <Card onPress={() => router.push('/cuaderno')} style={s.row} accessibilityLabel="Abrir cuaderno de errores">
        <Icon name="notebook-pen" size={22} color={colors.sky700} />
        <Text style={[s.strong, { flex: 1 }]}>Cuaderno de errores</Text>
        <Icon name="chevron-right" size={20} color={colors.graphite} />
      </Card>
    </TabScreen>
  );
}

/** Resumen semanal (PRD §13): esta semana frente a la anterior. */
function WeekSummary() {
  const p = useProgress();
  const today = dayKey(new Date());
  const start = weekStart(today);
  const days = (from: string, n: number) => Array.from({ length: n }, (_, i) => addDays(from, i));
  const thisWeek = days(start, 7).filter((d) => d <= today);
  const lastWeek = days(addDays(start, -7), 7);
  const sum = (ds: string[], f: (d: string) => number) => ds.reduce((acc, d) => acc + f(d), 0);
  const xp = sum(thisWeek, (d) => p.xpByDay[d] ?? 0);
  const xpLast = sum(lastWeek, (d) => p.xpByDay[d] ?? 0);
  const correct = sum(thisWeek, (d) => p.dayStats[d]?.correct ?? 0);
  const lessons = sum(thisWeek, (d) => p.dayStats[d]?.lessons ?? 0);
  const active = thisWeek.filter((d) => p.activeDays.includes(d)).length;
  return (
    <Section title="Esta semana">
      <Card style={{ gap: 10 }}>
        <View style={s.weekRow}>
          <Stat value={String(active)} label={active === 1 ? 'día activo' : 'días activos'} />
          <Stat value={String(lessons)} label={lessons === 1 ? 'lección' : 'lecciones'} />
          <Stat value={String(correct)} label="aciertos" />
          <Stat value={String(xp)} label="XP" />
        </View>
        <Text style={s.caption}>
          {xpLast === 0
            ? 'Tu primera semana: cada día cuenta.'
            : xp >= xpLast
              ? `${xp - xpLast} XP más que la semana pasada. Vas bien.`
              : `La semana pasada hiciste ${xpLast} XP. Un poco cada día y lo alcanzas.`}
        </Text>
      </Card>
    </Section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={s.big}>{value}</Text>
      <Text style={s.caption}>{label}</Text>
    </View>
  );
}

/** Historial de ensayos con su evolución. */
function ExamHistory() {
  const history = useExams((st) => st.history);
  if (history.length === 0) return null;
  const last = history.slice(0, 5);
  return (
    <Section title="Tus ensayos">
      <Card style={{ gap: 10 }}>
        {last.map((r) => (
          <Tappable
            key={r.id}
            accessibilityRole="button"
            accessibilityLabel={`${r.spec.title}: ${r.result.score} puntos`}
            onPress={() => router.push({ pathname: '/ensayo/resultado/[id]', params: { id: r.id } })}
            style={s.historyRow}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.strong}>{r.spec.title}</Text>
              <Text style={s.caption}>
                {r.finishedAt.slice(8, 10)}/{r.finishedAt.slice(5, 7)} · {r.result.correct}/{r.result.total} correctas
              </Text>
            </View>
            <Text style={s.big}>{r.result.score}</Text>
            <Icon name="chevron-right" size={18} color={colors.graphite} />
          </Tappable>
        ))}
      </Card>
    </Section>
  );
}

function ScoreBar({ low, high, target }: { low: number; high: number; target: number }) {
  const x = (n: number) => `${Math.max(0, Math.min(100, ((n - 100) / 900) * 100))}%` as const;
  return (
    <View style={s.track} accessibilityLabel={`Rango estimado entre ${low} y ${high}; meta ${Math.round(target)}`}>
      <View style={[s.range, { left: x(low), width: `${((high - low) / 900) * 100}%` }]} />
      <View style={[s.mark, { left: x(target) }]} />
    </View>
  );
}

/** Simulador de postulación (PRD §11): ponderado estimado de tu carrera meta frente a su corte. */
function Simulator({ point }: { point: number }) {
  const d = useDashboard();
  const sim = useProgress((s) => s.simScores);
  const setSim = useProgress((s) => s.setSimScore);
  const career = careerById(d.answers.careerId);
  const inst = institutionById(d.answers.institutionId);
  if (!career?.w) {
    return (
      <Card tone="sky" style={{ gap: 6 }}>
        <Text style={s.strong}>Simulador de postulación</Text>
        <Text style={s.body}>Elige una carrera en tu perfil para ver tu puntaje ponderado y cuánto te falta.</Text>
      </Card>
    );
  }
  const hoc = !!career.hoc;
  const defaults: Record<ScoreKey, number> = { nem: 700, ranking: 700, lectora: point, m1: point, m2: point, historia: point, ciencias: point };
  const scores = { ...defaults, ...sim, m1: point };
  const { total, parts } = weightedScore(career.w, scores, hoc);
  const cut = isGeneric(career) ? undefined : career.cut;
  const best = levers(career.w, hoc)[0];
  const gap = cut ? Math.round((cut.score - total) * 10) / 10 : null;

  return (
    <Section title="Simulador de postulación">
      <Card style={{ gap: 12 }}>
        <View style={{ gap: 2 }}>
          <Text style={s.strong}>{career.name}</Text>
          <Text style={s.caption}>{inst ? inst.name : isGeneric(career) ? 'Ponderación promedio de la carrera' : ''}</Text>
        </View>
        <View style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={s.caption}>Tu ponderado estimado</Text>
            <Text style={s.big}>{formatScore(total, 1)}</Text>
          </View>
          {cut ? (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.caption}>
                Corte {cut.year} ({cut.kind === 'seleccionado' ? 'último seleccionado' : 'último matriculado'})
              </Text>
              <Text style={[s.big, { color: colors.sky700 }]}>{formatScore(cut.score, 1)}</Text>
            </View>
          ) : null}
        </View>
        {gap !== null ? (
          <Card tone={gap <= 0 ? 'success' : 'sky'} padding={12}>
            <Text style={s.body}>
              {gap <= 0 ? 'Con estos puntajes estarías sobre el corte. Ahora hay que asegurarlo.' : `Te faltan ${formatScore(gap, 1)} puntos ponderados.`}
              {best && gap > 0 ? ` Tu mejor palanca: ${best.label}. Si subes 40 puntos ahí, ganas ${formatScore(best.gain, 1)} ponderados.` : ''}
            </Text>
          </Card>
        ) : null}

        <View style={{ gap: 8 }}>
          {parts.map((p) =>
            p.key === 'm1' ? (
              <View key={p.key} style={s.row}>
                <Text style={[s.body, { flex: 1 }]}>
                  M1 · {p.weight} %
                </Text>
                <Text style={s.strong}>{p.score}</Text>
                <Chip label="estimado" tone="neutral" />
              </View>
            ) : (
              <Stepper
                key={p.key}
                label={`${p.label} · ${p.weight} %`}
                value={p.score}
                onChange={(v) => {
                  if (p.key === 'hoc') {
                    setSim('historia', v);
                    setSim('ciencias', v);
                  } else setSim(p.key, v);
                }}
              />
            ),
          )}
          <Text style={s.caption}>
            Ajusta tus puntajes esperados. Las pruebas que no editas usan tu estimado de M1 como referencia. Ponderaciones y cortes
            oficiales (DEMRE 2027 y universidades).
          </Text>
        </View>
      </Card>
    </Section>
  );
}

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View style={s.row}>
      <Text style={[s.body, { flex: 1 }]} numberOfLines={1}>
        {label}
      </Text>
      <IconButton icon="minus" label={`Bajar ${label}`} onPress={() => onChange(value - 10)} size={18} />
      <Text style={[s.strong, { minWidth: 40, textAlign: 'center' }]}>{Math.round(value)}</Text>
      <IconButton icon="plus" label={`Subir ${label}`} onPress={() => onChange(value + 10)} size={18} />
    </View>
  );
}

function StreakCalendar({ active, rest, today }: { active: Set<string>; rest: Set<string>; today: string }) {
  const start = addDays(weekStart(today), -28);
  const weeks = Array.from({ length: 5 }, (_, w) => Array.from({ length: 7 }, (_, i) => addDays(start, w * 7 + i)));
  return (
    <View style={{ gap: 6 }}>
      <View style={s.calRow}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((l, i) => (
          <Text key={i} style={[s.caption, s.calCell]}>
            {l}
          </Text>
        ))}
      </View>
      {weeks.map((week, w) => (
        <View key={w} style={s.calRow}>
          {week.map((day) => {
            const on = active.has(day);
            const isRest = rest.has(day);
            const future = day > today;
            return (
              <View
                key={day}
                style={[
                  s.calCell,
                  s.dot,
                  on && { backgroundColor: colors.sky },
                  isRest && { backgroundColor: colors.sky100 },
                  day === today && { borderWidth: 2, borderColor: colors.ink },
                  future && { opacity: 0.35 },
                ]}
                accessibilityLabel={`${day}: ${on ? 'activo' : isRest ? 'descanso' : 'sin actividad'}`}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  huge: { fontFamily: fonts['poppins-bold'], fontSize: 34, lineHeight: 40, color: colors.ink },
  big: { fontFamily: fonts['poppins-bold'], fontSize: 24, lineHeight: 30, color: colors.ink },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 15, lineHeight: 21, color: colors.ink },
  body: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 21, color: colors.ink },
  caption: { fontFamily: fonts.poppins, fontSize: 12, lineHeight: 17, color: colors.graphite },
  track: { height: 12, borderRadius: 6, backgroundColor: colors.graphite100, justifyContent: 'center' },
  range: { position: 'absolute', top: 0, bottom: 0, borderRadius: 6, backgroundColor: colors.sky },
  mark: { position: 'absolute', width: 4, height: 22, marginLeft: -2, borderRadius: 2, backgroundColor: colors.ink },
  calRow: { flexDirection: 'row', justifyContent: 'space-between' },
  calCell: { width: 32, textAlign: 'center' },
  dot: { height: 32, borderRadius: 16, backgroundColor: colors.graphite100 },
  weekRow: { flexDirection: 'row' },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 16 },
  badgeCell: { width: '33.33%', alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  badgeTitle: { fontFamily: fonts['poppins-medium'], fontSize: 12, lineHeight: 16, color: colors.ink, textAlign: 'center' },
});
