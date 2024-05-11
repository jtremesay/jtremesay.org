from uuid import uuid4

from django.db import models


# Create your models here.
class PageHit(models.Model):
    uuid = models.UUIDField(default=uuid4, primary_key=True)
    timestamp_start = models.DateTimeField()
    timestamp_end = models.DateTimeField()
    duration = models.FloatField()
    # Request
    remote_address = models.GenericIPAddressField()
    version = models.CharField(max_length=32)
    method = models.CharField(max_length=32)
    url = models.URLField(max_length=1024)
    app_name = models.CharField(max_length=32)
    view_name = models.CharField(max_length=128)
    route = models.URLField()
    user_agent = models.TextField()
    accepted_types = models.TextField()
    accepted_language = models.TextField()
    accepted_encoding = models.TextField()
    # Response
    status = models.PositiveIntegerField(default=200)
    content_type = models.TextField()

    dnt = models.BooleanField(default=False)  # Ironic I guess

    # Tracking data
    # MUST NOT BE set if DNT is enabled
