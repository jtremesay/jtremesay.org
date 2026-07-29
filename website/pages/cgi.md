---
title: "Images générés par ordinateur"
---
{% load jssg %}

Quelques expérimentations avec la création d'images par ordinateur.

Ici, un [triangle de Sierpinski](https://fr.wikipedia.org/wiki/Triangle_de_Sierpi%C5%84ski>) généré dans une image SVG avec du vanilla typescript.

<div class="sierpinski">
    <p>
        <label>
            Récursion
            <input class="sierpinski-level" type="range" min="0" max="10" value="1">
        </label>
    </p>
    <svg class="sierpinski-svg" width="400" heigh="400" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="black" />
    </svg>
</div>

{% vite_module "cgi" %}