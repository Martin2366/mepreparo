import { useLocalSearchParams } from 'expo-router';

import { UnitScreen } from '@/features/learn/UnitScreen';

export default function UnitRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <UnitScreen unitId={id} />;
}
