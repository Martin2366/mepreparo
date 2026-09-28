# expresiones-algebraicas

> Generado por `npm run content:preview`. No editar a mano: se edita el JSON.

## m1-ea-1 · Términos semejantes (draft, ~5 min)

**1. [explain]**
*Solo se juntan los parecidos*
Términos semejantes tienen la misma parte literal: $3x$ y $-5x$ son semejantes; $3x$ y $3x^{2}$ no lo son. Solo los semejantes se pueden sumar o restar.
> Nota de Equis: $3x+5x=8x$, pero $3x+5$ queda así.

**2. [choice]** · representar · dificultad 1
¿Cuál par corresponde a términos semejantes?

- A) $4ab$ y $-7ab$  ✅
- B) $4a$ y $4b$  → Casi. Tienen el mismo coeficiente, pero distinta letra: no son semejantes.
- C) $x^{2}$ y $2x$  → Casi. $x^{2}$ y $x$ tienen distinto exponente: no son semejantes.
- D) $5y$ y $5$  → Casi. Uno tiene $y$ y el otro es solo un número.

Por qué: $4ab$ y $-7ab$ tienen la misma parte literal, $ab$.

Pistas: (1) Mira solo las letras y sus exponentes, no los números de adelante.

**3. [numeric]** · resolver · dificultad 1
Reduce $7x+3x-4x$. ¿Cuál es el coeficiente que queda en la $x$?

Respuesta: **6**
- Si escribe 14 → Casi. El $-4x$ resta: $7+3-4$.
- Otro error → Casi. Suma y resta solo los coeficientes: $7+3-4$.

Pistas: (1) Los tres términos son semejantes: opera sus coeficientes.
Resolución: $7x+3x-4x=(7+3-4)x=6x$

**4. [choice]** · resolver · dificultad 2
Reduce $5a+2b-3a+4b$.

- A) $2a+6b$  ✅
- B) $8ab$  → Casi. $a$ y $b$ no son semejantes: no se pueden juntar en un solo término.
- C) $2a-2b$  → Casi. $2b+4b=6b$.
- D) $8a+6b$  → Casi. El $-3a$ resta: $5a-3a=2a$.

Pistas: (1) Junta las $a$ por un lado y las $b$ por otro.
Resolución: $(5a-3a)+(2b+4b)=2a+6b$

**5. [explain]**
*El menos delante de un paréntesis*
Un signo menos delante de un paréntesis cambia el signo de todo lo que está adentro: $-(2x-5)=-2x+5$. Y un número delante multiplica a cada término: $3(x+2)=3x+6$.

**6. [choice]** · resolver · dificultad 3
Reduce $3(x+2)-(x-4)$.

- A) $2x+10$  ✅
- B) $2x+2$  → Casi. El menos cambia el signo del $-4$: queda $+4$.
- C) $4x+10$  → Casi. $-(x-4)$ resta la $x$: $3x-x=2x$.
- D) $2x+6$  → Casi. Falta el $+4$ que sale de $-(-4)$.

Pistas: (1) $3(x+2)=3x+6$ y $-(x-4)=-x+4$.
Resolución: $3x+6-x+4$ → $=2x+10$

**7. [numeric]** · resolver · dificultad 3
Si $x=-2$, ¿cuánto vale $x^{2}-3x+1$?

Respuesta: **11**
- Si escribe 3 → Casi. $(-2)^{2}=4$: el cuadrado de un número negativo es positivo.
- Si escribe -1 → Casi. $-3\cdot(-2)=+6$.
- Otro error → Casi. Reemplaza con paréntesis: $(-2)^{2}-3\cdot(-2)+1$.

Pistas: (1) Usa paréntesis al reemplazar un negativo.
Resolución: $(-2)^{2}-3\cdot(-2)+1$ → $=4+6+1=11$

**8. [find-error]** · argumentar · dificultad 3
Carla redujo $2(3x-1)-4x$. ¿En qué línea se equivocó?

1. $2(3x-1)-4x$
2. $6x-1-4x$  ❌ (error)
3. $2x-1$
Si elige otra → Casi. Esa línea sigue bien desde la anterior. Revisa cómo se multiplicó el paréntesis.
Explicación: El 2 multiplica también al $-1$: $6x-2-4x=2x-2$.

Pistas: (1) ¿A qué términos multiplica el 2?

## m1-ea-2 · El modelo de área (draft, ~6 min)

