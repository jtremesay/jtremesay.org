from django.contrib import admin

from .models import PageHit


@admin.register(PageHit)
class PageHitModelAdmin(admin.ModelAdmin):
    list_display = [
        "timestamp_start",
        "duration",
        "status",
        "method",
        "app_name",
        "view_name",
        "route",
        "url",
        "remote_address",
        "version",
        "user_agent",
        "content_type",
        "dnt",
        "accepted_language",
    ]
