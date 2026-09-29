import { LearnScreen } from '@/features/learn/LearnScreen';
import { Tour } from '@/features/tour/Tour';

export default function Route() {
  return (
    <>
      <LearnScreen />
      <Tour id="learn" />
    </>
  );
}
