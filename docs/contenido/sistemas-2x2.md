# sistemas-2x2

> Generado por `npm run content:preview`. No editar a mano: se edita el JSON.

## m1-se-1 · Dos condiciones a la vez (draft, ~5 min)

**1. [explain]**
*Dos pistas*
A veces hay dos incógnitas y dos pistas. Por ejemplo: dos números suman 10 y su diferencia es 2. Cada pista es una ecuación, y la solución tiene que cumplir las dos a la vez.
> Nota de Equis: $x+y=10$ y $x-y=2$

**2. [choice]** · resolver · dificultad 1
¿Qué par de valores cumple $x+y=10$ y $x-y=2$?

- A) $x=6$, $y=4$  ✅
- B) $x=5$, $y=5$  → Casi. Cumple la suma, pero $5-5=0$, no 2.
- C) $x=8$, $y=2$  → Casi. Cumple la suma, pero $8-2=6$, no 2.
- D) $x=7$, $y=3$  → Casi. Cumple la suma, pero $7-3=4$, no 2.

Por qué: $6+4=10$ y $6-4=2$: cumple las dos.

Pistas: (1) Prueba cada par en las dos ecuaciones.

**3. [choice]** · modelar · dificultad 2
Una entrada de adulto y una de niño cuestan \$9.000 en total, y la de adulto cuesta \$3.000 más. Si $a$ es el precio de adulto y $n$ el de niño, ¿qué sistema representa la situación?

- A) $a+n=9000$ y $a-n=3000$  ✅
- B) $a+n=9000$ y $n-a=3000$  → Casi. La de adulto es la más cara: $a-n=3000$.
- C) $a\cdot n=9000$ y $a-n=3000$  → Casi. "En total" es una suma, no un producto.
- D) $a+n=3000$ y $a-n=9000$  → Casi. Intercambiaste los datos: el total es \$9.000.

Por qué: El total es la suma $a+n=9000$ y la diferencia es $a-n=3000$.

Pistas: (1) "En total" → suma. "Cuesta 3.000 más" → diferencia.

**4. [numeric]** · resolver · dificultad 2
Resuelve el sistema $x+y=12$ y $x-y=4$. ¿Cuánto vale $x$?

Respuesta: **8**
- Si escribe 4 → Casi. 4 es el valor de $y$; la pregunta es por $x$.
- Si escribe 16 → Casi. Al sumar las ecuaciones queda $2x=16$: falta dividir por 2.
- Otro error → Casi. Suma las dos ecuaciones: la $y$ se cancela.

Pistas: (1) $(x+y)+(x-y)=12+4$
Resolución: $2x=16$ → $x=8$

**5. [explain]**
*Siempre comprueba*
Reemplaza tus valores en las dos ecuaciones. Si se cumplen ambas, encontraste la solución; si falla una, hay un error.

**6. [choice]** · modelar · dificultad 4
En un corral hay gallinas y conejos. En total hay 10 cabezas y 32 patas. ¿Cuántos conejos hay?

- A) $6$  ✅
- B) $4$  → Casi. 4 son las gallinas; la pregunta es por los conejos.
- C) $8$  → Casi. 8 conejos tendrían 32 patas solos, sin contar las gallinas.
- D) $16$  → Casi. Plantea el sistema: cabezas $g+c=10$ y patas $2g+4c=32$.

Pistas: (1) Cabezas: $g+c=10$. Patas: $2g+4c=32$. (2) Reemplaza $g=10-c$ en la segunda.
Resolución: $2(10-c)+4c=32$ → $20+2c=32$ → $c=6$

## m1-se-2 · Sustitución (draft, ~5 min)

**1. [explain]**
*Despejar y reemplazar*
Despeja una incógnita en una ecuación y reemplázala en la otra. Así queda una ecuación con una sola incógnita, que ya sabes resolver.

**2. [order]** · argumentar · dificultad 2
Ordena la resolución del sistema $y=2x$ y $x+y=9$.

1. Reemplazar: $x+2x=9$
2. $3x=9$
3. $x=3$
4. $y=2\cdot 3=6$
Si falla → Casi. Primero se reemplaza, después se resuelve para $x$ y al final se calcula $y$.

Pistas: (1) ¿Qué incógnita ya está despejada?

**3. [numeric]** · resolver · dificultad 2
Resuelve $y=x+1$ y $2x+y=10$. ¿Cuánto vale $x$?

Respuesta: **3**
- Si escribe 11/3 → Casi. Al reemplazar, el $+1$ pasa restando: $3x=10-1$.
- Otro error → Casi. Reemplaza $y$ por $x+1$ en la segunda ecuación.

Pistas: (1) $2x+(x+1)=10$
Resolución: $2x+x+1=10$ → $3x=9$ → $x=3$

