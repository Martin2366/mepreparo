import { useLocalSearchParams } from 'expo-router';

import { IntensiveScreen } from '@/features/intensives/IntensiveScreens';

export default function IntensiveRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <IntensiveScreen id={id} />;
}
