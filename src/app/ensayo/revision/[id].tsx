import { useLocalSearchParams } from 'expo-router';

import { ExamReviewScreen } from '@/features/exams/ExamReviewScreen';

export default function ExamReviewRoute() {
  const { id, q } = useLocalSearchParams<{ id: string; q?: string }>();
  return <ExamReviewScreen id={id} index={Number(q ?? 0)} />;
}
