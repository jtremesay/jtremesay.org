---
title: Django + VueJS - MultiPage Application
date: 2023-06-14T20:00+02:00
---

## Préambule

Parce que j'ai passé beaucoup trop de temps à faire tomber ça en marche, je partage ici le résultat de mes expérimentations.

Contexte: j'ai fait un peu de dev front au début des années 2010. À l'époque, c'était simple. Jquery, quelques fichiers javascript inclus dans la page, et roulez jeunesse.

```shell
$ tree oldschool/
oldschool/
├── js
│   ├── common.js
│   ├── index.js
│   ├── jquery.js
│   └── ma_page.js
├── index.html
└── ma_page.html

$ cat oldschool/ma_page.html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Mon Site | Ma Page</title>
    <script src="/js/jquery.js"></script>
    <script src="/js/common.js"></script>
    <script src="/js/ma_page.js"></script>
</head>

<body>

</body>

</html>
```

Ça fini immanquablement par devenir du code spaghetti, mais le coût d'entrée est pour ainsi dire nul. C'est à la portée du premier crétin venu. Cf moi.

## La problématique

Nous voila en 2023. Au cours de cette décennie écoulée, j'ai fait assez peu de dev web, et je n'ai pas DU TOUT suivi les évolutions du domaine. Au taf, on a une webapp django dont le frontend est géré à l'ancienne : HTML généré par les templates Django et Vanilla JS inclut à l'ancienne.

Ça commence à devenir assez gros et bordélique. Je voudrais faire du ménage dans tout ça, et moderniser. Au moins ajouter TypeScript pour profiter du typage statique et de la compilation pour détecter et corriger aux plus tôt les petites erreurs d'inattention à la con et de profiter de l'intelligence de l'IDE. NPM serait aussi un plus pour simplifier les mises à jours de nos dépendances. Puis peut-être expérimenter avec des framework UI tel que vuejs pour voir si ça peut nous simplifier la vie pour certain éléments de l'interface.

Bref, le cahier des charges est simple : transitionner vers du front moderne, tout en continuant à le gérer à l'ancienne, et intégration avec l'existant parce qu'on ne va pas tout remplacer.

Ben il s'avère que l'écosystème moderne n'est ABSOLUMENT pas pensé pour être utilisé comme ça.

Non, maintenant le front est censé être pensé comme une application à part entière et indépendante du backend et causer avec ce dernier via une api REST.

Sauf que cette manière de faire arrange pas du tout quand il faut intégrer avec l'existant. Surtout quand tu veux juste quelque composants par ci par là et pas une application complète.

Après beaucoup trop de prises de tête, de crises de nerfs, d'expérimetations, et d'épluchage de documentations, j'ai fini par faire fonctionner vuejs+typescript et django pour que ça marche à l'ancienne.

La solution est d'utiliser vitejs en mode MultiPage Application, de découvrir dynamiquement vos différents points d'entrées, et demander à Django de servir en tant que static le dossier contenant le résultat de la compilation.

## Le front

Intéressons nous tout d'abord à la partie front.

```shell
$ tree djangovuejs
djangovuejs
├── front
│   ├── main
│   │   ├── index.ts
│   │   └── ma_page.ts
│   └── src
│       ├── common.ts
│       ├── Index.vue
│       └── MaPage.vue
├── package.json
├── tsconfig.json
└── vite.config.ts

$ cat djangovuejs/package.json
{
    "name": "djangovuejs",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite build --watch -m dev",
        "build": "tsc && vite build"
    },
    "dependencies": {
    },
    "devDependencies": {
        "@vitejs/plugin-vue": "^4.1.0",
        "typescript": "^5.0.2",
        "vite": "^4.3.9",
        "glob": "^10.2.6"
    }
}

$ djangovuejs/tsconfig.json
{
    "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "module": "ESNext",
        "lib": [
        "ES2020",
        "DOM",
        "DOM.Iterable"
        ],
        "skipLibCheck": true,
        /* Bundler mode */
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "preserve",
        /* Linting */
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true
    },
    "include": [
        "front/**/*.ts",
        "front/**/*.d.ts",
        "front/**/*.vue"
    ],
}

$ cat djangovuejs/vite.config.ts
import { globSync } from 'glob'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
import { globSync } from 'glob'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        rollupOptions: {
        input: globSync("front/main/**/*.ts"),
        output: {
            dir: "out/front/",
            entryFileNames: "[name].js",
            assetFileNames: "assets/[name].[ext]",
            chunkFileNames: "chunks/[name].js",
        }
        }
    }
})

$ cat front/main/ma_page.ts
import { createApp } from 'vue'
import App from '../src/MaPage.vue'

createApp(App).mount('#app')
```

