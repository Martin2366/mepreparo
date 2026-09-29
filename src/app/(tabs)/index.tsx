import { HomeScreen } from '@/features/home/HomeScreen';
import { Tour } from '@/features/tour/Tour';

export default function Route() {
  return (
    <>
      <HomeScreen />
      <Tour id="home" />
    </>
  );
}
