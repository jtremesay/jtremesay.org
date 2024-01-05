---
title: Bienvenue sur mon site !
slug: index
---

## Pages

- [Images générés par ordinateur]({% url 'page' 'cgi' %})
- [Un raycaster façon Wolfenstein3D en pur typescript]({% url 'page' 'raycaster' %})
- [Algorithmes de tris animés]({% url 'page' 'tris-animes' %})
- [Calculer Pi au casino]({% url 'page' 'pi-monte-carlo' %})
- [Scada player]({% url 'page' 'scadaplayer' %}) : un outil pour visualiser les données issues d'une éolienne
- [Crankshaft]({% url 'page' 'crankshaft' %}) : Simulation de systèmes vilebrequin / bielle / piston

## Projets

Quelqu'uns de mes projets :

- [Raytracer](https://github.com/jtremesay/raytracer) : Itération suivante, un raytraceur en rust.
- [Mathsworld](https://mathsworld.jtremesay.org/) ([sources](https://github.com/jtremesay/mathsworld)) : Le next level du projet précédent : un générateur de shader WebGL raytraçant une scène décrite en s-expression
- [kFPGA](https://github.com/jtremesay/kfpga) : une architecture FPGA opensource (openhardware?).
- [MPS](https://github.com/jtremesay/mpssim) : Un processor MIPS 8 bits.

## Articles

{% for post in posts %}
- [{{ post.timestamp|date:"Y-m-d" }}]({% url 'post' post.slug %}): {{ post.title }}{% endfor %}