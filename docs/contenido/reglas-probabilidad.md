# reglas-probabilidad

> Generado por `npm run content:preview`. No editar a mano: se edita el JSON.

## m1-rp-1 · Casos favorables y posibles (draft, ~6 min)

**1. [explain]**
*La regla de Laplace*
Si todos los resultados son igual de probables, la probabilidad de un evento es casos favorables dividido por casos posibles. Siempre queda entre 0 (imposible) y 1 (seguro).

**2. [numeric]** · resolver · dificultad 1
Al lanzar un dado común, ¿cuál es la probabilidad de obtener un número mayor que 4? Responde como fracción.

Respuesta: **1/3**
- Si escribe 1/2 → Casi. Mayor que 4 son solo el 5 y el 6: 2 casos de 6.
- Si escribe 2 → Casi. 2 son los casos favorables; falta dividir por los 6 posibles.
- Otro error → Casi. Cuenta los casos favorables (5 y 6) y divide por 6.

Pistas: (1) Favorables: 5 y 6.
Resolución: $\frac{2}{6}=\frac{1}{3}$

**3. [choice]** · resolver · dificultad 1
Una bolsa tiene 3 bolitas rojas, 5 azules y 2 verdes. Se saca una al azar. ¿Cuál es la probabilidad de que sea azul?

- A) $\frac{1}{2}$  ✅
- B) $\frac{5}{3}$  → Casi. Se divide por el total de bolitas, no por las rojas.
- C) $\frac{1}{5}$  → Casi. Hay 5 azules de 10: la probabilidad es $\frac{5}{10}$.
- D) $\frac{5}{8}$  → Casi. El total es $3+5+2=10$, no 8.

Pistas: (1) Total: $3+5+2$.
Resolución: $\frac{5}{10}=\frac{1}{2}$

**4. [explain]**
*El complemento*
La probabilidad de que algo NO ocurra es 1 menos la probabilidad de que ocurra: P(no A) = 1 − P(A). A veces es mucho más fácil contar lo contrario.

**5. [numeric]** · resolver · dificultad 2
Con la misma bolsa, ¿cuál es la probabilidad de que la bolita NO sea verde? Responde como fracción.

Respuesta: **4/5**
- Si escribe 1/5 → Casi. Esa es la probabilidad de que SÍ sea verde.
- Otro error → Casi. Calcula 1 − P(verde).

Pistas: (1) P(verde) = $\frac{2}{10}$
Resolución: $1-\frac{2}{10}=\frac{8}{10}=\frac{4}{5}$

**6. [choice]** · modelar · dificultad 2
Se lanzan dos monedas. ¿Cuál es la probabilidad de obtener exactamente una cara?

- A) $\frac{1}{2}$  ✅
- B) $\frac{1}{3}$  → Casi. Los resultados posibles son 4 (CC, CS, SC, SS), no 3: CS y SC son distintos.
- C) $\frac{1}{4}$  → Casi. Hay dos formas de obtener una sola cara: CS y SC.
- D) $\frac{3}{4}$  → Casi. $\frac{3}{4}$ es la probabilidad de al menos una cara.

Pistas: (1) Escribe los 4 resultados: CC, CS, SC, SS.
Resolución: Favorables: CS y SC → $\frac{2}{4}=\frac{1}{2}$

**7. [numeric]** · modelar · dificultad 3
Se lanzan dos dados. ¿Cuál es la probabilidad de que la suma sea 7? Responde como fracción.

Respuesta: **1/6**
- Si escribe 1/11 → Casi. Las 11 sumas posibles no son igual de probables; hay 36 resultados.
- Si escribe 1/12 → Casi. Hay 6 pares que suman 7, no 3: (1,6) y (6,1) son distintos.
- Otro error → Casi. Hay 36 resultados; cuenta los pares que suman 7.

Pistas: (1) (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)
Resolución: $\frac{6}{36}=\frac{1}{6}$

## m1-rp-2 · Lanzar mil veces (draft, ~5 min)

