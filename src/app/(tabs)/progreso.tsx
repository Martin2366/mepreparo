import { ProgressTab } from '@/features/progress/ProgressTab';
import { Tour } from '@/features/tour/Tour';

export default function Route() {
  return (
    <>
      <ProgressTab />
      <Tour id="progress" />
    </>
  );
}
