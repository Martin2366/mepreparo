# funcion-lineal-afin

> Generado por `npm run content:preview`. No editar a mano: se edita el JSON.

## m1-fl-1 · Qué es una función (draft, ~5 min)

**1. [explain]**
*Una máquina de números*
Una función es una máquina: entra un número y sale exactamente uno. $f(x)=2x+1$ significa "multiplica por 2 y suma 1".
> Nota de Equis: $f(3)=2\cdot 3+1=7$

**2. [numeric]** · representar · dificultad 1
Si $f(x)=2x+1$, ¿cuánto vale $f(4)$?

Respuesta: **9**
- Si escribe 8 → Casi. Falta sumar 1 después de multiplicar.
- Si escribe 10 → Casi. Primero multiplica $2\cdot 4$ y después suma 1.
- Otro error → Casi. Reemplaza la $x$ por 4: $f(4)=2\cdot 4+1$.

Pistas: (1) Donde dice $x$, escribe 4.
Resolución: $f(4)=2\cdot 4+1$ → $=8+1=9$

**3. [numeric]** · representar · dificultad 2
Si $f(x)=5-x$, ¿cuánto vale $f(-2)$?

Respuesta: **7**
- Si escribe 3 → Casi. $5-(-2)=5+2$: restar un negativo es sumar.
- Otro error → Casi. Reemplaza con paréntesis: $f(-2)=5-(-2)$.

Pistas: (1) Usa paréntesis al reemplazar un negativo.
Resolución: $f(-2)=5-(-2)$ → $=5+2=7$

**4. [explain]**
*Imagen y preimagen*
Si $f(3)=7$, decimos que 7 es la imagen de 3 y que 3 es la preimagen de 7. En una función, cada $x$ tiene una sola imagen.

**5. [choice]** · resolver · dificultad 3
Si $g(x)=3x-2$ y $g(a)=10$, ¿cuánto vale $a$?

- A) $4$  ✅
- B) $28$  → Casi. 10 es la imagen; buscas el $x$ que produce 10, no $g(10)$.
- C) $\frac{8}{3}$  → Casi. El $-2$ pasa sumando: $3a=12$.
- D) $12$  → Casi. $3a=12$; falta dividir por 3.

Pistas: (1) Plantea la ecuación $3a-2=10$.
Resolución: $3a-2=10$ → $3a=12$ → $a=4$

**6. [choice]** · representar · dificultad 2
¿Qué tabla corresponde a $f(x)=x+3$? (entrada → salida)

- A) 0 → 3, 1 → 4, 2 → 5  ✅
- B) 0 → 0, 1 → 3, 2 → 6  → Casi. Esa es $3x$: aquí se suma 3, no se multiplica.
- C) 0 → 3, 1 → 6, 2 → 9  → Casi. Esa es $3x+3$.
- D) 0 → $-3$, 1 → $-2$, 2 → $-1$  → Casi. Esa es $x-3$.

Por qué: $f(0)=3$, $f(1)=4$ y $f(2)=5$.

Pistas: (1) Calcula $f(0)$, $f(1)$ y $f(2)$.

**7. [choice]** · modelar · dificultad 3
Un taxi cobra según $T(d)=800+450d$, con $d$ en kilómetros. ¿Cuánto cuesta un viaje de 6 km?

- A) \$3.500  ✅
- B) \$2.700  → Casi. Falta sumar los \$800 de la bajada de bandera.
- C) \$7.500  → Casi. Solo los kilómetros se multiplican por 450; los \$800 se suman una vez.
- D) \$1.250  → Casi. Reemplaza $d=6$: $800+450\cdot 6$.

Pistas: (1) $T(6)=800+450\cdot 6$.
Resolución: $T(6)=800+450\cdot 6$ → $=800+2700=3500$

## m1-fl-2 · La pendiente: cuánto sube la recta (draft, ~6 min)

**1. [explain]**
*La pendiente*
En $f(x)=mx+n$, el número $m$ es la pendiente: cuánto sube (o baja) la recta cada vez que avanzas 1 hacia la derecha.

**2. [graph]** · representar · dificultad 1
Mueve la pendiente $m$ hasta que la recta $y=mx$ pase por el punto $(2,6)$.