**1. [explain]**
*Multiplicar es armar un rectángulo*
Un rectángulo de lados $x+3$ y $x+2$ se divide en 4 partes: $x^{2}$, $3x$, $2x$ y $6$. Su área total es la suma de las partes.
> Nota de Equis: $(x+3)(x+2)=x^{2}+5x+6$

**2. [numeric]** · representar · dificultad 2
Un rectángulo mide $x+4$ por $x+1$. Su área es $x^{2}+bx+4$. ¿Cuánto vale $b$?

Respuesta: **5**
- Si escribe 4 → Casi. Las dos partes del medio son $4x$ y $1x$: suman $5x$.
- Otro error → Casi. Dibuja las 4 partes: $x^{2}$, $4x$, $x$ y $4$.

Pistas: (1) Las partes con $x$ son $4\cdot x$ y $1\cdot x$.
Resolución: $(x+4)(x+1)=x^{2}+x+4x+4=x^{2}+5x+4$

**3. [choice]** · resolver · dificultad 2
¿Cuál es el desarrollo de $(x+5)(x+3)$?

- A) $x^{2}+8x+15$  ✅
- B) $x^{2}+15$  → Casi. Faltan las partes del medio: $5x$ y $3x$.
- C) $x^{2}+8x+8$  → Casi. La última parte es $5\cdot 3=15$, no $5+3$.
- D) $2x+8$  → Casi. $x\cdot x=x^{2}$, no $2x$.

Pistas: (1) Cada término del primer paréntesis multiplica a cada término del segundo.
Resolución: $x^{2}+3x+5x+15=x^{2}+8x+15$

**4. [explain]**
*Distribuir*
Sin dibujar: cada término del primer paréntesis multiplica a cada término del segundo, y después se reducen los semejantes. Con signos negativos funciona igual.

**5. [numeric]** · resolver · dificultad 3
Desarrolla $(2x+1)(x+3)$. ¿Cuál es el coeficiente del término con $x$?

Respuesta: **7**
- Si escribe 6 → Casi. Falta el término $1\cdot x$: $6x+x=7x$.
- Otro error → Casi. Multiplica los 4 pares y junta los términos con $x$.

Pistas: (1) $2x\cdot 3=6x$ y $1\cdot x=x$.
Resolución: $2x^{2}+6x+x+3=2x^{2}+7x+3$

**6. [choice]** · resolver · dificultad 3
¿A qué es igual $(x-2)(x+5)$?

- A) $x^{2}+3x-10$  ✅
- B) $x^{2}-3x-10$  → Casi. $5x-2x=3x$, que es positivo.
- C) $x^{2}+3x+10$  → Casi. $-2\cdot 5=-10$.
- D) $x^{2}-10$  → Casi. Faltan los términos con $x$: $5x$ y $-2x$.

Pistas: (1) Cuida los signos: $-2\cdot x=-2x$ y $-2\cdot 5=-10$.
Resolución: $x^{2}+5x-2x-10=x^{2}+3x-10$

**7. [choice]** · modelar · dificultad 4
Un rectángulo tiene lados $x+6$ y $x-1$. ¿Qué expresión representa su área?

- A) $x^{2}+5x-6$  ✅
- B) $x^{2}+5x+6$  → Casi. $6\cdot(-1)=-6$.
- C) $x^{2}-5x-6$  → Casi. $6x-x=5x$, positivo.
- D) $x^{2}+7x-6$  → Casi. Es $6x-x$, no $6x+x$.

Pistas: (1) Área = largo por ancho: $(x+6)(x-1)$.
Resolución: $x^{2}-x+6x-6=x^{2}+5x-6$

## m1-ea-3 · Productos notables (draft, ~6 min)

**1. [explain]**
*El cuadrado de un binomio*
$(a+b)^{2}$ es un cuadrado de lado $a+b$: se arma con un cuadrado $a^{2}$, otro $b^{2}$ y dos rectángulos $ab$. Por eso $(a+b)^{2}=a^{2}+2ab+b^{2}$.
> Nota de Equis: El error más común: olvidar el $2ab$.

**2. [choice]** · resolver · dificultad 1
¿Cuál es el desarrollo de $(x+4)^{2}$?

- A) $x^{2}+8x+16$  ✅
- B) $x^{2}+16$  → Casi. Faltan los dos rectángulos: $2\cdot 4x=8x$.
- C) $x^{2}+4x+16$  → Casi. El término del medio es el doble: $2\cdot 4x=8x$.
- D) $x^{2}+8x+8$  → Casi. $4^{2}=16$.