**1. [explain]**
*Frecuencia y probabilidad*
Si repites un experimento muchas veces, la frecuencia relativa de un resultado se acerca a su probabilidad. Esto es la ley de los grandes números. Con pocos intentos, en cambio, puede pasar casi cualquier cosa.

**2. [choice]** · argumentar · dificultad 1
Lanzas una moneda 10 veces y salen 7 caras. ¿Qué puedes concluir?

- A) Nada seguro: con 10 lanzamientos es un resultado posible  ✅
- B) La moneda está cargada  → Casi. Con tan pocos lanzamientos, 7 caras puede pasar con una moneda justa.
- C) La próxima saldrá sello  → Casi. La moneda no tiene memoria: sigue siendo mitad y mitad.
- D) La probabilidad de cara es 0,7  → Casi. Con 10 intentos la frecuencia aún puede estar lejos de la probabilidad.

Por qué: Con pocos intentos la frecuencia varía mucho. Harían falta muchos más lanzamientos para sospechar.

Pistas: (1) ¿10 lanzamientos son muchos?

**3. [numeric]** · modelar · dificultad 2
Si lanzas un dado 600 veces, ¿cuántas veces esperas que salga un 3, aproximadamente?

Respuesta: **100**
- Si escribe 200 → Casi. La probabilidad de un 3 es $\frac{1}{6}$, no $\frac{1}{3}$.
- Otro error → Casi. Multiplica 600 por la probabilidad de obtener un 3.

Pistas: (1) $600\cdot \frac{1}{6}$
Resolución: $\frac{600}{6}=100$

**4. [choice]** · modelar · dificultad 2
En una fábrica, 12 de cada 400 ampolletas revisadas salieron defectuosas. ¿Cuál es la mejor estimación de la probabilidad de que una ampolleta sea defectuosa?

- A) $0,03$  ✅
- B) $0,12$  → Casi. $\frac{12}{400}$ no es $\frac{12}{100}$.
- C) $0,3$  → Casi. Revisa la división: $\frac{12}{400}=0,03$.
- D) $12$  → Casi. Una probabilidad siempre está entre 0 y 1.

Pistas: (1) Frecuencia relativa: $\frac{12}{400}$.
Resolución: $\frac{12}{400}=\frac{3}{100}=0,03$

**5. [numeric]** · modelar · dificultad 3
Con esa estimación, ¿cuántas ampolletas defectuosas esperas en un lote de 5.000?

Respuesta: **150**
- Si escribe 600 → Casi. Usaste 0,12; la estimación es 0,03.
- Otro error → Casi. Multiplica 5.000 por 0,03.

Pistas: (1) $5000\cdot 0,03$
Resolución: $5000\cdot 0,03=150$

**6. [choice]** · argumentar · dificultad 3
En una ruleta con igual cantidad de rojos y negros, salió rojo 5 veces seguidas. ¿Qué es más probable en el siguiente giro?

- A) Rojo y negro son igual de probables  ✅
- B) Negro, porque "le toca"  → Casi. La ruleta no recuerda los giros anteriores: esa es la falacia del jugador.
- C) Rojo, porque viene en racha  → Casi. Las rachas no cambian la probabilidad de cada giro.
- D) Ninguno puede salir  → Casi. Ambos colores pueden salir.

Por qué: Cada giro es independiente: la probabilidad no cambia por lo que salió antes.

Pistas: (1) ¿La ruleta sabe lo que salió antes?

## m1-rp-3 · Regla aditiva (draft, ~6 min)

**1. [explain]**
*A o B*
P(A o B) = P(A) + P(B) − P(A y B). Se resta la parte común porque se contó dos veces. Si $A$ y $B$ no pueden ocurrir juntos (son excluyentes), basta con sumar.

**2. [numeric]** · resolver · dificultad 1
Al lanzar un dado, ¿cuál es la probabilidad de obtener un 1 o un 6? Responde como fracción.

Respuesta: **1/3**
- Si escribe 1/6 → Casi. Esa es la probabilidad de uno solo; son dos casos favorables.
- Otro error → Casi. Son excluyentes: suma $\frac{1}{6}+\frac{1}{6}$.

