# JSSG - Jtremesay's Static Site Generator
# Copyright (C) 2023 Jonathan Tremesaygues
#
# Dockerfile
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along with
# this program. If not, see <https://www.gnu.org/licenses/>.
FROM ubuntu:noble AS site

# Update packages and install needed stuff
RUN apt-get update \
    && apt-get install -y --no-install-recommends npm python3-pip python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /code

# Create venv
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install python & node deps
COPY requirements.txt package.json package-lock.json ./
RUN pip install -Ur requirements.txt \
    && npm install

# Copy source dir
COPY manage.py tsconfig.json vite.config.ts ./
COPY jssg/ jssg/
COPY content/ content/
COPY front/ front/

# Build
RUN npm run build \
    && ./manage.py distill-local --collectstatic --force dist

FROM nginx:mainline-alpine
COPY --from=site /code/dist/ /usr/share/nginx/html/
