import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { MathText } from '@/components/ui/MathText';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';

/** Casos reales del eje Álgebra y funciones, del más simple al más exigente. */
const SAMPLES: { label: string; source: string; display?: boolean }[] = [
  { label: 'Ecuación lineal', source: '$3x+1=x+5$', display: true },
  { label: 'Fracción', source: '$\\frac{x}{2}-\\frac{1}{3}=\\frac{5}{6}$', display: true },
  { label: 'Potencias', source: '$(a+b)^{2}=a^{2}+2ab+b^{2}$', display: true },
  { label: 'Raíz', source: '$\\sqrt{x^{2}+9}=5$', display: true },
  { label: 'Fórmula del vértice', source: '$x=-\\frac{b}{2a}$', display: true },
  { label: 'Anidado', source: '$\\frac{\\sqrt{b^{2}-4ac}}{2a}\\ge 0$', display: true },
  { label: 'Inecuación', source: '$-2x+4\\le 3x-1$', display: true },
  {
    label: 'Prosa con matemática',
    source:
      'La función $f(x)=x^{2}-4x+3$ tiene su vértice en $x=\\frac{4}{2}$. Si una entrada cuesta \\$1.500 y compras $n$ entradas, pagas $1500\\cdot n$ pesos.',
  },
];

export default function MathSpikeScreen() {
  return (
    <Screen>
      <View className="gap-4">
        <Text variant="overline">Spike A · Matemática legible</Text>
        <Text variant="h2">Números grandes y claros</Text>
        {SAMPLES.map((s) => (
          <View key={s.label} className="gap-2 rounded-lg border border-line bg-white px-4 py-4">
            <Text variant="caption">{s.label}</Text>
            <MathText source={s.source} display={s.display} />
          </View>
        ))}
        <Button variant="ghost" label="Volver" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
