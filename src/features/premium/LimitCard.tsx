import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PremiumTag } from '@/components/ui/Chip';
import { Text } from '@/components/ui/Text';
import { PRICES } from '@/engine/entitlements';
import { clp } from '@/lib/format';
import { colors, fonts } from '@/theme/tokens';

/**
 * Tarjeta amable de límite (PRD §4.2): nunca interrumpe un ejercicio en curso, muestra el precio a la vista
 * y siempre deja un camino gratis (`free`).
 */
export function LimitCard({ title, free, compact = false }: { title: string; free: string; compact?: boolean }) {
  return (
    <Card tone="paper" style={{ gap: 8 }}>
      <View style={s.row}>
        <PremiumTag />
        <Text style={[s.strong, { flex: 1 }]}>{title}</Text>
      </View>
      <Text style={s.small}>{free}</Text>
      {compact ? null : (
        <Text style={s.small}>
          Premium: {clp(PRICES.monthly)} al mes o {clp(PRICES.pass)} hasta tu PAES, sin renovación. Nunca cobramos sin que toques «Pagar».
        </Text>
      )}
      <Button label="Ver Premium" variant="secondary" onPress={() => router.push('/planes')} />
    </Card>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
});
