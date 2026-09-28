# funcion-cuadratica

> Generado por `npm run content:preview`. No editar a mano: se edita el JSON.

## m1-fc-1 · La forma de la parábola (draft, ~6 min)

**1. [explain]**
*Una curva con forma de U*
$f(x)=ax^{2}+bx+c$ dibuja una parábola. El signo de $a$ decide hacia dónde abre: hacia arriba si $a>0$ y hacia abajo si $a<0$.

**2. [graph]** · representar · dificultad 2
Mueve $a$ para que la parábola $y=ax^{2}$ pase por el punto $(2,2)$.

Familia: quadratic · deslizadores: a ∈ [-3, 3] paso 1/2 (parte en 1)
Objetivo: {"kind":"points","points":[["2","2"]]}
Si falla → Casi. En $x=2$ la parábola vale $a\cdot 4$; tiene que dar 2.
Por qué: $4a=2$, entonces $a=\frac{1}{2}$.

Pistas: (1) $a\cdot 2^{2}=2$

**3. [choice]** · representar · dificultad 1
¿Hacia dónde abre la parábola $f(x)=-2x^{2}+3x+1$?

- A) Hacia abajo  ✅
- B) Hacia arriba  → Casi. $a=-2$ es negativo.
- C) Hacia la derecha  → Casi. Una parábola de la forma $ax^{2}+bx+c$ abre hacia arriba o hacia abajo.
- D) Depende del 3  → Casi. Lo decide el signo de $a$, el número que acompaña a $x^{2}$.

Por qué: $a=-2<0$: abre hacia abajo.

Pistas: (1) Mira el signo del coeficiente de $x^{2}$.

**4. [explain]**
*El corte con el eje y*
Como $f(0)=c$, la parábola corta al eje $y$ en el punto $(0,c)$.

**5. [numeric]** · representar · dificultad 1
¿En qué valor de $y$ corta al eje $y$ la parábola $f(x)=x^{2}-4x+3$?

Respuesta: **3**
- Si escribe -4 → Casi. $-4$ acompaña a la $x$; el corte con el eje $y$ es $f(0)=c$.
- Otro error → Casi. Calcula $f(0)$.

Pistas: (1) Reemplaza $x=0$.
Resolución: $f(0)=0-0+3=3$

**6. [graph]** · representar · dificultad 2
Mueve $c$ para que la parábola $y=x^{2}+c$ corte al eje $y$ en $-2$.

Familia: quadratic · deslizadores: a ∈ [1, 1] paso 1 (parte en 1); c ∈ [-5, 5] paso 1 (parte en 0)
Objetivo: {"kind":"params","values":{"c":"-2"}}
Si falla → Casi. El corte con el eje $y$ es $(0,c)$.
Por qué: Con $c=-2$ la parábola baja 2 unidades y corta al eje $y$ en $-2$.

Pistas: (1) $f(0)=c$

**7. [numeric]** · resolver · dificultad 3
Si $f(x)=2x^{2}-3$, ¿cuánto vale $f(-2)$?

Respuesta: **5**
- Si escribe -11 → Casi. $(-2)^{2}=4$, positivo: $2\cdot 4-3$.
- Si escribe 13 → Casi. Solo la $x$ va al cuadrado: $2\cdot(-2)^{2}=2\cdot 4$.
- Otro error → Casi. Reemplaza con paréntesis: $2\cdot(-2)^{2}-3$.

Pistas: (1) Primero la potencia: $(-2)^{2}=4$.
Resolución: $2\cdot(-2)^{2}-3=2\cdot 4-3=5$

## m1-fc-2 · El vértice (draft, ~6 min)

**1. [explain]**
*El punto de giro*
El vértice es el punto más bajo de la parábola (si $a>0$) o el más alto (si $a<0$). Su coordenada $x$ es $-\frac{b}{2a}$.

