import logging

from jssg.models import Page, Post, Site

logger = logging.getLogger(__name__)

def build_page(page: Page, site: Site) -> None:
    logger.info("Building page: %s", page.title)
    pass

def build_post(post: Post, site: Site) -> None:
    logger.info("Building post: %s", post.title)
    pass

def build_atom_feed(site: Site) -> None:
    logger.info("Building Atom feed")
    pass

def build_pages(site: Site) -> None:
    for page in site.pages:
        build_page(page, site)

def build_posts(site: Site) -> None:
    for post in site.posts:
        build_post(post, site)

def build_site(site: Site) -> None:
    build_pages(site)
    build_posts(site)
    build_atom_feed(site)