# semejanza

> Generado por `npm run content:preview`. No editar a mano: se edita el JSON.

## m1-sm-1 · Misma forma, otro tamaño (draft, ~5 min)

**1. [explain]**
*Semejantes*
Dos figuras son semejantes si tienen la misma forma: los mismos ángulos y los lados proporcionales. La razón entre lados homólogos (los que se corresponden) es la razón de semejanza $k$.

**2. [choice]** · argumentar · dificultad 1
Un triángulo tiene lados de 3, 4 y 5 cm. ¿Cuál de estos triángulos es semejante a él?

- A) 6, 8 y 10 cm  ✅
- B) 4, 5 y 6 cm  → Casi. Sumar 1 a cada lado no mantiene la proporción.
- C) 3, 4 y 6 cm  → Casi. Dos lados son iguales, pero el tercero no es proporcional.
- D) 6, 8 y 12 cm  → Casi. $\frac{6}{3}=\frac{8}{4}=2$, pero $\frac{12}{5}$ no es 2.

Por qué: Todos los lados se multiplican por 2.

Pistas: (1) Busca el que tenga todos los lados multiplicados por el mismo número.

**3. [numeric]** · resolver · dificultad 2
Dos rectángulos son semejantes. El pequeño mide 4 cm × 6 cm y el grande tiene su lado menor de 10 cm. ¿Cuánto mide su lado mayor?

Respuesta: **15** cm
- Si escribe 12 → Casi. No se suma la diferencia: la razón es $\frac{10}{4}=2,5$.
- Otro error → Casi. Calcula la razón $k=\frac{10}{4}$ y multiplica.

Pistas: (1) $k=2,5$
Resolución: $k=\frac{10}{4}=2,5$ → $6\cdot 2,5=15$

**4. [explain]**
*Perímetros y áreas*
Si los lados están en razón $k$, los perímetros también están en razón $k$, pero las áreas están en razón $k^{2}$.

**5. [numeric]** · resolver · dificultad 2
Dos cuadrados son semejantes con razón 3. Si el pequeño tiene 4 cm² de área, ¿cuál es el área del grande?

Respuesta: **36** cm²
- Si escribe 12 → Casi. Las áreas están en razón $k^{2}=9$, no 3.
- Otro error → Casi. Multiplica el área por $k^{2}$.

Pistas: (1) $k^{2}=9$
Resolución: $4\cdot 9=36$

**6. [choice]** · argumentar · dificultad 3
Un mapa se amplía al doble. ¿Qué pasa con el área que ocupa un parque en el mapa?

- A) Se multiplica por 4  ✅
- B) Se duplica  → Casi. Se duplican el largo y el ancho: $2\cdot 2=4$.
- C) Se multiplica por 8  → Casi. Por 8 se multiplicaría un volumen.
- D) No cambia  → Casi. Si el dibujo crece, el área que ocupa también.

Por qué: $k=2$, así que las áreas se multiplican por $k^{2}=4$.

Pistas: (1) Las áreas se multiplican por $k^{2}$.

## m1-sm-2 · Criterios de semejanza (draft, ~6 min)

**1. [explain]**
*Tres criterios*
Dos triángulos son semejantes si: tienen dos ángulos iguales (AA); sus tres lados son proporcionales (LLL); o dos lados son proporcionales y el ángulo entre ellos es igual (LAL).

**2. [choice]** · argumentar · dificultad 2
Un triángulo tiene ángulos de 50° y 60°; otro tiene ángulos de 60° y 70°. ¿Son semejantes?

- A) Sí, por el criterio AA  ✅
- B) No, los ángulos dados son distintos  → Casi. Calcula el tercer ángulo de cada uno: ambos tienen 50°, 60° y 70°.
- C) No se puede saber  → Casi. Con dos ángulos se puede calcular el tercero: los ángulos de un triángulo suman 180°.
- D) Solo si tienen lados iguales  → Casi. Semejantes no significa iguales: basta con los ángulos.

Por qué: El primero tiene 50°, 60° y 70°; el segundo, 60°, 70° y 50°. Son semejantes por AA.

Pistas: (1) Los ángulos de un triángulo suman 180°.

**3. [choice]** · argumentar · dificultad 2
¿Qué trío de lados es proporcional a 2, 3 y 4?

- A) $5$, $7,5$ y $10$  ✅
- B) $4$, $5$ y $6$  → Casi. Sumar 2 a cada lado no mantiene la proporción.
- C) $3$, $4$ y $5$  → Casi. Sumar 1 no es multiplicar.
- D) $4$, $6$ y $9$  → Casi. $\frac{4}{2}=\frac{6}{3}=2$, pero $\frac{9}{4}$ no es 2.

Por qué: Todos se multiplican por $2,5$.

