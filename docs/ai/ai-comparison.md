# Comparación de herramientas de IA

## Estado del documento
Este archivo forma parte de la estructura inicial de documentación de la práctica.

## Introducción
En este documento voy a documentar la comparación entre distintas herramientas de inteligencia artificial utilizadas durante la práctica, analizando sus ventajas, limitaciones y posibles usos dentro del flujo de desarrollo.

## Objetivo
En este documento comparo el comportamiento de ChatGPT y Claude en distintas tareas relacionadas con conceptos técnicos, detección de errores y generación de código JavaScript.

## Herramientas comparadas
- ChatGPT
- Claude

## Criterios de comparación
- Claridad de la explicación
- Profundidad técnica
- Calidad de los ejemplos
- Capacidad para detectar errores
- Calidad del código generado
- Utilidad general en el flujo de trabajo







## Prueba 1. Explicación de conceptos técnicos

### Concepto 1: DOM

**Prompt usado en ChatGPT**  
"Explícame de forma clara y con un ejemplo en JavaScript qué es el DOM."

**Respuesta resumida de ChatGPT**  
ChatGPT explicó que el DOM (Document Object Model) es la forma en que el navegador representa una página web para que JavaScript pueda interactuar con ella.

Cuando el navegador carga un archivo HTML lo convierte en una estructura en forma de árbol de objetos, donde cada elemento HTML se convierte en un nodo del árbol.

Esto permite que JavaScript pueda:

leer el contenido de la página

modificar elementos

añadir o eliminar nodos

También incluyó un ejemplo práctico donde se modifica el texto de un elemento h1 utilizando JavaScript.
function cambiarTexto() {
  const titulo = document.getElementById("titulo");
  titulo.textContent = "El texto ha cambiado";
}
La explicación también mostraba cómo el navegador interpreta el HTML como un árbol:
document
 └── html
     └── body
         ├── h1
         └── button


**Valoración**  
La explicación fue muy clara y estructurada.
Primero definió el concepto, después explicó cómo funciona internamente y finalmente mostró ejemplos prácticos.

Los ejemplos eran sencillos y fáciles de entender para alguien que está aprendiendo JavaScript.

**Prompt usado en Claude**  
"Explícame de forma clara y con un ejemplo en JavaScript qué es el DOM."

**Respuesta resumida de Claude**  
Claude también explicó que el DOM es una representación en forma de árbol del HTML de una página web, donde cada etiqueta se convierte en un nodo que puede ser manipulado con JavaScript.

Incluyó una analogía para facilitar la comprensión:

HTML → plano de una casa

DOM → casa construida

JavaScript → el trabajador que puede modificarla

También mostró un ejemplo práctico donde JavaScript selecciona elementos del DOM, escucha un evento click y modifica el contenido y el estilo de un elemento:

const titulo = document.getElementById("titulo");
const boton = document.getElementById("btn");

boton.addEventListener("click", () => {
  titulo.textContent = "¡Título cambiado!";
  titulo.style.color = "tomato";
});
Claude también añadió un pequeño esquema del árbol DOM y un resumen de los métodos principales utilizados para manipularlo.

document
 └── html
      ├── head
      └── body
           ├── h1#titulo   ← nodo elemento
           │    └── "Hola, mundo"  ← nodo de texto
           └── button#btn
                └── "Cambiar título"

**Valoración**  
La explicación fue muy completa y detallada.
Claude utilizó una analogía muy clara para explicar el concepto y proporcionó ejemplos prácticos con eventos y manipulación del estilo.

La explicación fue algo más extensa que la de ChatGPT, pero también más profunda.

**Comparación**  
Ambos asistentes ofrecieron explicaciones correctas y útiles sobre el DOM.

ChatGPT destacó por ofrecer una explicación más directa y sencilla, con ejemplos claros y fáciles de entender para principiantes.

Claude proporcionó una explicación más extensa y detallada, incluyendo analogías y ejemplos más completos que muestran más posibilidades de manipulación del DOM.

En general:

ChatGPT → explicación más simple y rápida de entender

Claude → explicación más detallada y profunda

Ambos asistentes resultan útiles para aprender conceptos técnicos, aunque el estilo de explicación es ligeramente diferente.






