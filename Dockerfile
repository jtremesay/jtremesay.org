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
FROM ubuntu:noble

# Update packages and install needed stuff
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3-pip python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Create venv (make pip install happy)
ENV VIRTUAL_ENV=/opt/jtremesay_venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

WORKDIR /opt/jtremesay

# Install python deps
COPY requirements.txt ./
RUN pip install -Ur requirements.txt

# Copy source dir
COPY manage.py entrypoint.sh ./
COPY proj/ proj/
COPY jtremesay/ jtremesay/

# Build
RUN DJANGO_SECRET_KEY=django-secure-build ./manage.py collectstatic --noinput
RUN python -m compileall jtremesay proj

# Expose port
EXPOSE 8000

ENTRYPOINT [ "/opt/jtremesay/entrypoint.sh" ]

CMD [ "daphne", "--bind", "0.0.0.0", "proj.asgi:application" ]