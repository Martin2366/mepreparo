import { useLocalSearchParams } from 'expo-router';

import { LessonScreen } from '@/features/lesson-player/LessonScreen';
import { Tour } from '@/features/tour/Tour';

export default function LessonRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // La clave reinicia el reproductor al pasar a la siguiente lección.
  return (
    <>
      <LessonScreen key={id} lessonId={id} />
      <Tour id="lesson" />
    </>
  );
}
