# JSSG - Jtremesay's Static Site Generator
# Copyright (C) 2024 Jonathan Tremesaygues
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along with
# this program. If not, see <https://www.gnu.org/licenses/>.

from typing import Any

from django.contrib.syndication.views import Feed
from django.db.models.base import Model as Model
from django.db.models.query import QuerySet
from django.urls import reverse
from django.utils.feedgenerator import Atom1Feed
from django.views.generic import DetailView

from jssg.models import Page, Post


class PostFeedsView(Feed):
    title = "MY WEBSITE - last articles"
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


class PageView(DetailView):
    model = Page
    template_name = "page.html"

    def get_object(self, queryset: QuerySet[Any] | None = None) -> Model:
        return self.model.load_page_with_slug(self.kwargs["slug"])


class IndexView(PageView):
    model = Page
    template_name = "page.html"

    def get_object(self, queryset: QuerySet[Any] | None = None) -> Model:
        self.kwargs["slug"] = "index"
        return super().get_object(queryset)


class PostView(PageView):
    model = Post
    template_name = "post.html"
