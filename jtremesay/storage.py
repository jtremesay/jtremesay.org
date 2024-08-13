# jtremesay.org - Website of Jonathan Tremesaygues
# Copyright (C) 2024 Jonathan Tremesaygues

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.

# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