Familia: linear · deslizadores: m ∈ [-4, 4] paso 1/2 (parte en 1)
Objetivo: {"kind":"points","points":[["2","6"]]}
Si falla → Casi. En $x=2$ la recta tiene que llegar a $y=6$: ¿cuánto sube por cada paso?
Por qué: Con $m=3$, en $x=2$ la recta llega a $3\cdot 2=6$.

Pistas: (1) Si sube $m$ por cada paso, en 2 pasos sube $2m$. (2) $2m=6$.

**3. [graph]** · representar · dificultad 2
Ahora haz que la recta baje y pase por $(3,-3)$.

Familia: linear · deslizadores: m ∈ [-4, 4] paso 1/2 (parte en 1)
Objetivo: {"kind":"points","points":[["3","-3"]]}
Si falla → Casi. Para bajar, la pendiente tiene que ser negativa.
Por qué: Con $m=-1$, en $x=3$ la recta llega a $-3$.

Pistas: (1) En 3 pasos baja 3: ¿cuánto baja por paso?

**4. [explain]**
*Pendiente con dos puntos*
La pendiente es el cambio en $y$ dividido por el cambio en $x$. Entre $(1,2)$ y $(3,8)$: $m=\frac{8-2}{3-1}=\frac{6}{2}=3$.
> Nota de Equis: Positiva: sube. Negativa: baja. Cero: horizontal.

**5. [numeric]** · representar · dificultad 2
¿Cuál es la pendiente de la recta que pasa por $(0,1)$ y $(2,7)$?

Respuesta: **3**
- Si escribe 1/3 → Casi. Es el cambio en $y$ dividido por el cambio en $x$, no al revés.
- Si escribe -3 → Casi. Resta en el mismo orden arriba y abajo.
- Otro error → Casi. Calcula $\frac{7-1}{2-0}$.

Pistas: (1) Cambio en $y$: $7-1$. Cambio en $x$: $2-0$.
Resolución: $m=\frac{7-1}{2-0}=\frac{6}{2}=3$

**6. [numeric]** · representar · dificultad 3
¿Cuál es la pendiente de la recta que pasa por $(-1,4)$ y $(3,-4)$?

Respuesta: **-2**
- Si escribe 2 → Casi. La recta baja de 4 a $-4$: la pendiente es negativa.
- Si escribe -1/2 → Casi. Va el cambio en $y$ arriba y el cambio en $x$ abajo.
- Otro error → Casi. Calcula $\frac{-4-4}{3-(-1)}$.

Pistas: (1) Cuidado con restar $-1$: $3-(-1)=4$.
Resolución: $m=\frac{-4-4}{3-(-1)}=\frac{-8}{4}=-2$

**7. [choice]** · argumentar · dificultad 3
¿Cuál de estas rectas es la más empinada?

- A) $y=-4x+1$  ✅
- B) $y=3x$  → Casi. Lo empinado depende del tamaño de $m$ sin importar su signo, y 4 es mayor que 3.
- C) $y=\frac{1}{2}x+5$  → Casi. El $+5$ sube la recta, pero no la hace más empinada.
- D) $y=2x-7$  → Casi. El $-7$ mueve la recta hacia abajo, pero no cambia su inclinación.

Por qué: La más empinada es la de mayor $m$ en valor absoluto: $-4$.

Pistas: (1) Compara los valores de $m$ sin fijarte en el signo.

**8. [choice]** · modelar · dificultad 3
Una vela mide 20 cm y se consume 2 cm por hora. ¿Qué función da su altura $h$ después de $t$ horas?

- A) $h(t)=20-2t$  ✅
- B) $h(t)=2t+20$  → Casi. La vela se acorta: la pendiente es negativa.
- C) $h(t)=20t-2$  → Casi. 20 es la altura inicial (no cambia con $t$) y 2 es lo que baja por hora.
- D) $h(t)=-20t+2$  → Casi. Cambiaste los papeles: lo que baja por hora es 2 y lo inicial es 20.

Por qué: Parte en 20 y baja 2 por hora: $h(t)=20-2t$.

Pistas: (1) ¿Cuánto mide al comienzo? ¿Cuánto cambia por hora, y hacia dónde?

