import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { frameToPhoto, type Region } from '@/engine/equis';

const MAX_SIDE = 1280;

/** Ruta de un archivo o imagen en memoria (la foto de la cámara con `pictureRef`). */
export type ImageSource = Parameters<typeof ImageManipulator.manipulate>[0];

export type Prepared = { base64: string; uri: string };

/**
 * Recorta al marco y reduce a ≤ 1280 px en JPEG: menos datos, menos costo y lectura igual de buena.
 * El recorte se calcula sobre la imagen REAL (algunos Android informan medidas giradas): si la foto viene
 * apaisada y la pantalla es vertical, primero se endereza. Devuelve lo mismo que se muestra y se envía.
 */
export async function prepare(
  source: ImageSource,
  frame?: { frame: Region; view: { w: number; h: number } },
): Promise<Prepared> {
  const probe = await ImageManipulator.manipulate(source).renderAsync();
  const ctx = ImageManipulator.manipulate(source);
  let w = probe.width;
  let h = probe.height;
  if (frame && frame.view.h > frame.view.w && w > h) {
    ctx.rotate(90);
    [w, h] = [h, w];
  }
  if (frame) {
    const r = frameToPhoto(frame.frame, frame.view, { w, h });
    const crop = { originX: Math.round(r.x * w), originY: Math.round(r.y * h), width: Math.round(r.w * w), height: Math.round(r.h * h) };
    ctx.crop(crop);
    w = crop.width;
    h = crop.height;
  }
  if (Math.max(w, h) > MAX_SIDE) ctx.resize(w >= h ? { width: MAX_SIDE } : { height: MAX_SIDE });
  const img = await ctx.renderAsync();
  const out = await img.saveAsync({ format: SaveFormat.JPEG, compress: 0.7, base64: true });
  return { base64: out.base64 ?? '', uri: out.uri };
}

/** Elegir una foto de la galería, con el recorte del sistema. */
export async function pickFromGallery(): Promise<string | null> {
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.9 });
  if (res.canceled || !res.assets?.[0]) return null;
  return res.assets[0].uri;
}
