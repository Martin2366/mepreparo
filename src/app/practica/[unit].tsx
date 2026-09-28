import { useLocalSearchParams } from 'expo-router';

import { PracticeScreen } from '@/features/practice/PracticeScreen';

export default function PracticeRoute() {
  const { unit, count, intensive, day } = useLocalSearchParams<{ unit: string; count?: string; intensive?: string; day?: string }>();
  return (
    <PracticeScreen
      unitId={unit}
      count={count ? Number(count) : undefined}
      intensive={intensive && day ? { id: intensive, day: Number(day) } : undefined}
    />
  );
}
