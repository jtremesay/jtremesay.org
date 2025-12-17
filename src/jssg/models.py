from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Page:
    title: str
    slug: str
    content_md: str

@dataclass
class Post(Page):
    date: datetime
    modified: Optional[datetime] = None


@dataclass
class Site:
    pages: list[Page]
    posts: list[Post]