# jssg - jtremesay's static site generator
# Copyright (C) 2026 Jonathan Tremesaygues
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
from pathlib import Path
from typing import Self, cast

import frontmatter
from django.conf import settings
from django.db import models


class PageManager(models.Manager):
    def update_or_create_from_file(self, path: Path) -> tuple[Page, bool]:
        page = self.model.from_file(path)
        return self.model.objects.update_or_create(
            url=page.url,
            defaults={
                "title": page.title,
                "body_md": page.body_md,
            },
        )

    def delete_from_file(self, path: Path) -> None:
        url = self.model.url_from_path(path)
        self.model.objects.filter(url=url).delete()


class Page(models.Model):
    objects = PageManager()
    url = models.URLField(unique=True)
    title = models.CharField(max_length=255)
    body_md = models.TextField()

    def __str__(self) -> str:
        return self.url

    @classmethod
    def url_from_path(cls, path: Path) -> str:
        try:
            rel_path = path.relative_to(settings.JSSG_PAGES_DIR)
        except ValueError:
            raise ValueError(f"Path {path} is not under '{settings.JSSG_PAGES_DIR}'")

        return str(rel_path.with_suffix(".html"))

    @classmethod
    def from_file(cls, path: Path) -> Self:
        content = frontmatter.load(path)

        try:
            title = cast(str, content.metadata["title"])
        except KeyError:
            raise ValueError(f"Missing 'title' in metadata of {path}")

        url = cls.url_from_path(path)

        return cls(url=url, title=title, body_md=content.content)
