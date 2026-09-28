import { StyleSheet, View } from 'react-native';

import { colors, fonts } from '@/theme/tokens';

import { Icon, type IconName } from './Icon';
import { Text } from './Text';

export type ChipTone = 'sky' | 'neutral' | 'success' | 'premium' | 'new' | 'ink';

const TONES: Record<ChipTone, { bg: string; fg: string }> = {
  sky: { bg: colors.sky100, fg: colors.sky700 },
  neutral: { bg: colors.graphite100, fg: colors.graphite },
  success: { bg: colors.success100, fg: colors.success700 },
  /** Premium y "Nuevo": pastilla coral clara (el coral queda reservado para lo especial). */
  premium: { bg: colors.coral50, fg: colors.coral700 },
  new: { bg: colors.coral50, fg: colors.coral700 },
  ink: { bg: colors.ink, fg: colors.white },
};

/** Pastilla (Badge/Tag del design system). */
export function Chip({ label, tone = 'sky', icon }: { label: string; tone?: ChipTone; icon?: IconName }) {
  const t = TONES[tone];
  return (
    <View style={[s.chip, { backgroundColor: t.bg }]}>
      {icon ? <Icon name={icon} size={14} color={t.fg} /> : null}
      <Text style={[s.label, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

export const PremiumTag = () => <Chip label="Premium" tone="premium" />;

const s = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  label: { fontFamily: fonts['poppins-semibold'], fontSize: 12, lineHeight: 17 },
});
