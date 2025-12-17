import logging
from pathlib import Path

from jssg.models import Page
from jssg.settings import PAGES_DIR

logger = logging.getLogger(__name__)


def load_page(path: Path) -> Page:
    logging.info("Loading page from %s", path)
    with path.open("r") as f:
        line = f.readline()
        if line.strip() != "---":
            raise ValueError("Invalid page format: missing front matter")
        
        title = None
        slug = None
        found_front_matter_end = False
        for line in f:
            if line.strip() == "---":
                found_front_matter_end = True
                break
            key, value = line.split(": ", 1)
            match key:
                case "title":
                    title = value.strip()
                case "slug":
                    slug = value.strip()
                case _:
                    logger.warning("Unknown front matter key: %s", key)

        if not found_front_matter_end:
            raise ValueError("Invalid page format: missing closing front matter")
        
        if title is None:
            raise ValueError("Missing title in front matter")
        
        if slug is None:
            slug = path.stem

        content_md = f.read()

    return Page(title=title, slug=slug, content_md=content_md)

def load_pages(module) -> list[Page]:
    pages_dir = Path(module.__file__).parent / PAGES_DIR
    pages = []
    for page_path in pages_dir.glob("*.md"):
        pages.append(load_page(page_path))

    return pages