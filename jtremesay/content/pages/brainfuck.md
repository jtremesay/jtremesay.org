---
title: Brainfuck
---
{% load django_vite %}
{% load static %}
<link rel="stylesheet" type="text/css" href="{% static 'jtremesay/brainfuck/brainfuck.css' %}">
{% vite_asset 'jtremesay/front/main/brainfuck.ts' %}

Exploration du langage Brainfuck.

## Introduction

Brainfuck est un langage de programmation minimaliste, inventé par Urban Müller en 1993. Il est conçu pour être le plus petit possible, tout en restant Turing-complet. Il est basé sur un modèle de machine à ruban infinie, avec un pointeur se déplaçant de gauche à droite sur cette bande. Le langage est composé de 8 instructions, chacune étant un caractère ASCII.

## Instructions

Les 8 instructions de Brainfuck sont les suivantes :

- `>` : déplace le pointeur d'une case vers la droite
- `<` : déplace le pointeur d'une case vers la gauche
- `+` : incrémente la valeur de la case pointée
- `-` : décrémente la valeur de la case pointée
- `.` : affiche la valeur de la case pointée
- `,` : lit un caractère depuis l'entrée standard et le stocke dans la case pointée
- `[` : si la valeur de la case pointée est nulle, saute à l'instruction après le `]`
- `]` : si la valeur de la case pointée n'est pas nulle, saute à l'instruction après le `[`

## Exemple

Voici un exemple de programme Brainfuck qui affiche "Hello World!" :

```brainfuck
++++++++                Set Cell #0 to 8
[
    >++++               Add 4 to Cell #1; this will always set Cell #1 to 4
    [                   as the cell will be cleared by the loop
        >++             Add 2 to Cell #2
        >+++            Add 3 to Cell #3
        >+++            Add 3 to Cell #4
        >+              Add 1 to Cell #5
        <<<<-           Decrement the loop counter in Cell #1
    ]                   Loop until Cell #1 is zero; number of iterations is 4
    >+                  Add 1 to Cell #2
    >+                  Add 1 to Cell #3
    >-                  Subtract 1 from Cell #4
    >>+                 Add 1 to Cell #6
    [<]                 Move back to the first zero cell you find; this will
                        be Cell #1 which was cleared by the previous loop
    <-                  Decrement the loop Counter in Cell #0
]                       Loop until Cell #0 is zero; number of iterations is 8

The result of this is:
Cell no :   0   1   2   3   4   5   6
Contents:   0   0  72 104  88  32   8
Pointer :   ^

>>.                     Cell #2 has value 72 which is 'H'
>---.                   Subtract 3 from Cell #3 to get 101 which is 'e'
+++++++..+++.           Likewise for 'llo' from Cell #3
>>.                     Cell #5 is 32 for the space
<-.                     Subtract 1 from Cell #4 for 87 to give a 'W'
<.                      Cell #3 was set to 'o' from the end of 'Hello'
+++.------.--------.    Cell #3 for 'rl' and 'd'
>>+.                    Add 1 to Cell #5 gives us an exclamation point
>++.                    And finally a newline from Cell #6
```

## La partie marrante

On va transformer le code source petit à petit pour réussir à l'interpréter puis soyons fous, à le compiler.

### Source code

Tout d'abord, notre code source. Modifiez-le pour voir comment les étapes suivantes se comportent.

<textarea id="brainfuck-input" cols="80" rows="25">
++++++++                Set Cell #0 to 8
[
    >++++               Add 4 to Cell #1; this will always set Cell #1 to 4
    [                   as the cell will be cleared by the loop
        >++             Add 2 to Cell #2
        >+++            Add 3 to Cell #3
        >+++            Add 3 to Cell #4
        >+              Add 1 to Cell #5
        <<<<-           Decrement the loop counter in Cell #1
    ]                   Loop until Cell #1 is zero; number of iterations is 4
    >+                  Add 1 to Cell #2
    >+                  Add 1 to Cell #3
    >-                  Subtract 1 from Cell #4
    >>+                 Add 1 to Cell #6
    [<]                 Move back to the first zero cell you find; this will
                        be Cell #1 which was cleared by the previous loop
    <-                  Decrement the loop Counter in Cell #0
]                       Loop until Cell #0 is zero; number of iterations is 8

The result of this is:
Cell no :   0   1   2   3   4   5   6
Contents:   0   0  72 104  88  32   8
Pointer :   ^

>>.                     Cell #2 has value 72 which is 'H'
>---.                   Subtract 3 from Cell #3 to get 101 which is 'e'
+++++++..+++.           Likewise for 'llo' from Cell #3
>>.                     Cell #5 is 32 for the space
<-.                     Subtract 1 from Cell #4 for 87 to give a 'W'
<.                      Cell #3 was set to 'o' from the end of 'Hello'
+++.------.--------.    Cell #3 for 'rl' and 'd'
>>+.                    Add 1 to Cell #5 gives us an exclamation point
>++.                    And finally a newline from Cell #6
</textarea>

### Pre-processor

Nous commençons par exécuter le préprocesseur. Il va supprimer tous les caractères qui ne sont pas des instructions brainfuck afin de simplifier l'analyse du code dans les étapes suivantes.

<textarea id="brainfuck-preprocessor" cols="80" rows="2" readonly="true"></textarea>

### Tokenizer

Dans cette étape, on va transformer le code source en une liste de tokens. Chaque token représente un mot dans une phrase brainfuck. Le reste du flow déterminera si la phrase est correcte ou non.

<textarea id="brainfuck-tokenizer" cols="80" rows="2" readonly="true"></textarea>

### Parser

La grammaire de brainfuck est simple :

```bnf
<program> ::= <statement>*
<statement> ::= <loop> | <instruction>
<loop> ::= '[' <statement>* ']'
<instruction> ::= '>' | '<' | '+' | '-' | '.' | ','
```

Dans cette étape, on va générer l'AST du programme brainfuck en utilisant la grammaire ci-dessus.
Si cela échoue, cela signifie que le programme n'est pas correct :P

<figure>
    <figcaption>AST of the program</figcaption>
    <ul id="brainfuck-parser" class="tree"></ul>
</figure>

### Interpreter

Maintenant que nous avons un AST valide, nous pouvons l'interpréter. C'est facile, il suffit simplement de le parcourir en profondeur et d'exécuter les instructions au fur et à mesure qu'on les découvre.

Input: <textarea id="brainfuck-interpreter-input"></textarea>

<button id="brainfuck-interpreter-run">Run</button>

Output: <textarea id="brainfuck-interpreter-output" readonly="true"></textarea>

### Compiler

À partir de là, il est aussi facile de compiler le programme brainfuck en un autre langage.

#### C

<textarea id="brainfuck-compiler-c" cols="80" rows="25" readonly="true"></textarea>

#### Python

<textarea id="brainfuck-compiler-python" cols="80" rows="25" readonly="true"></textarea>