## m1-fl-3 · Mover la recta: el coeficiente de posición (draft, ~6 min)

**1. [explain]**
*Dónde corta al eje y*
En $f(x)=mx+n$, el número $n$ es el coeficiente de posición: el punto donde la recta corta al eje $y$, porque $f(0)=n$.

**2. [graph]** · representar · dificultad 1
Mueve $n$ para que la recta $y=2x+n$ corte al eje $y$ en $-3$.

Familia: linear · deslizadores: m ∈ [2, 2] paso 1 (parte en 2); n ∈ [-5, 5] paso 1 (parte en 1)
Objetivo: {"kind":"params","values":{"n":"-3"}}
Si falla → Casi. El corte con el eje $y$ ocurre en $x=0$, y ahí $y=n$.
Por qué: Con $n=-3$, la recta pasa por $(0,-3)$.

Pistas: (1) Si $x=0$, entonces $y=n$.

**3. [graph]** · representar · dificultad 3
Ajusta $m$ y $n$ para que la recta pase por $(0,1)$ y $(2,5)$.

Familia: linear · deslizadores: m ∈ [-4, 4] paso 1/2 (parte en 0); n ∈ [-5, 5] paso 1 (parte en 0)
Objetivo: {"kind":"points","points":[["0","1"],["2","5"]]}
Si falla → Casi. Primero ubica $n$ con el punto que está sobre el eje $y$; después ajusta la inclinación.
Por qué: $n=1$ y $m=\frac{5-1}{2-0}=2$: la recta es $y=2x+1$.

Pistas: (1) El punto $(0,1)$ te da $n$ directamente. (2) De $(0,1)$ a $(2,5)$ sube 4 en 2 pasos.

**4. [explain]**
*Rectas paralelas*
Rectas con la misma pendiente son paralelas: $y=2x+1$ y $y=2x-4$ nunca se cruzan. Cambiar $n$ traslada la recta hacia arriba o hacia abajo sin cambiar su inclinación.

**5. [choice]** · representar · dificultad 2
¿En qué punto corta al eje $y$ la recta $y=-3x+7$?

- A) $(0,7)$  ✅
- B) $(7,0)$  → Casi. En el eje $y$, la $x$ vale 0: el punto es $(0,n)$.
- C) $(0,-3)$  → Casi. $-3$ es la pendiente; el corte con el eje $y$ lo da $n$.
- D) $(0,-7)$  → Casi. Reemplaza $x=0$: $y=-3\cdot 0+7=7$.

Por qué: Con $x=0$ queda $y=7$: el punto es $(0,7)$.

Pistas: (1) Reemplaza $x=0$.

**6. [numeric]** · resolver · dificultad 3
¿En qué valor de $x$ corta al eje $x$ la recta $y=2x-6$?

Respuesta: **3**
- Si escribe -6 → Casi. $-6$ es donde corta al eje $y$. En el eje $x$, $y=0$: $0=2x-6$.
- Si escribe -3 → Casi. $2x=6$, entonces $x=3$.
- Otro error → Casi. En el eje $x$ la altura es 0: resuelve $0=2x-6$.

Pistas: (1) En el eje $x$, $y=0$.
Resolución: $0=2x-6$ → $2x=6$ → $x=3$

**7. [choice]** · argumentar · dificultad 2
¿Cuál recta es paralela a $y=4x-1$?

- A) $y=4x+5$  ✅
- B) $y=-4x-1$  → Casi. Las paralelas tienen la misma pendiente, con el mismo signo.
- C) $y=\frac{1}{4}x-1$  → Casi. $\frac{1}{4}$ no es igual a 4: esa recta es mucho menos empinada.
- D) $y=x-1$  → Casi. Comparten el $-1$, pero eso solo dice dónde cortan al eje $y$.

Por qué: $y=4x+5$ tiene la misma pendiente, 4: es paralela.

Pistas: (1) Paralelas = misma pendiente.

**8. [choice]** · representar · dificultad 3
Una recta pasa por $(0,-2)$ y sube 3 unidades por cada unidad que avanza a la derecha. ¿Cuál es su ecuación?

