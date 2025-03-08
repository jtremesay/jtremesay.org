---
title: JSSG django app
date: 2024-11-28T20:00+02:00
---

Disclaimer: article écrit avec l'assistance de GitHub Copilot.

TL;DR: [JSSG](https://github.com/jtremesay/jssg) le générateur de site statique est maintenant disponible sous forme d'app django.


## #MyLife
Vu que ça fait plusieurs mois que je n'ai pas eu à toucher à JSSG (Jtremesay Static Site Generator) alors que dans l'interval j'ai fait plusieurs trucs rigolo sur le site, c'est un signe qu'il était plutôt stable. Je vais donc faire un point dessus.

Donc, JSSG, c'est qu'est-ce que c'est que quoi ?

C'est mon générateur de site statique à moi parce que j'ai des besoins de gros relous et que j'ai un gros syndrome de Not Invented Here.

Mes besoins de gros relous :

- le résultat est un site statique, facilement délivrable par un serveur web lambda et deployable virtuellement partout; y compris en utilisant un bon vieux ftp sur un hébergeur gratuit si il le faut !
- j'aime pas écrire du html ou me répéter, me faudra un truc qui me permette de prendre du contenu quelque soit son origine, généralement markdown. Mais qui n'aime pas exécuter un flow compliqué orchestré par make pour générer une page spécifique du site parce que l'automatisation a ses raisons que la raison ignore ? (oui, fut un temps, ce [post]({% url 'post' 'chaines-youtubes' %}) était généré automatiquement à partir d'un export OPML de mon aggrégateur RSS via des scripts et un makefile :D)
- maintenant que j'ai découvert les joies de la génération procédurale 2D/3D en typescript, j'veux pouvoir facilement intégrer du front moderne dans le site. donc faut supporter `vite` ou whatever est le truc à la mode pour compiler du typescript en js; mais pas de single page application. Le JS doit être chargé par page au besoin. 
- doit avoir une gestion des fichiers statiques (images, css, js, etc.). Par gestion, j'entends collection des statics, transformations nécessaires, et intégration dans le site généré
- gestion des liens internes et détection des liens morts: le générateur doit détecter au build time les liens cassés pointant vers des pages ou fichiers inexistants, ainsi que les medias, les scripts et autres css
- je veux organiser mon contenu comme je veux, pas comme le générateur le veut. Donc je veux pouvoir mettre mes fichiers markdown où je veux, avec la structure de répertoires que je veux, et que le générateur s'adapte à ça
- je veux que ça soit facile à utiliser en local : je tape mon contenu, je sauvegarde, je rafraîchis la page (ou pas d'ailleurs, c'est bien aussi le live reload), et pouf, je vois mes changements