### Concepto 2: Event Loop

**Prompt usado en ChatGPT**  
Explícame de forma clara y con un ejemplo en JavaScript qué es el Event Loop.

**Respuesta resumida de ChatGPT**  
ChatGPT explicó que el Event Loop es el mecanismo que utiliza JavaScript para gestionar tareas asíncronas sin bloquear la ejecución del programa.

JavaScript funciona con un solo hilo de ejecución (single-thread), por lo que solo puede ejecutar una tarea a la vez. Para manejar operaciones que tardan más tiempo (como temporizadores, peticiones HTTP o eventos del usuario), utiliza un sistema compuesto por varios elementos:

Call Stack → donde se ejecuta el código JavaScript.

Web APIs → donde el navegador maneja operaciones asíncronas como setTimeout o fetch.

Callback Queue → cola donde esperan las funciones cuando están listas para ejecutarse.

Event Loop → mecanismo que revisa continuamente si el Call Stack está vacío para ejecutar la siguiente tarea de la cola.
Ejemplo proporcionado:
console.log("Inicio");

setTimeout(() => {
  console.log("Esto se ejecuta después");
}, 0);

console.log("Fin");

Resultado esperado

Inicio
Esto se ejecuta después
Fin

Pero el resultado real es:

Inicio
Fin
Esto se ejecuta después

Esto ocurre porque setTimeout se envía a las Web APIs, mientras el resto del código continúa ejecutándose en el Call Stack.

Cuando el temporizador termina, la función pasa a la Callback Queue, y el Event Loop la ejecuta cuando el Call Stack queda libre.

**Valoración**  
La explicación fue clara y bien estructurada. ChatGPT presentó primero el concepto general y luego explicó los componentes principales del sistema de ejecución de JavaScript.

El ejemplo con setTimeout ayuda a entender el comportamiento del Event Loop en situaciones reales y muestra claramente la diferencia entre ejecución síncrona y asíncrona.

Además, se incluyó un pequeño esquema del flujo de ejecución que facilita comprender cómo interactúan el Call Stack, las Web APIs y la Callback Queue.

**Prompt usado en Claude**  
Explícame de forma clara y con un ejemplo en JavaScript qué es el Event Loop.

**Respuesta resumida de Claude**  
Claude también explicó que el Event Loop es el mecanismo que permite que JavaScript gestione operaciones asíncronas sin bloquear el hilo principal.

Además de los componentes básicos, Claude explicó con más detalle la estructura interna del sistema:

Call Stack → ejecuta el código JavaScript.

Web APIs → gestionan tareas asíncronas como temporizadores o peticiones de red.

Microtask Queue → cola de alta prioridad utilizada por Promises.

Macrotask Queue → cola donde se almacenan tareas como setTimeout o eventos.

Claude explicó también que las microtareas tienen prioridad sobre las macrotareas, algo que no se mencionaba en la explicación anterior.

Ejemplo proporcionado
console.log("1 - Inicio");

