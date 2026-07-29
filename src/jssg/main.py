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
