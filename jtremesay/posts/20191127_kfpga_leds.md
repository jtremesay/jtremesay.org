---
title: kFPGA et DEL qui clignotent
date: 2019-11-27T00:00+02:00
---
{% load static %}

(Billet que j'avais publié sur un précédent blog et que je pensais irrémédiablement perdu jusqu'à ce que j'en trouve une copie sur la [Wayback Machine](https://web.archive.org/web/20200423094849/https://blog.slaanesh.org/kfpga-et-del-qui-clignotent.html#kfpga-et-del-qui-clignotent))

[![Un FPGA branché à des LEDS montrant la fonctionnalité d'additionneur]({% static 'jtremesay/images/qmtech_board_running_adder2_implemented_on_k1g4_thumb.jpg' %})]({% static 'jtremesay/images/qmtech_board_running_adder2_implemented_on_k1g4.jpg' %})


Lors de l'[épisode précédent](https://linuxfr.org/users/killruana/journaux/k1g1-le-premier-fpga-libre), j'avais annoncé avoir validé le fonctionnement de l'architecture kFPGA - ou du moins celui de son plus petit cœur possible - par simulation. Comme son nom l'indique, la simulation consiste à faire simuler le circuit par l'ordinateur. C'est donc un moyen facile de voir son circuit fonctionner. Et avec l'usage de banc de tests, il est possible d'automatiser l'exécution du circuit afin de s'assurer qu'il fonctionne comme attendu malgré. C'est un peu nos tests unitaires à nous. La simulation est donc un outil important dans la conception d'un circuit intégré. Mais je trouve que la simulation possède 2 problèmes majeurs : elle est imbitable et abstraite. Pour le côté imbitable, je pense qu'une image vaut mieux que milles mots.
Simulation d'un Adder 2 bits mappé dans k1g4

[![Simulation d'un Adder 2 bits mappé dans k1g4]({% static 'jtremesay/images/kfpga_k1g4_adder_2_simulation_thumb.png' %})]({% static 'jtremesay/images/kfpga_k1g4_adder_2_simulation.png' %})

Là, c'est le résultat de l'exécution d'un banc de test validant le fonctionnement d'un additionneur deux bits mappé dans un cœur kFPGA. Quand j'avais dit que c'était imbitable…

Pour le côté abstrait, c'est plus un truc personnel. Voir des vagues de couleurs et des lignes de log sur un écran, ce n'est pas assez concret pour moi. J'ai **besoin** de toucher le truc (c'est là que je me dis que l'informatique n'était peut-être pas le meilleur choix de carrière pour moi…). Et comment fait-on pour exécuter réellement un circuit intégré sans l'envoyer en fonderie ? On le met dans un FPGA ! #FPGAception. Mais pour éviter des histoires d'œuf et de poule, j'ai choisi de me tourner vers une carte de développement QMTech basé sur un FPGA [Xilinx Artix 7](https://www.xilinx.com/products/silicon-devices/fpga/artix-7.html) 100T. J'ai choisi cette carte parce qu'elle intègre un gros FPGA (100k logic cells !) et beaucoup d'I/O pour vraiment pas cher ($60)

[![Photo d'une carte Xilinx Artix-7 XCA7A100T de QMTECH]({% static 'jtremesay/images/QMTECH-Xilinx-FPGA-Artix7-Artix-7-XC7A100T-Core-Board_thumb.jpg' %})]({% static 'jtremesay/images/QMTECH-Xilinx-FPGA-Artix7-Artix-7-XC7A100T-Core-Board.webp' %})

Seul bémol, il a fallu que je soude les connecteurs d'IO moi même. 120 putains de pins à souder. J'ai jamais était très bon pour souder des composants et j'avais rien pour me faire la main. Du coup, pas le choix, c'est avec beaucoup d'appréhension j'ai appris sur le tas. Comme attendu, les premières soudures étaient franchement catastrophique. Mais sur la fin, ça commençait à être acceptables. Du coup, je suis repassé sur toute les pins. Ce qui nous fait plus de 200 points de soudure. Youhou.

Je vous passe les galères pour faire reconnaitre le FPGA par le programmeur (spoiler alert, ça marche mieux quand on installe les pilotes), la prise en main du dit programmeur, les premiers tests (youhou, j'arrive à faire clignoter des DEL o/).

Fun fact : Malgré mes 4 ans dans une startup proposant des softs & hard IP de eFPGA, c'était la première fois de ma vie que j'utilisais un FGPA.

Une fois cette prise en main terminée, il a fallut faire rentrer mon kFPGA dans le Xilinx. Puis aussi de quoi le programmer. Et une ROM pour contenir le bitstream. Et un générateur de signaux parce que j'aime bien quand ça fait des trucs tout seul. Et un diviseur de clock parce que sinon la STA n'était pas validée. Au final, je me suis retrouvé avec ce design :

[![Schematic du kFPGA prêt à être implémenté dans le FPGA Xilinx]({% static 'jtremesay/images/kfpga_k1g4_adder_2_vivado_schematic_thumb.png' %})]({% static 'jtremesay/images/kfpga_k1g4_adder_2_vivado_schematic.png' %})

Bref, après un peu de bidouillage, j'ai fini par avoir un cœur kFPGA implémenté sur un Xilinx qui réalise des additions 2 bits et dont on peut visualiser le fonctionnement avec des DEL. Le résultat est visible en vidéo ici.

Je suis content :)