- A) $y=3x-2$  ✅
- B) $y=-2x+3$  → Casi. Cambiaste los papeles: la pendiente es 3 y el corte con el eje $y$ es $-2$.
- C) $y=3x+2$  → Casi. Pasa por $(0,-2)$: el coeficiente de posición es $-2$.
- D) $y=\frac{1}{3}x-2$  → Casi. Sube 3 por cada 1: $m=\frac{3}{1}=3$.

Por qué: $m=3$ y $n=-2$: $y=3x-2$.

Pistas: (1) $n$ sale del punto sobre el eje $y$; $m$, de cuánto sube por paso.

## m1-fl-4 · Modelar con funciones afines (draft, ~6 min)

**1. [explain]**
*Fijo más variable*
Muchas situaciones tienen un monto fijo y otro que crece de a poco: eso es una función afín. Lo fijo es $n$; lo que crece por unidad es $m$.
> Nota de Equis: Plan de celular: cargo fijo + precio por GB.

**2. [choice]** · modelar · dificultad 2
Un gimnasio cobra \$15.000 de matrícula y \$20.000 al mes. ¿Qué función da el costo $C$ de $x$ meses?

- A) $C(x)=20000x+15000$  ✅
- B) $C(x)=15000x+20000$  → Casi. Lo que se repite cada mes es lo que multiplica a $x$.
- C) $C(x)=35000x$  → Casi. La matrícula se paga una sola vez: no se multiplica por los meses.
- D) $C(x)=20000x$  → Casi. Falta la matrícula de \$15.000.

Por qué: Cada mes suma 20000 ($m$) y la matrícula es fija ($n$): $C(x)=20000x+15000$.

Pistas: (1) ¿Qué se paga una sola vez y qué se paga cada mes?

**3. [numeric]** · resolver · dificultad 2
Con esa función, ¿cuánto pagas en total por 6 meses? Escribe solo el número.

Respuesta: **135000**
- Si escribe 120000 → Casi. Falta sumar la matrícula.
- Si escribe 210000 → Casi. La matrícula se suma una sola vez, no cada mes.
- Otro error → Casi. Calcula $C(6)=20000\cdot 6+15000$.

Pistas: (1) $C(6)=20000\cdot 6+15000$.
Resolución: $C(6)=20000\cdot 6+15000$ → $=120000+15000=135000$

**4. [graph]** · modelar · dificultad 3
Una piscina tiene 4 m³ de agua y se llena a 2 m³ por hora. Ajusta $m$ y $n$ para que la recta modele el volumen después de $t$ horas.

Familia: linear · deslizadores: m ∈ [0, 5] paso 1 (parte en 1); n ∈ [0, 8] paso 1 (parte en 0)
Objetivo: {"kind":"params","values":{"m":"2","n":"4"}}
Si falla → Casi. $n$ es lo que hay al comienzo ($t=0$) y $m$ lo que aumenta cada hora.
Por qué: Al comienzo hay 4 ($n=4$) y sube 2 por hora ($m=2$): $V(t)=2t+4$.

Pistas: (1) ¿Cuánta agua hay cuando $t=0$? (2) ¿Cuánto aumenta por hora?

**5. [explain]**
*Cómo modelar*
Identifica el valor inicial ($n$), la tasa de cambio ($m$) y comprueba con un dato del enunciado antes de responder.

**6. [find-error]** · argumentar · dificultad 3
Martín modeló: "Un taxi cobra \$700 de bajada de bandera y \$150 por cada 200 metros". ¿En qué línea está el error?

1. Distancia en metros: $d$
2. Tramos de 200 m: $\frac{d}{200}$
3. Costo: $C(d)=700\cdot\frac{d}{200}+150$  ❌ (error)
Si elige otra → Casi. Esa línea está bien. Revisa qué se cobra por tramo y qué se cobra una sola vez.
Explicación: Los \$150 se cobran por cada tramo y los \$700 una sola vez: $C(d)=150\cdot\frac{d}{200}+700$.

Pistas: (1) ¿Cuál de los dos montos se repite por cada tramo?

**7. [choice]** · modelar · dificultad 4
El plan A cobra \$10.000 fijos más \$2.000 por GB; el plan B, \$4.000 fijos más \$3.500 por GB. ¿Cuándo conviene el plan A?

