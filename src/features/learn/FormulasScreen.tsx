import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { MathText } from '@/components/ui/MathText';
import { Text } from '@/components/ui/Text';
import formulasJson from '@/content/formulas.json';
import type { Formula } from '@/content/schema';
import { curriculum, SHOW_DRAFTS } from '@/features/content/catalog';
import { Pill } from '@/features/exams/ExamSetupScreen';
import { useProgress } from '@/features/progress/store';
import { Section } from '@/features/shell/TabScreen';
import { FullScreen } from '@/features/shell/FullScreen';
import { colors, fonts } from '@/theme/tokens';

const DATA = formulasJson as { reviewStatus: string; units: Record<string, Formula[]> };
const VISIBLE = SHOW_DRAFTS || DATA.reviewStatus === 'approved';

/** Fórmulas por unidad para repasar y guardar (PRD §5.1). */
export function FormulasScreen() {
  const saved = useProgress((s) => s.savedFormulas);
  const toggle = useProgress((s) => s.toggleFormula);
  const [onlySaved, setOnlySaved] = useState(false);

  return (
    <FullScreen title="Fórmulas">
      <View style={s.row}>
        <Pill label="Todas" on={!onlySaved} onPress={() => setOnlySaved(false)} />
        <Pill label={`Guardadas (${saved.length})`} on={onlySaved} onPress={() => setOnlySaved(true)} />
      </View>
      {!VISIBLE ? <Text style={s.caption}>Estamos revisando las fórmulas. Muy pronto.</Text> : null}
      {VISIBLE
        ? curriculum.axes.map((axis) => {
            const units = axis.units
              .map((u) => ({ unit: u, list: (DATA.units[u.id] ?? []).filter((f) => !onlySaved || saved.includes(f.id)) }))
              .filter((x) => x.list.length > 0);
            if (units.length === 0) return null;
            return (
              <Section key={axis.id} title={axis.name}>
                <View style={{ gap: 14 }}>
                  {units.map(({ unit, list }) => (
                    <View key={unit.id} style={{ gap: 8 }}>
                      <Text style={s.unit}>{unit.name}</Text>
                      {list.map((f) => {
                        const on = saved.includes(f.id);
                        return (
                          <Card key={f.id} padding={14} style={{ gap: 6 }}>
                            <View style={s.row}>
                              <Text style={[s.strong, { flex: 1 }]}>{f.title}</Text>
                              <IconButton
                                icon={on ? 'star' : 'book-marked'}
                                label={on ? 'Quitar de guardadas' : 'Guardar fórmula'}
                                color={on ? colors.coral700 : colors.graphite}
                                size={20}
                                onPress={() => toggle(f.id)}
                              />
                            </View>
                            <View style={s.formula}>
                              <MathText source={f.formula} size={17} display />
                            </View>
                            {f.note ? <MathText source={f.note} size={14} color={colors.graphite} /> : null}
                          </Card>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </Section>
            );
          })
        : null}
      {onlySaved && saved.length === 0 ? <Text style={s.caption}>Toca la estrella de una fórmula para guardarla aquí.</Text> : null}
    </FullScreen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  unit: { fontFamily: fonts['poppins-semibold'], fontSize: 14, color: colors.sky700 },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 15, lineHeight: 21, color: colors.ink },
  caption: { fontFamily: fonts.poppins, fontSize: 13, color: colors.graphite },
  formula: { backgroundColor: colors.sky50, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 6 },
});
