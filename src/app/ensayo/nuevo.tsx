import { useLocalSearchParams } from 'expo-router';

import type { ExamKind } from '@/engine/exam';
import { ExamSetupScreen } from '@/features/exams/ExamSetupScreen';

const KINDS: ExamKind[] = ['full', 'mini', 'thematic', 'custom'];

export default function NewExamRoute() {
  const { kind, unit } = useLocalSearchParams<{ kind?: string; unit?: string }>();
  const k = KINDS.includes(kind as ExamKind) ? (kind as ExamKind) : 'mini';
  return <ExamSetupScreen key={`${k}-${unit ?? ''}`} kind={k} initialUnits={unit ? [unit] : []} />;
}
