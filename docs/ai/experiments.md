# Experimentos realizados

## Estado del documento
Este archivo forma parte de la estructura inicial de documentación de la práctica.

## Introducción
En este documento se recogen varios experimentos realizados para comparar la resolución de problemas de programación sin ayuda de IA y con ayuda de IA. El objetivo es analizar diferencias en tiempo invertido, calidad del código y comprensión del problema.

## Parte 1. Problemas de programación generales

### Problema 1: comprobar si un número es par

*Sin IA*

Para resolver este problema primero tuve que buscar información en tutoriales y documentación de JavaScript, ya que no recordaba exactamente cómo escribir una función desde cero. Revisé ejemplos sobre el uso del operador módulo (%) para comprobar si un número es divisible entre 2. Después de entenderlo, escribí una función sencilla para devolver si el número era par o impar.

*Tiempo invertido*

Más tiempo del esperado para un problema sencillo, porque tuve que consultar documentación y ejemplos antes de escribir la función.

*Resultado*

La solución funcionaba correctamente, pero el proceso fue más lento porque tuve que investigar primero cómo hacerlo.

*Con IA*

Después pedí a la IA que resolviera el mismo problema. La IA generó una función correcta y además explicó por qué se utiliza el operador % para comprobar si un número es par.

*Comparación*

La IA permitió resolver el problema mucho más rápido y, además, explicó el motivo de cada parte del código. Esto hace que el código sea más comprensible y ayuda a aprender mejor cómo funciona la solución.

### Problema 2: sumar un array de números

*Sin IA*

Primero busqué en tutoriales y ejemplos cómo recorrer un array en JavaScript. Encontré varias formas de hacerlo, como usar un bucle for. Después escribí una función que recorre el array y acumula la suma en una variable.

*Tiempo invertido*

Tiempo medio, porque tuve que revisar ejemplos antes de escribir la función correctamente.

*Resultado*

La solución funcionaba bien, aunque era una implementación básica.

*Con IA*

La IA generó una solución correcta y además propuso una alternativa usando el método reduce(). También explicó qué hace cada parte del código.

*Comparación*

La IA ayudó no solo a obtener una solución más rápida, sino también a entender mejor el problema. Las explicaciones sobre cada paso del código hacen que la solución sea más fácil de comprender.

### Problema 3: invertir un texto

*Sin IA*

Para resolver este problema tuve que buscar ejemplos de cómo manipular cadenas de texto en JavaScript. Encontré que una forma común es usar split(), reverse() y join(). Después escribí una función siguiendo esos ejemplos.

*Tiempo invertido*

Tiempo medio, porque fue necesario revisar documentación para recordar cómo funcionan esos métodos.

*Resultado*

La función funcionaba correctamente, aunque fue necesario investigar antes de escribirla.

*Con IA*

La IA generó una solución correcta y además explicó qué hace cada método (split, reverse, join) y por qué se utilizan juntos para invertir un texto.

*Comparación*

La IA permitió entender mejor el funcionamiento del código, ya que no solo dio la solución sino también una explicación clara de cada paso.

## Parte 2. Tareas relacionadas con TaskFlow

**Tarea 1: añadir validación para tareas vacías**

*Sin IA*

Para implementar esta mejora primero tuve que revisar el código del proyecto para entender en qué parte se añadían las tareas. Después busqué ejemplos en tutoriales y documentación de JavaScript sobre cómo validar texto introducido por el usuario. También revisé ejemplos de otros proyectos para ver cómo se suelen hacer este tipo de validaciones.

Una vez entendido el problema, añadí una comprobación para evitar que se pudieran crear tareas vacías o con solo espacios.

*Tiempo invertido*

Tiempo medio, porque tuve que investigar primero dónde aplicar la validación y cómo hacerlo correctamente.

*Resultado*

La validación funcionaba correctamente, aunque el proceso fue algo más lento porque tuve que consultar varios ejemplos antes de implementar la solución.

*Con IA*

Cuando pedí ayuda a la IA, esta analizó el código del proyecto y sugirió rápidamente usar trim() para eliminar espacios y comprobar si el texto estaba vacío. Además, explicó por qué se utiliza esta técnica para validar entradas de usuario.

*Comparación*

Con la ayuda de la IA el proceso fue mucho más rápido. Además de generar la solución, también explicó por qué funcionaba, lo que ayudó a entender mejor la lógica del código.

**Tarea 2: refactorizar la función renderTasks**

*Sin IA*

Primero analicé la función renderTasks para entender qué hacía cada parte del código. Para ello revisé documentación y ejemplos sobre cómo organizar funciones que manipulan el DOM en JavaScript. También consulté algunos tutoriales para entender mejores prácticas de organización del código.

*Tiempo invertido*

Más tiempo que en otras tareas, porque la función realiza varias operaciones (filtrar, ordenar, renderizar tareas y actualizar estadísticas).

*Resultado*

Pude entender la función y su funcionamiento, aunque me resultó más difícil pensar en una forma clara de mejorar su estructura.

*Con IA*

La IA analizó la función y propuso varias mejoras para hacerla más clara, como usar nombres de variables más descriptivos (query, filteredTasks, sortedTasks) y separar mejor cada paso de la lógica. Además, explicó qué hace cada parte de la función.

*Comparación*

En esta tarea la IA fue especialmente útil. No solo permitió encontrar mejoras más rápido, sino que también explicó la lógica del código y ofreció distintas opciones de organización. Esto ayudó a comprender mejor la función y a mejorar su legibilidad.

**Tarea 3: añadir comentarios JSDoc al proyecto**

*Sin IA*

Para añadir comentarios JSDoc tuve que consultar documentación sobre el formato correcto de este tipo de comentarios. Revisé manuales y ejemplos para recordar cómo se documentan parámetros, tipos de datos y valores de retorno.

*Tiempo invertido*

Tiempo medio, porque tuve que revisar varias referencias antes de escribir los comentarios correctamente.

*Resultado*

Sin ayuda de IA habría sido posible añadir la documentación, pero habría llevado más tiempo y probablemente habría sido menos uniforme.

*Con IA*

La IA generó automáticamente comentarios JSDoc para las funciones importantes del proyecto. Además de generar la documentación, explicó qué representa cada parámetro y qué devuelve cada función.

*Comparación*

La IA permitió generar la documentación mucho más rápido y de forma más consistente. Además, al explicar el propósito de cada función, ayudó a entender mejor la estructura del proyecto.