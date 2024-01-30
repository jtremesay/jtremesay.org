# JSSG - Jtremesay's Static Site Generator
# Copyright (C) 2024 Jonathan Tremesaygues
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
from csv import reader as csv_reader
from io import StringIO
from pathlib import Path

from django import template
from django.contrib.staticfiles.storage import staticfiles_storage

register = template.Library()


@register.simple_tag
def csv_table(csv_file: str) -> str:
    """Generate a markdown table from a csv-file.

    First row is used as header.

    :param csv_file: path to a csv file stored in static files
    :return: the markdown table
    """
    with Path(staticfiles_storage.path(csv_file)).open() as f:
        r = csv_reader(f)
        builder = StringIO()
        builder.write("\n")
        headers = next(r)
        builder.write("|")
        for h in headers:
            builder.write(h)
            builder.write("|")
        builder.write("\n")
        builder.write("|")
        for h in headers:
            builder.write("---|")
        builder.write("\n")

        for row in r:
            builder.write("|")
            for cell in row:
                builder.write(cell)
                builder.write("|")
            builder.write("\n")

        return builder.getvalue()
