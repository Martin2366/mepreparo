import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GridBackground } from '@/components/ui/GridBackground';
import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import { goBack } from '@/lib/nav';
import { colors, fonts } from '@/theme/tokens';

type Props = {
  title?: string;
  children: ReactNode;
  /** Sin scroll: el contenido maneja su propio layout (reproductor de lecciones). */
  scroll?: boolean;
  right?: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
  backIcon?: 'arrow-left' | 'x';
};

/** Pantalla completa (sin barra de pestañas) con botón volver y título. */
export function FullScreen({ title, children, scroll = true, right, footer, onBack, backIcon = 'arrow-left' }: Props) {
  const back = onBack ?? (() => goBack());
  return (
    <View style={s.root}>
      <GridBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={s.header}>
          <IconButton icon={backIcon} label={backIcon === 'x' ? 'Cerrar' : 'Volver'} onPress={back} />
          <Text style={s.title} numberOfLines={1} accessibilityRole="header">
            {title ?? ''}
          </Text>
          <View style={{ minWidth: 48, alignItems: 'flex-end' }}>{right}</View>
        </View>
        {scroll ? (
          <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={[s.content, { flex: 1 }]}>{children}</View>
        )}
        {footer ? <View style={s.footer}>{footer}</View> : null}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 4, minHeight: 56 },
  title: { flex: 1, fontFamily: fonts['poppins-semibold'], fontSize: 17, lineHeight: 24, color: colors.ink, textAlign: 'center' },
  content: { paddingHorizontal: 20, paddingBottom: 28, gap: 18, width: '100%', maxWidth: 720, alignSelf: 'center' },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.paper,
  },
});