Pistas: (1) $(a+b)^{2}=a^{2}+2ab+b^{2}$ con $a=x$ y $b=4$.
Resolución: $x^{2}+2\cdot x\cdot 4+4^{2}=x^{2}+8x+16$

**3. [numeric]** · resolver · dificultad 2
Si $(x-3)^{2}=x^{2}+bx+9$, ¿cuánto vale $b$?

Respuesta: **-6**
- Si escribe 6 → Casi. Con resta, el término del medio es negativo: $-2\cdot 3x$.
- Si escribe -3 → Casi. Es el doble: $2\cdot 3=6$, con signo menos.
- Otro error → Casi. Usa $(a-b)^{2}=a^{2}-2ab+b^{2}$.

Pistas: (1) El término del medio es $-2\cdot x\cdot 3$.
Resolución: $(x-3)^{2}=x^{2}-6x+9$

**4. [explain]**
*Suma por diferencia*
$(a+b)(a-b)=a^{2}-b^{2}$: al multiplicar, los términos del medio ($ab$ y $-ab$) se cancelan.

**5. [choice]** · resolver · dificultad 2
¿A qué es igual $(x+7)(x-7)$?

- A) $x^{2}-49$  ✅
- B) $x^{2}+49$  → Casi. El último término es $7\cdot(-7)=-49$.
- C) $x^{2}-14x-49$  → Casi. Los términos del medio se cancelan: $7x-7x=0$.
- D) $x^{2}-7$  → Casi. Es $7^{2}=49$, no 7.

Pistas: (1) $(a+b)(a-b)=a^{2}-b^{2}$
Resolución: $x^{2}-7^{2}=x^{2}-49$

**6. [numeric]** · argumentar · dificultad 3
Calcula $101\cdot 99$ usando suma por diferencia.

Respuesta: **9999**
- Si escribe 10001 → Casi. Es $100^{2}-1^{2}$: el 1 se resta.
- Otro error → Casi. Escribe $101=100+1$ y $99=100-1$.

Pistas: (1) $101\cdot 99=(100+1)(100-1)$
Resolución: $(100+1)(100-1)=100^{2}-1^{2}$ → $=10000-1=9999$

**7. [choice]** · argumentar · dificultad 4
Si $a+b=7$ y $ab=10$, ¿cuánto vale $a^{2}+b^{2}$?

- A) $29$  ✅
- B) $49$  → Casi. $(a+b)^{2}=49$ incluye el término $2ab=20$; hay que restarlo.
- C) $39$  → Casi. $2ab=2\cdot 10=20$, no 10.
- D) $69$  → Casi. El $2ab$ se resta, no se suma.

Pistas: (1) $(a+b)^{2}=a^{2}+2ab+b^{2}$ (2) Reemplaza: $49=a^{2}+b^{2}+20$.
Resolución: $(a+b)^{2}=a^{2}+b^{2}+2ab$ → $49=a^{2}+b^{2}+20$ → $a^{2}+b^{2}=29$

## m1-ea-4 · Factorizar: volver al rectángulo (draft, ~6 min)

**1. [explain]**
*El camino de vuelta*
Factorizar es escribir una suma como un producto. Lo primero es buscar un factor común: $6x+9=3(2x+3)$.

**2. [choice]** · resolver · dificultad 2
Factoriza $4x^{2}+8x$.

- A) $4x(x+2)$  ✅
- B) $4(x^{2}+8x)$  → Casi. Si sacas el 4, adentro queda $x^{2}+2x$, y aún queda $x$ común.
- C) $x(4x+8)$  → Casi. Aún queda el factor común 4 adentro del paréntesis.
- D) $4x(x+8)$  → Casi. $4x\cdot 8=32x$; debería dar $8x$.

Pistas: (1) ¿Qué número y qué letra dividen a los dos términos?
Resolución: $4x^{2}+8x=4x\cdot x+4x\cdot 2=4x(x+2)$

**3. [explain]**
*Trinomios*
Para $x^{2}+bx+c$ busca dos números que multiplicados den $c$ y sumados den $b$. Por ejemplo, $x^{2}+5x+6=(x+2)(x+3)$ porque $2\cdot 3=6$ y $2+3=5$.

**4. [choice]** · resolver · dificultad 2
Factoriza $x^{2}+7x+12$.

