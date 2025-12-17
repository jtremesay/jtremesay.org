import re

RE_SLUGIFY = re.compile(r"[^\w\s-]")

def slugify(text: str) -> str:
    """Convert a string to a URL-friendly slug."""
    text = text.lower()
    text = RE_SLUGIFY.sub("", text)
    text = re.sub(r"[\s_-]+", "-", text)
    text = text.strip("-")
    
    return text