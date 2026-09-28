/** Pesos chilenos para texto de interfaz: 3990 → "$3.990" (sin depender de Intl). */
export const clp = (n: number) => `$${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
