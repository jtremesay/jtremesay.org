# jssg - jtremesay's static site generator
# Copyright (C) 2026 Jonathan Tremesaygues
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
from argparse import ArgumentParser

from django.conf import settings
from django.core.management.base import BaseCommand
from tqdm import tqdm

from jssg.models import Page


class Command(BaseCommand):
    help = "Import the website content into the database."

    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "-c",
            "--clear",
            action="store_true",
            help="Clear the database before importing.",
        )

    def handle(self, *args, clear: bool = False, update: bool = False, **options):
        if clear:
            self.stdout.write("Clearing the database...")
            c = Page.objects.all().delete()
            self.stdout.write(f"Deleted {c[0]} pages.")

        tqdm.write(f"Importing website at {settings.JSSG_WEBSITE_DIR}")

        # `sorted` force cast to list that provide len for tqdm progress bar
        # and also it's nice to have a deterministic order for the import.
        for page_entry in tqdm(sorted(settings.JSSG_PAGES_DIR.glob("**.md"))):
            tqdm.write(f"Importing {page_entry}")
            Page.objects.update_or_create_from_file(page_entry)
