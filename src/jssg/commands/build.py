from argparse import ArgumentParser, Namespace
from pathlib import Path
from shutil import rmtree

from jssg.command import BaseCommand
from jssg.settings import DIST_DIR


class Command(BaseCommand):
    def add_arguments(self, parser: ArgumentParser) -> None:
        pass

    def handle(self, args: Namespace) -> None:
        dist_dir = Path(DIST_DIR)
        rmtree(dist_dir, ignore_errors=True)
        dist_dir.mkdir(parents=True, exist_ok=True)