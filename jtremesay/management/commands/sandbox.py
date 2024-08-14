from typing import Any

from django.apps import apps
from django.core.management.base import BaseCommand

from jssg.models import Post


class Command(BaseCommand):
    def handle(self, *args: Any, **options: Any) -> str | None:
        posts = Post.load_posts_from_apps()
        for post in posts:
            print(post.slug)
