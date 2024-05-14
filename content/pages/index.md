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
- [Doom]({% url 'page' 'doom' %}) : parce que si à 40 ans t'as pas fait ton propre moteur pour Doom, t'as un peu raté ta vie de dev…
- [free flow]({% url 'page' 'freeflow' %}) : un clone de [Flow Free®](https://www.bigduckgames.com/flowfree)

## Projets

Quelqu'uns de mes projets :

- [Raytracer](https://github.com/jtremesay/raytracer) : Itération suivante, un raytraceur en rust.
- [Mathsworld](https://mathsworld.jtremesay.org/) ([sources](https://github.com/jtremesay/mathsworld)) : Le next level du projet précédent : un générateur de shader WebGL raytraçant une scène décrite en s-expression
- [kFPGA](https://github.com/jtremesay/kfpga) : une architecture FPGA opensource (openhardware?).
- [MPS](https://github.com/jtremesay/mpssim) : Un processor MIPS 8 bits.

## Liens

- [Solène'%](https://dataswamp.org/~solene/), une amie qui fait des choses bizarres avec openbsd, qubeos et nixos sur des thinkpads, entre autre chose. Mon pendant administration système
- [Fabien Sanglard](https://fabiensanglard.net/), c'est notamment grace à ce site et ses articles que j'ai pu comprendre des trucs sur les moteurs de jeux vidéos. Et que je suis devenu le développeur que je suis aujourd'hui. Merci M. Sanglard de m'avoir permis de faire [ça]({% url 'page' 'raycaster' %}) !
- [Portefolio](https://s-keyp.github.io/new_portfolio/) de Padawan, mon alternant


## Blog

{% for post in posts %}
- [{{ post.timestamp|date:"Y-m-d" }}]({% url 'post' post.slug %}): {{ post.title }}{% endfor %}
