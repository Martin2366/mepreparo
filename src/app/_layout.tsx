import '@/global.css';
import '@/components/ui/animated';

import { Kalam_400Regular } from '@expo-google-fonts/kalam';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { STIXTwoText_400Regular, STIXTwoText_400Regular_Italic } from '@expo-google-fonts/stix-two-text';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initSentry, Sentry } from '@/lib/sentry';
import { colors } from '@/theme/tokens';

initSentry();
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    STIXTwoText_400Regular,
    STIXTwoText_400Regular_Italic,
    Kalam_400Regular,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // Si una fuente falla, igual se muestra la app (con la fuente del sistema) en vez de quedar pegada en el splash.
  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(RootLayout);
