from argparse import ArgumentParser, Namespace

from jssg.command import BaseCommand


class Command(BaseCommand):
    def add_arguments(self, parser: ArgumentParser) -> None:
        pass

    def handle(self, args: Namespace) -> None:
        pass