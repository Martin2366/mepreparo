# medidas-posicion

> Generado por `npm run content:preview`. No editar a mano: se edita el JSON.

## m1-mp-1 · Ordenar para entender (draft, ~5 min)

**1. [explain]**
*La posición importa*
Las medidas de posición dicen dónde queda un dato respecto de los demás. Para calcularlas, el primer paso siempre es ordenar los datos de menor a mayor.

**2. [order]** · representar · dificultad 1
Ordena estos puntajes de menor a mayor.

1. $480$
2. $515$
3. $550$
4. $602$
5. $640$
Si falla → Casi. Compara primero las centenas y después las decenas.

**3. [numeric]** · representar · dificultad 1
Datos: 12, 7, 15, 9, 7, 20, 11. Una vez ordenados, ¿qué dato queda en la posición 5?

Respuesta: **12**
- Si escribe 7 → Casi. Ese es el quinto dato sin ordenar; primero ordena.
- Otro error → Casi. Ordena: 7, 7, 9, 11, 12, 15, 20.

Pistas: (1) 7, 7, 9, 11, …
Resolución: Ordenados: 7, 7, 9, 11, 12, 15, 20 → Posición 5: 12

**4. [numeric]** · resolver · dificultad 2
¿Cuál es la mediana de esos mismos datos?

Respuesta: **11**
- Si escribe 9 → Casi. Con 7 datos, el central es el cuarto.
- Otro error → Casi. Con 7 datos ordenados, la mediana es el cuarto.

Pistas: (1) Quedan 3 datos a cada lado.
Resolución: 7, 7, 9, 11, 12, 15, 20: el cuarto dato es 11

**5. [numeric]** · resolver · dificultad 2
¿Cuál es el rango (máximo menos mínimo) de esos datos?

Respuesta: **13**
- Si escribe 8 → Casi. Usaste los datos en su orden original; el rango usa el mayor y el menor.
- Otro error → Casi. Resta el mayor menos el menor.

Pistas: (1) $20-7$
Resolución: $20-7=13$

**6. [choice]** · argumentar · dificultad 2
En un curso de 31 estudiantes, Sofía tiene la mediana de las notas. ¿Cuántos compañeros tienen una nota mayor o igual a la de ella, sin contarla?

- A) 15  ✅
- B) 16  → Casi. Sin contar a Sofía quedan 30 estudiantes, repartidos 15 y 15.
- C) 31  → Casi. Ese es el total del curso.
- D) 30  → Casi. La mediana deja la mitad de los datos a cada lado.

Por qué: Quedan 30 estudiantes: 15 bajo la mediana y 15 sobre ella.

Pistas: (1) La mediana queda justo al medio de los datos ordenados.

## m1-mp-2 · Cuartiles (draft, ~6 min)

**1. [explain]**
*Cortar en cuatro*
Los cuartiles dividen los datos ordenados en cuatro partes con la misma cantidad de datos. Q2 es la mediana. Q1 es la mediana de la mitad inferior y Q3, la de la mitad superior.

**2. [numeric]** · resolver · dificultad 2
Datos ordenados: 2, 4, 4, 6, 8, 8, 9. ¿Cuál es el primer cuartil?

Respuesta: **4**
- Si escribe 6 → Casi. 6 es la mediana (Q2). Q1 es el centro de la mitad inferior.
- Otro error → Casi. Toma la mitad inferior (2, 4, 4) y busca su centro.

Pistas: (1) Mitad inferior: 2, 4, 4.
Resolución: Mediana: 6 → Mitad inferior: 2, 4, 4 → Q1 = 4

**3. [numeric]** · resolver · dificultad 2
Con los mismos datos, ¿cuál es el tercer cuartil?

Respuesta: **8**
- Si escribe 9 → Casi. 9 es el máximo. Q3 es el centro de la mitad superior.
- Otro error → Casi. Toma la mitad superior (8, 8, 9) y busca su centro.

Pistas: (1) Mitad superior: 8, 8, 9.
Resolución: Q3 = 8

**4. [numeric]** · resolver · dificultad 2
El rango intercuartil es Q3 − Q1. ¿Cuánto vale para esos datos?

Respuesta: **4**
- Si escribe 7 → Casi. Ese es el rango (máximo menos mínimo).
- Otro error → Casi. Resta los cuartiles: $8-4$.

Pistas: (1) Q3 = 8 y Q1 = 4.
Resolución: $8-4=4$

**5. [numeric]** · resolver · dificultad 3
Datos ordenados: 3, 5, 5, 7, 9, 11, 11, 14. ¿Cuál es la mediana?

