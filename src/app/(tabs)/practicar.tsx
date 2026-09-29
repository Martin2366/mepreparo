import { PracticeTab } from '@/features/practice/PracticeTab';
import { Tour } from '@/features/tour/Tour';

export default function Route() {
  return (
    <>
      <PracticeTab />
      <Tour id="practice" />
    </>
  );
}