JSSG a connus plusieurs itérations. Tel le [bateau de Thésée](https://fr.wikipedia.org/wiki/Bateau_de_Th%C3%A9s%C3%A9e), il a d'ailleurs était réécrit from scratch plusieurs fois.

Ce fut originellement une app flask. La partie utilisation était bien; mais j'ai pas réussi à en faire un générateur static. 

Puis ce fut un assemblage créatif de python, de jinja et de makefile. Ça faisait un contenu static comme je le voulais, mais c'était chiants à utiliser en local.

Au [taf](https://sereema.com), on utilise Django. Et après 4 ans à bosser intensivement avec, j'aime beaucoup. c'est vraiment ma plateforme préféré pour faire dev du web en local. Y'a tout ce qu'il faut : du templating, du live reload, de l'extensibilité, des outils de dev, etc. Sauf que Django c'est pas fait pour générer du contenu statique. Qu'à cela ne tienne. J'ai donc bricolé un bout de code pour collecter les .md des pages et posts, ainsi qu'une commande Django qui exécute les vues des pages et des posts avec tous les .md trouvé et enregistre le résultat dans un répertoire de sortie. Django s'occupe comme un grand des statict avec `./manage.py collectstatic`. Ainsi, on se retrouve avec toute la puissance et flexibilité de Django pour développer son site, et un site static tout simple en sortie !

En plus, grace à Django, vous pouvez faire des trucs débilement compliqué tel qu'utiliser une base de données. Wait, une base de données avec un site statique ? Non ! Une base de données utilisé pendant le dev pour générer des pages dynamiques qui seront ensuite capturés au build time :D

Donc si c'est votre truc, vous pouvez tout a fait envisager de transformer JSSG en un CMS pour usage local en profitant des possibilités du backoffice de Django et de la persistance du contenu dans une base de données. Puis utiliser cette DB pour générer la version statique de votre site.

Puis j'ai découvert [Distill](https://django-distill.com/) qui permet de générer des pages statiques à partir de vues Django. C'est sans aucun scrupule que je leur ai délégué la génération des pages statiques. J'ai donc pu me concentrer sur la partie ingestion du contenu.

Depuis, quelqu'un a manifesté son intérêt pour utiliser JSSG. Mais jusque là le code de JSSG était lié de manière trop incestueuse à celui de jtremesay.org. J'ai donc décidé de le séparer dans un repo à part. Mais c'était un peu relou d'avoir jssg aussi mêlé au contenu et devoir maintenir les deux versions, la vanilla et la mienne.

Ce qui nous mene à la version actuelle de JSSG et aussi un changement de paradigme. JSSG N'EST PAS un générateur de site statique. C'est un composant (app) Django à ajouter à votre projet pour simplifier la statification de ce dernier. Ou vu autrement, c'est une plateforme de développement web moderne permettant la création de stite statique. C'est vous qui voyez :shrug:


## Installation

JSSG est installable via pip:

```shell
$ pip install git+https://github.com/jtremesay/jssg.git
```

Maintenant, il vous faut ajouter `jssg` à votre `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    ...
    'jssg',
    ...
]
```

Vous aurez aussi besoin de définir les variables suivantes dans votre `settings.py`:

- `JSSG_RSS_LINK: str`: L'url de votre site, utilisé dans le flux RSS
- `JSSG_RSS_TITLE: str`: la description de votre site, utilisé dans le flux RSS


Mettez à jour votre `urls.py` pour déclarer les urls de JSSG:

```python
from jssg.utils import jssg_urls

urlpatterns = [
    # ...
]

# Automatically declare urls for pages, posts and rss feed
urlpatterns += jssg_urls()
```

## Fonctionnement

JSSG va chercher un dossier `content` dans les applications de votre projet. De cette manière, vous pouvez facilement organiser votre contenu comme vous le souhaitez, en plusieurs applications si cela est nécessaire pour s'adapter à votre complexité. Par exemple pour définir des sous-sites.

Dans ce dossier `content`, vous devez avoir un dossier `posts` et un dossier `pages`. Les fichiers markdown de ces dossiers seront traités pour générer les pages et les posts de votre site.

Exemple d'application utilisant JSSG :

```
yousapp/
├── apps.py
├── content
│   ├── pages
│   │   ├── doom.md
│   │   └── index.md
│   └── posts
│       ├── 20230531_helloworld.md
│       └── 20250231_DOOM.md
├── front
│   ├── doom
│   │   ├── engine.ts
│   │   ├── lumps.ts
│   │   ├── main.ts
│   │   ├── readers.ts
│   │   ├── types.ts
│   │   ├── view2d.ts
│   │   └── view3d.ts
│   ├── main
│   │   ├── doom.ts
│   │   └── mytsapp.ts
│   └── vite-env.d.ts
├── __init__.py
├── migrations
│   └── __init__.py
├── static
│   └── yousapp
│       ├── doom
│       │   └── doom1.wad
│       ├── files
│       │   └── my_file.txt
│       ├── images
│       │   └── myimage.jpg
│       ├── css
│       │   └── mycss.css
│       ├── theme
│       │   └── favicon.ico
├── storage.py
└── templates
    ├── base.html
    ├── blocks
    │   ├── footer.html
    │   └── header.html
    ├── page.html
    └── post.html
  ```



Chaque fichier markdown trouvé sera rendu accessible par Django via une vue et des routes. Ainsi, vous pouvez accéder à votre contenu en local en utilisant les urls générées par Django. JSSG génère aussi une route pour un flux RSS de votre contenu.

Si vous souhaitez gérez vous même les urls de votre contenu, vous pouvez désactiver l'autodiscovery et déclarer les routes à la main tout en profitant des vues de JSSG pour générer le contenu.

Vous pouvez même directement utiliser [Distill](https://django-distill.com/) pour déclarer les routes de vos propres vues pour générer des pages statiques à partir de celles-ci.

Le contenu des fichiers markdown est traité par le moteur de template de Django avant d'être rendu en html. Vous pouvez donc utiliser toute la puissance du [langage de template](https://docs.djangoproject.com/en/5.1/ref/templates/language/) de Django.

Vous pouvez utiliser `{% verbatim %}{% static %}{% endverbatim %}` et `{% verbatim %}{% url %}{% endverbatim %}` pour référencer vos fichiers statiques et vos urls Django dans le contenu.

## Templates

Si vous utilisez les vues de JSSG, vous devez fournir les templates `post.html` et `page.html`. Ils doivent être dans le dossier `templates` d'une de vos applications, n'importe laquelle.

Dans ces template, vous aurez accès à la variable `object` qui contiendra respectivement un objet `Post` ou `Page` selon le type de contenu à afficher.

Exemple de template `post.html`:

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

Exemple de template `page.html`:

```html
{% verbatim %}
{% extends "base.html" %}

{% block "content" %}
<h1>{{ object.title }}</h1>
{{ object.content_md|safe }}
{% endblock %}
{% endverbatim %}
```

Comme ces vos propres templates, vous êtes libres de faire absolument tous ce que vous voulez.


## Contenu

Pour l'instant, JSSG ne supporte que le markdown. Il reprend la convention "front matter" et cherche un header en entête du fichier markdown. Ce header doit être délimité par `---` et contenir des clés/valeurs au format `key: value`. Les clés supportées dépendent du type de contenue. Après le header, le contenu du fichier est traité comme du un template django contenant du markdown.

### Document

C'est une abstraction représentant un contenu et ses metadata et destiné à être utilisé pour construire une page. Aucun à priori n'est fait sur le type de contenu ou ses metadata.

Dans le contenu, vous avez accès à l'objet `posts` contenant la list des `Post` ordonnés par date de publication décroissante. Principalement utile pour générer des liens vers d'autres posts, tel que sur la page d'accueil.

```markdown
---
foo: bar
iiii: jjjj
---
blabla
```

Vous pouvez charger un document de la manière suivante:

```python
from jssg.models import Document

doc = Document.load('path/to/file.md') # relatif à n'importe quel dossier `content`
print(doc.path) # le chemin du fichier, utilisé pour générer l'url. N'a pas besoin d'être un vrai fichier existant réellement. Utile pour créer dynamiquement des pages
print(doc.metadata) # les metadata du document (le contenu du header)
print(doc.content) # le contenu du document tel que lu depuis le fichier
print(doc.content_md) # le contenu du document après traitement par le moteur de template de Django et markdown2html
```

### Page

Une page est un document (la classe `Page` hérite de `Document`) qui représente une page du site. Si l'autodiscovery est activé, JSSG cherche les fichiers markdown dans le dossier `content/pages` de chaque application de votre projet.

Header:

- `title: str`: le titre de la page, obligatoire
- `slug: str`: le slug de la page, utilisé pour générer l'url. Déterminé automatiquement si non fourni

Chaque page est accessible via la route `/pages/<slug>.html` nommée `page`

Exemple de page :

```markdown
{% verbatim %}
---
title: Hello, world!
slug: hello
---
A [link  to a page]({% url 'page' 'other-page' }).

List of posts: 

{% for post in posts %}
- [{{ post.title }}]({% url 'post' post.slug %})
{% endfor %}

An image:
![A cat]({% static 'yourapp/images/cat.jpg' %})

A js app:
<div id="myjsapp"></div>
<script src="{% static 'yourapp/js/myjsapp.js' %}"></script>

A table generated from a csv:
{% csv_table 'yourapp/files/data.csv' %}

{% endverbatim %}
```

Exemple d'objet `Page`:

```python
from jssg.models import Page
from django.urls import reverse

page = Page.load('path/to/file.md') # relatif à n'importe quel dossier `content/pages`
print(page.title) # "Hello, world!"
print(page.slug) # "hello"
print(page.content_md) # ...
print(reverse('page', args=[page.slug])) # "/pages/path/to/hello.html"
```

### Post

Un post est une page (la classe `Post` hérite de `Page`) qui représente un article du site. Un flux RSS est généré automatiquement pour les posts. Si l'autodiscovery est activé, JSSG cherche les fichiers markdown dans le dossier `content/posts` de chaque application de votre projet.

Header :

- `title: str`: le titre du post, obligatoire
- `date: str`: la date de publication, obligatoire. Format ISO 8601
- `slug: str`: le slug du post, utilisé pour générer l'url. Déterminé automatiquement si non fourni

Chaque post est accessible via la route `/posts/<slug>.html` nommée `post`

Exemple de post :

```markdown
{% verbatim %}
---
title: Hello, world
date: 2023-05-31T20:00+02:00
---
bla bla bla
{% endverbatim %}
```

Exemple d'objet `Post`:

```python
from jssg.models import Post
from django.urls import reverse

post = Post.load('path/to/file.md') # relatif à n'importe quel dossier `content/posts`
print(page.title) # "Hello, world!"
print(page.slug) # "hello-world"
print(page.content_md) # ...
print(reverse('page', args=[page.slug])) # "/posts/path/to/hello-world.html"
```

## Vues

JSSG fournit des vues pour afficher les pages et les posts. Vous pouvez les utiliser telles quelles ou les étendre pour ajouter des fonctionnalités.

## Fichiers statiques

C'est du django standard. Vous mettez vos fichiers statiques dans un dossier `static` à la racine de vos applications et vous les référencez dans vos templates avec `{% verbatim %}{% static %}{% endverbatim %}`.

## Liens internes

Comme JSSG permet d'utiliser le système d'url de Django, y compris dans le contenu, il est facile de faire des liens internes. JSSG détecte les liens cassés au build time et vous prévient si un lien pointe vers un fichier ou une page qui n'existe pas.

## Génaration du site statique

Pour générer le site statique, vous pouvez utiliser la commande `distill-local` fournie par distill. Elle va collecter les fichiers statiques et générer les pages statiques dans un dossier de sortie. Vous pouvez ensuite servir ce dossier avec n'importe quel serveur web.

```shell
$ ./manage.py distill-local --collectstatic dist
```

## Extra: typescript

Ce n'est pas intégré à JSSG, mais grace à [django-vite](https://pypi.org/project/django-vite/), il est très facile d'intégrer typescript dans votre projet. 

Pour cela, vous devez installer `django-vite`:

```shell
$ pip install django-vite
```

Puis ajouter `vite` à votre `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    ...
    'django_vite',
    'jssg',
    ...
]
```

Puis définir la variable `DJANGO_VITE` dans votre `settings.py`:

```python
DJANGO_VITE = {"default": {"dev_mode": DEBUG}}
```

Vous pouvez utilisez ce `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import { globSync } from 'glob'

export default defineConfig({
    base: "/static/",
    build: {
        manifest: "manifest.json",
        outDir: "./static",
        rollupOptions: {
            input: globSync('*/front/main/*.ts'),
        }
    }
})
```

À partir de là, `vite` va traiter chaque fichier `.ts` dans les dossiers `front/main` de vos applications et les compiler en `.js` dans le dossier `static` de votre projet. De cette manière, vous pouvez profiter du dev web moderne (imports, gestion des dépendances par pinage, vérification du code par typescript, transpilation vers du vieux js pour supporter un max de navigateur…) sans avoir à subir la bullshiterie du SPA et intégrer mes js à l'ancienne page par page comme le gros boomer que je suis.

Ex pour charger votre app typescript top moumoute dans une page:

```markdown
{% verbatim %}
---
title: Hello, typescript!
slug: hello-ts
---
{% load django_vite %}

{% vite_asset 'yourapp/front/main/mytsapp.ts' %}
<div id="app"></div>
{% endverbatim %}
```

Un petit coup de `npm run dev` && `./manage.py runserver`, un petit tour sur `http://localhost:8000/pages/hello-ts.html` et tadam; Vous pouvez faire vos délire front les plus créatifs, dans du markdown, servi par django, et destiné à finir dans un site statique. C'est pas beau ça ? #kamoulox


Et pour le site final ? 

```shell
$ npm run build
$ ./manage.py distill-local --collectstatic dist
```

Simple et efficace.

## Extra: Docker

```Dockerfile
FROM node:current-alpine AS front
WORKDIR /code
COPY package.json package-lock.json ./
RUN npm install
COPY tsconfig.json vite.config.ts ./
COPY myapp/front/ myapp/front/
RUN npm run build

FROM python:3-slim AS site
WORKDIR /code
COPY requirements.txt ./
RUN pip install -Ur requirements.txt
COPY manage.py ./
COPY proj/ proj/
COPY myapp/ myapp/
COPY --from=front /code/static/ static/
RUN ./manage.py distill-local --collectstatic --force dist

FROM nginx:mainline-alpine
COPY --from=site /code/dist/ /usr/share/nginx/html/
```

```shell
$ docker build -t mysite .
$ docker run -p 8080:80 mysite
```

## Extra: Docker-compose pour déployement avec docker swarm + traefik

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
      - "traefik.http.routers.jtremesay.rule=Host(`jtremesay.org`) || Host(`slaanesh.org`)"
      - "traefik.http.routers.jtremesay.service=jtremesay"
      - "traefik.http.routers.jtremesay.tls.certresolver=leresolver"
      - "traefik.http.services.jtremesay.loadbalancer.server.port=80"

networks:
  traefik_public:
    external: true
```

Je vends le script de CI/CD Github Actions et le docker-compose de traefik pour une giraffe de bière.

## Évolutions futures

- le rendre plus configurable et flexible. Il est actuellemnent très lié à mes besoins et mon organisation de contenu
- intégrer le contenu avec l'orm django (aka faire hérieter `Document` de `models.Model`) pour donner la possibilité JSSG en tant que CMS plus traditionnel. Y'a plein d'endroit où ça serait cool de pouvoir utiliser un queryset pour lister des pages ou charger un post
- fournir un nouveau type de [db backend](https://docs.djangoproject.com/en/5.1/ref/databases/#subclassing-the-built-in-database-backends) pour django qui permettrait de rendre directement accessible à l'orm les trucs dans le dossier `content` pour une utilisation plus traditionnelle de django sans avoir à charger les posts dans une db. Vous pouvez utiliser l'ORM de Django ET avoir un contenu toujours à jour parce que directement lu depuis le disque :D. `Post.objects.filter(title__icontains="hello")` directement mappé sur `Path("content/posts").rglob("*.md")` :D `post.save()` ? Paf ! `content/posts/bla.md` est crée !
- intégrer django-vite directement dans JSSG ? C'est quand meme un truc un peu relou qui a plus de sens à être appliqué sur le projet qui utilise jssg

## Conclusion

Pour *mon* usage, JSSG fait le taf. Comme dit en intro, j'ai pas eu à y toucher depuis plusieurs mois. malgré les ajouts de conneries sur le site. Et ce fut un régal de faire ces conneries ([text 2 particules !]({% url 'page' 'textnodes' %}) ! [Doom]({% url 'page' 'doom' %}) ! [Crankshaft]({% url 'page' 'crankshaft' %}) !)

Ça vous permet de transformer simplement votre projet Django tout moderne, complexe et hackable en bon vieux site statique ennuyeux qui juste marche. Et c'est disponible sous licence GNU AGPL dans toutes les bonnes cremeries libristes. Que demander de plus ?