**2. [graph]** · representar · dificultad 3
Ajusta $b$ para que el vértice de la parábola $y=x^{2}+bx$ quede en el punto $(2,-4)$.

Familia: quadratic · deslizadores: a ∈ [1, 1] paso 1 (parte en 1); b ∈ [-6, 6] paso 1 (parte en 0)
Objetivo: {"kind":"vertex","point":["2","-4"]}
Si falla → Casi. La $x$ del vértice es $-\frac{b}{2}$; tiene que dar 2.
Por qué: $b=-4$: la parábola $y=x^{2}-4x$ tiene su vértice en $(2,-4)$.

Pistas: (1) $-\frac{b}{2}=2$

**3. [numeric]** · resolver · dificultad 2
¿Cuál es la coordenada $x$ del vértice de $f(x)=x^{2}-6x+5$?

Respuesta: **3**
- Si escribe -3 → Casi. $-\frac{b}{2a}=-\frac{-6}{2}=3$: cuidado con los dos signos menos.
- Si escribe 6 → Casi. Falta dividir por $2a=2$.
- Otro error → Casi. Usa $x=-\frac{b}{2a}$ con $a=1$ y $b=-6$.

Pistas: (1) $a=1$, $b=-6$
Resolución: $x=-\frac{-6}{2\cdot 1}=3$

**4. [numeric]** · resolver · dificultad 2
¿Y cuál es la coordenada $y$ de ese vértice?

Respuesta: **-4**
- Si escribe 5 → Casi. La coordenada $y$ del vértice es $f(3)$, no el término $c$.
- Otro error → Casi. Calcula $f(3)$.

Pistas: (1) $f(3)=9-18+5$
Resolución: $f(3)=9-18+5=-4$

**5. [choice]** · resolver · dificultad 3
¿Cuál es el vértice de $f(x)=-x^{2}+4x$?

- A) $(2,4)$  ✅
- B) $(-2,-12)$  → Casi. Con $a=-1$: $-\frac{4}{2\cdot(-1)}=2$, positivo.
- C) $(2,-4)$  → Casi. $f(2)=-4+8=4$.
- D) $(4,0)$  → Casi. En $x=4$ la parábola corta al eje $x$; el vértice está en la mitad.

Pistas: (1) $a=-1$, $b=4$
Resolución: $x=-\frac{4}{2\cdot(-1)}=2$ → $f(2)=-4+8=4$

**6. [choice]** · argumentar · dificultad 3
La parábola $f(x)=x^{2}-6x+5$, ¿tiene un máximo o un mínimo?

- A) Un mínimo, igual a $-4$  ✅
- B) Un máximo, igual a $-4$  → Casi. $a=1>0$: abre hacia arriba, así que tiene mínimo.
- C) Un mínimo, igual a $5$  → Casi. El mínimo está en el vértice: $f(3)=-4$.
- D) Un máximo, igual a $5$  → Casi. Abre hacia arriba (mínimo), y el valor es $f(3)=-4$.

Por qué: Abre hacia arriba y su punto más bajo es el vértice $(3,-4)$.

Pistas: (1) El signo de $a$ decide si es máximo o mínimo.

## m1-fc-3 · Dónde corta al eje x (draft, ~6 min)

**1. [explain]**
*Los ceros*
Los ceros de $f$ son los valores de $x$ donde $f(x)=0$: ahí la parábola corta al eje $x$. Si la expresión está factorizada, cada factor igual a cero da un cero: $(x-1)(x-3)=0$ da $x=1$ o $x=3$.

**2. [choice]** · resolver · dificultad 1
¿Cuáles son los ceros de $f(x)=(x-2)(x+5)$?

- A) $x=2$ y $x=-5$  ✅
- B) $x=-2$ y $x=5$  → Casi. $x-2=0$ da $x=2$: al despejar cambia el signo.
- C) $x=2$ y $x=5$  → Casi. $x+5=0$ da $x=-5$.
- D) $x=-10$  → Casi. No se multiplican: cada factor por separado se iguala a cero.

