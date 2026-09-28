import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { FpsMeter } from '@/features/dev/FpsMeter';
import { BalanceSpike } from '@/features/interactives/balance/Balance';

export default function BalanceSpikeScreen() {
  return (
    <Screen>
      <View className="gap-4">
        <Text variant="overline">Spike B · Balanza</Text>
        <FpsMeter />
        <Text variant="h2">Deja la x sola</Text>
        <BalanceSpike />
        <Button variant="ghost" label="Volver" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
