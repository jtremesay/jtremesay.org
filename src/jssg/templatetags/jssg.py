# jssg - jtremesay's static site generator
# Copyright (C) 2026 Jonathan Tremesaygues
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
from django import template
from django.contrib.staticfiles import finders
from django.template.defaultfilters import stringfilter
from django.templatetags.static import static
from django.urls import reverse

from jssg.models import Page

register = template.Library()


@register.simple_tag
@stringfilter
def page_url(url: str) -> str:
    """
    Returns the URL of a page given its title.
    """
    # Check if the page exists
    try:
        page = Page.objects.get(url=url)
    except Page.DoesNotExist:
        raise ValueError(f"Page with url '{url}' does not exist.")

    # Could probably just use the input url
    return reverse("page", args=[page.url])


@register.simple_tag
@stringfilter
def static_url(path: str) -> str:
    """
    Returns the URL of a static file given its path.
    """
    if not finders.find(path):
        raise ValueError(f"Static file '{path}' does not exist.")

    url = static(path)

    return url


@register.filter
@stringfilter
def content(value: str) -> str:
    """
    Renders a string as a Django template.
    """
    t = template.Template(value)
    c = template.Context()
    return t.render(c)
