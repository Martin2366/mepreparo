# cuerpos

> Generado por `npm run content:preview`. No editar a mano: se edita el JSON.

## m1-cg-1 · Desarmar un cuerpo (draft, ~5 min)

**1. [explain]**
*Caras, aristas y vértices*
Un cuerpo geométrico tiene caras (superficies), aristas (bordes) y vértices (esquinas). Su red o desarrollo es la figura plana que obtienes al desarmarlo: un cubo se desarma en 6 cuadrados.

**2. [choice]** · representar · dificultad 1
¿Cuántas caras tiene un prisma de base triangular?

- A) $5$  ✅
- B) $3$  → Casi. Además de las 3 caras laterales, tiene 2 bases triangulares.
- C) $6$  → Casi. 6 caras tiene un prisma de base cuadrada.
- D) $9$  → Casi. 9 son sus aristas.

Por qué: 2 triángulos y 3 rectángulos: 5 caras.

Pistas: (1) 2 bases + caras laterales.

**3. [numeric]** · representar · dificultad 1
¿Cuántas aristas tiene un cubo?

Respuesta: **12**
- Si escribe 6 → Casi. 6 son las caras.
- Si escribe 8 → Casi. 8 son los vértices.
- Otro error → Casi. Cuenta: 4 arriba, 4 abajo y 4 verticales.

Pistas: (1) 4 + 4 + 4
Resolución: $4+4+4=12$

**4. [choice]** · representar · dificultad 2
¿De qué figuras está formado el desarrollo de un cilindro?

- A) Dos círculos y un rectángulo  ✅
- B) Un círculo y un sector circular  → Casi. Ese es el desarrollo de un cono.
- C) Seis cuadrados  → Casi. Ese es el desarrollo de un cubo.
- D) Dos círculos y un triángulo  → Casi. La superficie lateral del cilindro, al desenrollarla, es un rectángulo.

Por qué: Dos tapas circulares y la superficie lateral, que es un rectángulo.

Pistas: (1) Piensa en la etiqueta de una lata: al despegarla, ¿qué forma tiene?

**5. [explain]**
*La fórmula de Euler*
En todo poliedro: caras + vértices − aristas = 2. En el cubo: $6+8-12=2$.

**6. [numeric]** · resolver · dificultad 3
Un poliedro tiene 8 caras y 12 vértices. ¿Cuántas aristas tiene?

Respuesta: **18**
- Si escribe 22 → Casi. Es $C+V-A=2$: $8+12-A=2$, entonces $A=18$.
- Otro error → Casi. Usa $C+V-A=2$.

Pistas: (1) $8+12-A=2$
Resolución: $20-A=2$ → $A=18$

**7. [choice]** · representar · dificultad 2
Al girar un rectángulo en torno a uno de sus lados se obtiene un:

- A) Cilindro  ✅
- B) Cono  → Casi. Un cono se obtiene girando un triángulo rectángulo.
- C) Esfera  → Casi. Una esfera se obtiene girando un semicírculo.
- D) Prisma  → Casi. Un prisma no se obtiene por rotación.

Por qué: El lado del eje es la altura y el otro lado es el radio: un cilindro.

Pistas: (1) Imagina el rectángulo girando como una puerta.

## m1-cg-2 · Área de superficie (draft, ~6 min)

**1. [explain]**
*Sumar todas las caras*
El área total de un cuerpo es la suma de las áreas de todas sus caras. Cubo de arista $a$: $6a^{2}$. Cilindro: dos tapas $2πr^{2}$ más el lateral $2πrh$.

**2. [numeric]** · resolver · dificultad 1
¿Cuál es el área total de un cubo de arista 3 cm?

Respuesta: **54** cm²
- Si escribe 27 → Casi. 27 es el volumen; el área es $6\cdot 3^{2}$.
- Si escribe 9 → Casi. Esa es una sola cara; el cubo tiene 6.
- Otro error → Casi. Son 6 cuadrados de $3\cdot 3$.

Pistas: (1) $6a^{2}$
Resolución: $6\cdot 9=54$

**3. [numeric]** · resolver · dificultad 2
Una caja mide 5 cm × 4 cm × 2 cm. ¿Cuál es su área total?

Respuesta: **76** cm²
- Si escribe 40 → Casi. 40 es el volumen.
- Si escribe 38 → Casi. Cada cara aparece dos veces (la de arriba y la de abajo, etc.).
- Otro error → Casi. Calcula $2\cdot(5\cdot 4+5\cdot 2+4\cdot 2)$.

