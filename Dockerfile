FROM alpine:latest AS jssg
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
ENV UV_NO_DEV=1
WORKDIR /code
COPY .python-version ./
RUN uv python install && uv venv
COPY pyproject.toml uv.lock ./
RUN uv sync --no-install-project
ENV UV_FROZEN=1
COPY README.md ./
COPY src/jssg src/jssg ./src/jssg

FROM jssg AS build
COPY src/jtremesay src/jtremesay
RUN uv sync
RUN uv run jssg build

FROM nginx:alpine AS final
COPY --from=build /code/dist/ /usr/share/nginx/html/