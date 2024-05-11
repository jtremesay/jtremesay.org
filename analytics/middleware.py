from django.conf import settings
from django.utils import timezone

from .models import PageHit


class RequestLoggerMiddleware:
    def __init__(self, get_response) -> None:
        self.get_response = get_response

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        start = timezone.now()
        response = self.get_response(request)
        end = timezone.now()
        duration = end - start

        # Legitimate interest data
        dnt = request.headers.get("Dnt", "0") == "1"
        page_hit = PageHit(
            timestamp_start=start,
            timestamp_end=end,
            duration=duration.total_seconds(),
            remote_address=request.META.get("REMOTE_ADDR"),
            version=request.scope.get("http_version", ""),
            method=request.method,
            url=request.path,
            user_agent=request.headers.get("User-Agent", ""),
            accepted_types=request.headers.get("Accept", ""),
            accepted_language=request.headers.get("Accept-Language", ""),
            accepted_encoding=request.headers.get("Accept-Encoding", ""),
            status=response.status_code,
            content_type=response.headers.get("Content-Type"),
            dnt=dnt,
        )
        if request.resolver_match is not None:
            page_hit.app_name = request.resolver_match.app_names[0]
            if not page_hit.app_name in settings.ANALYTICS_MONITORED_APPS:
                return response

            page_hit.view_name = request.resolver_match.url_name
            page_hit.route = request.resolver_match.route

        # Tracking Data
        if not dnt:
            ...

        page_hit.save()

        # Code to be executed for each request/response after
        # the view is called.

        return response
