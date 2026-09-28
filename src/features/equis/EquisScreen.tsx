import { type Href, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Icon, type IconName } from '@/components/ui/Icon';
import { HandNote, Mascot } from '@/components/ui/Mascot';
import { MathText } from '@/components/ui/MathText';
import { Text } from '@/components/ui/Text';
import { careerById } from '@/features/onboarding/admission';
import { useDashboard } from '@/features/progress/derived';
import { Section, TabScreen } from '@/features/shell/TabScreen';
import { colors, fonts } from '@/theme/tokens';

type Shortcut = { icon: IconName; label: string; href?: Href; soon?: boolean };

/**
 * Equis (PRD §10): el tutor que te conoce, no un chat en blanco. En el Hito 1 la portada usa lo que ya sabemos
 * (último error, plan, carrera) y sus atajos llevan a funciones locales; la conversación llega con la API (Hito 3).
 */
export function EquisScreen() {
  const d = useDashboard();
  const name = d.answers.name.trim();
  const career = careerById(d.answers.careerId);
  const last = Object.values(d.progress.notebook).sort((a, b) => (a.lastWrongOn < b.lastWrongOn ? 1 : -1))[0];
  const focusUnit = d.next?.unitId ?? d.session.find((x) => x.kind === 'practice')?.unitId;

  const shortcuts: Shortcut[] = [
    { icon: 'notebook-pen', label: 'Explícame mi último error', href: last ? '/cuaderno' : undefined },
    { icon: 'target', label: '¿Qué estudio hoy?', href: '/(tabs)' },
    {
      icon: 'zap',
      label: 'Quiz de 5 minutos de lo que me cuesta',
      href: focusUnit ? { pathname: '/practica/[unit]', params: { unit: focusUnit, count: '5' } } : undefined,
    },
    { icon: 'graduation-cap', label: career ? `¿Me alcanza para ${career.name}?` : '¿Me alcanza para mi carrera?', href: '/(tabs)/progreso' },
    { icon: 'camera', label: 'Sácale foto a un ejercicio', soon: true },
    { icon: 'lightbulb', label: 'No entiendo un concepto', href: '/(tabs)/aprender' },
  ];

  return (
    <TabScreen title="Equis">
      <View style={s.hero}>
        <Mascot pose="explicando" height={120} />
        <View style={s.bubble}>
          <Text style={s.hello}>{name ? `Hola, ${name}.` : 'Hola.'}</Text>
          {last ? (
            <>
              <Text style={s.body}>La última vez te costó esto:</Text>
              <MathText source={last.prompt} size={15} />
              <Text style={s.body}>¿Lo repasamos juntos?</Text>
            </>
          ) : (
            <Text style={s.body}>Soy tu compañero de estudio. Te explico sin apuro, las veces que haga falta.</Text>
          )}
        </View>
      </View>

      <Section title="Atajos">
        <View style={s.grid}>
          {shortcuts.map((sc) => (
            <Card
              key={sc.label}
              onPress={sc.href ? () => router.push(sc.href!) : undefined}
              style={[s.shortcut, !sc.href && { opacity: sc.soon ? 1 : 0.6 }]}
              accessibilityLabel={sc.label}
            >
              <Icon name={sc.icon} size={22} color={colors.sky700} />
              <Text style={s.shortcutText}>{sc.label}</Text>
              {sc.soon ? <Chip label="Pronto" tone="neutral" /> : null}
            </Card>
          ))}
        </View>
      </Section>

      <Card tone="sky" style={{ gap: 8 }}>
        <View style={s.row}>
          <Icon name="message-circle" size={20} color={colors.sky700} />
          <Text style={s.strong}>Conversar con Equis</Text>
          <View style={{ flex: 1 }} />
          <Chip label="Muy pronto" tone="neutral" />
        </View>
        <Text style={s.body}>
          Podrás preguntarle cualquier duda. Equis te pregunta primero qué intentaste, te da la siguiente idea y te explica con gráficos
          y ejemplos. Las respuestas las verifica el motor, no una IA.
        </Text>
        <HandNote>Yo no te doy la respuesta: te ayudo a llegar.</HandNote>
      </Card>
    </TabScreen>
  );
}

const s = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubble: {
    flex: 1,
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
  },
  hello: { fontFamily: fonts['poppins-semibold'], fontSize: 18, lineHeight: 24, color: colors.ink },
  body: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 21, color: colors.graphite },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  shortcut: { width: '48%', flexGrow: 1, gap: 8, minHeight: 110 },
  shortcutText: { fontFamily: fonts['poppins-semibold'], fontSize: 15, lineHeight: 20, color: colors.ink },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 16, color: colors.ink },
});
