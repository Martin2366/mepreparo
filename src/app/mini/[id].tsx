import { useLocalSearchParams } from 'expo-router';

import { MiniClassScreen } from '@/features/learn/MiniClassScreen';

export default function MiniClassRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <MiniClassScreen key={id} id={id} />;
}
