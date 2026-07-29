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

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Self, cast

import frontmatter

CONTENT_DIR = Path() / "content"
PAGES_DIR = CONTENT_DIR / "pages"


@dataclass
class Content:
    metadata: dict[str, Any]
    body_md: str

    @classmethod
    def from_file(cls, path: Path) -> Self:
        page = frontmatter.load(path)

        return cls(metadata=page.metadata, body_md=page.content)


@dataclass
class Page(Content):
    title: str

    @classmethod
    def from_file(cls, path: Path) -> Self:
        content = frontmatter.load(path)

        try:
            title = cast(str, content.metadata["title"])
        except KeyError:
            raise ValueError(f"Missing 'title' in metadata of {path}")

        return cls(metadata=content.metadata, body_md=content.content, title=title)


def main():
    page_path = PAGES_DIR / "index.md"
    page = Page.from_file(page_path)
    print(page)