- A) $(x+3)(x+4)$  ✅
- B) $(x+2)(x+6)$  → Casi. $2\cdot 6=12$, pero $2+6=8$, no 7.
- C) $(x+12)(x+1)$  → Casi. $12+1=13$, no 7.
- D) $(x-3)(x-4)$  → Casi. Los dos números deben sumar $+7$: son positivos.

Pistas: (1) Busca dos números con producto 12 y suma 7.
Resolución: $3\cdot 4=12$ y $3+4=7$ → $x^{2}+7x+12=(x+3)(x+4)$

**5. [numeric]** · resolver · dificultad 2
Si $x^{2}-9=(x+3)(x-a)$, ¿cuánto vale $a$?

Respuesta: **3**
- Si escribe 9 → Casi. $x^{2}-9=x^{2}-3^{2}$: es una diferencia de cuadrados.
- Otro error → Casi. Recuerda $a^{2}-b^{2}=(a+b)(a-b)$.

Pistas: (1) $9=3^{2}$
Resolución: $x^{2}-9=(x+3)(x-3)$

**6. [choice]** · resolver · dificultad 3
Factoriza $x^{2}-x-6$.

- A) $(x-3)(x+2)$  ✅
- B) $(x+3)(x-2)$  → Casi. $3-2=1$ daría $+x$; necesitas que sumen $-1$.
- C) $(x-6)(x+1)$  → Casi. $-6+1=-5$, no $-1$.
- D) $(x-3)(x-2)$  → Casi. $(-3)(-2)=+6$, pero necesitas $-6$.

Pistas: (1) Producto $-6$ y suma $-1$: uno positivo y otro negativo.
Resolución: $(-3)\cdot 2=-6$ y $-3+2=-1$ → $x^{2}-x-6=(x-3)(x+2)$

**7. [order]** · argumentar · dificultad 3
Ordena los pasos para factorizar $2x^{2}+10x+12$.

1. Factor común: $2(x^{2}+5x+6)$
2. Buscar dos números con producto 6 y suma 5
3. Son 2 y 3
4. $2(x+2)(x+3)$
Si falla → Casi. Siempre se busca primero el factor común; después se factoriza lo que queda.

Pistas: (1) ¿Qué se hace primero cuando todos los términos tienen un factor común?

**8. [choice]** · argumentar · dificultad 4
Para $x$ distinto de $-2$, ¿a qué expresión es equivalente $\frac{x^{2}-4}{x+2}$?

- A) $x-2$  ✅
- B) $x+2$  → Casi. Al simplificar se cancela $x+2$ y queda el otro factor.
- C) $x-4$  → Casi. Factoriza primero el numerador: $x^{2}-4=(x+2)(x-2)$.
- D) $x^{2}-2$  → Casi. No se simplifica término a término; factoriza el numerador.

Pistas: (1) $x^{2}-4$ es una diferencia de cuadrados.
Resolución: $\frac{(x+2)(x-2)}{x+2}=x-2$

## Mini-clases

### mc-ea-1 · Reducir en 90 segundos (draft)

- **Semejantes** Misma parte literal (letras y exponentes). Solo esos se suman o restan. · Ej.: $3x^{2}+2x-x^{2}+5x$ → $=2x^{2}+7x$
- **Paréntesis** Un número delante multiplica a cada término; un menos cambia todos los signos. · $-(a-b)=-a+b$
- **Comprueba** Reemplaza un número (por ejemplo $x=1$) en la expresión original y en la reducida: deben dar lo mismo.

### mc-ea-2 · Productos notables (draft)

- **Cuadrado de binomio** Primero al cuadrado, más el doble del primero por el segundo, más el segundo al cuadrado. · $(a+b)^{2}=a^{2}+2ab+b^{2}$
- **Con resta** Solo cambia el signo del término del medio. · $(a-b)^{2}=a^{2}-2ab+b^{2}$
- **Suma por diferencia** Los términos del medio se cancelan. · $(a+b)(a-b)=a^{2}-b^{2}$

### mc-ea-3 · Factorizar paso a paso (draft)

- **1. Factor común** Siempre primero. · Ej.: $5x^{2}-10x=5x(x-2)$
- **2. Diferencia de cuadrados** Dos cuadrados restados. · Ej.: $x^{2}-25=(x+5)(x-5)$
- **3. Trinomio** Dos números: producto $c$ y suma $b$. · Ej.: $x^{2}+x-12$ → $4\cdot(-3)=-12$ y $4-3=1$ → $(x+4)(x-3)$
