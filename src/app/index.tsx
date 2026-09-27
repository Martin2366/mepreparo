import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import * as Updates from 'expo-updates';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';

/**
 * Pantalla del Día 1: verifica marca (papel + cuadrícula + Poppins) y da acceso a los spikes.
 * La reemplaza la ruta de Aprender en el Día 5.
 */
export default function Home() {
  return (
    <Screen>
      <View className="flex-1 gap-6">
        <Image
          source={require('@/assets/images/logo/mepreparo-lockup.png')}
          style={{ width: 240, height: 65 }}
          contentFit="contain"
          accessibilityLabel="MePreparo. Entiende, practica, avanza."
        />

        <View className="items-center">
          <Image
            source={require('@/assets/images/mascot/equis-saludo.png')}
            style={{ width: 165, height: 185 }}
            contentFit="contain"
            accessibilityLabel="Equis saluda"
          />
        </View>

        <View className="gap-2">
          <Text variant="overline">Día 1 · Fundaciones</Text>
          <Text variant="h1">Aprender haciendo. Hasta que haga clic.</Text>
          <Text variant="lead" className="text-graphite">
            Hola, soy Equis. Vamos paso a paso, a tu ritmo.
          </Text>
        </View>

        <View className="gap-3">
          <Link href="/dev/math" asChild>
            <Button label="Spike A · Matemática legible" />
          </Link>
          <Link href="/dev/balance" asChild>
            <Button label="Spike B · Balanza" variant="secondary" />
          </Link>
        </View>

        <View className="flex-row items-end justify-between">
          <Text variant="hand" className="-rotate-3">
            Tú puedes.
          </Text>
          <Text variant="caption">
            v{Constants.expoConfig?.version ?? '—'} · canal {Updates.channel || 'dev'}
          </Text>
        </View>
      </View>
    </Screen>
  );
}