Pistas: (1) No pueden salir el 1 y el 6 a la vez.
Resolución: $\frac{1}{6}+\frac{1}{6}=\frac{1}{3}$

**3. [choice]** · resolver · dificultad 2
Al lanzar un dado, ¿cuál es la probabilidad de obtener un número par o mayor que 3?

- A) $\frac{2}{3}$  ✅
- B) $1$  → Casi. Sumaste $\frac{3}{6}+\frac{3}{6}$ sin restar lo común: el 4 y el 6 se contaron dos veces.
- C) $\frac{1}{2}$  → Casi. Esa es la probabilidad de solo uno de los eventos.
- D) $\frac{1}{3}$  → Casi. $\frac{1}{3}$ es la parte común: par y mayor que 3.

Pistas: (1) Pares: 2, 4, 6. Mayores que 3: 4, 5, 6.
Resolución: Favorables: 2, 4, 5, 6 → $\frac{4}{6}=\frac{2}{3}$

**4. [numeric]** · modelar · dificultad 3
En un curso de 30 estudiantes, 18 juegan fútbol, 12 juegan básquetbol y 6 juegan ambos. Si eliges uno al azar, ¿cuál es la probabilidad de que juegue fútbol o básquetbol? Responde como fracción.

Respuesta: **4/5**
- Si escribe 1 → Casi. Los 6 que juegan ambos se contaron dos veces: hay que restarlos.
- Otro error → Casi. Usa P(A) + P(B) − P(A y B).

Pistas: (1) $\frac{18+12-6}{30}$
Resolución: $\frac{18+12-6}{30}=\frac{24}{30}=\frac{4}{5}$

**5. [numeric]** · resolver · dificultad 2
En ese mismo curso, ¿cuántos estudiantes no juegan ninguno de los dos deportes?

Respuesta: **6**
- Si escribe 0 → Casi. $18+12=30$, pero 6 están contados dos veces.
- Otro error → Casi. Juegan al menos uno $18+12-6=24$ estudiantes.

Pistas: (1) $30-24$
Resolución: $30-24=6$

**6. [find-error]** · argumentar · dificultad 3
Calcularon la probabilidad de sacar un corazón o una figura (J, Q o K) de un naipe inglés de 52 cartas. ¿En qué línea está el error?

1. P(corazón) = $\frac{13}{52}$
2. P(figura) = $\frac{12}{52}$
3. P = $\frac{13}{52}+\frac{12}{52}=\frac{25}{52}$  ❌ (error)
Si elige otra → Casi. Esa línea está bien. Revisa si hay cartas que son las dos cosas a la vez.
Explicación: Hay 3 figuras de corazón que se contaron dos veces: $\frac{13+12-3}{52}=\frac{22}{52}$.

Pistas: (1) ¿Hay figuras de corazón?

## m1-rp-4 · Regla multiplicativa (draft, ~6 min)

**1. [explain]**
*A y después B*
Si dos eventos son independientes (uno no afecta al otro), P(A y B) = P(A) · P(B). Si se saca sin reposición, el segundo paso cambia: se multiplica por la probabilidad ya actualizada.

**2. [numeric]** · resolver · dificultad 1
Se lanza una moneda y un dado. ¿Cuál es la probabilidad de obtener cara y un 6? Responde como fracción.

Respuesta: **1/12**
- Si escribe 2/3 → Casi. Esa es la suma; para "y" con eventos independientes se multiplica.
- Otro error → Casi. Multiplica $\frac{1}{2}\cdot \frac{1}{6}$.

Pistas: (1) Son independientes.
Resolución: $\frac{1}{2}\cdot \frac{1}{6}=\frac{1}{12}$

**3. [choice]** · resolver · dificultad 2
Se lanza una moneda 3 veces. ¿Cuál es la probabilidad de obtener 3 caras?