Respuesta: **8**
- Si escribe 7 → Casi. Con 8 datos hay dos centrales: 7 y 9.
- Si escribe 9 → Casi. Con 8 datos hay dos centrales: 7 y 9.
- Otro error → Casi. Promedia los dos datos centrales.

Pistas: (1) $\frac{7+9}{2}$
Resolución: $\frac{7+9}{2}=8$

**6. [choice]** · resolver · dificultad 3
Con esos 8 datos, ¿cuáles son Q1 y Q3?

- A) Q1 = 5 y Q3 = 11  ✅
- B) Q1 = 3 y Q3 = 14  → Casi. Esos son el mínimo y el máximo.
- C) Q1 = 7 y Q3 = 9  → Casi. Esos son los datos centrales, que forman la mediana.
- D) Q1 = 5 y Q3 = 9  → Casi. La mitad superior es 9, 11, 11, 14: su centro es 11.

Pistas: (1) Mitades: 3, 5, 5, 7 y 9, 11, 11, 14.
Resolución: Q1: $\frac{5+5}{2}=5$ → Q3: $\frac{11+11}{2}=11$

**7. [choice]** · argumentar · dificultad 2
¿Qué porcentaje de los datos queda entre Q1 y Q3?

- A) $50$ %  ✅
- B) $25$ %  → Casi. Entre Q1 y Q3 hay dos de las cuatro partes.
- C) $75$ %  → Casi. Bajo Q3 queda el 75 %, pero hay que descontar el 25 % bajo Q1.
- D) $100$ %  → Casi. Fuera de ese tramo quedan los extremos.

Por qué: Dos partes de 25 %: el 50 % central.

Pistas: (1) Cada parte tiene el 25 %.

## m1-mp-3 · Percentiles (draft, ~5 min)

**1. [explain]**
*Cortar en cien*
El percentil $k$ (Pk) es el valor que deja bajo él, aproximadamente, el $k$ % de los datos. Así, P25 = Q1, P50 es la mediana y P75 = Q3.

**2. [choice]** · argumentar · dificultad 1
¿A qué medida corresponde el percentil 50?

- A) A la mediana  ✅
- B) Al promedio  → Casi. El promedio no siempre deja la mitad de los datos a cada lado.
- C) A la moda  → Casi. La moda es el dato que más se repite.
- D) Al primer cuartil  → Casi. El primer cuartil es el percentil 25.

Por qué: Deja la mitad de los datos bajo él: es la mediana.

Pistas: (1) El 50 % de los datos queda bajo él.

**3. [numeric]** · resolver · dificultad 2
Tu puntaje está en el percentil 90 entre 2.000 postulantes. Aproximadamente, ¿cuántos postulantes tienen un puntaje menor o igual al tuyo?

Respuesta: **1800**
- Si escribe 200 → Casi. 200 es el 10 % que queda sobre ti.
- Otro error → Casi. Calcula el 90 % de 2.000.

Pistas: (1) $0,9\cdot 2000$
Resolución: $0,9\cdot 2000=1800$

**4. [choice]** · argumentar · dificultad 2
Martina quedó en el percentil 80 de un ensayo. ¿Qué significa?

- A) Le fue igual o mejor que al 80 % de los que rindieron  ✅
- B) Contestó bien el 80 % de las preguntas  → Casi. El percentil compara con otras personas, no cuenta respuestas correctas.
- C) Sacó 80 puntos  → Casi. El percentil no es un puntaje.
- D) Le fue mejor que al 20 %  → Casi. Es al revés: solo el 20 % queda sobre ella.

Por qué: El percentil 80 deja bajo él cerca del 80 % de los resultados.

Pistas: (1) El percentil es una posición respecto de los demás.

**5. [choice]** · argumentar · dificultad 3
En un grupo, P30 = 450 puntos y P70 = 620 puntos. ¿Qué porcentaje de los datos está entre 450 y 620 puntos?

- A) Cerca del $40$ %  ✅
- B) Cerca del $30$ %  → Casi. El 30 % queda bajo 450; lo que se pregunta está entre ambos percentiles.
- C) Cerca del $70$ %  → Casi. El 70 % queda bajo 620, pero hay que restar el 30 % bajo 450.
- D) Cerca del $100$ %  → Casi. Fuera del tramo quedan el 30 % de abajo y el 30 % de arriba.

Por qué: $70$ % $-30$ % $=40$ %.

Pistas: (1) $70-30$

**6. [numeric]** · resolver · dificultad 3
En un curso de 40 estudiantes, ¿cuántos quedan aproximadamente sobre el tercer cuartil?

Respuesta: **10**
- Si escribe 30 → Casi. 30 son los que quedan bajo Q3.
- Otro error → Casi. Sobre Q3 queda el 25 % de los datos.

