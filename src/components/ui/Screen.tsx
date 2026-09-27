import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GridBackground } from './GridBackground';

type Props = {
  children: ReactNode;
  /** Sin scroll para pantallas con interactivos que manejan sus propios gestos. */
  scroll?: boolean;
  grid?: boolean;
};

/** Contenedor base: fondo papel + cuadrícula de cuaderno + márgenes seguros. */
export function Screen({ children, scroll = true, grid = true }: Props) {
  const body = <View className="w-full max-w-content flex-1 self-center px-5 py-4">{children}</View>;
  return (
    <View className="flex-1 bg-paper">
      {grid && <GridBackground />}
      <SafeAreaView className="flex-1">
        {scroll ? <ScrollView contentContainerClassName="flex-grow">{body}</ScrollView> : body}
      </SafeAreaView>
    </View>
  );
}
