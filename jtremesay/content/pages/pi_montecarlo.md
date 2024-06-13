---
title: Pi Monte Carlo
---
{% load vite %}

Il est possible d'approximer Pi en tirant au hasard sur une cible.

Je vais sauvagement copié/collé [Wikipedia](https://fr.wikipedia.org/w/index.php?title=M%C3%A9thode_de_Monte-Carlo&oldid=206141750#D%C3%A9termination_de_la_valeur_de_%CF%80>) parce que je suis une grosse feignasse :)

Soit un point M de coordonnées (x, y), où 0 < x < 1 et 0 < y < 1. On tire aléatoirement les valeurs de x et y entre 0 et 1 suivant une loi uniforme. Le point M appartient au disque de centre (0,0) de rayon R = 1 si et seulement si x2 + y2 ≤ 1. La probabilité que le point M appartienne au disque est π/4, puisque le quart de disque est de surface σ=π R2/4 = π/4, et le carré qui le contient est de surface S = R2=1 : si la loi de probabilité du tirage de point est uniforme, la probabilité de tomber dans le quart de disque vaut σ/S = π/4.

En faisant le rapport du nombre de points dans le disque au nombre de tirages, on obtient une approximation du nombre π/4 si le nombre de tirages est grand.

Représentation du calcul de la valeur de π par rapport du nombre de points aléatoires étant contenus dans un quart de cercle, l'ensemble des possibles étant un carré de côté R :


{% vite 'front/main/pimontecarlo.ts' %}
<div id="app">
    <label for="samples_count">
        Samples count:

        <input type="number" name="samples_count" id="samples_count">
    </label>

    <label for="samples_in_circle">
        Samples in circle:

        <input type="number" name="samples_in_circle" id="samples_in_circle">
    </label>

    <label for="ratio">
        Ratio:

        <input type="number" name="ratio" id="ratio">
    </label>


    <canvas name="canvas" width="400" height=400></canvas>
</div>


Code source disponible [ici](https://github.com/jtremesay/jtremesay.org/blob/main/front/main/pimontecarlo.ts).
