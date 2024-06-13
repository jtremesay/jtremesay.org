from django_distill import distill_path

from jssg import views
from jssg.urls import get_pages, get_posts

urlpatterns = [
    distill_path(
        "",
        views.IndexView.as_view(template_name="jtremesay/page.html"),
        name="index",
        distill_file="index.html",
    ),
    distill_path("atom.xml", views.PostFeedsView(), name="atom_feed"),
    distill_path(
        "pages/<slug:slug>.html",
        views.PageView.as_view(template_name="jtremesay/page.html"),
        name="page",
        distill_func=get_pages,
    ),
    distill_path(
        "posts/<slug:slug>.html",
        views.PostView.as_view(template_name="jtremesay/post.html"),
        name="post",
        distill_func=get_posts,
    ),
]
