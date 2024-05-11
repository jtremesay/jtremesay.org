from django.urls import path
from django.views.generic import TemplateView

app_name = "jtremesay"
urlpatterns = [
    path("", TemplateView.as_view(template_name="jtremesay/index.html"), name="index"),
    path(
        "js_sandbox",
        TemplateView.as_view(template_name="jtremesay/js_sandbox.html"),
        name="js_sandbox",
    ),
]
