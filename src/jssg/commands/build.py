from argparse import ArgumentParser, Namespace
from importlib import import_module
from pathlib import Path
from shutil import rmtree

from jssg.command import BaseCommand
from jssg.loaders import load_site
from jssg.settings import DIST_DIR


class Command(BaseCommand):
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("-m", "--module", type=str, default="jtremesay", help="Specify the module to build")

    def handle(self, args: Namespace) -> None:
        dist_dir = Path(DIST_DIR)
        rmtree(dist_dir, ignore_errors=True)
        dist_dir.mkdir(parents=True, exist_ok=True)

        module = import_module(args.module)
        site = load_site(module)
        print(site)