Pistas: (1) El 25 % de 40.
Resolución: $\frac{40}{4}=10$

## m1-mp-4 · El diagrama de cajón (draft, ~6 min)

**1. [explain]**
*Cinco números en un dibujo*
El diagrama de cajón (o de caja y bigotes) muestra cinco valores: mínimo, Q1, mediana, Q3 y máximo. La caja va de Q1 a Q3 con una línea en la mediana, y los bigotes llegan al mínimo y al máximo.

**2. [numeric]** · representar · dificultad 1
Un diagrama de cajón tiene mínimo 20, Q1 = 35, mediana 42, Q3 = 50 y máximo 70. ¿Cuánto mide la caja, es decir, el rango intercuartil?

Respuesta: **15**
- Si escribe 50 → Casi. Ese es el rango (máximo menos mínimo).
- Otro error → Casi. La caja va de Q1 a Q3.

Pistas: (1) $50-35$
Resolución: $50-35=15$

**3. [choice]** · representar · dificultad 2
Con ese diagrama, ¿qué porcentaje de los datos es mayor que 50?

- A) $25$ %  ✅
- B) $50$ %  → Casi. 50 es Q3, no la mediana.
- C) $75$ %  → Casi. El 75 % queda bajo Q3; sobre él, el resto.
- D) $10$ %  → Casi. Cada tramo del diagrama tiene el 25 % de los datos.

Por qué: Sobre Q3 queda el 25 % de los datos.

Pistas: (1) 50 es el tercer cuartil.

**4. [choice]** · argumentar · dificultad 3
El bigote derecho (de 50 a 70) es más largo que el izquierdo (de 20 a 35). ¿Qué significa?

- A) El 25 % superior está más disperso que el 25 % inferior  ✅
- B) Hay más datos a la derecha  → Casi. Cada bigote tiene la misma cantidad de datos (25 %); cambia cuán separados están.
- C) El promedio es 70  → Casi. El diagrama no muestra el promedio.
- D) La mediana está mal calculada  → Casi. Los bigotes no tienen por qué medir lo mismo.

Por qué: Mismo porcentaje de datos en un tramo más largo: están más dispersos.

Pistas: (1) Cada bigote contiene el 25 % de los datos.

**5. [choice]** · argumentar · dificultad 3
Dos cursos rindieron la misma prueba. El A tiene Q1 = 4,5 y Q3 = 5,0; el B tiene Q1 = 3,5 y Q3 = 6,5. ¿Qué curso tiene notas más parejas en su 50 % central?

- A) El A  ✅
- B) El B  → Casi. La caja del B mide 3,0; la del A, solo 0,5.
- C) Los dos por igual  → Casi. Compara los rangos intercuartiles: 0,5 y 3,0.
- D) No se puede saber  → Casi. El rango intercuartil mide justamente eso.

Por qué: A: $5,0-4,5=0,5$. B: $6,5-3,5=3,0$. La caja del A es más angosta: notas más parejas.

Pistas: (1) Calcula Q3 − Q1 en cada curso.

**6. [find-error]** · argumentar · dificultad 3
Para los datos 1, 3, 3, 3, 6, 7, 8, 10, 10, 10, 12 hicieron este resumen. ¿En qué línea está el error?

1. Mínimo 1 y máximo 12
2. Mediana: 7
3. Q1 = 3
4. Q3 = 8  ❌ (error)
Si elige otra → Casi. Esa línea está bien. Revisa la mitad superior.
Explicación: La mitad superior es 8, 10, 10, 10, 12: su centro es 10, así que Q3 = 10.

Pistas: (1) Mitad superior: 8, 10, 10, 10, 12.

## Mini-clases

### mc-mp-1 · Cuartiles paso a paso (draft)

- **1. Ordena** Siempre de menor a mayor.
- **2. Mediana** El centro: Q2.
- **3. Mitades** Q1 es el centro de la mitad inferior y Q3, el de la superior. · Ej.: 2, 4, 4, 6, 8, 8, 9 → Q1 = 4, Q3 = 8

### mc-mp-2 · Percentiles (draft)

- **Idea** Pk deja bajo él cerca del $k$ % de los datos.
- **Equivalencias** P25 = Q1, P50 = mediana, P75 = Q3.
- **Ojo** Percentil 80 no es el 80 % de respuestas correctas: es tu posición frente a los demás.

### mc-mp-3 · Diagrama de cajón (draft)

- **Cinco números** Mínimo, Q1, mediana, Q3 y máximo.
- **Cuatro tramos** Cada tramo tiene el 25 % de los datos, aunque midan distinto.
- **Dispersión** Caja angosta: datos parejos. Rango intercuartil: Q3 − Q1.
