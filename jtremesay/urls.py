from typing import Any, Iterable

from django.urls import path
from django.views.generic import TemplateView
from django_distill import distill_path

from jtremesay import views
from jtremesay.models import Page, Post


def get_pages() -> Iterable[dict[str, Any]]:
    """Get available pages."""
    return ({"slug": p.slug} for p in Page.load_glob())


def get_posts():
    """Get available posts."""
    return ({"slug": p.slug} for p in Post.load_glob())


app_name = "jtremesay"
urlpatterns = [
    distill_path(
        "", views.IndexView.as_view(), name="index", distill_file="index.html"
    ),
    distill_path("atom.xml", views.PostFeedsView(), name="atom_feed"),
    distill_path(
        "pages/<slug:slug>.html",
        views.PageView.as_view(),
        name="page",
        distill_func=get_pages,
    ),
    distill_path(
        "posts/<slug:slug>.html",
        views.PostView.as_view(),
        name="post",
        distill_func=get_posts,
    ),
]
