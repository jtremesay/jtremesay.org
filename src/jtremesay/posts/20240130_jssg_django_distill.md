---
title: JSSG + django-distill
date: 2024-01-30T20:00+02:00
---

Petite mise à jour de JSSG.

Depuis l'[épisode précédent]({% url 'post' 'jssg-django' %}), j'ai découvert [django-distill](https://django-distill.com/).

> django-distill is an open source, MIT licenced static site generator library for the Django web development framework and is designed to integrate into existing Django projects to allow some, or all of the content in the site to be written out as static pages. Integration is simple and the level of static site generation is up to the project. django-distill integrates with Django, rather than requiring projects to be written for django-distill.

L'intégration fut très facile. Essentiellement mettre à jour le `urls.py` :

```python
from django_distill import distill_path

from jssg import views
from jssg.models import Page, Post


def get_pages():
    return ({"slug": p.slug} for p in Page.load_glob())


def get_posts():
    return ({"slug": p.slug} for p in Post.load_glob())


urlpatterns = [
    distill_path(
        "", views.IndexView.as_view(), name="index", distill_file="index.html"
    ),
    distill_path("atom.xml", views.PostFeedsView(), name="atom_feed"),
    distill_path(
        "pages/<slug:slug>.html",
        views.PageView.as_view(),
        name="page",
        distill_func=get_pages,
    ),
    distill_path(
        "posts/<slug:slug>.html",
        views.PostView.as_view(),
        name="post",
        distill_func=get_posts,
    ),
]
```

Un petit coup de `./manage.py distill-local --collectstatic dist` et pouf, vos assets sont collectés, et les pages html et le flux atom généré.

Ça m'a permis de supprimer pas mal de code :D

De plus, c'est aussi utilisable avec un django en prod pour avoir une partie du site en static et le reste en dynamique. Je n'en ai pas l'usage immédiat, mais c'est toujours bon à savoir :)
