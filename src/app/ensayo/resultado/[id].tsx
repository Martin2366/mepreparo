import { useLocalSearchParams } from 'expo-router';

import { ExamResultScreen } from '@/features/exams/ExamResultScreen';

export default function ExamResultRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ExamResultScreen id={id} />;
}
