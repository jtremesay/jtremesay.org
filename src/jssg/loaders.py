import logging
from datetime import datetime
from pathlib import Path
from typing import Callable, TextIO

from jssg.models import Page, Post, Site
from jssg.settings import PAGES_DIR, POSTS_DIR

logger = logging.getLogger(__name__)


def parse_front_matter(f: TextIO) -> dict[str, str]:
    front_matter = {}
    
    if f.readline().strip() != "---":
        raise ValueError("Invalid front matter format: missing starting '---'")
    

    found_end = False
    for line in f:
        line = line.strip()
        if line== "---":
            found_end = True
            break

        key, value = line.split(": ", 1)
        front_matter[key] = value.strip()

    if not found_end:
        raise ValueError("Invalid front matter format: missing ending '---'")

    return front_matter



def load_page(path: Path) -> Page:
    logging.info("Loading page from %s", path)
    with path.open("r") as f:
        front_matter = parse_front_matter(f)
        content_md = f.read()

    title = front_matter["title"]
    slug = front_matter.get("slug", path.stem)

    return Page(title=title, slug=slug, content_md=content_md)



def load_post(path: Path) -> Post:
    logging.info("Loading post from %s", path)
    with path.open("r") as f:
        front_matter = parse_front_matter(f)
        content_md = f.read()
    
    title = front_matter["title"]
    slug = front_matter.get("slug", path.stem)
    date = datetime.fromisoformat(front_matter["date"])
    if (modified_str := front_matter.get("modified")) is not None:
        modified = datetime.fromisoformat(modified_str)
    else:
        modified = None

    return Post(title=title, slug=slug, date=date, modified=modified, content_md=content_md)


def load_contents(module, loader_function: Callable, directory_name: str) -> list:
    contents_dir = Path(module.__file__).parent / directory_name
    contents = []
    for content_path in contents_dir.glob("*.md"):
        contents.append(loader_function(content_path))

    return contents



def load_pages(module) -> list[Page]:
    return load_contents(module, load_page, PAGES_DIR)


def load_posts(module) -> list[Post]:
    return load_contents(module, load_post, POSTS_DIR)

def load_site(module) -> Site:
    pages = load_pages(module)
    posts = load_posts(module)
    
    return Site(pages=pages, posts=posts)