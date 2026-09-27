/** Versión web (solo para la vista previa de diseño): localStorage, tolerante a navegadores que lo bloquean. */
export const kv = {
  getItem: (key: string): string | null => {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      // Sin almacenamiento disponible: la sesión sigue en memoria.
    }
  },
  removeItem: (key: string): void => {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      // Ídem.
    }
  },
};
