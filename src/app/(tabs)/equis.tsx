import { EquisScreen } from '@/features/equis/EquisScreen';
import { Tour } from '@/features/tour/Tour';

export default function Route() {
  return (
    <>
      <EquisScreen />
      <Tour id="equis" />
    </>
  );
}
