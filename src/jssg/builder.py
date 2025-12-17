import logging
from pathlib import Path

from jssg.models import Page, Post, Site

logger = logging.getLogger(__name__)

def build_page(page: Page, site: Site, dist_dir: Path) -> None:
    logger.info("Building page: %s", page.title)
    dist_dir.mkdir(parents=True, exist_ok=True)
    with open(dist_dir / f"{page.slug}.html", "w") as f:
        pass

def build_post(post: Post, site: Site, dist_dir: Path) -> None:
    logger.info("Building post: %s", post.title)
    dist_dir.mkdir(parents=True, exist_ok=True)
    with open(dist_dir / f"{post.slug}.html", "w") as f:
        pass

def build_atom_feed(site: Site, dist_dir: Path) -> None:
    logger.info("Building Atom feed")
    dist_dir.mkdir(parents=True, exist_ok=True)
    with open(dist_dir / "atom.xml", "w") as f:
        pass

def build_pages(site: Site, dist_dir: Path) -> None:
    for page in site.pages:
        build_page(page, site, dist_dir)

def build_posts(site: Site, dist_dir: Path) -> None:
    dist_dir = dist_dir / "posts"

    for post in site.posts:
        build_post(post, site, dist_dir)

def build_site(site: Site, dist_dir: Path) -> None:

    build_pages(site, dist_dir)
    build_posts(site, dist_dir)
    build_atom_feed(site, dist_dir)