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
    timestamp: datetime
    modified: Optional[datetime] = None


@dataclass
class Site:
    base_url: str
    pages: list[Page]
    posts: list[Post]