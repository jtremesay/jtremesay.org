import logging
from pathlib import Path

from jinja2 import Environment

from jssg.models import Page, Post, Site

logger = logging.getLogger(__name__)


def build_page(page: Page, site: Site, dist_dir: Path, env: Environment) -> None:
    logger.info("Building page: %s", page.title)

    tpl = env.get_template("page.html")
    r = tpl.render(object=page, site=site)

    dist_dir.mkdir(parents=True, exist_ok=True)
    with open(dist_dir / f"{page.slug}.html", "w") as f:
        f.write(r)


def build_post(post: Post, site: Site, dist_dir: Path, env: Environment) -> None:
    logger.info("Building post: %s", post.title)
    dist_dir.mkdir(parents=True, exist_ok=True)
    with open(dist_dir / f"{post.slug}.html", "w") as f:
        pass


def build_atom_feed(site: Site, dist_dir: Path, env: Environment) -> None:
    logger.info("Building Atom feed")
    dist_dir.mkdir(parents=True, exist_ok=True)
    with open(dist_dir / "atom.xml", "w") as f:
        pass


def build_pages(site: Site, dist_dir: Path, env: Environment) -> None:
    for page in site.pages:
        build_page(page, site, dist_dir, env)


def build_posts(site: Site, dist_dir: Path, env: Environment) -> None:
    dist_dir = dist_dir / "posts"

    for post in site.posts:
        build_post(post, site, dist_dir, env)


def build_site(site: Site, dist_dir: Path, env: Environment) -> None:
    build_pages(site, dist_dir, env)
    build_posts(site, dist_dir, env)
    build_atom_feed(site, dist_dir, env)
