import { useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { MathText } from '@/components/ui/MathText';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { safeRich } from '@/engine/equis';
import { LimitCard } from '@/features/premium/LimitCard';
import { useAllowance } from '@/features/progress/allowance';
import { useDashboard } from '@/features/progress/derived';
import { FullScreen } from '@/features/shell/FullScreen';
import { kv } from '@/lib/kv';
import { dur } from '@/theme/motion';
import { colors, fonts } from '@/theme/tokens';

import { chat, type ChatMessage, ERROR_TEXT } from './api';

type ChatState = { messages: ChatMessage[]; add: (m: ChatMessage) => void; clear: () => void };

/** Conversación con Equis: solo en el teléfono (no se sube a la nube). */
const useChat = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      add: (m) => set((s) => ({ messages: [...s.messages, m].slice(-40) })),
      clear: () => set({ messages: [] }),
    }),
    { name: 'mp.chat.v1', storage: createJSONStorage(() => kv), partialize: (s) => ({ messages: s.messages }) },
  ),
);

/** Contexto sin datos personales: meta, foco y último error (PRD §10 «qué recibe»). */
function useContextText() {
  const d = useDashboard();
  const last = Object.values(d.progress.notebook).sort((a, b) => (a.lastWrongOn < b.lastWrongOn ? 1 : -1))[0];
  return [
    d.answers.target ? `Meta: ${d.answers.target} puntos.` : '',
    d.plan.focus.length ? `Foco: ${d.plan.focus.join(', ')}.` : '',
    last ? `Último error: ${last.prompt}` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function ChatScreen() {
  const messages = useChat((s) => s.messages);
  const add = useChat((s) => s.add);
  const clear = useChat((s) => s.clear);
  const tutor = useAllowance('tutor');
  const context = useContextText();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  // Cuenta una conversación (no cada mensaje) al primer envío de esta visita.
  const [counted, setCounted] = useState(false);
  const scroll = useRef<ScrollView>(null);

  const send = async () => {
    const t = text.trim();
    if (!t || busy) return;
    if (!counted) {
      if (!tutor.ok) return;
      tutor.use();
      setCounted(true);
    }
    setText('');
    setNote(null);
    const next = [...messages, { role: 'user' as const, text: t }];
    add({ role: 'user', text: t });
    setBusy(true);
    const r = await chat(next.slice(-8), context);
    setBusy(false);
    if (r.ok) add({ role: 'equis', text: r.data.reply });
    else setNote(ERROR_TEXT[r.error]);
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
  };

  const blocked = !tutor.ok && !counted;

  return (
    <FullScreen title="Conversar con Equis" scroll={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView ref={scroll} contentContainerStyle={{ gap: 10, paddingBottom: 12 }} onContentSizeChange={() => scroll.current?.scrollToEnd()}>
          {messages.length === 0 ? (
            <View style={s.empty}>
              <Mascot pose="saludo" height={110} float={false} />
              <Text style={s.body}>Cuéntame qué ejercicio o tema te cuesta. Te pregunto primero qué intentaste y vamos de a poco.</Text>
            </View>
          ) : (
            <Tappable accessibilityRole="button" onPress={clear} style={s.clear}>
              <Text style={s.link}>Empezar una conversación nueva</Text>
            </Tappable>
          )}
          {messages.map((m, i) => (
            <Animated.View key={i} entering={FadeInUp.duration(dur.base)} style={[s.bubble, m.role === 'user' ? s.mine : s.theirs]}>
              {m.role === 'user' ? <Text style={s.body}>{m.text}</Text> : <MathText source={safeRich(m.text)} size={15} />}
            </Animated.View>
          ))}
          {busy ? (
            <View style={[s.bubble, s.theirs, { flexDirection: 'row', gap: 8 }]}>
              <ActivityIndicator color={colors.sky700} />
              <Text style={s.small}>Equis está pensando…</Text>
            </View>
          ) : null}
          {note ? <Text style={s.small}>{note}</Text> : null}
          {blocked ? <LimitCard title="Hoy ya conversaste 3 veces con Equis" free="Mañana se recargan. Las pistas y explicaciones siguen gratis." compact /> : null}
        </ScrollView>
        <View style={[s.composer, { marginBottom: Math.max(insets.bottom, 8) }]}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Escribe tu duda…"
            placeholderTextColor={colors.graphite300}
            style={s.input}
            multiline
            maxLength={600}
            editable={!blocked}
          />
          <Tappable accessibilityRole="button" accessibilityLabel="Enviar" onPress={send} style={[s.send, (!text.trim() || blocked) && { opacity: 0.4 }]}>
            <Icon name="send" size={20} color={colors.ink} />
          </Tappable>
        </View>
      </KeyboardAvoidingView>
    </FullScreen>
  );
}

const s = StyleSheet.create({
  empty: { alignItems: 'center', gap: 10, paddingVertical: 16 },
  bubble: { maxWidth: '88%', padding: 12, borderRadius: 18 },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.sky100, borderBottomRightRadius: 6 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 6 },
  body: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 22, color: colors.ink },
  small: { fontFamily: fonts.poppins, fontSize: 13, lineHeight: 19, color: colors.graphite },
  link: { fontFamily: fonts['poppins-semibold'], fontSize: 13, color: colors.sky700 },
  clear: { alignSelf: 'center', minHeight: 40, justifyContent: 'center' },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingTop: 8 },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.graphite200,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fonts.poppins,
    fontSize: 15,
    color: colors.ink,
  },
  send: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center' },
});
