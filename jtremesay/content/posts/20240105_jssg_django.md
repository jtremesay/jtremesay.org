---
title: JSSG Django
date: 2024-01-05T12:30+02:00
---

Encore une nouvelle itération de JSSG, mon générateur de sites statiques propulsant ce site afin de mieux répondre à mes besoins.

Pour rappel, mes besoins étaient :

- je veux un site statique en plain old html
- je ne veux pas écrire de html
- je veux que le déployement soit en mode "fire & forget" (CI/CD on push)
- je veux toujours faire des trucs tordus qui ne rentrent pas dans les cases des solutions clés en main existantes.

Dans l'épisode [précédent]({% url 'post' 'jssg' %}), j'avais bricolé un [pelican](https://getpelican.com/) du pauvre à truc à base de python + restructuredtext + jinja pour gérer le contenue et vite + typescript pour le front.

Ça marche super bien pour générer la version finale du site. Mais c'était super désagréable d'écrire du contenu ou de travailler sur les animations en typescript. La faute à l'absence d'un auto-rebuild à la volée pour simplifier la vie. Mais c'est super relou à coder ça :P

Retour à la planche à dessin, avec cette contrainte en plus :

- il faut que ça soit très facile de travailler sur le contenu du site

Après quelques PoC infructueux, dont un basé sur [ninja](https://ninja-build.org/) parce que pourquoi pas, j'eu une épiphanie : il me fallait [django](https://www.djangoproject.com/).

En effet, django est absolument génial en ce qui concerne le développement web :

```console
$ npm run dev &
$ ./manage.py runserver
```

Et pouf, j'ai un environnement de dev très confortable, l'accès à plein de modules et bibliothèques, de l'autoreload automatique, et l'intégration de vite/typescript via le plugin [django-vite-plugin](https://github.com/protibimbok/django-vite-plugin).

Sauf que Django sert à propulser des webapps WSGI/ASGI, pas à générer des sites statiques.

Qu'à cela ne tienne. Y'a qu'à ajouter une commande qui parcoure toutes les routes de l'application et appellent les vues sous-jacentes pour générer le HTML et l'enregistrer dans des fichiers. C'est moche mais c'est pas stupide si ça marche.

```console
$ npm run build
$ ./manage.py collectstatic --no-input
$ ./manage.py gensite
```

Et pouf, j'ai mon front transpilé, mes statics traités, et mon html généré.

```console
dist/
├── atom.xml
├── index.html
├── pages
│   ├── a-propos.html
│   ├── cgi.html
│   ├── crankshaft.html
│   ├── cv.html
│   ├── pi-monte-carlo.html
│   ├── raycaster.html
│   ├── scadaplayer.html
│   └── tris-animes.html
├── posts
│   ├── chaines-youtubes.html
│   ├── django-vuejs-multipage-application.html
│   ├── hello-world.html
│   ├── jssg-django.html
│   ├── jssg.html
│   ├── migration-de-gandi-mail-vers-mailo.html
│   ├── news.html
│   ├── pelican.html
│   ├── terraform-oracle-cloud.html
│   └── tris-animes.html
└── static
    ├── assets
    │   ├── cgi-d89f4043.js
    │   ├── crankshaft-e50e7a32.js
    │   ├── pimontecarlo-ecd5d6d5.js
    │   ├── raycaster-d4ad5a5e.js
    │   ├── scadaplayer-f0555500.js
    │   └── sorts-02a45577.js
    ├── jssg
    │   ├── files
    │   │   ├── jonathan.tremesaygues_at_slaanesh.org.pub.043beb42ea7d.asc
    │   │   ├── jonathan.tremesaygues_at_slaanesh.org.pub.043beb42ea7d.asc.br
    │   │   ├── jonathan.tremesaygues_at_slaanesh.org.pub.043beb42ea7d.asc.gz
    │   │   ├── jonathan.tremesaygues_at_slaanesh.org.pub.asc
    │   │   ├── jonathan.tremesaygues_at_slaanesh.org.pub.asc.br
    │   │   ├── jonathan.tremesaygues_at_slaanesh.org.pub.asc.gz
    │   │   ├── youtube_channels.csv
    │   │   ├── youtube_channels.csv.br
    │   │   ├── youtube_channels.csv.gz
    │   │   ├── youtube_channels.d4eefe1fdb68.csv
    │   │   ├── youtube_channels.d4eefe1fdb68.csv.br
    │   │   └── youtube_channels.d4eefe1fdb68.csv.gz
    │   ├── images
    │   │   ├── mailo_access_to_spaces.704ca18ad68e.jpg
    │   │   └── mailo_access_to_spaces.jpg
    │   ├── pygments
    │   │   ├── monokai.569e3254f732.css
    │   │   ├── monokai.569e3254f732.css.br
    │   │   ├── monokai.569e3254f732.css.gz
    │   │   ├── monokai.css
    │   │   ├── monokai.css.br
    │   │   └── monokai.css.gz
    │   ├── theme
    │   │   ├── cc_byncsa.44c7d2e04342.png
    │   │   ├── cc_byncsa.png
    │   │   ├── favicon-16x16.e4b7b2c44b28.png
    │   │   ├── favicon-16x16.png
    │   │   ├── favicon-32x32.57254c655e62.png
    │   │   ├── favicon-32x32.png
    │   │   ├── favicon.fac9193e2b71.ico
    │   │   ├── favicon.fac9193e2b71.ico.br
    │   │   ├── favicon.fac9193e2b71.ico.gz
    │   │   ├── favicon.ico
    │   │   ├── favicon.ico.br
    │   │   └── favicon.ico.gz
    │   └── tol
    │       ├── analyse_grammaticale_francais_vs_pros_large.daa0891c22db.jpg
    │       ├── analyse_grammaticale_francais_vs_pros_large.jpg
    │       ├── analyse_grammaticale_francais_vs_pros_small.4e91758daeea.jpg
    │       └── analyse_grammaticale_francais_vs_pros_small.jpg
    ├── manifest.json
    └── staticfiles.json

11 directories, 64 files
```

## Le contenu

Le contenu (pages et posts) est maintenant écrit en markdown. La précédente version de JSSG utilisait restructuredtext, mais je me suis rendu compte à l'usage que je détestais :D

Chaque document commence par un block de méta-data encadrés par des `---`. Il me sert notamment à renseigner le nom ou le slug de la page, et la date de publication des posts.

```markdown
---
title: Ma super page!
---

## Un titre

Bla bla bla
```

J'ai aussi accès à toute la puissance du django, ce qui permet de faire des trucs rigolos.

Les urls internes sont gérés par django. Comme ça, tous lien mort est automatiquement détecté à la génération, permettant d'avoir un semblant de cohérence du contenu au cours du temps.

```markdown
{% verbatim %}
- [Images générés par ordinateur]({% url 'page' 'cgi' %})
{% endverbatim %}
```

Génération de la liste des articles :

```markdown
{% verbatim %}
{% for post in posts %}
- [{{ post.timestamp|date:"Y-m-d" }}]({% url 'post' post.slug %}): {{ post.title }}{% endfor %}
{% endverbatim %}
```

Inclusion d'une web app :

```markdown
{% verbatim %}
{% vite 'front/main/crankshaft.ts' %}
{% static 'jss/css/crankshaft.css' %}
<div id="crankshaft-app"></div>
{% endverbatim %}
```

Pour un exemple plus complet, voila la page d’accueil :

```markdown
{% verbatim %}
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
{% endverbatim %}
```


## Les vues

```python
class PageView(TemplateView):
    template_name = "page.html"
    page_cls = Page
    slug: Optional[str] = None

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        try:
            self.slug = kwargs["slug"]
        except:
            ...
        ctx = super().get_context_data(**kwargs)
        ctx["object"] = self.page_cls.load_page_with_slug(self.slug)
        return ctx


class PostView(PageView):
    template_name = "post.html"
    page_cls = Post
```

J'aime Django, simple et efficace <3

Comme vous vous en doutez à la vue de mon site, les templates sont ultra minimalistes.

```html
{% verbatim %}
{% extends "base.html" %}

{% block "content" %}
Publié le {{ object.timestamp|date:"Y-m-d" }}.

<h1>{{ object.title }}</h1>
{{ object.content_md|safe }}
{% endblock %}
{% endverbatim %}
```

La propriété `Page.content_md` s'occupe de générer à la volée le HTML à partir du markdown, après que ce dernier soit passé par le moteur de templating.

```python
class Post:
    # snip

    @property
    def content_md(self):
        return markdown2.markdown(
            Template(self.content).render(
                Context(
                    {
                        "posts": sorted(
                            Post.load_glob(), key=lambda p: p.timestamp, reverse=True
                        )
                    }
                )
            ),
            extras=["fenced-code-blocks"],
        )

```

Le flux de syndication atom est généré par django.

```python
class PostFeedsView(Feed):
    title = "jtremesay - derniers articles"
    link = ""
    feed_type = Atom1Feed

    def items(self) -> list[Post]:
        return sorted(Post.load_glob(), key=lambda p: p.timestamp, reverse=True)[:20]

    def item_title(self, post: Post) -> str:
        return post.title

    def item_description(self, item: Post):
        return item.content_md

    def item_link(self, post: Post) -> str:
        return reverse("post", args=(post.slug,))

    def item_pubdate(self, post: Post) -> str:
        return post.timestamp
```

## Les routes

Encore une fois, rien de bien compliqué.

```python
urlpatterns = [
    path("", RedirectView.as_view(url="/pages/index.html"), name="index"),
    path("atom.xml", views.PostFeedsView(), name="atom_feed"),
    path("pages/<slug:slug>.html", views.PageView.as_view(), name="page"),
    path("posts/<slug:slug>.html", views.PostView.as_view(), name="post"),
]
```

## La génération statique

La partie "rigolote" du projet, la commande qui s'occupe de générer le HTML. Encore une fois, rien de bien compliqué.

On se contente de visiter toutes les pages du site et d'enregistrer le résultat.

```python
class Command(BaseCommand):
    def handle(self, *args, **options):
        get_page(reverse("index"), "index.html")
        get_page(reverse("atom_feed"))
        for page in Page.load_glob():
            if page.slug == "index":
                continue
            get_page(reverse("page", args=(page.slug,)))
        for post in Post.load_glob():
            get_page(reverse("post", args=(post.slug,)))
```

La récupération proprement dite, on crée une requête HTTP et on laisse la vue faire son travail :)

```python
def get_page(url: str, path: Optional[Path] = None) -> None:
    match = resolve(url)
    request = HttpRequest()
    request.META["HTTP_HOST"] = "jtremesay.org"
    request.method = "get"
    request.path = url
    request._get_scheme = lambda: "https"
    response = match.func(request, *match.args, **match.kwargs)
    if response.status_code in (301, 302):
        return get_page(response.url, path)

    assert response.status_code == 200

    try:
        response.render()
    except AttributeError:
        ...

    if path is None:
        path = settings.DIST_DIR / url[1:]
    else:
        path = settings.DIST_DIR / path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(response.content)
```

## Dockerization

On installe le bordel nécessaire, on copie le code source, on build le front, on traite les statics, on génère le site, et on génère le site. Enfin on copie le résultat dans une nouvelle image nginx.

```dockerfile
FROM python:3.12 AS site

# Update packages and install needed stuff
RUN apt-get update && apt-get dist-upgrade -y
# I hate modern way of doing things
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - &&\
    apt-get install -y nodejs
RUN pip install -U pip setuptools wheel

# Install python & node deps
WORKDIR /code
COPY requirements.txt ./
RUN pip install -Ur requirements.txt
COPY package.json package-lock.json ./
RUN npm install

# Copy source dir
COPY manage.py tsconfig.json vite.config.ts ./
COPY jssg/ jssg/
COPY content/ content/
COPY front/ front/

# Build
RUN npm run build
RUN python manage.py collectstatic --no-input
RUN python manage.py gensite

FROM nginx
COPY --from=site /code/dist/ /usr/share/nginx/html/
```

## Cloudification

Ça tourne dans un cluster docker swarm avec traefik en frontal.

```yaml
version: "3.8"
services:
  jtremesay:
    image: "killruana/jtremesay.org:main"
    ports:
      - 8003:80
    networks:
      - "traefik_public"
    labels:
      - "traefik.enable=true"
      - "traefik.http.middlewares.jtremesay-compress.compress=true"
      - "traefik.http.routers.jtremesay.entrypoints=websecure"
      - "traefik.http.routers.jtremesay.middlewares=jtremesay-compress"
      - "traefik.http.routers.jtremesay.rule=Host(`jtremesay.org`, `slaanesh.org`)"
      - "traefik.http.routers.jtremesay.service=jtremesay"
      - "traefik.http.routers.jtremesay.tls.certresolver=zerossl"
      - "traefik.http.services.jtremesay.loadbalancer.server.port=80"

networks:
  traefik_public:
    external: true
```

## CI/CD

Github Actions.

```yaml
{% verbatim %}
name: CI/CD

on:
  push:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      -
        name: Docker meta
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: |
            killruana/jtremesay.org
          tags: |
            type=schedule
            type=ref,event=branch
            type=ref,event=pr
            type=sha
      -
        name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      -
        name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: killruana
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      -
        name: Build and push
        uses: docker/build-push-action@v3
        with:
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=registry,ref=killruana/jtremesay.org:buildcache
          cache-to: type=registry,ref=killruana/jtremesay.org:buildcache,mode=max

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'

    steps:
      -
        name: Deploy
        uses: distributhor/workflow-webhook@v3
        with:
          webhook_url: ${{ secrets.WEBHOOK_URL }}
          verify_ssl: false
{% endverbatim %}
```

## Conclusion

- site static ? check
- chouette environement de dev ? check
- integration de vite/typescript ? check
- écriture du contenu en pas html ? check
- transpilation du front ? check
- gestion des static ? check
- customizable ? check
- simple ? check
- fire & forget ? check

```
$ cloc jssg/
      12 text files.
      10 unique files.
      14 files ignored.

github.com/AlDanial/cloc v 1.98  T=0.01 s (1127.0 files/s, 71340.1 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
Python                          10            125            223            285
-------------------------------------------------------------------------------
SUM:                            10            125            223            285
-------------------------------------------------------------------------------
```

C'est fou ce qu'on peut faire avec moins de 300 lignes de python !
