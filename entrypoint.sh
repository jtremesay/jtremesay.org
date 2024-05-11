#!/bin/sh
set -e

python3 manage.py migrate

exec $@