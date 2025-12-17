from dataclasses import dataclass


@dataclass
class Page:
    title: str
    slug: str
    content_md: str


def load_pages(module) -> list[Page]:
    pages = []
    return pages