---
title: Hello, world
date: 2023-05-31T20:00+02:00
---

Encore un nouveau Hello world, sur une nouvelle itération du blog, qui va encore une fois rester désespérément vide :D

Je veux un truc simple. J'écris mon contenu dans mon éditeur de texte préféré, je commit, je push, et ka-boom, le site est mis à jour. Idéalement, je voudrais un site complètement statique. Du bon vieux HTML servi par un bon vieux nginx. Malheureusement, je n'ai pas trouvé mon bonheur dans les trucs existants (principalement Pelican, Hugo et Jekyll) (disclaimer: j'ai pas non plus trop cherché). Pis y'a nécessairement où je voudrais faire des trucs pas prévus pour. Genre des expérimentations en JS pour illustrer certains articles. Mais voila, j'ai la flemme d'écrire du bon vieux HTML. Pis j'aime beaucoup la méta-programmation et les trucs qui génèrent des bidules.

Du coup, voila ma solution, pas du tout `sur-ingénieurée <https://xeiaso.net/talks/how-my-website-works>`_. Le contenu écrit sous forme de templates Jinja, et servi par une app Flask maison. Comme tout est sous forme de template, je peux écrire mes articles depuis le comfort de mon éditeur de texte, tout en ayant une bonne séparations entre la partie contenu et la partie présentation.

Un post ressemble à ça :

```html
{% verbatim %}
{% extends "base.html" %}

{% block title %}Hello, world{% endblock %}

{% block content %}
<p>
    Mon super article
</p>
{% endblock %}

{% endverbatim %}
```

On a déjà vu plus simple. Certes. Mais on a aussi pire :shrug:

La vue flask s'occupant d'afficher ce post :

```python
@app.route("/<int:year>/<int:month>/<int:day>/<slug>")
def view_post(year: int, month: int, day: int, slug: str):
    try:
        return render_template(f"blog/{year:04}{month:02}{day:02}_{slug}.html")
    except TemplateNotFound:
        return abort(404)
```

Simple et efficace. Y'a que la partie découverte des posts pour générer l'index qui est «créative» et assez insatisfaisante. Mébon, si j'attends d'être satisfait de la solution avant de publier du contenu, on est pas arrivés :D

Fin bref, bienvenue dans mon antre :)