**4. [numeric]** · resolver · dificultad 1
Con ese valor de $x$, ¿cuánto vale $y$ en $y=x+1$?

Respuesta: **4**
- Si escribe 2 → Casi. Es $y=x+1=3+1$.
- Otro error → Casi. Reemplaza $x=3$ en $y=x+1$.

Pistas: (1) $y=3+1$
Resolución: $y=3+1=4$

**5. [find-error]** · argumentar · dificultad 3
Así resolvieron el sistema $x=3y$ y $x-y=8$. ¿En qué línea está el error?

1. $3y-y=8$
2. $2y=8$
3. $y=4$
4. $x=3+4=7$  ❌ (error)
Si elige otra → Casi. Esa línea está bien. Revisa cómo se calculó $x$ al final.
Explicación: $x=3y$ significa 3 por $y$: $x=3\cdot 4=12$, no $3+4$.

Pistas: (1) ¿Qué dice la primera ecuación sobre $x$?

**6. [choice]** · modelar · dificultad 3
La suma de dos números es 30 y uno es el cuádruple del otro. ¿Cuál es el número mayor?

- A) $24$  ✅
- B) $6$  → Casi. 6 es el menor; el mayor es su cuádruple.
- C) $20$  → Casi. Plantea $x+4x=30$.
- D) $26$  → Casi. $26+4=30$, pero 26 no es el cuádruple de 4.

Pistas: (1) Si el menor es $x$, el mayor es $4x$.
Resolución: $x+4x=30$ → $x=6$ → mayor: $4\cdot 6=24$

## m1-se-3 · Reducción (draft, ~6 min)

**1. [explain]**
*Sumar para cancelar*
Si en las dos ecuaciones una incógnita tiene coeficientes opuestos, al sumarlas desaparece. Si no, multiplica antes una ecuación para lograrlo.

**2. [choice]** · argumentar · dificultad 1
En el sistema $2x+y=11$ y $3x-y=9$, ¿qué conviene hacer?

- A) Sumar las ecuaciones  ✅
- B) Restar las ecuaciones  → Casi. Restando queda $-x+2y=2$: no se cancela ninguna incógnita.
- C) Multiplicar la primera por 3  → Casi. No hace falta: $y$ y $-y$ ya son opuestos.
- D) Dividir todo por 2  → Casi. Eso no cancela ninguna incógnita.

Por qué: $y$ y $-y$ son opuestos: al sumar, queda $5x=20$.

Pistas: (1) Fíjate en los coeficientes de $y$.

**3. [numeric]** · resolver · dificultad 2
Resuelve ese sistema. ¿Cuánto vale $x$?

Respuesta: **4**
- Si escribe 20 → Casi. $5x=20$: falta dividir por 5.
- Otro error → Casi. Suma las ecuaciones: $5x=20$.

Pistas: (1) $(2x+y)+(3x-y)=11+9$
Resolución: $5x=20$ → $x=4$

**4. [numeric]** · resolver · dificultad 2
Con $x=4$, ¿cuánto vale $y$ en $2x+y=11$?

Respuesta: **3**
- Si escribe 7 → Casi. $2x=8$, no 4: $y=11-8$.
- Otro error → Casi. Reemplaza: $2\cdot 4+y=11$.

Pistas: (1) $8+y=11$
Resolución: $8+y=11$ → $y=3$

**5. [explain]**
*Multiplicar antes*
En $x+2y=7$ y $3x+y=11$ no hay opuestos. Multiplica la segunda por 2 ($6x+2y=22$) y réstale la primera: la $y$ desaparece.

**6. [numeric]** · resolver · dificultad 3
Resuelve $x+2y=7$ y $3x+y=11$. ¿Cuánto vale $y$?

Respuesta: **2**
- Si escribe 3 → Casi. 3 es el valor de $x$; la pregunta es por $y$.
- Otro error → Casi. Multiplica la segunda ecuación por 2 y resta la primera.

Pistas: (1) $6x+2y=22$ menos $x+2y=7$ da $5x=15$.
Resolución: $5x=15$, entonces $x=3$ → $3+2y=7$ → $y=2$

**7. [choice]** · modelar · dificultad 4
En una tienda, 2 poleras y 3 gorros cuestan \$26.000, y 1 polera y 1 gorro cuestan \$10.000. ¿Cuánto cuesta una polera?

- A) \$4.000  ✅
- B) \$6.000  → Casi. \$6.000 es el precio del gorro.
- C) \$5.000  → Casi. No cuestan lo mismo: plantea el sistema.
- D) \$8.000  → Casi. Revisa: con $p+g=10000$, $2p+3g=26000$.

