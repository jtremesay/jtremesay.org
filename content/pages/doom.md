---
title: Doom
---
{% load static %}
{% load vite %}
{% vite 'front/main/doom.ts' %}

<div class="app" data-wad-url="{% static 'doom/doom1.wad' %}"></div>
