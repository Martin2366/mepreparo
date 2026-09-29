import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Mascot } from '@/components/ui/Mascot';
import { MathText } from '@/components/ui/MathText';
import { Text } from '@/components/ui/Text';
import { dayKey } from '@/engine/dates';
import { LimitCard } from '@/features/premium/LimitCard';
import { useHasPremium } from '@/features/premium/store';
import { dueItems } from '@/engine/review';
import { unitRef } from '@/features/content/catalog';
import { useProgress } from '@/features/progress/store';
import { FullScreen } from '@/features/shell/FullScreen';
import { colors, fonts } from '@/theme/tokens';

import { freeNotebookFrom } from './review';

/** Cuaderno de errores (PRD §9): cada error con su explicación y su próximo repaso. */
export function NotebookScreen() {
  const today = dayKey(new Date());
  const notebook = useProgress((s) => s.notebook);
  const reviews = useProgress((s) => s.reviews);
  const premium = useHasPremium();
  const from = freeNotebookFrom(today);
  const entries = Object.values(notebook).sort((a, b) => (a.lastWrongOn < b.lastWrongOn ? 1 : -1));
  const visible = premium ? entries : entries.filter((e) => e.addedOn >= from);
  const hidden = entries.length - visible.length;
  const due = dueItems(reviews, today).length;
  const dueOf = new Map(reviews.map((r) => [r.ref, r.due]));

  return (
    <FullScreen
      title="Cuaderno de errores"
      footer={visible.length ? <Button label={due ? `Repasar ahora (${Math.min(due, 5)})` : 'Nada vence hoy'} disabled={!due} onPress={() => router.push('/repaso')} /> : undefined}
    >
      {visible.length === 0 ? (
        <View style={s.empty}>
          <Mascot pose="descansando" height={140} />
          <Text style={s.title}>Tu cuaderno está vacío</Text>
          <Text style={s.body}>Cuando te equivoques en algo, lo guardamos aquí con su explicación y te lo recordamos en el momento justo.</Text>
        </View>
      ) : null}
      {visible.map((e) => (
        <Card key={e.ref} style={{ gap: 8 }}>
          <View style={s.row}>
            {e.unitId ? <Chip label={unitRef(e.unitId)?.unit.name ?? 'Práctica'} tone="neutral" /> : null}
            <View style={{ flex: 1 }} />
            <Text style={s.caption}>{labelDue(dueOf.get(e.ref), today)}</Text>
          </View>
          <MathText source={e.prompt} size={16} />
          {e.feedback ? (
            <View style={s.feedback}>
              <MathText source={e.feedback} size={14} color={colors.graphite} />
            </View>
          ) : null}
        </Card>
      ))}
      {hidden > 0 ? (
        <LimitCard
          title={`${hidden} ${hidden === 1 ? 'error más antiguo' : 'errores más antiguos'} de 7 días`}
          free="Los errores de los últimos 7 días y su repaso siguen gratis. Todo el historial está en Premium."
          compact
        />
      ) : null}
    </FullScreen>
  );
}

function labelDue(due: string | undefined, today: string): string {
  if (!due) return 'Superado';
  if (due <= today) return 'Repasar hoy';
  return `Repaso: ${due.slice(8, 10)}/${due.slice(5, 7)}`;
}

const s = StyleSheet.create({
  empty: { alignItems: 'center', gap: 10, paddingTop: 24 },
  title: { fontFamily: fonts['poppins-bold'], fontSize: 22, lineHeight: 28, color: colors.ink, textAlign: 'center' },
  body: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 22, color: colors.graphite, textAlign: 'center' },
  caption: { fontFamily: fonts.poppins, fontSize: 12, lineHeight: 17, color: colors.graphite },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  feedback: { borderLeftWidth: 3, borderLeftColor: colors.graphite200, paddingLeft: 10 },
});
