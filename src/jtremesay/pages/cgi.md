---
title: Images générés par ordinateur
slug: cgi
---
{% load django_vite %}

Quelques expérimentations avec la création d'images par ordinateur.

Ici, un [triangle de Sierpinski](https://fr.wikipedia.org/wiki/Triangle_de_Sierpi%C5%84ski>) généré dans une image SVG avec du vanilla typescript.

{% vite_asset 'jtremesay/front/main/cgi.ts' %}

<div id="sierpinski">
    <p>
        <label>
            Récursion
            <input id="sierpinski-input" type="range" min="0" max="7" value="1">
        </label>
    </p>
    <svg version="1.1" width="400" height="400" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="black" />
    </svg>
</div>
