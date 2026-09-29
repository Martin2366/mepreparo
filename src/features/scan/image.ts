import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import type { Region } from '@/engine/equis';


const MAX_SIDE = 1280;

/**
 * Recorta a la región del marco y reduce a ≤ 1280 px en JPEG: menos datos, menos costo y lectura igual de buena.
 * Devuelve base64 para enviarlo a Equis (la foto no se guarda en ningún servidor).
 */
export async function prepare(uri: string, width: number, height: number, region?: Region): Promise<string> {
  const ctx = ImageManipulator.manipulate(uri);
  let w = width;
  let h = height;
  if (region) {
    const crop = {
      originX: Math.round(region.x * width),
      originY: Math.round(region.y * height),
      width: Math.round(region.w * width),
      height: Math.round(region.h * height),
    };
    ctx.crop(crop);
    w = crop.width;
    h = crop.height;
  }
  if (Math.max(w, h) > MAX_SIDE) ctx.resize(w >= h ? { width: MAX_SIDE } : { height: MAX_SIDE });
  const img = await ctx.renderAsync();
  const out = await img.saveAsync({ format: SaveFormat.JPEG, compress: 0.7, base64: true });
  return out.base64 ?? '';
}

/** Elegir una foto de la galería, con el recorte del sistema. */
export async function pickFromGallery(): Promise<{ uri: string; width: number; height: number } | null> {
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.9 });
  if (res.canceled || !res.assets?.[0]) return null;
  const a = res.assets[0];
  return { uri: a.uri, width: a.width, height: a.height };
}
