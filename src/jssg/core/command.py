import importlib
import logging
import pkgutil
from argparse import ArgumentParser, Namespace
from collections.abc import Sequence
from pathlib import Path
from typing import Optional

from jssg import commands as command_modules

logger = logging.getLogger(__name__)

class BaseCommand:
    def add_arguments(self, parser: ArgumentParser) -> None:
        pass

    def handle(self, args: Namespace) -> None:
        pass


def get_available_commands() -> dict[str, BaseCommand]:
    commands = {}
    
    package_path = Path(command_modules.__file__).parent
    for _, module_name, is_pkg in pkgutil.iter_modules([str(package_path)]):
        if is_pkg:
            continue
        
        try:
            module = importlib.import_module(f"jssg.commands.{module_name}")
        except (ImportError, AttributeError) as e:
            logger.warning("Failed to load command module '%s': %s", module_name, e)
            continue
        
        if (command_class := getattr(module, "Command", None)) and issubclass(command_class, BaseCommand):
            logger.debug("Loaded command '%s'", module_name)
            commands[module_name] = command_class()

    return commands


def main(args: Optional[Sequence[str]] = None) -> None:
    logging.basicConfig(level=logging.INFO)

    parser = ArgumentParser(description="Jtremesay Static Site Generator")
    sub_parsers = parser.add_subparsers(dest="command", required=True)

    commands = get_available_commands()
    for name, cmd_instance in commands.items():
        cmd_parser = sub_parsers.add_parser(name, help=f"{name} command")
        cmd_instance.add_arguments(cmd_parser)

    parsed_args = parser.parse_args(args)
    logger.debug("Parsed arguments: %s", parsed_args)
    command_instance = commands[parsed_args.command]
    del parsed_args.command  # type: ignore
    command_instance.handle(parsed_args)