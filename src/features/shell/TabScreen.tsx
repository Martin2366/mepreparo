import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GridBackground } from '@/components/ui/GridBackground';
import { Text } from '@/components/ui/Text';
import { colors, fonts } from '@/theme/tokens';

import { TopBar } from './TopBar';

/** Pantalla de pestaña: papel + cuadrícula, cabecera y contenido con scroll. La barra inferior la pone el layout. */
export function TabScreen({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <View style={s.root}>
      <GridBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          <TopBar title={title} />
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/** Título de sección en versalitas (overline del design system). */
export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 24 }}>
        <Text style={s.overline} accessibilityRole="header">
          {title.toUpperCase()}
        </Text>
        {action}
      </View>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  content: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 32, gap: 22, width: '100%', maxWidth: 720, alignSelf: 'center' },
  overline: { fontFamily: fonts['poppins-semibold'], fontSize: 12, lineHeight: 16, letterSpacing: 1.7, color: colors.graphite },
});