Pistas: (1) Busca el que tenga todos los lados multiplicados por el mismo número.

**4. [numeric]** · resolver · dificultad 3
Un triángulo de lados 5, 12 y 13 cm es semejante a otro cuyo lado mayor mide 39 cm. ¿Cuánto mide el lado menor del segundo triángulo?

Respuesta: **15** cm
- Si escribe 31 → Casi. No se suma la diferencia: la razón es $\frac{39}{13}=3$.
- Otro error → Casi. La razón es $\frac{39}{13}$; multiplica el lado menor por ella.

Pistas: (1) $k=3$
Resolución: $k=\frac{39}{13}=3$ → $5\cdot 3=15$

**5. [choice]** · argumentar · dificultad 2
Si dos triángulos tienen sus lados proporcionales, entonces sus ángulos:

- A) Son iguales  ✅
- B) Son proporcionales  → Casi. Los ángulos no se agrandan con la figura: se mantienen iguales.
- C) Suman 360°  → Casi. Los ángulos de un triángulo suman 180°.
- D) No se puede saber  → Casi. Por el criterio LLL los triángulos son semejantes, y en figuras semejantes los ángulos son iguales.

Por qué: Figuras semejantes tienen ángulos iguales.

Pistas: (1) Una fotocopia ampliada, ¿cambia los ángulos?

**6. [choice]** · argumentar · dificultad 3
En el triángulo ABC se traza un segmento DE paralelo a BC, con D en AB y E en AC. ¿Por qué el triángulo ADE es semejante al ABC?

- A) Porque tienen los mismos ángulos (criterio AA)  ✅
- B) Porque DE mide la mitad de BC  → Casi. No sabemos cuánto mide DE; la razón es de ángulos.
- C) Porque tienen un lado en común  → Casi. Compartir un lado no basta para la semejanza.
- D) Porque son congruentes  → Casi. No son del mismo tamaño: ADE es más pequeño.

Por qué: Comparten el ángulo A y, por las paralelas, los ángulos en D y B son iguales: criterio AA.

Pistas: (1) Rectas paralelas forman ángulos correspondientes iguales.

## m1-sm-3 · Teorema de Thales (draft, ~6 min)

**1. [explain]**
*Paralelas que cortan*
Si varias rectas paralelas cortan a dos transversales, los segmentos que determinan en una son proporcionales a los que determinan en la otra: $\frac{a}{b}=\frac{c}{d}$.

**2. [numeric]** · resolver · dificultad 2
Tres paralelas determinan en una transversal segmentos de 4 cm y 6 cm. En la otra transversal, el primer segmento mide 6 cm. ¿Cuánto mide el segundo?

Respuesta: **9** cm
- Si escribe 8 → Casi. No se suma la diferencia: plantea $\frac{4}{6}=\frac{6}{x}$.
- Otro error → Casi. Plantea la proporción $\frac{4}{6}=\frac{6}{x}$.

Pistas: (1) $4x=36$
Resolución: $\frac{4}{6}=\frac{6}{x}$ → $4x=36$ → $x=9$

**3. [numeric]** · resolver · dificultad 3
En un triángulo, una paralela a la base corta un lado en segmentos de 3 cm y 5 cm, y el otro lado en segmentos de 6 cm y $x$ cm, en el mismo orden. ¿Cuánto vale $x$?

Respuesta: **10** cm
- Si escribe 8 → Casi. No se suma la diferencia: $\frac{3}{5}=\frac{6}{x}$.
- Otro error → Casi. Plantea $\frac{3}{5}=\frac{6}{x}$.

Pistas: (1) $3x=30$
Resolución: $3x=5\cdot 6$ → $x=10$

**4. [find-error]** · argumentar · dificultad 2
Así resolvieron $\frac{3}{x}=\frac{9}{12}$. ¿En qué línea está el error?

1. $\frac{3}{x}=\frac{9}{12}$
2. $9x=3\cdot 12$
3. $x=\frac{36}{9}$
4. $x=3$  ❌ (error)
Si elige otra → Casi. Esa línea está bien. Revisa la última división.
Explicación: $\frac{36}{9}=4$, no 3.

Pistas: (1) ¿Cuánto es $36\div 9$?

**5. [choice]** · modelar · dificultad 3
Un poste de 3 m proyecta una sombra de 2 m. A la misma hora, un árbol proyecta una sombra de 8 m. ¿Cuánto mide el árbol?

- A) 12 m  ✅
- B) 9 m  → Casi. No se suma la diferencia de sombras: la relación es proporcional.
- C) $\frac{16}{3}$ m  → Casi. Planteaste la proporción al revés.
- D) 13 m  → Casi. Plantea $\frac{3}{2}=\frac{h}{8}$.

