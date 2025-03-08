---
title: Particules dans un champs vectoriel
slug: particles
---
{% load static %}
{% load django_vite %}
{% vite_asset 'jtremesay/front/main/particles.ts' %}

Des particules se promenant dans un champs vectoriel. 


La teinte encode la direction de la force appliqué aux particules.

<canvas id="particles-canvas-direction"></canvas>

La luminosité encode l'intensité de la force appliqué aux particules.

<canvas id="particles-canvas-intensity"></canvas>

À partir de là, on peut faire des trucs débiles :D

Le Donut :

<canvas id="particles-canvas-donut"></canvas>

Le Vortex :

<canvas id="particles-canvas-vortex"></canvas>

??? :

<canvas id="particles-canvas-demo1"></canvas>
