# potencias-raices

> Generado por `npm run content:preview`. No editar a mano: se edita el JSON.

## m1-pr-1 · Multiplicar lo mismo muchas veces (draft, ~5 min)

**1. [explain]**
*Potencia*
$a^{n}$ es multiplicar $a$ por sí mismo $n$ veces: $2^{5}=2\cdot 2\cdot 2\cdot 2\cdot 2=32$. El número de abajo es la base y el de arriba, el exponente.

**2. [numeric]** · resolver · dificultad 1
¿Cuánto es $3^{4}$?

Respuesta: **81**
- Si escribe 12 → Casi. No es $3\cdot 4$: es $3\cdot 3\cdot 3\cdot 3$.
- Otro error → Casi. Multiplica el 3 cuatro veces.

Pistas: (1) $3\cdot 3=9$, $9\cdot 3=27$…
Resolución: $3\cdot 3\cdot 3\cdot 3=81$

**3. [choice]** · resolver · dificultad 2
¿Cuánto es $(-2)^{3}$?

- A) $-8$  ✅
- B) $8$  → Casi. Tres factores negativos dan un resultado negativo.
- C) $-6$  → Casi. No es $-2\cdot 3$: es $(-2)\cdot(-2)\cdot(-2)$.
- D) $6$  → Casi. Es una potencia, no una multiplicación por 3.

Pistas: (1) $(-2)\cdot(-2)=4$, y después por $-2$.
Resolución: $(-2)\cdot(-2)\cdot(-2)=-8$

**4. [choice]** · argumentar · dificultad 3
¿Cuál afirmación es correcta?

- A) $(-3)^{2}=9$ y $-3^{2}=-9$  ✅
- B) Ambos valen 9  → Casi. En $-3^{2}$ solo el 3 está al cuadrado; el menos queda afuera.
- C) Ambos valen $-9$  → Casi. $(-3)^{2}=(-3)\cdot(-3)=9$, positivo.
- D) $(-3)^{2}=-9$ y $-3^{2}=9$  → Casi. Es al revés: con paréntesis el negativo también se eleva.

Por qué: $(-3)^{2}=9$, pero $-3^{2}=-(3^{2})=-9$.

Pistas: (1) El paréntesis decide qué se eleva al cuadrado.

**5. [explain]**
*Potencias de 10*
$10^{3}=1000$: tantos ceros como indica el exponente. En notación científica, $3,2\cdot 10^{5}=320000$: la coma se corre 5 lugares a la derecha.

**6. [numeric]** · representar · dificultad 2
¿Cuánto es $4,5\cdot 10^{3}$?

Respuesta: **4500**
- Si escribe 45000 → Casi. La coma se corre 3 lugares, no 4.
- Otro error → Casi. Multiplica $4,5$ por 1000.

Pistas: (1) $10^{3}=1000$
Resolución: $4,5\cdot 1000=4500$

**7. [choice]** · representar · dificultad 3
La distancia de la Tierra al Sol es aproximadamente 150.000.000 km. ¿Cómo se escribe en notación científica?

- A) $1,5\cdot 10^{8}$  ✅
- B) $15\cdot 10^{7}$  → Casi. Vale lo mismo, pero en notación científica el número de adelante debe estar entre 1 y 10.
- C) $1,5\cdot 10^{7}$  → Casi. Cuenta los lugares que se corre la coma: son 8.
- D) $1,5\cdot 10^{9}$  → Casi. $1,5\cdot 10^{9}$ son 1.500 millones.

Por qué: $150000000=1,5\cdot 10^{8}$.

Pistas: (1) Desde 1,5 hasta 150.000.000, ¿cuántos lugares se corre la coma?

## m1-pr-2 · Propiedades de las potencias (draft, ~6 min)

**1. [explain]**
*Tres reglas*
Con la misma base: al multiplicar se suman los exponentes, $a^{m}\cdot a^{n}=a^{m+n}$; al dividir se restan, $\frac{a^{m}}{a^{n}}=a^{m-n}$; y una potencia de una potencia los multiplica, $(a^{m})^{n}=a^{m\cdot n}$.

**2. [choice]** · resolver · dificultad 1
¿A qué es igual $2^{3}\cdot 2^{4}$?

- A) $2^{7}$  ✅
- B) $2^{12}$  → Casi. Al multiplicar potencias de igual base los exponentes se suman, no se multiplican.
- C) $4^{7}$  → Casi. La base se mantiene: sigue siendo 2.
- D) $4^{12}$  → Casi. La base se mantiene y los exponentes se suman.

Pistas: (1) $a^{m}\cdot a^{n}=a^{m+n}$
Resolución: $2^{3+4}=2^{7}$

**3. [choice]** · resolver · dificultad 2
¿A qué es igual $\frac{5^{8}}{5^{3}}$?

- A) $5^{5}$  ✅
- B) $5^{11}$  → Casi. Al dividir, los exponentes se restan.
- C) $1^{5}$  → Casi. La base se mantiene: sigue siendo 5.
- D) $5^{24}$  → Casi. Al dividir no se multiplican los exponentes: se restan.

