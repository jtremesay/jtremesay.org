# JSSG - Jtremesay's Static Site Generator

[![CI/CD](https://github.com/jtremesay/jtremesay.org/actions/workflows/main.yaml/badge.svg)](https://github.com/jtremesay/jtremesay.org/actions/workflows/main.yaml)

The thing that propulse [jtremesay.org](https://jtremesay.org).
Also host the content for the aforementioned site.

Today, it's a django app that can generate a static website.

## Bootstrap

```shell
$ git clone https://github.com/jtremesay/jtremesay.org.git
$ cd jtremesay.org
$ direnv allow
$ npm install
$ pip install -Ur requirements.txt
```

## Dev

```shell
$ npm run dev 
# (in other shell)
$ ./manage.py runserver
```

## Prod

```shell
$ npm run build
$ ./manage.py distill-local --collectstatic --force dist
```

Or, if you prefer docker

```shell
$ make docker-image
```

(`make` for building and runnnig the image)
