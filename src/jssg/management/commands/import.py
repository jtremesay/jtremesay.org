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
