/**
 * Índice de contenido por unidad. Metro necesita `require` estáticos: al agregar una unidad nueva,
 * se suma aquí su archivo (el validador avisa si hay un JSON en `lessons/` que no está en este índice).
 */
const UNIT_FILES: unknown[] = [
  require('./m1/ecuaciones-inecuaciones.json'),
  require('./m1/funcion-lineal-afin.json'),
  require('./m1/expresiones-algebraicas.json'),
  require('./m1/proporcionalidad.json'),
  require('./m1/sistemas-2x2.json'),
  require('./m1/funcion-cuadratica.json'),
  require('./m1/enteros-racionales.json'),
  require('./m1/porcentaje.json'),
  require('./m1/potencias-raices.json'),
  require('./m1/figuras.json'),
  require('./m1/cuerpos.json'),
  require('./m1/transformaciones.json'),
  require('./m1/semejanza.json'),
  require('./m1/tablas-graficos.json'),
  require('./m1/medidas-posicion.json'),
  require('./m1/reglas-probabilidad.json'),
];

export default UNIT_FILES;