Pistas: (1) $\frac{a^{m}}{a^{n}}=a^{m-n}$
Resolución: $5^{8-3}=5^{5}$

**4. [numeric]** · resolver · dificultad 2
Escribe $(x^{3})^{4}$ como una sola potencia de $x$. ¿Cuál es el exponente?

Respuesta: **12**
- Si escribe 7 → Casi. Una potencia elevada a otra multiplica los exponentes: $3\cdot 4$.
- Otro error → Casi. Usa $(a^{m})^{n}=a^{m\cdot n}$.

Pistas: (1) $(x^{3})^{4}=x^{3}\cdot x^{3}\cdot x^{3}\cdot x^{3}$
Resolución: $(x^{3})^{4}=x^{12}$

**5. [explain]**
*Exponente cero y negativo*
Para $a$ distinto de 0: $a^{0}=1$ y $a^{-n}=\frac{1}{a^{n}}$. Un exponente negativo no hace negativo el resultado: indica el recíproco.

**6. [numeric]** · resolver · dificultad 2
¿Cuánto es $2^{-3}$?

Respuesta: **1/8**
- Si escribe -8 → Casi. El exponente negativo indica el recíproco, no un número negativo.
- Si escribe -1/8 → Casi. El resultado es positivo: $\frac{1}{2^{3}}$.
- Otro error → Casi. $2^{-3}=\frac{1}{2^{3}}$.

Pistas: (1) $a^{-n}=\frac{1}{a^{n}}$
Resolución: $2^{-3}=\frac{1}{8}$

**7. [choice]** · resolver · dificultad 3
¿Cuál es el valor de $\frac{3^{5}\cdot 3^{2}}{3^{4}}$?

- A) $27$  ✅
- B) $9$  → Casi. $5+2-4=3$, no 2.
- C) $81$  → Casi. El exponente final es 3: $3^{3}=27$.
- D) $3^{14}$  → Casi. En la división los exponentes se restan.

Pistas: (1) Arriba: $3^{7}$. Después divide.
Resolución: $3^{5+2-4}=3^{3}=27$

## m1-pr-3 · Raíces como potencias (draft, ~6 min)

**1. [explain]**
*La operación inversa*
La raíz cuadrada de $a$ es el número positivo que al cuadrado da $a$: $\sqrt{49}=7$. La raíz cúbica es el número que al cubo da $a$. Y las raíces son potencias con exponente fraccionario: $\sqrt{a}=a^{\frac{1}{2}}$.

**2. [numeric]** · resolver · dificultad 1
¿Cuánto es $\sqrt{144}$?

Respuesta: **12**
- Si escribe 72 → Casi. La raíz no es la mitad: es el número que al cuadrado da 144.
- Otro error → Casi. ¿Qué número multiplicado por sí mismo da 144?

Pistas: (1) $12\cdot 12$
Resolución: $12^{2}=144$, entonces $\sqrt{144}=12$

**3. [choice]** · resolver · dificultad 2
¿Cuánto es $8^{\frac{1}{3}}$, es decir, la raíz cúbica de 8?

- A) $2$  ✅
- B) $\frac{8}{3}$  → Casi. Un exponente fraccionario es una raíz, no una división.
- C) $4$  → Casi. $4^{3}=64$, no 8.
- D) $24$  → Casi. Eso es $8\cdot 3$.

Pistas: (1) ¿Qué número al cubo da 8?
Resolución: $2^{3}=8$, entonces $8^{\frac{1}{3}}=2$

**4. [explain]**
*Simplificar raíces*
Como $\sqrt{a\cdot b}=\sqrt{a}\cdot\sqrt{b}$, puedes sacar de la raíz los cuadrados perfectos: $\sqrt{50}=\sqrt{25\cdot 2}=5\sqrt{2}$.

**5. [choice]** · resolver · dificultad 2
Simplifica $\sqrt{12}$.

- A) $2\sqrt{3}$  ✅
- B) $3\sqrt{2}$  → Casi. $3\sqrt{2}=\sqrt{18}$, no $\sqrt{12}$.
- C) $4\sqrt{3}$  → Casi. Sale la raíz de 4, que es 2, no el 4.
- D) $6\sqrt{2}$  → Casi. Busca el cuadrado perfecto que divide a 12: es 4.

Pistas: (1) $12=4\cdot 3$
Resolución: $\sqrt{12}=\sqrt{4}\cdot\sqrt{3}=2\sqrt{3}$

**6. [choice]** · resolver · dificultad 2
¿Cuánto es $\sqrt{2}\cdot\sqrt{8}$?

- A) $4$  ✅
- B) $\sqrt{10}$  → Casi. Las raíces se multiplican adentro, no se suman: $\sqrt{2\cdot 8}$.
- C) $16$  → Casi. $\sqrt{16}=4$: falta sacar la raíz.
- D) $2\sqrt{2}$  → Casi. $2\sqrt{2}=\sqrt{8}$; falta multiplicar por $\sqrt{2}$.

Pistas: (1) $\sqrt{a}\cdot\sqrt{b}=\sqrt{a\cdot b}$
Resolución: $\sqrt{16}=4$

