import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedSolution } from '@/components/ui/AnimatedSolution';
import { Button } from '@/components/ui/Button';
import { HandNote, Mascot } from '@/components/ui/Mascot';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { enqueue } from '@/data/attempts';
import { type Explanation, safeRich } from '@/engine/equis';
import { requestSync } from '@/features/cloud/sync';
import { LimitCard } from '@/features/premium/LimitCard';
import { useAllowance } from '@/features/progress/allowance';
import { dur } from '@/theme/motion';
import { colors, fonts } from '@/theme/tokens';

import { ERROR_TEXT, type EquisError, explain } from './api';

/** Hoja inferior del design system (modal con fondo tenue). */
export function Sheet({ visible, onClose, onShow, children }: { visible: boolean; onClose: () => void; onShow?: () => void; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} onShow={onShow} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <Pressable style={s.backdrop} onPress={onClose} accessibilityLabel="Cerrar" />
        <Animated.View entering={SlideInDown.duration(dur.slow)} style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
          <View style={s.grabber} />
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export type ExplainInput = { statement: string; options?: string[]; solution?: string; studentAnswer?: string; mistake?: string };

/** «Pregúntale a Equis» sobre un ejercicio: explicación en pasos animados + pregunta de comprobación. */
export function AskEquisSheet({ visible, onClose, input }: { visible: boolean; onClose: () => void; input: ExplainInput }) {
  const tutor = useAllowance('tutor');
  const [state, setState] = useState<{ kind: 'idle' } | { kind: 'loading' } | { kind: 'done'; data: Explanation } | { kind: 'error'; error: EquisError }>({
    kind: 'idle',
  });

  const start = () => {
    if (state.kind !== 'idle' || !tutor.ok) return;
    setState({ kind: 'loading' });
    tutor.use();
    explain(input).then((r) => setState(r.ok ? { kind: 'done', data: r.data } : { kind: 'error', error: r.error }));
  };

  const close = () => {
    onClose();
    // La próxima vez vuelve a preguntar (puede ser otro ejercicio).
    setTimeout(() => setState({ kind: 'idle' }), 300);
  };

  return (
    <Sheet visible={visible} onClose={close} onShow={start}>
      <ScrollView style={{ maxHeight: 520 }} contentContainerStyle={{ gap: 12 }}>
        <View style={s.row}>
          <Mascot pose="explicando" height={56} float={false} />
          <Text style={s.title}>Veámoslo juntos</Text>
        </View>
        {!tutor.ok && state.kind === 'idle' ? (
          <LimitCard title="Hoy ya conversaste 3 veces con Equis" free="Mañana se recargan. Las pistas y la explicación de cada error siguen gratis." compact />
        ) : state.kind === 'loading' || state.kind === 'idle' ? (
          <View style={s.center}>
            <ActivityIndicator color={colors.sky700} />
            <Text style={s.small}>Equis está pensando…</Text>
          </View>
        ) : state.kind === 'error' ? (
          <Text style={s.body}>{ERROR_TEXT[state.error]}</Text>
        ) : (
          <>
            <AnimatedSolution steps={state.data.steps.map((st) => ({ text: safeRich(st.text), math: st.math ? safeRich(st.math) : null }))} />
            {state.data.question ? <HandNote>{safeRich(state.data.question).replace(/\$/g, '')}</HandNote> : null}
            <Text style={s.caption}>Equis te guía; si tu respuesta está bien lo decide el motor de MePreparo.</Text>
          </>
        )}
      </ScrollView>
      <Button label="Volver al ejercicio" variant="secondary" onPress={close} />
    </Sheet>
  );
}

const REASONS = ['La respuesta está mal', 'El enunciado es confuso', 'Falta de ortografía', 'Otro'] as const;

/** Reportar un error de contenido: se guarda en el teléfono y se sube con la sincronización. */
export function ReportSheet({ visible, onClose, refId }: { visible: boolean; onClose: () => void; refId: string }) {
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  const close = () => {
    onClose();
    setTimeout(() => {
      setReason(null);
      setNote('');
      setSent(false);
    }, 300);
  };

  const send = () => {
    if (!reason) return;
    enqueue('report', { ref: refId, reason, note: note.trim() || null });
    requestSync(1000);
    setSent(true);
  };

  return (
    <Sheet visible={visible} onClose={close}>
      {sent ? (
        <View style={[s.center, { paddingVertical: 12 }]}>
          <Mascot pose="celebrando" height={90} float={false} />
          <Text style={s.title}>¡Gracias! Lo revisamos.</Text>
          <Text style={s.small}>Cada reporte mejora MePreparo para todos.</Text>
          <Button label="Listo" onPress={close} />
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          <Text style={s.title}>¿Qué encontraste?</Text>
          {REASONS.map((r) => (
            <Tappable key={r} accessibilityRole="radio" accessibilityState={{ selected: reason === r }} onPress={() => setReason(r)} style={[s.option, reason === r && s.optionOn]}>
              <Text style={s.body}>{r}</Text>
            </Tappable>
          ))}
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Cuéntanos más (opcional)"
            placeholderTextColor={colors.graphite300}
            maxLength={500}
            multiline
            style={s.input}
          />
          <Button label="Enviar reporte" disabled={!reason} onPress={send} />
        </View>
      )}
    </Sheet>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(30,42,74,0.35)' },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 12,
  },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.graphite200, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  center: { alignItems: 'center', gap: 8, paddingVertical: 20 },
  title: { fontFamily: fonts['poppins-semibold'], fontSize: 18, lineHeight: 24, color: colors.ink },
  body: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 22, color: colors.ink },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite, textAlign: 'center' },
  caption: { fontFamily: fonts.poppins, fontSize: 12, lineHeight: 17, color: colors.graphite },
  option: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5, borderColor: colors.graphite200, backgroundColor: colors.white },
  optionOn: { borderColor: colors.sky, backgroundColor: colors.sky50 },
  input: {
    minHeight: 72,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.graphite200,
    backgroundColor: colors.white,
    padding: 12,
    fontFamily: fonts.poppins,
    fontSize: 15,
    color: colors.ink,
    textAlignVertical: 'top',
  },
});
