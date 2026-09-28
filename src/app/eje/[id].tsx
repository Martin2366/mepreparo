import { useLocalSearchParams } from 'expo-router';

import { AxisScreen } from '@/features/learn/AxisScreen';

export default function AxisRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AxisScreen axisId={id} />;
}
