---
title: Doom
---
{% load static %}
{% load django_vite %}
{% vite_asset 'front/main/doom.ts' %}

<div class="doom" data-wad-url="{% static 'jtremesay/doom/doom1.wad' %}"></div>
