import { useLocalSearchParams } from 'expo-router';

import { PracticeScreen } from '@/features/practice/PracticeScreen';

export default function PracticeRoute() {
  const { unit, count } = useLocalSearchParams<{ unit: string; count?: string }>();
  return <PracticeScreen unitId={unit} count={count ? Number(count) : undefined} />;
}
