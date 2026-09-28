import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Platform, StyleSheet, View } from 'react-native';

import { colors, fonts } from '@/theme/tokens';

import { Icon, type IconName } from './Icon';
import { Tappable } from './Tappable';
import { Text } from './Text';

const ITEMS: Record<string, { label: string; icon: IconName | 'equis' }> = {
  index: { label: 'Inicio', icon: 'house' },
  aprender: { label: 'Aprender', icon: 'book' },
  equis: { label: 'Equis', icon: 'equis' },
  practicar: { label: 'Practicar', icon: 'target' },
  progreso: { label: 'Progreso', icon: 'trending-up' },
};

/**
 * Barra inferior (D12): 5 pestañas con Equis al centro, destacado en un círculo celeste.
 * Propia en vez de la del navegador para controlar la pestaña central y la tipografía de marca.
 */
export function TabBar({ state, navigation, insets }: BottomTabBarProps) {
  return (
    <View style={[s.bar, { paddingBottom: Math.max(insets.bottom, 8) }]} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const item = ITEMS[route.name];
        if (!item) return null;
        const focused = state.index === index;
        const color = focused ? colors.sky700 : colors.graphite;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            navigation.navigate(route.name);
          }
        };
        return (
          <Tappable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={item.label}
            onPress={onPress}
            style={s.item}
            pressedStyle={s.pressed}
          >
            {item.icon === 'equis' ? (
              <View style={[s.equis, focused && s.equisOn]}>
                <Image
                  source={require('@/assets/images/mascot/expr-curioso.png')}
                  style={{ width: 34, height: 34 }}
                  contentFit="contain"
                />
              </View>
            ) : (
              <View style={[s.iconWrap, focused && s.iconOn]}>
                <Icon name={item.icon} size={22} color={color} strokeWidth={focused ? 2.4 : 2} />
              </View>
            )}
            <Text style={[s.label, { color: focused ? colors.ink : colors.graphite }, focused && s.labelOn]}>
              {item.label}
            </Text>
          </Tappable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 6,
    paddingHorizontal: 4,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 2, minHeight: 52 },
  pressed: { transform: [{ scale: 0.95 }] },
  iconWrap: { width: 52, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  iconOn: { backgroundColor: colors.sky100 },
  equis: {
    width: 52,
    height: 52,
    marginTop: -18,
    borderRadius: 26,
    backgroundColor: colors.sky100,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.ink,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  equisOn: { backgroundColor: colors.sky },
  label: { fontFamily: fonts['poppins-medium'], fontSize: 11, lineHeight: 14 },
  labelOn: { fontFamily: fonts['poppins-semibold'] },
});