Le dossier `front/main/` contient nos différents point d'entrées qui seront découverts dynamiquement par vitejs. `front/src/` contient le reste du code relatif au front.

Pour plus de détail, la doc est votre amie :

- https://vitejs.dev/config/
- https://rollupjs.org/configuration-options/
- https://vuejs.org/guide/introduction.html
- https://www.typescriptlang.org/docs/

Nous pouvons maintenant installer les dépendances et compiler le différents points d'entrées :

```shell

$ cd djangovuejs/

$ npm install

added 67 packages, and audited 68 packages in 853ms

15 packages are looking for funding
run `npm fund` for details

found 0 vulnerabilities

$ npm run build

> djangovuejs@0.0.0 build
> vite build

vite v4.3.9 building for production...
✓ 14 modules transformed.
out/front/assets/ma_page.css                    0.04 kB │ gzip:  0.06 kB
out/front/assets/index.css                      0.04 kB │ gzip:  0.06 kB
out/front/index.js                              0.33 kB │ gzip:  0.26 kB
out/front/ma_page.js                            0.34 kB │ gzip:  0.27 kB
out/front/chunks/_plugin-vue_export-helper.js  49.54 kB │ gzip: 20.01 kB
✓ built in 684ms

$ tree out/
out/
└── front
    ├── assets
    │   ├── index.css
    │   └── ma_page.css
    ├── chunks
    │   └── _plugin-vue_export-helper.js
    ├── index.js
    └── ma_page.js

4 directories, 5 files
```

Le sous dossier `chunks` contient les morceaux de codes qui sont communs à vos points d'entrées afin de minimiser la quantité de javascript téléchargée par le client. Le sous dossier `assets` contient les css générés à partir des composants vuejs et les assets (images et cie) référencés dans ces derniers.

Vous pouvez aussi compiler le code à la demande quand vous éditer un fichier avec la commande suivante :

```shell
$  npm run dev

> djangovuejs@0.0.0 dev
> vite build --watch -m dev

vite v4.3.9 building for dev...

watching for file changes...
```

## Django

Les modifications à appliquer à Django sont minimales. Il vous suffit d'abord de définir la variable `STATICFILES_DIRS` de votre `proj/settings.py` :

```python
STATICFILES_DIRS = [
    # ...
    ("front", BASE_DIR / "out" / "front"),
]
```

Vous pouvez maintenant importer le javascript dans votre template :

```html
{% verbatim %}
{% load static %}
{% extends "myapp/base.html" %}

{% block content %}
    <script src="{% static 'front/ma_page.js' %}" type="module"></script>
    <link rel="stylesheet" type="text/css" href="{% static 'front/assets/ma_page.css' %}" />

    <div id="ma_page" data-api-url="{% url 'app:api.json' %}"></div>
{% endblock %}
{% endverbatim %}
```

## Conclusion

Le dev web s'est quand même sacrément complexifié aux cours des 10 dernières années :-/

```shell
$ tree oldschool
oldschool
├── js
│   ├── common.js
│   ├── index.js
│   ├── jquery.js
│   └── ma_page.js
├── index.html
└── ma_page.html

2 directories, 6 files
```

```shell
$ djangovuejs
├── front
│   ├── main
│   │   ├── index.ts
│   │   └── ma_page.ts
│   └── src
│       ├── common.ts
│       ├── Index.vue
│       └── MaPage.vue
├── manage.py
├── myapp
│   ├── admin.py
│   ├── apps.py
│   ├── __init__.py
│   ├── migrations
│   │   └── __init__.py
│   ├── models.py
│   ├── templates
│   │   └── myapp
│   │       ├── base.html
│   │       ├── index.html
│   │       └── ma_page.html
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── package.json
├── package-lock.json
├── proj
│   ├── asgi.py
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── requirements.txt
├── tsconfig.json
└── vite.config.ts

9 directories, 27 files
```