- A) Si usas más de 4 GB  ✅
- B) Si usas menos de 4 GB  → Casi. Con pocos GB pesa más el cargo fijo, y el de A es más alto.
- C) Si usas más de 6 GB  → Casi. Iguala los costos: $10000+2000g=4000+3500g$, así $1500g=6000$.
- D) Nunca conviene  → Casi. A cobra menos por GB: si usas muchos GB, termina siendo más barato.

Pistas: (1) Busca cuántos GB hacen que los dos planes cuesten lo mismo.
Resolución: $10000+2000g=4000+3500g$ → $6000=1500g$ → $g=4$: sobre 4 GB conviene A

**8. [choice]** · modelar · dificultad 4
La temperatura de un horno sube de forma constante: a los 2 minutos marca 80 °C y a los 5 minutos, 170 °C. ¿Qué temperatura tenía al encenderlo?

- A) 20 °C  ✅
- B) 80 °C  → Casi. 80 °C es a los 2 minutos; al encenderlo, $t=0$.
- C) 30 °C  → Casi. 30 es cuánto sube por minuto (la pendiente), no el valor inicial.
- D) 50 °C  → Casi. Primero la pendiente: $\frac{170-80}{5-2}=30$. Luego $80=30\cdot 2+n$.

Pistas: (1) Calcula cuánto sube por minuto. (2) Retrocede 2 minutos desde los 80 °C.
Resolución: $m=\frac{170-80}{5-2}=30$ → $80=30\cdot 2+n$ → $n=20$

## Mini-clases

### mc-fl-1 · Función, imagen y preimagen (draft)

- **Función** A cada valor de entrada le asigna exactamente un valor de salida.
- **Evaluar** Reemplaza la $x$ por el número, con paréntesis si es negativo. · Ej.: $f(x)=3x-1$ → $f(-2)=3\cdot(-2)-1=-7$
- **Preimagen** Si te dan la imagen, plantea una ecuación. · Ej.: $f(x)=11$ → $3x-1=11$ → $x=4$

### mc-fl-2 · Pendiente en 3 pasos (draft)

- **1. Resta las y** Segundo punto menos primero.
- **2. Resta las x** En el mismo orden que las $y$.
- **3. Divide** Cambio en $y$ sobre cambio en $x$. · Ej.: $(1,3)$ y $(4,9)$ → $m=\frac{9-3}{4-1}=\frac{6}{3}=2$

### mc-fl-3 · El coeficiente de posición (draft)

- **Qué es** En $y=mx+n$, $n$ es el valor de $y$ cuando $x=0$: donde la recta corta al eje $y$.
- **Para qué sirve** En problemas es el valor inicial: lo que hay antes de empezar (cargo fijo, altura inicial, agua al comienzo).
- **Ejemplo** La recta $y=-2x+5$ corta al eje $y$ en $(0,5)$.

### mc-fl-4 · Paralelas: la misma pendiente (draft)

- **Regla** Dos rectas son paralelas si tienen la misma pendiente y distinto coeficiente de posición.
- **Ejemplo** $y=3x+1$ y $y=3x-5$ son paralelas: suben igual y nunca se cruzan.
- **Ojo** Si también tienen el mismo $n$, no son dos rectas: es la misma recta.

### mc-fl-5 · La recta que pasa por dos puntos (draft)

- **Paso 1** Calcula la pendiente con los dos puntos.
- **Paso 2** Reemplaza uno de los puntos en $y=mx+n$ y despeja $n$.
- **Ejemplo** Pasa por $(1,5)$ y $(3,9)$. · Ej.: $m=\frac{9-5}{3-1}=2$ → $5=2\cdot 1+n$ → $n=3$ → $y=2x+3$

### mc-fl-6 · Lineal o afín (draft)

- **Función lineal** $f(x)=mx$: pasa por el origen. Es proporcionalidad directa: si $x$ se duplica, $f(x)$ también.
- **Función afín** $f(x)=mx+n$ con $n$ distinto de 0: la recta está trasladada y ya no pasa por el origen.
- **En la PAES** Si hay un monto fijo (cargo, matrícula, bajada de bandera), el modelo es afín, no lineal.
