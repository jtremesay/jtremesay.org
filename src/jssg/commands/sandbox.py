from argparse import ArgumentParser, Namespace
from importlib import import_module

from jssg.core.command import BaseCommand
from jssg.core.loaders import load_pages


class Command(BaseCommand):
    def add_arguments(self, parser: ArgumentParser) -> None:
        pass

    def handle(self, args: Namespace) -> None:
        module_name = "jtremesay"
        module = import_module(module_name)
        pages = load_pages(module)