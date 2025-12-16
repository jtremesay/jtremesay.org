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

FROM node:current-alpine AS build
WORKDIR /code
COPY package.json package-lock.json ./
RUN npm install
COPY svelte.config.js tsconfig.json vite.config.ts ./
COPY static/ static/
COPY src/ src/
RUN npm run build

FROM nginx:mainline-alpine
COPY --from=build /code/build/ /usr/share/nginx/html/