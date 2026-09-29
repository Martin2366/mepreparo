import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { HandNote, Mascot } from '@/components/ui/Mascot';
import { MathText } from '@/components/ui/MathText';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { clampDiff, safeRich, unitOfGenerator } from '@/engine/equis';
import { GENERATORS } from '@/engine/generators';
import { UNIT_GENERATORS } from '@/features/equis/api';
import { AskEquisSheet } from '@/features/equis/sheets';
import { FullScreen } from '@/features/shell/FullScreen';
import { colors, fonts } from '@/theme/tokens';

import { useScan } from './store';

/**
 * Resultado de la foto: el enunciado leído (editable), «Explícamelo» con Equis y 5 ejercicios parecidos
 * de los generadores verificados (los corrige el motor, no la IA).
 */
export function ScanResultScreen() {
  const result = useScan((s) => s.result);
  const imageUri = useScan((s) => s.imageUri);
  const exercises = result?.exercises ?? [];
  const [index, setIndex] = useState<number | null>(exercises.length === 1 ? 0 : null);
  const [edited, setEdited] = useState<Record<number, string>>({});
  const [editing, setEditing] = useState(false);
  const [askOpen, setAskOpen] = useState(false);

  if (!exercises.length) {
    return (
      <FullScreen title="Tu foto">
        <View style={s.center}>
          <Mascot pose="pensando" height={120} float={false} />
          <Text style={s.body}>{result?.note ?? 'No alcancé a leer un ejercicio. Prueba con más luz y encuadrando solo el ejercicio.'}</Text>
          <Button label="Sacar otra foto" onPress={() => router.replace('/foto')} />
        </View>
      </FullScreen>
    );
  }

  if (index === null) {
    return (
      <FullScreen title="Elige un ejercicio">
        <Text style={s.body}>Encontré {exercises.length} ejercicios. ¿Con cuál partimos?</Text>
        {exercises.map((ex, i) => (
          <Card key={i} onPress={() => setIndex(i)} accessibilityLabel={`Ejercicio ${i + 1}`} style={{ gap: 6 }}>
            <Chip label={`Ejercicio ${i + 1}`} tone="neutral" />
            <MathText source={safeRich(ex.statement)} size={15} />
          </Card>
        ))}
      </FullScreen>
    );
  }

  const ex = exercises[index]!;
  const statement = edited[index] ?? safeRich(ex.statement);
  const gen = ex.topic && GENERATORS[ex.topic] ? GENERATORS[ex.topic] : null;
  const unit = gen ? unitOfGenerator(gen.id, UNIT_GENERATORS) : null;

  const footer = (
    <View style={{ gap: 8 }}>
      <Button label="Explícamelo" onPress={() => setAskOpen(true)} />
      {gen && unit ? (
        <Button
          label="5 ejercicios parecidos"
          variant="secondary"
          onPress={() =>
            router.push({ pathname: '/practica/[unit]', params: { unit, gen: gen.id, diff: String(clampDiff(ex.difficulty)), count: '5' } })
          }
        />
      ) : null}
    </View>
  );

  return (
    <FullScreen title="Tu ejercicio" footer={footer}>
      {imageUri ? <Image source={{ uri: imageUri }} style={s.photo} contentFit="cover" accessibilityLabel="Tu foto" /> : null}
      <Card style={{ gap: 10 }}>
        <View style={s.row}>
          <Text style={[s.strong, { flex: 1 }]}>Leí esto</Text>
          <Tappable accessibilityRole="button" onPress={() => setEditing((e) => !e)} style={s.edit}>
            <Text style={s.link}>{editing ? 'Listo' : 'Corregir'}</Text>
          </Tappable>
        </View>
        {editing ? (
          <TextInput
            value={statement}
            onChangeText={(t) => setEdited((e) => ({ ...e, [index]: t }))}
            multiline
            style={s.input}
            accessibilityLabel="Enunciado"
          />
        ) : (
          <MathText source={statement} size={17} />
        )}
        {ex.options.length ? (
          <View style={{ gap: 4 }}>
            {ex.options.map((o, i) => (
              <MathText key={i} source={`${'ABCDE'[i]}) ${safeRich(o)}`} size={15} />
            ))}
          </View>
        ) : null}
      </Card>

      {gen ? (
        <Card tone="sky" padding={14} style={{ gap: 6 }}>
          <View style={s.row}>
            <Chip label="Verificado" tone="success" />
            <Text style={[s.strong, { flex: 1 }]}>{gen.title}</Text>
          </View>
          <Text style={s.small}>Te armo ejercicios parecidos, siempre nuevos. Los corrige el motor de MePreparo, paso a paso.</Text>
        </Card>
      ) : (
        <Text style={s.small}>Todavía no tengo ejercicios verificados de este tema, pero Equis te lo puede explicar.</Text>
      )}
      <HandNote>Primero piénsalo tú; yo te acompaño.</HandNote>
      {exercises.length > 1 ? <Button label="Ver los otros ejercicios de la foto" variant="ghost" onPress={() => setIndex(null)} /> : null}

      <AskEquisSheet visible={askOpen} onClose={() => setAskOpen(false)} input={{ statement, options: ex.options.length ? ex.options : undefined }} />
    </FullScreen>
  );
}

const s = StyleSheet.create({
  center: { alignItems: 'center', gap: 12, paddingVertical: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  photo: { width: '100%', height: 150, borderRadius: 16, backgroundColor: colors.paper2 },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink },
  body: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 22, color: colors.ink, textAlign: 'center' },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
  link: { fontFamily: fonts['poppins-semibold'], fontSize: 14, color: colors.sky700 },
  edit: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 8 },
  input: {
    minHeight: 90,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.sky,
    backgroundColor: colors.white,
    padding: 12,
    fontFamily: fonts.poppins,
    fontSize: 15,
    color: colors.ink,
    textAlignVertical: 'top',
  },
});
