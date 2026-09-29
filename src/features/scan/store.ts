import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';
import { create } from 'zustand';

import type { ScanResult } from '@/engine/equis';

/** ¿Este build trae cámara, galería y recorte? (el development build anterior no los trae). */
export function scanAvailable(): boolean {
  if (Platform.OS === 'web') return true;
  return !!(
    requireOptionalNativeModule('ExpoCamera') &&
    requireOptionalNativeModule('ExponentImagePicker') &&
    requireOptionalNativeModule('ExpoImageManipulator')
  );
}

type ScanState = {
  imageUri: string | null;
  result: ScanResult | null;
  set: (patch: Partial<Pick<ScanState, 'imageUri' | 'result'>>) => void;
};

/** Última foto leída (solo en memoria: la foto nunca se guarda). */
export const useScan = create<ScanState>()((set) => ({ imageUri: null, result: null, set: (patch) => set(patch) }));
