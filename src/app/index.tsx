import Constants from 'expo-constants';
import { Link, Redirect } from 'expo-router';
import * as Updates from 'expo-updates';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { HandNote, Mascot } from '@/components/ui/Mascot';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import paes from '@/content/paes-config.json';
import { careerById, institutionById } from '@/features/onboarding/admission';
import { daysUntil, formatScore } from '@/features/onboarding/model';
import { useOnboarding } from '@/features/onboarding/store';

/**
 * Inicio provisorio: confirma lo respondido en el onboarding mientras se construyen las pestañas
 * (Inicio, Practicar, Progreso, Perfil). Si el onboarding no terminó, lo retoma donde quedó.
 */
export default function Home() {
  const completed = useOnboarding((s) => s.completed);
  const a = useOnboarding((s) => s.answers);
  const reset = useOnboarding((s) => s.reset);

  if (!completed) return <Redirect href="/onboarding" />;

  const career = careerById(a.careerId);
  const inst = institutionById(a.institutionId);
  const session = a.session && a.session !== 'unknown' ? paes.sessions[a.session] : undefined;
  const days = session?.start ? daysUntil(session.start, new Date()) : undefined;

  return (
    <Screen>
      <View className="flex-1 gap-6">
        <View className="flex-row items-center gap-3">
          <Mascot pose="saludo" height={90} />
          <View className="flex-1">
            <Text variant="h2">{a.name ? `Hola, ${a.name}.` : 'Hola.'}</Text>
            <Text variant="small">Tu plan se arma con esto:</Text>
          </View>
        </View>

        <View className="gap-3 rounded-lg border border-line bg-white px-4 py-4">
          <Row label="Meta" value={career ? `${career.name}${inst ? ` · ${inst.name}` : ''}` : 'Carrera por definir'} />
          {a.target ? <Row label="Puntaje meta" value={`${formatScore(a.target)} puntos`} /> : null}
          <Row label="PAES" value={session ? `${session.label}${days && days > 0 ? ` · faltan ${days} días` : ''}` : 'Por definir'} />
          <Row label="Pruebas" value={a.tests?.length ? a.tests.join(', ').toUpperCase() : 'Por definir'} />
          <Row label="Temas a reforzar" value={a.topics.length ? `${a.topics.length} marcados` : 'Ninguno marcado'} />
        </View>

        <Text variant="small">Siguiente: las pantallas que faltan del onboarding y las pestañas de la app.</Text>

        <View className="gap-3">
          <Link href="/dev/balance" asChild>
            <Button label="Probar la balanza" variant="secondary" arrow={false} />
          </Link>
          <Link href="/dev/math" asChild>
            <Button label="Ver matemática legible" variant="secondary" arrow={false} />
          </Link>
          <Button label="Repetir onboarding" variant="ghost" arrow={false} onPress={reset} />
        </View>

        <View className="mt-auto flex-row items-end justify-between">
          <HandNote>Tú puedes.</HandNote>
          <Text variant="caption">
            v{Constants.expoConfig?.version ?? '—'} · canal {Updates.channel || 'dev'}
          </Text>
        </View>
      </View>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-0.5">
      <Text variant="overline" className="text-graphite">
        {label}
      </Text>
      <Text className="text-ink">{value}</Text>
    </View>
  );
}