- A) $\frac{1}{8}$  ✅
- B) $\frac{1}{6}$  → Casi. Se multiplica $\frac{1}{2}$ tres veces: $\frac{1}{2}\cdot \frac{1}{2}\cdot \frac{1}{2}$.
- C) $\frac{3}{2}$  → Casi. Sumaste; aquí se multiplica. Además, una probabilidad no supera 1.
- D) $\frac{1}{3}$  → Casi. Hay 8 resultados posibles y solo uno es CCC.

Pistas: (1) $\frac{1}{2}\cdot \frac{1}{2}\cdot \frac{1}{2}$
Resolución: $\frac{1}{2}\cdot \frac{1}{2}\cdot \frac{1}{2}=\frac{1}{8}$

**4. [numeric]** · modelar · dificultad 3
Una caja tiene 4 bolitas rojas y 6 azules. Se sacan dos, sin devolver la primera. ¿Cuál es la probabilidad de que ambas sean rojas? Responde como fracción.

Respuesta: **2/15**
- Si escribe 4/25 → Casi. Eso sería con reposición. Sin devolver quedan 3 rojas de 9.
- Otro error → Casi. Multiplica $\frac{4}{10}$ por la probabilidad de la segunda, ya actualizada.

Pistas: (1) Después de sacar una roja quedan 3 rojas de 9.
Resolución: $\frac{4}{10}\cdot \frac{3}{9}=\frac{12}{90}=\frac{2}{15}$

**5. [choice]** · modelar · dificultad 3
Una prueba tiene 2 preguntas de 4 alternativas cada una. Si respondes ambas al azar, ¿cuál es la probabilidad de acertar las dos?

- A) $\frac{1}{16}$  ✅
- B) $\frac{1}{8}$  → Casi. $\frac{1}{4}\cdot \frac{1}{4}=\frac{1}{16}$, no $\frac{1}{8}$.
- C) $\frac{1}{2}$  → Casi. Sumaste las probabilidades; para "las dos" se multiplica.
- D) $\frac{1}{4}$  → Casi. Esa es la probabilidad de acertar solo una.

Pistas: (1) Cada pregunta: $\frac{1}{4}$.
Resolución: $\frac{1}{4}\cdot \frac{1}{4}=\frac{1}{16}$

**6. [numeric]** · modelar · dificultad 4
Lanzas un dado dos veces. ¿Cuál es la probabilidad de que salga al menos un 6? Responde como fracción.

Respuesta: **11/36**
- Si escribe 1/3 → Casi. Sumar $\frac{1}{6}+\frac{1}{6}$ cuenta dos veces el caso (6,6).
- Si escribe 25/36 → Casi. Esa es la probabilidad de que NO salga ningún 6.
- Otro error → Casi. Usa el complemento: 1 − P(ningún 6).

Pistas: (1) P(ningún 6) = $\frac{5}{6}\cdot \frac{5}{6}$
Resolución: $1-\frac{25}{36}=\frac{11}{36}$

## Mini-clases

### mc-rp-1 · Laplace y complemento (draft)

- **Laplace** Casos favorables sobre casos posibles, si todos son igual de probables.
- **Complemento** Que NO ocurra: 1 menos que ocurra. · Ej.: $P(A)=\frac{2}{5}$ → no $A$: $\frac{3}{5}$
- **Rango** Toda probabilidad está entre 0 y 1.

### mc-rp-2 · O: se suma (draft)

- **Regla aditiva** Suma y resta lo que se contó dos veces.
- **Excluyentes** Si no pueden ocurrir juntos, solo se suma.
- **Ejemplo** Par o mayor que 3 en un dado. · Ej.: $\frac{3}{6}+\frac{3}{6}-\frac{2}{6}$ → $=\frac{4}{6}$

### mc-rp-3 · Y: se multiplica (draft)

- **Independientes** Se multiplican las probabilidades. · Ej.: cara y 6 → $\frac{1}{2}\cdot \frac{1}{6}=\frac{1}{12}$
- **Sin reposición** Actualiza el segundo paso: queda un elemento menos.
- **Al menos uno** Casi siempre conviene el complemento: 1 menos ninguno.