setTimeout(() => {
  console.log("2 - setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("3 - Promise.then");
});

console.log("4 - Fin");

Resultado en consola:

1 - Inicio
4 - Fin
3 - Promise.then
2 - setTimeout

Este ejemplo muestra cómo las microtasks (Promises) se ejecutan antes que las macrotasks (setTimeout) cuando el Call Stack queda vacío.
**Valoración**  
La explicación fue más detallada y técnica. Claude introdujo conceptos adicionales como microtasks y macrotasks, lo que aporta una comprensión más profunda del funcionamiento del Event Loop.

**Comparación**  
Ambos asistentes ofrecieron explicaciones correctas y útiles sobre el Event Loop.

ChatGPT presentó una explicación más sencilla y directa, ideal para entender el concepto general de asincronía en JavaScript.

Claude ofreció una explicación más profunda, introduciendo conceptos más avanzados como la diferencia entre microtasks y macrotasks, lo que ayuda a comprender mejor el comportamiento interno del Event Loop.






### Concepto 3: Hoisting

**Prompt usado en ChatGPT**  
Explícame de forma clara y con un ejemplo en JavaScript qué es el Hoisting.

**Respuesta resumida de ChatGPT**  
ChatGPT explicó que hoisting es un comportamiento de JavaScript por el cual las declaraciones de variables y funciones se procesan al inicio del código antes de ejecutarse.

Esto no significa que el código se mueva realmente, sino que el motor de JavaScript registra primero las variables y funciones antes de ejecutar el programa.

Idea principal

JavaScript sigue dos fases principales:

Lee el archivo completo

Registra variables y funciones

Después ejecuta el código

Este registro previo es lo que se conoce como hoisting.

Ejemplo con var
console.log(x);
var x = 5;

Resultado:

undefined

Esto ocurre porque JavaScript lo interpreta internamente así:

var x;
console.log(x);
x = 5;

Primero declara la variable sin valor y luego la inicializa.

Ejemplo con funciones
saludar();

function saludar() {
  console.log("Hola!");
}

Esto funciona porque las funciones declaradas con function se elevan completamente durante el proceso de hoisting.

Ejemplo con let y const
console.log(y);
let y = 10;

Resultado:

ReferenceError

Esto ocurre porque let y const tienen una Temporal Dead Zone (TDZ): la variable existe pero no puede usarse antes de declararse.

**Valoración**  
La explicación fue clara y progresiva. ChatGPT mostró primero el concepto general y después presentó ejemplos prácticos con var, function, let y const.

Los ejemplos ayudan a entender cómo JavaScript interpreta el código internamente y por qué aparecen valores como undefined o errores de referencia.

**Prompt usado en Claude**  
Explícame de forma clara y con un ejemplo en JavaScript qué es el Hoisting.

**Respuesta resumida de Claude**  
Claude explicó que hoisting es un comportamiento del motor de JavaScript por el cual, antes de ejecutar el código, el intérprete procesa las declaraciones de variables y funciones y las registra al inicio de su ámbito.

Esto provoca que algunas variables o funciones puedan utilizarse antes de aparecer en el código.

Claude explicó los siguientes casos:

Hoisting con var

Cuando se usa var, la variable se eleva pero solo la declaración, no su valor.

console.log(nombre);
var nombre = "Ana";
console.log(nombre);

Resultado:

undefined
Ana

Esto ocurre porque JavaScript interpreta el código internamente así:

var nombre;
console.log(nombre);
nombre = "Ana";
console.log(nombre);
Hoisting con let y const

Claude explicó que let y const también se registran al inicio del ámbito, pero quedan dentro de una Temporal Dead Zone (TDZ).

console.log(edad);
let edad = 30;

Esto produce un error:

ReferenceError: Cannot access 'edad' before initialization
Hoisting con funciones declaradas

Las funciones declaradas se elevan completamente, por lo que pueden llamarse antes de declararse.

saludar();

function saludar() {
  console.log("Hola!");
}
Funciones expresadas

Claude también explicó que las funciones expresadas no se elevan completamente, ya que solo se eleva la variable.

despedir();

var despedir = function() {
  console.log("Adiós");
};

Esto genera un error porque la variable existe pero aún no contiene la función.


**Valoración**  
La explicación de Claude fue clara y bien estructurada. Presentó el concepto general de hoisting y después mostró varios ejemplos prácticos para ilustrar el comportamiento de JavaScript.

Claude destacó especialmente en la explicación de la diferencia entre funciones declaradas y funciones expresadas, mostrando por qué una funciona antes de declararse y la otra no.

Los ejemplos utilizados fueron sencillos y fáciles de entender, lo que facilita comprender cómo JavaScript interpreta el código internamente.

En general, Claude proporcionó una explicación técnica correcta y bien organizada del concepto de hoisting.

**Comparación**  
ChatGPT presentó la explicación de forma muy estructurada, comenzando con la idea general del hoisting y después mostrando varios ejemplos prácticos (var, function, let y const).
Los ejemplos estaban acompañados de la interpretación interna del código por parte de JavaScript, lo que ayuda a entender por qué ocurre el comportamiento.

Claude también explicó el concepto correctamente, pero su enfoque fue más directo. Explicó el comportamiento del motor de JavaScript antes de ejecutar el código y presentó ejemplos claros con var, let, const y funciones.

En términos de claridad, ambos asistentes ofrecieron explicaciones comprensibles, aunque ChatGPT mostró una estructura ligeramente más pedagógica paso a paso.

Los dos asistentes utilizaron ejemplos claros de JavaScript:

Uso de var mostrando undefined

Error con let y const

Ejemplo de funciones que funcionan antes de declararse

Diferencia entre función declarada y función expresada

Claude presentó los ejemplos de forma muy compacta y clara, mientras que ChatGPT explicó paso a paso cómo el motor de JavaScript reorganiza el código internamente.








## Prueba 2. Detección de errores en funciones JavaScript
En esta sección se evaluó la capacidad de los asistentes de IA para detectar y explicar errores en código JavaScript.
Se escribieron tres funciones con errores intencionales y se pidió a los asistentes que identificaran el problema y explicaran cómo solucionarlo

### Función con error 1

**Prompt utilizado**
Encuentra el error en esta función JavaScript y explica qué problema tiene.

function suma(a, b) {
  return a + c;
}

console.log(suma(2, 3));

**Respuesta de ChatGPT**
ChatGPT detectó que el error se encuentra en la línea:

return a + c;

La función recibe los parámetros a y b, pero en la operación se está utilizando la variable c, que no está definida en ningún lugar del código.

Cuando JavaScript intenta ejecutar la función, busca una variable llamada c, pero como no existe, se produce el error:

ReferenceError: c is not defined

ChatGPT también propuso la versión corregida de la función:

function suma(a, b) {
  return a + b;
}


**Respuesta de Claude**
Claude identificó que el error se encuentra en la línea:

return a + c;

La función recibe los parámetros a y b, pero dentro del return se utiliza la variable c, que no está definida en ningún lugar del programa.

Cuando JavaScript intenta ejecutar la función, busca una variable llamada c, pero al no existir se produce el error:

ReferenceError: c is not defined

Claude también explicó que se trata de un error en tiempo de ejecución, ya que el código es sintácticamente correcto, pero falla cuando JavaScript intenta ejecutarlo.

Además, propuso la versión corregida de la función:

function suma(a, b) {
  return a + b;
}

console.log(suma(2, 3));


**Conclusión**
Ambos asistentes identificaron correctamente que el problema es el uso de una variable no definida (c) dentro de la función.

ChatGPT ofreció una explicación más simple y directa del error, mientras que Claude añadió más contexto técnico al explicar que se trata de un error en tiempo de ejecución y mencionó herramientas como ESLint o TypeScript que pueden detectar este tipo de problemas antes de ejecutar el código.







### Función con error 2
**Prompt utilizado**
Detecta el error en esta función JavaScript y explica por qué ocurre.

function contarHastaDiez() {
  let i = 0;

  while (i < 10) {
    console.log(i);
  }
}

contarHastaDiez();

**Respuesta de ChatGPT**
ChatGPT detectó que el error se encuentra en el bucle while:

while (i < 10) {
  console.log(i);
}

Dentro del bucle la variable i nunca se modifica, por lo que su valor permanece siempre en 0.

Como la condición i < 10 siempre se cumple, el programa entra en un bucle infinito, imprimiendo el valor 0 continuamente.

ChatGPT explicó que para solucionar el problema es necesario incrementar la variable i dentro del bucle.

Versión corregida
function contarHastaDiez() {
  let i = 0;

  while (i < 10) {
    console.log(i);
    i++;
  }
}

contarHastaDiez();

De esta manera, i aumenta en cada iteración hasta llegar a 10, momento en el que el bucle termina correctamente.


**Respuesta de Claude**
Claude identificó que el error se encuentra en el bucle while, ya que la variable i nunca se incrementa dentro del bucle.

while (i < 10) {
  console.log(i);
}

La condición i < 10 se evalúa antes de cada iteración. Como i empieza en 0 y nunca cambia su valor, la condición siempre es verdadera.

Esto provoca que el programa entre en un bucle infinito, imprimiendo continuamente el valor 0 y bloqueando la ejecución del programa.

Claude propuso como solución incrementar la variable i dentro del bucle:

function contarHastaDiez() {
  let i = 0;

  while (i < 10) {
    console.log(i);
    i++;
  }
}

También sugirió una alternativa utilizando un bucle for, que reduce la probabilidad de olvidar el incremento:

function contarHastaDiez() {
  for (let i = 0; i < 10; i++) {
    console.log(i);
  }
}


**Conclusión**
Ambos asistentes detectaron correctamente que el problema es que la variable i no se incrementa dentro del bucle, lo que provoca un bucle infinito.

ChatGPT explicó el error de forma clara y directa, mientras que Claude añadió una alternativa usando un bucle for, mostrando una forma más segura de escribir este tipo de iteraciones.


### Función con error 3
**Prompt utilizado**
Encuentra el error en esta función JavaScript y explica qué está mal.

function esMayor(a, b) {
  if (a = b) {
    return true;
  } else {
    return false;
  }
}

console.log(esMayor(5, 3));

**Respuesta de ChatGPT**
ChatGPT identificó que el error se encuentra en la condición del if:

if (a = b)

En este caso se está utilizando el operador = que en JavaScript significa asignación, no comparación.

Esto provoca que el valor de b se asigne a la variable a, en lugar de comparar ambos valores.

Después de la asignación, el if evalúa el valor resultante. Como la mayoría de valores son considerados verdaderos (truthy) en JavaScript, la condición casi siempre se cumple, por lo que la función devuelve true aunque los valores no sean iguales.

ChatGPT explicó que la forma correcta de comparar valores es utilizando el operador de igualdad estricta ===.

Versión corregida
function esMayor(a, b) {
  if (a === b) {
    return true;
  } else {
    return false;
  }
}

También sugirió una forma más sencilla para comprobar si a es mayor que b:

function esMayor(a, b) {
  return a > b;
}

**Respuesta de Claude**
Claude identificó que el error está en la condición del if:

if (a = b)

En esta expresión se está utilizando el operador = que en JavaScript significa asignación, no comparación.

Esto provoca que el valor de b se asigne a la variable a. Después, el if evalúa el resultado de esa asignación como un valor booleano.

Si b tiene un valor truthy (por ejemplo cualquier número distinto de 0, un string no vacío, etc.), la condición del if será verdadera y el bloque se ejecutará siempre.

Claude explicó que la forma correcta de comparar valores es usar el operador de igualdad estricta ===, que compara valor y tipo.

Versión corregida
function esMayor(a, b) {
  if (a === b) {
    return true;
  } else {
    return false;
  }
}

También indicó que el código puede simplificarse devolviendo directamente el resultado de la comparación:

function esMayor(a, b) {
  return a === b;
}

**Conclusión**
Ambos asistentes identificaron correctamente que el error consiste en usar el operador de asignación (=) en lugar de un operador de comparación (== o ===).

ChatGPT explicó de forma clara que la asignación modifica el valor de la variable y hace que la condición sea evaluada como verdadera en la mayoría de los casos.
Claude añadió más detalle sobre la diferencia entre == y ===, recomendando usar la igualdad estricta para evitar conversiones de tipo inesperadas.


## Prueba 3. Generación de funciones a partir de descripciones en lenguaje natural

### Función 1

**Prompt**
Crea una función en JavaScript que reciba un número y devuelva true si es par y false si es impar.

**Código generado por ChatGPT**

function esPar(numero) {
  return numero % 2 === 0;
}

**Código generado por Claude**
function esPar(numero) {
  return numero % 2 === 0;
}

Claude también sugirió una versión más moderna usando arrow function:

const esPar = (numero) => numero % 2 === 0;

**Análisis**
Tanto ChatGPT como Claude generaron una solución correcta para determinar si un número es par. Ambos utilizaron el operador módulo (%) para comprobar si el resto de dividir el número entre 2 es igual a 0.

La implementación generada por ambos asistentes fue prácticamente la misma:

function esPar(numero) {
  return numero % 2 === 0;
}

Esto demuestra que ambos modelos reconocen el patrón habitual para resolver este problema en JavaScript.

La diferencia principal es que Claude también sugirió una versión alternativa utilizando arrow functions, una sintaxis más moderna y compacta de JavaScript:

const esPar = (numero) => numero % 2 === 0;

En general, las dos respuestas fueron claras, correctas y eficientes. ChatGPT ofreció una explicación sencilla del funcionamiento del operador módulo, mientras que Claude añadió una alternativa moderna para escribir la función.





### Función 2

**Prompt**
Crea una función en JavaScript que reciba un array de números y devuelva la suma total de todos los elementos.


**Código generado por ChatGPT**
function sumarArray(numeros) {
  let suma = 0;

  for (let i = 0; i < numeros.length; i++) {
    suma += numeros[i];
  }

  return suma;
}

**Código generado por Claude**
function sumarArray(numeros) {
  return numeros.reduce((acumulador, numero) => acumulador + numero, 0);
}

tambien dió esta opción

function sumarArray(numeros) {
  let suma = 0;
  for (const numero of numeros) {
    suma += numero;
  }
  return suma;
}

**Análisis**
Tanto ChatGPT como Claude generaron una solución correcta para crear una función que sume todos los elementos de un array.

ChatGPT propuso una implementación utilizando un bucle for, que recorre el array y acumula la suma en una variable:

function sumarArray(numeros) {
  let suma = 0;

  for (let i = 0; i < numeros.length; i++) {
    suma += numeros[i];
  }

  return suma;
}

Por otro lado, Claude propuso una solución utilizando el método reduce(), que permite recorrer el array acumulando el resultado en una sola expresión:

function sumarArray(numeros) {
  return numeros.reduce((acumulador, numero) => acumulador + numero, 0);
}

Claude también mostró una alternativa utilizando un bucle for...of, más fácil de entender para principiantes.

En general, ambas soluciones son correctas. La propuesta de ChatGPT es más clásica y fácil de comprender, mientras que la de Claude es más concisa y moderna, aprovechando métodos propios de los arrays en JavaScript.


### Función 3

**Prompt**
Crea una función en JavaScript que reciba un texto y devuelva ese texto invertido.

**Código generado por ChatGPT**
function invertirTexto(texto) {
  return texto.split("").reverse().join("");
}

**Código generado por Claude**
function invertirTexto(texto) {
  return texto.split("").reverse().join("");
}

Ademas dio esta dos opciones más

function invertirTexto(texto) {
  let resultado = "";
  for (let i = texto.length - 1; i >= 0; i--) {
    resultado += texto[i];
  }
  return resultado;
}

const invertirTexto = (texto) => texto.split("").reverse().join("");


**Análisis**
Tanto ChatGPT como Claude generaron una solución correcta para invertir un texto en JavaScript. Ambos utilizaron la combinación de tres métodos de array: split(), reverse() y join().

La implementación propuesta por ambos asistentes fue prácticamente la misma:

function invertirTexto(texto) {
  return texto.split("").reverse().join("");
}

Esta solución funciona dividiendo el texto en un array de caracteres (split), invirtiendo el orden (reverse) y volviendo a unir los caracteres en un string (join).

Claude también propuso alternativas adicionales, como construir el texto manualmente utilizando un bucle for que recorre el string desde el final, y una versión utilizando arrow function, que ofrece una sintaxis más compacta.

En general, ambos asistentes generaron una solución correcta y eficiente. ChatGPT ofreció una solución directa y clara, mientras que Claude añadió más alternativas de implementación, mostrando diferentes formas de resolver el mismo problema.


## Conclusiones
En esta práctica se compararon dos asistentes de inteligencia artificial, ChatGPT y Claude, para ver cómo explican conceptos de programación, cómo detectan errores en el código y cómo generan funciones a partir de una descripción.

En general, los dos funcionaron bastante bien. Ambos fueron capaces de encontrar los errores en el código y explicar qué estaba pasando. También generaron funciones correctas cuando se les pidió crear código a partir de una descripción.

La principal diferencia es que ChatGPT suele dar respuestas más directas y fáciles de entender, mientras que Claude a veces añade más alternativas o explica otras formas de hacer lo mismo.

En conclusión, los dos asistentes pueden ser herramientas muy útiles para aprender programación y resolver dudas rápidamente. Aun así, es importante revisar siempre el código generado para asegurarse de que realmente hace lo que necesitamos.