Pistas: (1) Iguala cada paréntesis a cero.
Resolución: $x-2=0$ → $x=2$ → $x+5=0$ → $x=-5$

**3. [numeric]** · resolver · dificultad 2
¿Cuál es el cero positivo de $f(x)=x^{2}-9$?

Respuesta: **3**
- Si escribe 9 → Casi. $x^{2}=9$ da $x=3$ o $x=-3$: falta sacar la raíz.
- Otro error → Casi. Resuelve $x^{2}=9$.

Pistas: (1) $x^{2}-9=(x+3)(x-3)$
Resolución: $x^{2}=9$ → $x=3$ o $x=-3$

**4. [explain]**
*La fórmula general*
Cuando no se factoriza fácil: $x=\frac{-b±\sqrt{b^{2}-4ac}}{2a}$. El número bajo la raíz, el discriminante $b^{2}-4ac$, dice cuántos ceros hay: positivo, dos; cero, uno; negativo, ninguno real.

**5. [choice]** · argumentar · dificultad 3
¿Cuántos ceros reales tiene $f(x)=x^{2}+2x+5$?

- A) Ninguno  ✅
- B) Dos  → Casi. $b^{2}-4ac=4-20=-16$, que es negativo.
- C) Uno  → Casi. Uno ocurre cuando el discriminante es exactamente 0.
- D) Infinitos  → Casi. Una parábola corta al eje $x$ a lo más en dos puntos.

Pistas: (1) Calcula $b^{2}-4ac$.
Resolución: $b^{2}-4ac=2^{2}-4\cdot 1\cdot 5=-16$ → Negativo: no hay ceros reales.

**6. [numeric]** · resolver · dificultad 3
Resuelve $x^{2}-5x+6=0$. ¿Cuál es la solución mayor?

Respuesta: **3**
- Si escribe 2 → Casi. 2 es la solución menor.
- Si escribe 6 → Casi. Busca dos números con producto 6 y suma $-5$: $-2$ y $-3$.
- Otro error → Casi. Factoriza: $x^{2}-5x+6=(x-2)(x-3)$.

Pistas: (1) Producto 6, suma $-5$.
Resolución: $(x-2)(x-3)=0$ → $x=2$ o $x=3$

**7. [choice]** · argumentar · dificultad 4
La parábola $y=x^{2}-4x+c$ toca el eje $x$ en un solo punto. ¿Cuánto vale $c$?

- A) $4$  ✅
- B) $0$  → Casi. Con $c=0$ corta en dos puntos: $x=0$ y $x=4$.
- C) $-4$  → Casi. Un solo punto significa discriminante cero: $16-4c=0$.
- D) $16$  → Casi. $16-4c=0$ da $c=4$, no 16.

Pistas: (1) Un solo cero: $b^{2}-4ac=0$.
Resolución: $(-4)^{2}-4\cdot 1\cdot c=0$ → $16-4c=0$ → $c=4$

## m1-fc-4 · Máximos y mínimos en problemas (draft, ~6 min)

**1. [explain]**
*El mejor valor está en el vértice*
Muchos problemas piden el mayor o el menor valor posible: altura máxima, área máxima, costo mínimo. Si el modelo es cuadrático, la respuesta está en el vértice.

**2. [numeric]** · modelar · dificultad 3
Una pelota se lanza hacia arriba y su altura en metros es $h(t)=-5t^{2}+20t$, con $t$ en segundos. ¿En qué segundo alcanza su altura máxima?

Respuesta: **2**
- Si escribe -2 → Casi. $-\frac{20}{2\cdot(-5)}=2$: dos signos menos dan positivo.
- Si escribe 4 → Casi. En $t=4$ la pelota vuelve al suelo; el máximo está en la mitad.
- Otro error → Casi. Calcula la coordenada $t$ del vértice: $-\frac{b}{2a}$.

