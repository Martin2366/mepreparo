import Storage from 'expo-sqlite/kv-store';

/**
 * Almacenamiento clave-valor local (SQLite). API síncrona a propósito: el estado se escribe
 * en el mismo instante en que el usuario responde, a prueba de cierres (regla del producto).
 */
export const kv = {
  getItem: (key: string): string | null => Storage.getItemSync(key),
  setItem: (key: string, value: string): void => Storage.setItemSync(key, value),
  removeItem: (key: string): void => {
    Storage.removeItemSync(key);
  },
};