**7. [choice]** · argumentar · dificultad 3
¿Es cierto que $\sqrt{9+16}=\sqrt{9}+\sqrt{16}$?

- A) No: la izquierda vale 5 y la derecha, 7  ✅
- B) Sí, ambos lados valen 7  → Casi. $\sqrt{9+16}=\sqrt{25}=5$: primero se suma y después se saca la raíz.
- C) Sí, ambos lados valen 5  → Casi. $\sqrt{9}+\sqrt{16}=3+4=7$, no 5.
- D) No se puede calcular  → Casi. Ambos lados se pueden calcular: 5 y 7.

Por qué: La raíz de una suma no es la suma de las raíces: $\sqrt{9+16}=5$, pero $\sqrt{9}+\sqrt{16}=7$.

Pistas: (1) Calcula cada lado por separado.

## m1-pr-4 · Simplificar expresiones (draft, ~5 min)

**1. [explain]**
*Paso a paso*
Combina las propiedades de a una: primero lo que está entre paréntesis, después agrupa las potencias de igual base y al final suma o resta sus exponentes.

**2. [choice]** · resolver · dificultad 1
Simplifica $x^{2}\cdot x^{5}\cdot x$.

- A) $x^{8}$  ✅
- B) $x^{7}$  → Casi. La $x$ sola es $x^{1}$: suma también ese 1.
- C) $x^{10}$  → Casi. Los exponentes se suman, no se multiplican.
- D) $3x^{7}$  → Casi. No aparece un 3 adelante: es una multiplicación de potencias, no una suma.

Pistas: (1) $x=x^{1}$
Resolución: $x^{2+5+1}=x^{8}$

**3. [choice]** · resolver · dificultad 2
Simplifica $(2a^{3})^{2}$.

- A) $4a^{6}$  ✅
- B) $2a^{6}$  → Casi. El 2 también se eleva: $2^{2}=4$.
- C) $4a^{5}$  → Casi. $(a^{3})^{2}=a^{6}$: los exponentes se multiplican.
- D) $2a^{5}$  → Casi. Se eleva el 2 ($2^{2}=4$) y se multiplican los exponentes ($3\cdot 2$).

Pistas: (1) $(2a^{3})^{2}=2^{2}\cdot(a^{3})^{2}$
Resolución: $2^{2}\cdot a^{6}=4a^{6}$

**4. [numeric]** · resolver · dificultad 2
Si $2^{x}=32$, ¿cuánto vale $x$?

Respuesta: **5**
- Si escribe 16 → Casi. No es $32\div 2$: busca cuántas veces se multiplica el 2 para llegar a 32.
- Otro error → Casi. Escribe 32 como potencia de 2.

Pistas: (1) $2,4,8,16,32$
Resolución: $32=2^{5}$, entonces $x=5$

**5. [find-error]** · argumentar · dificultad 2
Así simplificaron $\frac{a^{6}}{a^{2}}$. ¿En qué línea está el error?

1. $\frac{a^{6}}{a^{2}}$
2. $=a^{3}$  ❌ (error)
Si elige otra → Casi. La primera línea es solo el enunciado.
Explicación: Al dividir potencias de igual base los exponentes se restan: $a^{6-2}=a^{4}$.

Pistas: (1) ¿Los exponentes se dividen o se restan?

**6. [choice]** · resolver · dificultad 4
¿Cuál es el valor de $\frac{2^{10}}{4^{3}}$?

- A) $16$  ✅
- B) $8$  → Casi. $4^{3}=2^{6}$, entonces queda $2^{10-6}=2^{4}$.
- C) $\frac{10}{3}$  → Casi. Los exponentes no se dividen; escribe todo en base 2.
- D) $256$  → Casi. Revisa: $4^{3}=64$ y $1024\div 64=16$.

Pistas: (1) $4=2^{2}$, entonces $4^{3}=2^{6}$.
Resolución: $\frac{2^{10}}{2^{6}}=2^{4}=16$

## Mini-clases

### mc-pr-1 · Propiedades de las potencias (draft)

- **Igual base** Multiplicar suma exponentes; dividir los resta. · $a^{m}\cdot a^{n}=a^{m+n}$
- **Potencia de potencia** Se multiplican los exponentes. · $(a^{m})^{n}=a^{m\cdot n}$
- **Cero y negativos** $a^{0}=1$ y $a^{-n}=\frac{1}{a^{n}}$ (con $a$ distinto de 0).

### mc-pr-2 · Raíces (draft)

- **Raíz cuadrada** El número positivo que al cuadrado da el de adentro. · Ej.: $\sqrt{81}=9$
- **Producto** La raíz de un producto es el producto de las raíces. · $\sqrt{a\cdot b}=\sqrt{a}\cdot\sqrt{b}$
- **Ojo con la suma** La raíz de una suma no es la suma de las raíces: $\sqrt{9+16}=5$, no 7.

### mc-pr-3 · Notación científica (draft)

- **Forma** Un número entre 1 y 10 multiplicado por una potencia de 10. · Ej.: $320000=3,2\cdot 10^{5}$
- **Números chicos** Con exponente negativo. · Ej.: $0,0045=4,5\cdot 10^{-3}$
