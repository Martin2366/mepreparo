import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MathText } from '@/components/ui/MathText';
import { Text } from '@/components/ui/Text';
import { hasPractice, miniClassById } from '@/features/content/catalog';
import { Shell } from '@/features/lesson-player/LessonScreen';
import { goBack } from '@/lib/nav';
import { colors, fonts } from '@/theme/tokens';

/** Mini-clase (D15): 90 segundos en tarjetas, sin video, funciona sin red. */
export function MiniClassScreen({ id }: { id: string }) {
  const found = miniClassById(id);
  const [i, setI] = useState(0);
  if (!found) {
    return (
      <Shell onClose={() => goBack()} progress={0}>
        <Text style={s.body}>No encontramos esta mini-clase.</Text>
      </Shell>
    );
  }
  const { mini, unitId } = found;
  const card = mini.cards[i]!;
  const last = i === mini.cards.length - 1;

  return (
    <Shell onClose={() => goBack()} progress={(i + 1) / mini.cards.length} label={`${i + 1}/${mini.cards.length}`}>
      <Text style={s.overline}>MINI-CLASE · {mini.title.toUpperCase()}</Text>
      <Animated.View key={i} entering={FadeInRight.duration(240)}>
        <Card padding={20} style={{ gap: 14 }}>
          {card.title ? <Text style={s.title}>{card.title}</Text> : null}
          <MathText source={card.body} size={18} />
          {card.formula ? (
            <View style={s.formula}>
              <MathText source={card.formula} size={18} display />
            </View>
          ) : null}
          {card.example?.length ? (
            <View style={{ gap: 6 }}>
              <Text style={s.caption}>Ejemplo</Text>
              {card.example.map((line, k) => (
                <MathText key={k} source={line} size={17} />
              ))}
            </View>
          ) : null}
        </Card>
      </Animated.View>
      <View style={{ flex: 1, minHeight: 20 }} />
      <View style={{ gap: 8 }}>
        {last ? (
          <>
            {hasPractice(unitId) ? (
              <Button
                label="Probar con 3 ejercicios"
                arrow
                onPress={() => router.replace({ pathname: '/practica/[unit]', params: { unit: unitId, count: '3' } })}
              />
            ) : null}
            <Button label="Listo" variant={hasPractice(unitId) ? 'ghost' : 'primary'} onPress={() => goBack()} />
          </>
        ) : (
          <Button label="Siguiente" arrow onPress={() => setI(i + 1)} />
        )}
        {i > 0 && !last ? <Button label="Anterior" variant="ghost" onPress={() => setI(i - 1)} /> : null}
      </View>
    </Shell>
  );
}

const s = StyleSheet.create({
  overline: { fontFamily: fonts['poppins-semibold'], fontSize: 12, letterSpacing: 1.5, color: colors.sky700, marginBottom: 12 },
  title: { fontFamily: fonts['poppins-bold'], fontSize: 22, lineHeight: 28, color: colors.ink },
  body: { fontFamily: fonts.poppins, fontSize: 16, color: colors.graphite },
  caption: { fontFamily: fonts['poppins-semibold'], fontSize: 13, color: colors.graphite },
  formula: { backgroundColor: colors.sky50, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 8 },
});
