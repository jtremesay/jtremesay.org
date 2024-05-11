---
title: Théorie des langages formels
slug: index
---

Petites expérimentations sur la `théorie des langages <https://fr.wikipedia.org/wiki/Langage_formel>`_. On va essayer de rester léger en maths.

D'après `Wikipedia <https://fr.wikipedia.org/wiki/Langage_formel>`_, un langage formel, en mathématiques, en informatique et en linguistique, est un ensemble de mots. L'alphabet d'un langage formel est l'ensemble des symboles, lettres ou lexèmes qui servent à construire les mots du langage ; souvent, on suppose que cet alphabet est fini. Les mots sont des suites d'éléments de cet alphabet ; les mots qui appartiennent à un langage formel particulier sont parfois appelés mots bien formés ou formules bien formées. Un langage formel est souvent défini par une grammaire formelle, telle que les grammaires algébriques et analysé par des `automates <https://fr.wikipedia.org/wiki/Th%C3%A9orie_des_automates>`_.

Présenté comme ça, c'est très abstrait. Mais en fait, c'est très concret. Il suffit de l'interpreter très littéralement. Prenons par exemple le cas du langage formel connu sous le nom de "`français <https://fr.wikipedia.org/wiki/Fran%C3%A7ais>`_".

Ce langage utilise l'`alphabet latin <https://fr.wikipedia.org/wiki/Alphabet_latin>`_ composé de 26 symboles principaux ("a", "b", "c", …) et quelques symboles auxiliaires ("1", "!", ";", "…", …). On peut combiner ces symboles pour former des `mots <https://fr.wiktionary.org/wiki/Cat%C3%A9gorie:fran%C3%A7ais>`_. Ces mots sont valides si ils respectent la `grammaire française <https://www.academie-francaise.fr/>`_. On peut utiliser des programmes informatique pour analyser des textes écrits dans ce langage.

.. image:: /static/tol/analyse_grammaticale_francais_vs_pros_small.jpg
    :alt: Comparaison de l'analyse lexicale d'une phrase française et d'un programme informatique
    :target: /static/tol/analyse_grammaticale_francais_vs_pros_large.jpg

Comparaison de l'analyse lexicale d'une phrase française et d'un programme informatique.

Français, programme informatique, c'est la même chose. On peut utiliser les mêmes outils pour les analyser. Outils eux même étant généralement des programmes informatiques écrit selon les règles d'un langage. #méta

TODO


1. Grammaire Non-Recursive
