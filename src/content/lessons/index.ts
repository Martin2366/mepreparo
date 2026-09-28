/**
 * Índice de contenido por unidad. Metro necesita `require` estáticos: al agregar una unidad nueva,
 * se suma aquí su archivo (el validador avisa si hay un JSON en `lessons/` que no está en este índice).
 */
const UNIT_FILES: unknown[] = [
  require('./m1/ecuaciones-inecuaciones.json'),
  require('./m1/funcion-lineal-afin.json'),
];

export default UNIT_FILES;
