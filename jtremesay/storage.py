import re

from django.contrib.staticfiles.storage import (
    HashedFilesMixin,
    ManifestStaticFilesStorage,
)


class ViteManifestStaticFilesStorage(ManifestStaticFilesStorage):
    vite_hash_pattern = re.compile(r"^.+[\.-][0-9a-zA-Z_-]{8,12}\..+$")

    def url(self, name, force=False):
        # if the file already has a hash, we don't need the django hashed file
        if self.vite_hash_pattern.match(name):
            return super(HashedFilesMixin, self).url(name)

        return super().url(name, force)