Pistas: (1) $p+g=10000$ y $2p+3g=26000$. (2) Multiplica la primera por 3 y resta.
Resolución: $3p+3g=30000$ → $(3p+3g)-(2p+3g)=30000-26000$ → $p=4000$

## m1-se-4 · Dos rectas que se cruzan (draft, ~6 min)

**1. [explain]**
*La solución se ve*
Cada ecuación de un sistema 2×2 es una recta. La solución del sistema es el punto donde las dos rectas se cruzan.

**2. [graph]** · representar · dificultad 3
La recta $y=x+1$ pasa por el punto $(2,3)$. Ajusta la recta $y=mx+n$ para que también pase por $(2,3)$ y por $(0,7)$.

Familia: linear · deslizadores: m ∈ [-4, 4] paso 1 (parte en 0); n ∈ [-5, 8] paso 1 (parte en 0)
Objetivo: {"kind":"points","points":[["0","7"],["2","3"]]}
Si falla → Casi. Primero ubica $n$ con el punto sobre el eje $y$ y después la pendiente.
Por qué: La recta es $y=-2x+7$. Se cruza con $y=x+1$ en $(2,3)$: esa es la solución del sistema.

Pistas: (1) $(0,7)$ da $n=7$. (2) De $(0,7)$ a $(2,3)$ baja 4 en 2 pasos.

**3. [choice]** · argumentar · dificultad 2
Si las dos rectas de un sistema son paralelas y distintas, el sistema tiene:

- A) Ninguna solución  ✅
- B) Una solución  → Casi. Las paralelas nunca se cruzan: no hay punto común.
- C) Infinitas soluciones  → Casi. Infinitas ocurre cuando las dos rectas son la misma.
- D) Dos soluciones  → Casi. Dos rectas distintas se cruzan a lo más en un punto.

Por qué: No se cruzan nunca: no hay solución.

Pistas: (1) ¿Se cruzan alguna vez dos rectas paralelas?

**4. [choice]** · argumentar · dificultad 3
¿Cuántas soluciones tiene el sistema $x+y=4$ y $2x+2y=8$?

- A) Infinitas  ✅
- B) Ninguna  → Casi. La segunda ecuación es la primera multiplicada por 2: son la misma recta.
- C) Una  → Casi. Cualquier par que cumpla la primera también cumple la segunda.
- D) Dos  → Casi. Dos rectas no pueden cruzarse en exactamente dos puntos.

Por qué: Son la misma recta: todos sus puntos son solución.

Pistas: (1) Divide la segunda ecuación por 2.

**5. [choice]** · argumentar · dificultad 3
¿Cuántas soluciones tiene el sistema $y=3x+1$ e $y=3x-2$?

- A) Ninguna  ✅
- B) Una  → Casi. Tienen la misma pendiente: son paralelas.
- C) Infinitas  → Casi. Tienen distinto coeficiente de posición: no son la misma recta.
- D) Dos  → Casi. Dos rectas no pueden cruzarse en dos puntos.

Por qué: Misma pendiente y distinto $n$: son paralelas distintas, sin solución.

Pistas: (1) Compara las pendientes y los coeficientes de posición.

**6. [numeric]** · resolver · dificultad 3
¿En qué valor de $x$ se cruzan las rectas $y=2x+1$ e $y=-x+7$?

Respuesta: **2**
- Si escribe 6 → Casi. $3x=6$: falta dividir por 3.
- Otro error → Casi. En el cruce tienen la misma $y$: iguala $2x+1=-x+7$.

Pistas: (1) $2x+1=-x+7$
Resolución: $2x+1=-x+7$ → $3x=6$ → $x=2$

## Mini-clases

### mc-se-1 · Sustitución en 3 pasos (draft)

- **1. Despeja** Una incógnita en la ecuación más simple. · Ej.: $x+y=7$ → $y=7-x$
- **2. Reemplaza** En la otra ecuación y resuelve. · Ej.: $2x+(7-x)=10$ → $x=3$
- **3. Vuelve** Calcula la otra incógnita y comprueba en las dos ecuaciones. · Ej.: $y=7-3=4$

### mc-se-2 · Reducción (draft)

- **Opuestos** Si una incógnita tiene coeficientes opuestos, suma las ecuaciones. · Ej.: $x+y=9$ → $x-y=1$ → $2x=10$ → $x=5$
- **Multiplica antes** Si no hay opuestos, multiplica una ecuación para crearlos.

### mc-se-3 · ¿Cuántas soluciones? (draft)

- **Una** Pendientes distintas: las rectas se cruzan en un punto.
- **Ninguna** Misma pendiente y distinto coeficiente de posición: paralelas.
- **Infinitas** Una ecuación es múltiplo de la otra: es la misma recta.