Pistas: (1) $a=-5$, $b=20$
Resolución: $t=-\frac{20}{2\cdot(-5)}=2$

**3. [numeric]** · resolver · dificultad 2
¿Cuál es esa altura máxima, en metros?

Respuesta: **20**
- Si escribe 40 → Casi. $-5\cdot 2^{2}=-20$; suma $-20+40$.
- Otro error → Casi. Calcula $h(2)$.

Pistas: (1) $h(2)=-5\cdot 4+20\cdot 2$
Resolución: $h(2)=-20+40=20$

**4. [choice]** · modelar · dificultad 3
Con 20 m de reja se quiere cercar un terreno rectangular. Si un lado mide $x$, ¿qué expresión da el área?

- A) $A(x)=x(10-x)$  ✅
- B) $A(x)=x(20-x)$  → Casi. El perímetro es $2x+2y=20$, entonces el otro lado es $y=10-x$.
- C) $A(x)=20x$  → Casi. El área es largo por ancho, y el ancho depende de $x$.
- D) $A(x)=x^{2}+10$  → Casi. El área de un rectángulo se multiplica: $x\cdot y$.

Pistas: (1) Perímetro: $2x+2y=20$.
Resolución: $y=10-x$ → $A=x\cdot(10-x)$

**5. [numeric]** · resolver · dificultad 3
¿Qué valor de $x$ da el área máxima?

Respuesta: **5**
- Si escribe 10 → Casi. Con $x=10$ el otro lado mide 0 y el área es 0.
- Otro error → Casi. $A(x)=-x^{2}+10x$: calcula el vértice.

Pistas: (1) $-\frac{10}{2\cdot(-1)}$
Resolución: $A(x)=-x^{2}+10x$ → $x=-\frac{10}{-2}=5$

**6. [choice]** · modelar · dificultad 4
El ingreso de una tienda, en miles de pesos, es $I(p)=-2p^{2}+80p$, donde $p$ es el precio. ¿Qué precio da el ingreso máximo?

- A) $20$  ✅
- B) $40$  → Casi. En $p=40$ el ingreso es 0; el máximo está en la mitad, en el vértice.
- C) $80$  → Casi. Calcula $-\frac{b}{2a}=-\frac{80}{2\cdot(-2)}$.
- D) $800$  → Casi. 800 es el ingreso máximo, no el precio.

Pistas: (1) El precio óptimo es la coordenada $p$ del vértice.
Resolución: $p=-\frac{80}{2\cdot(-2)}=20$ → $I(20)=-800+1600=800$

## Mini-clases

### mc-fc-1 · La parábola en 90 segundos (draft)

- **Forma** $a>0$: abre hacia arriba. $a<0$: abre hacia abajo. · $f(x)=ax^{2}+bx+c$
- **Eje y** Corta al eje $y$ en $(0,c)$.
- **Ojo con los negativos** Al evaluar, usa paréntesis: $(-3)^{2}=9$, pero $-3^{2}=-9$.

### mc-fc-2 · El vértice (draft)

- **Coordenada x** Está justo entre los dos ceros. · $x=-\frac{b}{2a}$
- **Coordenada y** Evalúa la función en esa $x$. · Ej.: $f(x)=x^{2}-2x-3$ → $x=1$ → $f(1)=-4$ → Vértice $(1,-4)$
- **Máximo o mínimo** Si abre hacia arriba, el vértice es el mínimo; si abre hacia abajo, el máximo.

### mc-fc-3 · Ceros y discriminante (draft)

- **Factorizando** Cada factor igual a cero. · Ej.: $(x+1)(x-4)=0$ → $x=-1$ o $x=4$
- **Fórmula general** Sirve siempre. · $x=\frac{-b±\sqrt{b^{2}-4ac}}{2a}$
- **Discriminante** $b^{2}-4ac$ positivo: dos ceros. Cero: uno. Negativo: ninguno real.
