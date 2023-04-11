---
layout: ../../layouts/MarkdownPostLayout.astro
title: Cómo funciona una regla de ESLint, un ejemplo práctico.
author: José Albarado
description: "ESLint hace uso del ***Abstract Syntax Tree (AST)*** de nuestro código, el cuál tiene toda la información sintáctica en forma de árbol, detecta los patrones definidos como erróneos y los muestra con una salida en consola o en su defecto los corrige."
image: 
  url: "https://miro.medium.com/v2/resize:fit:1400/1*sD4FvpW8AZnyQ2qFLuIZzg.jpeg"
  alt: "Learning"
pubDate: 2021-04-12
tags: ["eslint","code-style"]
---

## Abstract Syntax Tree (AST)

¿Se han preguntado cómo hace ESLint para detectar patrones “erróneos” en el código y corregirlos?

Resulta que para lograr esto, ESLint hace uso del ***Abstract Syntax Tree (AST)*** de nuestro código, el cuál tiene toda la información sintáctica en forma de árbol, detecta los patrones definidos como erróneos y los muestra con una salida en consola o en su defecto los corrige.

Veamos como funciona mediante un ejemplo práctico:

Para ilustrar como funciona una regla en ESLint vamos a crear una, que nos permita detectar una constante numérica, mostrar un error si su nombre no está escrito en mayúsculas o a su vez cambiar su nombre a mayúsculas. Para este propósito vamos a ayudarnos de la herramienta [astexplorer.net](http://astexplorer.net).

![](https://miro.medium.com/v2/resize:fit:1400/1*auuQlUs6DrpdDtJVXjNq3A.png)AST Explorer> Al hacer clic en una sección de código en el primer cuadrante, AST Explorer nos muestra resaltado de amarillo el nodo correspondiente a dicho código.

- En la configuración de código seleccionamos @babel/eslint-parser y en el menú transform escogemos ESLint v4

![](https://miro.medium.com/v2/resize:fit:1400/1*grMflkDGKOegnRQ7vuNeuQ.png)![](https://miro.medium.com/v2/resize:fit:1400/1*Sybn6zpVuC8VNHJOlX9OqQ.png)- Para evaluar nuestra regla vamos a escribir el siguiente código en el primer cuadrante

```
// declaramos el valor de pi en una constanteconst pi = 3.1415;
```

- Con el siguiente código, que colocaremos en el cuadrante 3, podremos evaluar todas las declaraciones de variables (`VaraibleDeclaration`), recibiendo los nodos hijos del `body` del AST para obtener datos sobre la declaración y cambiarlos.

```
export default function (context) {  return {    VariableDeclaration(node) {      // código de nuestra regla    }  };}
```

- Asumiremos que en nuestro código a evaluar solo habrá una declaración por cada `VariableDeclaration`

```
// Es decir tendremos esto:const pi = 3.1415;const half_pi = 1.57075;// y no estoconst pi = 3.1415, half_pi = 1.57075;
```

> Como reto podríamos hacer que nuestra regla funcione para ambos casos o crear una regla que solo permita una declaración por nodo.

- Verificamos que la declaración sea de tipos `const` y el valor de la constante sea numérico.

```
...  VariableDeclaration(node) {    // tipo de variable const    if (node.kind === "const") {      const declaration = node.declarations[0];      // asegurarnos que el valor es un número      if (typeof declaration.init.value === "number") {...
```

- Es de mucha ayuda guiarse de las propiedades que tenemos en el AST que se muestra en el cuadrante 2 del AST Explorer, para ir construyendo nuestra regla. El nodo que recibimos de `const pi = 3.1415;` en formato JSON es el siguiente

```
...{      "type": "VariableDeclaration",      "start": 0,      "end": 18,      "loc": {        "start": {          "line": 1,          "column": 0        },        "end": {          "line": 1,          "column": 18        }      },      "range": [        0,        18      ],      "declarations": [        {          "type": "VariableDeclarator",          "start": 6,          "end": 17,          "loc": {            "start": {              "line": 1,              "column": 6            },            "end": {              "line": 1,              "column": 17            }          },          "range": [            6,            17          ],          "id": {            "type": "Identifier",            "start": 6,            "end": 8,            "loc": {              "start": {                "line": 1,                "column": 6              },              "end": {                "line": 1,                "column": 8              }            },            "range": [              6,              8            ],            "name": "pi"          },          "init": {            "type": "Literal",            "start": 11,            "end": 17,            "loc": {              "start": {                "line": 1,                "column": 11              },              "end": {                "line": 1,                "column": 17              }            },            "range": [              11,              17            ],            "value": 3.1415,            "raw": "3.1415"          }        }      ],      "kind": "const"    }...
```

- Vamos a lanzar un mensaje si el nombre de la variable no está escrito en mayúsculas con el siguiente código.

```
...     if (typeof declaration.init.value === "number") {         if (declaration.id.name !== declaration.id.name.toUpperCase()) {      context.report({        node: declaration.id,        message: "El nombre de la constante debe estar en                  mayúsculas"      })...
```

- En el 4 cuadrante tendremos la siguiente salida de consola, que nos mostrará el sitio en donde está el patrón incorrecto:

```
// El nombre de la constante debe estar en mayúsculas (at 1:7)   const pi = 3.1415;// ------^// El nombre de la constante debe estar en mayúsculas (at 2:7)   const half_pi = 1.57075;// ------^
```

- Si queremos que en vez de mostrar un error, el código se corrija, agregamos la propiedad `fix` en el `context.report` que recibe la función qué realizará el reemplazo que queremos para nuestra regla (cambiar el nombre de nuestra constante numérica a mayúsculas).

```
...  if (declaration.id.name !== declaration.id.name.toUpperCase()) {    context.report({      node: declaration.id,      message: "El nombre de la constante debe estar                en mayúsculas",      fix: function (fixer) {	return fixer.replaceText(	  declaration.id,          declaration.id.name.toUpperCase()	);      }    });...
```

- La salida que obtenemos en la consola es la siguiente:

```
// Lint rule not fired.// Fixed output follows:// --------------------------------------------------------------------------------const PI = 3.1415;const HALF_PI = 1.57075;
```

El código completo de nuestra regla es el siguiente:

Conclusión
==========

El AST de nuestro código es una fuente de información muy importante para herramientas que hacen análisis de código estático como ESLint, Prettier, Babel, entre otras. Conocer la estructura del AST nos permitirá adaptar estas herramientas para funcionalidades específicas que requerimos del análisis de código para cumplir estándares en nuestra organización o proyectos personales.

