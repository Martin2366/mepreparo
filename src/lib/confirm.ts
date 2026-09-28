import { Alert, Platform } from 'react-native';

/**
 * Confirmación simple. En el teléfono usa el diálogo nativo; en la vista web (donde `Alert` con botones
 * no hace nada) usa `window.confirm`.
 */
export function confirm(title: string, message: string, ok = 'Aceptar', cancel = 'Cancelar'): Promise<boolean> {
  if (Platform.OS === 'web') return Promise.resolve(globalThis.confirm?.(`${title}\n\n${message}`) ?? true);
  return new Promise((resolve) =>
    Alert.alert(title, message, [
      { text: cancel, style: 'cancel', onPress: () => resolve(false) },
      { text: ok, onPress: () => resolve(true) },
    ]),
  );
}
