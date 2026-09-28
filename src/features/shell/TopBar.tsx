import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Ring } from '@/components/ui/Ring';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { useDashboard } from '@/features/progress/derived';
import { colors, fonts } from '@/theme/tokens';

/**
 * Cabecera de las pestañas (PRD §7): racha, meta diaria, cuenta regresiva y avatar (→ Perfil).
 * En Inicio va completa; en las demás pestañas, con el título de la pestaña.
 */
export function TopBar({ title }: { title?: string }) {
  const d = useDashboard();
  const initial = (d.answers.name.trim()[0] ?? 'T').toUpperCase();
  const days = d.plan.days;

  return (
    <View style={s.row}>
      {title ? (
        <Text style={s.title} accessibilityRole="header">
          {title}
        </Text>
      ) : (
        <Image
          source={require('@/assets/images/logo/mepreparo-icon.png')}
          style={{ width: 30, height: 29 }}
          contentFit="contain"
          accessibilityLabel="MePreparo"
        />
      )}
      <View style={{ flex: 1 }} />
      <View
        style={s.chip}
        accessible
        accessibilityLabel={`Racha de ${d.streak.current} ${d.streak.current === 1 ? 'día' : 'días'}`}
      >
        <Icon name="flame" size={18} color={d.streak.current > 0 ? colors.coral : colors.graphite300} />
        <Text style={s.chipText}>{d.streak.current}</Text>
      </View>
      <Ring
        value={d.xpToday / d.goalXp}
        size={34}
        stroke={4}
        accessibilityLabel={`Meta diaria: ${d.xpToday} de ${d.goalXp} XP`}
      >
        <Text style={s.ringText}>{Math.min(99, d.xpToday)}</Text>
      </Ring>
      {!title && days !== undefined && days > 0 ? (
        <View style={s.chip} accessible accessibilityLabel={`Faltan ${days} días para tu PAES`}>
          <Icon name="calendar" size={16} color={colors.sky700} />
          <Text style={s.chipText}>{days} d</Text>
        </View>
      ) : null}
      <Tappable
        accessibilityRole="button"
        accessibilityLabel="Abrir perfil"
        onPress={() => router.push('/perfil')}
        style={s.avatar}
        pressedStyle={{ opacity: 0.8 }}
      >
        <Text style={s.avatarText}>{initial}</Text>
      </Tappable>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 52 },
  title: { fontFamily: fonts['poppins-bold'], fontSize: 26, lineHeight: 32, color: colors.ink },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipText: { fontFamily: fonts['poppins-semibold'], fontSize: 14, lineHeight: 18, color: colors.ink },
  ringText: { fontFamily: fonts['poppins-semibold'], fontSize: 11, lineHeight: 13, color: colors.ink },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  avatarText: { fontFamily: fonts['poppins-semibold'], fontSize: 17, lineHeight: 22, color: colors.white },
});