Pistas: (1) Tres pares de caras iguales.
Resolución: $2\cdot(20+10+8)=76$

**4. [choice]** · resolver · dificultad 2
¿Cuál es el área lateral de un cilindro de radio 2 cm y altura 5 cm?

- A) $20π$ cm²  ✅
- B) $10π$ cm²  → Casi. Falta el 2 de $2πrh$.
- C) $40π$ cm²  → Casi. Revisa: $2π\cdot 2\cdot 5=20π$.
- D) $28π$ cm²  → Casi. $28π$ es el área total; el lateral no incluye las tapas.

Pistas: (1) $2πrh$
Resolución: $2π\cdot 2\cdot 5=20π$

**5. [numeric]** · resolver · dificultad 3
El área total de ese cilindro es $kπ$ cm². ¿Cuánto vale $k$?

Respuesta: **28**
- Si escribe 20 → Casi. Falta sumar las dos tapas: $2\cdot π\cdot 2^{2}=8π$.
- Otro error → Casi. Suma el lateral y las dos tapas.

Pistas: (1) Tapas: $2π\cdot 2^{2}$.
Resolución: $20π+8π=28π$

**6. [choice]** · modelar · dificultad 3
Se quiere pintar el exterior de una caja cerrada de 1 m × 1 m × 2 m. Si un litro de pintura cubre 5 m², ¿cuántos litros se necesitan?

- A) 2 litros  ✅
- B) 1 litro  → Casi. Revisa el área: $2\cdot(1+2+2)=10$ m².
- C) 4 litros  → Casi. $10\div 5=2$ litros.
- D) 0,4 litros  → Casi. Usaste el volumen; se pinta la superficie.

Pistas: (1) Área total: $2\cdot(1\cdot 1+1\cdot 2+1\cdot 2)$.
Resolución: Área: 10 m² → $10\div 5=2$ litros

## m1-cg-3 · Volumen (draft, ~6 min)

**1. [explain]**
*Base por altura*
El volumen de prismas y cilindros es el área de la base por la altura. Las pirámides y los conos tienen un tercio de eso: $V=\frac{B\cdot h}{3}$.

**2. [numeric]** · resolver · dificultad 1
¿Cuál es el volumen de una caja de 6 cm × 4 cm × 3 cm?

Respuesta: **72** cm³
- Si escribe 13 → Casi. El volumen se multiplica, no se suma.
- Otro error → Casi. Multiplica las tres medidas.

Pistas: (1) $6\cdot 4\cdot 3$
Resolución: $6\cdot 4\cdot 3=72$

**3. [choice]** · resolver · dificultad 2
¿Cuál es el volumen de un cilindro de radio 3 cm y altura 10 cm?

- A) $90π$ cm³  ✅
- B) $30π$ cm³  → Casi. El radio va al cuadrado: $π\cdot 3^{2}\cdot 10$.
- C) $60π$ cm³  → Casi. $2πrh$ es el área lateral, no el volumen.
- D) $900π$ cm³  → Casi. Solo el radio va al cuadrado, no la altura.

Pistas: (1) $V=πr^{2}h$
Resolución: $π\cdot 9\cdot 10=90π$

**4. [numeric]** · resolver · dificultad 2
Un cono tiene radio 3 cm y altura 4 cm. Su volumen es $kπ$ cm³. ¿Cuánto vale $k$?

Respuesta: **12**
- Si escribe 36 → Casi. El cono es un tercio del cilindro: $\frac{36π}{3}$.
- Otro error → Casi. Usa $\frac{πr^{2}h}{3}$.

Pistas: (1) $\frac{π\cdot 9\cdot 4}{3}$
Resolución: $\frac{π\cdot 9\cdot 4}{3}=12π$

**5. [choice]** · argumentar · dificultad 3
Si todas las aristas de un cubo se duplican, ¿qué pasa con su volumen?

- A) Se multiplica por 8  ✅
- B) Se duplica  → Casi. Se duplican las tres medidas: $2\cdot 2\cdot 2$.
- C) Se multiplica por 4  → Casi. Por 4 se multiplica el área de las caras; el volumen, por 8.
- D) Se multiplica por 6  → Casi. $(2a)^{3}=8a^{3}$.

Por qué: $(2a)^{3}=8a^{3}$.

Pistas: (1) $(2a)^{3}$

**6. [numeric]** · resolver · dificultad 3
Una pirámide de base cuadrada de lado 6 cm tiene 5 cm de altura. ¿Cuál es su volumen?

