---
title: Raycaster
---
{% load vite %}
Un petit raycaster écrit en pur typescript sans aucune dépendance externe.

Le moteur de rendu émet des commandes de dessins qui sont exécuté par les différents backend afin de supporter plusieurs type d'affichage. Par exemple, ici, le moteur utilise deux backends pour dessiner dans un Canvas 2D et dans un SVG.

C'est absolument pas orienté performance. Je voulais juste découvrir comment on faisait du raytracing from scratch.

Les images sont particulièrement distordus sur les bords de l'écran. C'est parce que mes formules de projections sont assez meh. On va dire que c'est une feature et non un bug…

Les déplacement utilisent les touches correspondant à "WASD" sur un clavier QWERTY ("ZQSD" sur un AZERTY, "ÉAUI" sur un BÉPOÈ).



{% vite 'front/main/raycaster.ts' %}
<div id="raycaster" class="rc">
    <table border="solid">
        <thead>
            <tr>
                <th>Type</th>
                <th>Output</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Canvas</td>
                <td><canvas class="rc-output-canvas" width="800" height="600"></canvas></td>
            </tr>
            <tr>
                <td>SVG</td>
                <td><svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="rc-output-svg" width="800" height="600"
    viewBox="0 0 800 600"></svg></td>
            </tr>
        </tbody>
    </table>
</div>


Code source disponible [ici](https://github.com/killruana/raycaster).