Pistas: (1) Altura y sombra son proporcionales: $\frac{3}{2}=\frac{h}{8}$.
Resolución: $h=\frac{3\cdot 8}{2}=12$

**6. [numeric]** · modelar · dificultad 3
A esa misma hora, ¿qué sombra proyecta una persona de 1,8 m? Responde en metros.

Respuesta: **6/5** m
- Si escribe 27/10 → Casi. Planteaste la proporción al revés: $\frac{3}{2}=\frac{1,8}{s}$.
- Otro error → Casi. Plantea $\frac{3}{2}=\frac{1,8}{s}$.

Pistas: (1) La sombra es $\frac{2}{3}$ de la altura.
Resolución: $s=\frac{2\cdot 1,8}{3}=1,2$

## m1-sm-4 · Escalas y sombras (draft, ~6 min)

**1. [explain]**
*Escala*
Una escala $1:n$ dice que 1 unidad del plano o mapa son $n$ unidades reales. En 1:100, 1 cm del plano son 100 cm, o sea 1 m real.

**2. [numeric]** · modelar · dificultad 2
En un mapa a escala 1:50.000, dos ciudades están a 6 cm. ¿A cuántos kilómetros están en la realidad?

Respuesta: **3** km
- Si escribe 300 → Casi. 300.000 cm son 3.000 m, es decir, 3 km.
- Otro error → Casi. $6\cdot 50000=300000$ cm; conviértelo a km.

Pistas: (1) 1 km = 100.000 cm
Resolución: $6\cdot 50000=300000$ cm → $=3$ km

**3. [numeric]** · modelar · dificultad 2
Una casa de 12 m de largo se dibuja con 6 cm en un plano. Si la escala es $1:n$, ¿cuánto vale $n$?

Respuesta: **200**
- Si escribe 2 → Casi. Pasa todo a la misma unidad: 12 m son 1.200 cm.
- Otro error → Casi. Divide la medida real por la del plano, en las mismas unidades.

Pistas: (1) $1200\div 6$
Resolución: $1200\div 6=200$

**4. [choice]** · modelar · dificultad 1
En una maqueta a escala 1:100, un edificio mide 30 cm. ¿Cuál es su altura real?

- A) 30 m  ✅
- B) 3 m  → Casi. $30\cdot 100=3000$ cm, que son 30 m.
- C) 300 m  → Casi. Revisa la conversión: 3.000 cm son 30 m.
- D) 0,3 m  → Casi. El edificio real es más grande que la maqueta.

Pistas: (1) $30\cdot 100$ cm
Resolución: $3000$ cm $=30$ m

**5. [choice]** · modelar · dificultad 3
En un plano a escala 1:200, una pieza rectangular mide 5 cm × 4 cm. ¿Cuál es su área real?

- A) 80 m²  ✅
- B) 20 m²  → Casi. Convierte cada medida y después multiplica: 10 m × 8 m.
- C) 800 m²  → Casi. Revisa: $5\cdot 200=1000$ cm, que son 10 m.
- D) 8 m²  → Casi. Las medidas reales son 10 m y 8 m.

Pistas: (1) Largo real: $5\cdot 200$ cm.
Resolución: 10 m × 8 m = 80 m²

**6. [choice]** · modelar · dificultad 3
Un edificio proyecta una sombra de 24 m y, al mismo tiempo, una persona de 1,5 m proyecta una sombra de 2 m. ¿Cuánto mide el edificio?

- A) 18 m  ✅
- B) 32 m  → Casi. Planteaste la proporción al revés.
- C) $25,5$ m  → Casi. No se suma la diferencia: la relación es proporcional.
- D) 36 m  → Casi. Plantea $\frac{1,5}{2}=\frac{h}{24}$.

Pistas: (1) $\frac{1,5}{2}=\frac{h}{24}$
Resolución: $h=\frac{1,5\cdot 24}{2}=18$

## Mini-clases

### mc-sm-1 · Razón de semejanza (draft)

- **Razón** Divide un lado de la figura grande por su homólogo en la pequeña. · $k=\frac{A}{a}$
- **Áreas** Si los lados están en razón $k$, las áreas están en razón $k^{2}$.

### mc-sm-2 · Criterios (draft)

- **AA** Dos ángulos iguales.
- **LLL** Tres lados proporcionales.
- **LAL** Dos lados proporcionales y el ángulo entre ellos igual.

### mc-sm-3 · Thales y sombras (draft)

- **Thales** Paralelas cortan segmentos proporcionales. · $\frac{a}{b}=\frac{c}{d}$
- **Sombras** A la misma hora, alturas y sombras son proporcionales. · Ej.: poste 2 m, sombra 3 m → árbol con sombra 9 m: 6 m