Respuesta: **60** cm³
- Si escribe 180 → Casi. La pirámide es un tercio del prisma: $\frac{36\cdot 5}{3}$.
- Otro error → Casi. Usa $\frac{B\cdot h}{3}$ con $B=36$.

Pistas: (1) Base: $6^{2}=36$.
Resolución: $\frac{36\cdot 5}{3}=60$

## m1-cg-4 · Problemas de capacidad (draft, ~6 min)

**1. [explain]**
*Litros y volumen*
1 litro es 1.000 cm³ (un cubo de 10 cm de lado). Y 1 m³ son 1.000 litros.

**2. [numeric]** · resolver · dificultad 1
¿Cuántos litros caben en un estanque de 2 m³?

Respuesta: **2000** litros
- Si escribe 2 → Casi. Cada m³ son 1.000 litros.
- Otro error → Casi. Multiplica por 1.000.

Pistas: (1) 1 m³ = 1.000 litros.
Resolución: $2\cdot 1000=2000$

**3. [numeric]** · modelar · dificultad 2
Un acuario mide 50 cm × 30 cm × 40 cm. ¿Cuántos litros caben?

Respuesta: **60** litros
- Si escribe 60000 → Casi. Eso son cm³; divide por 1.000 para pasar a litros.
- Otro error → Casi. Calcula el volumen en cm³ y divide por 1.000.

Pistas: (1) $50\cdot 30\cdot 40=60000$ cm³
Resolución: $60000\div 1000=60$

**4. [choice]** · modelar · dificultad 3
Un vaso cilíndrico tiene radio 3 cm y altura 10 cm. Usando $π$ aproximadamente 3, ¿cuántos vasos llenos se sirven con 1 litro?

- A) 3 vasos  ✅
- B) 4 vasos  → Casi. Cada vaso tiene unos 270 cm³: 4 vasos serían 1.080 cm³, más de un litro.
- C) 37 vasos  → Casi. Revisa las unidades: un litro son 1.000 cm³.
- D) 10 vasos  → Casi. El volumen del vaso es $π\cdot 3^{2}\cdot 10$, unos 270 cm³.

Pistas: (1) Volumen del vaso: $3\cdot 9\cdot 10$ cm³.
Resolución: Vaso: unos 270 cm³ → $1000\div 270$ es un poco más de 3

**5. [numeric]** · modelar · dificultad 2
Una piscina de 10 m × 5 m se llena hasta 1,2 m de altura. ¿Cuántos m³ de agua tiene?

Respuesta: **60** m³
- Si escribe 50 → Casi. Eso es el área del fondo; falta multiplicar por la altura.
- Otro error → Casi. Multiplica largo, ancho y altura del agua.

Pistas: (1) $10\cdot 5\cdot 1,2$
Resolución: $50\cdot 1,2=60$

**6. [choice]** · modelar · dificultad 4
Una llave echa 20 litros por minuto. ¿Cuánto demora en llenar un estanque de 1,5 m³?

- A) 75 minutos  ✅
- B) 7,5 minutos  → Casi. 1,5 m³ son 1.500 litros, no 150.
- C) 30 minutos  → Casi. Revisa: $1500\div 20=75$.
- D) 750 minutos  → Casi. 1,5 m³ son 1.500 litros, no 15.000.

Pistas: (1) Pasa a litros: $1,5\cdot 1000$.
Resolución: $1500\div 20=75$ minutos

## Mini-clases

### mc-cg-1 · Caras, aristas y vértices (draft)

- **Cubo** 6 caras, 12 aristas, 8 vértices.
- **Euler** En todo poliedro se cumple: · $C+V-A=2$
- **Redes** Cilindro: dos círculos y un rectángulo. Cono: un círculo y un sector circular.

### mc-cg-2 · Área y volumen (draft)

- **Área** Suma de las caras (cm²). · $6a^{2}$ (cubo)
- **Volumen** Base por altura (cm³). Pirámide y cono: un tercio. · $V=B\cdot h$
- **Escala** Si las medidas se multiplican por $k$: el área por $k^{2}$ y el volumen por $k^{3}$.

### mc-cg-3 · Litros (draft)

- **Conversiones** 1 litro = 1.000 cm³ = 1 dm³. 1 m³ = 1.000 litros.
- **Ejemplo** Una caja de 20 × 10 × 5 cm. · Ej.: $1000$ cm³ → $=1$ litro
