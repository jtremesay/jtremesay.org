---
title: "Un raycaster façon Wolfenstein3D en pur typescript"
vite_modules: ["raycaster"]
---
Un petit raycaster écrit en pur typescript sans aucune dépendance externe.

Le moteur de rendu émet des commandes de dessins qui sont exécuté par les différents backend afin de supporter plusieurs type d'affichage. Par exemple, ici, le moteur utilise deux backends pour dessiner dans un Canvas 2D et dans un SVG.

C'est absolument pas orienté performance. Je voulais juste découvrir comment on faisait du raytracing from scratch.

Les images sont particulièrement distordus sur les bords de l'écran. C'est parce que mes formules de projections sont assez meh. On va dire que c'est une feature et non un bug…

Les déplacement utilisent les touches correspondant à "WASD" sur un clavier QWERTY ("ZQSD" sur un AZERTY, "ÉAUI" sur un BÉPOÈ).

<div class="raycaster">
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
                <td><canvas class="raycaster-canvas" width="960" height="540"></canvas></td>
            </tr>
            <tr>
                <td>SVG</td>
                <td><svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="raycaster-svg" width="960" height="540"
    viewBox="0 0 960 540"></svg></td>
            </tr>
        </tbody>
    </table>
</div>