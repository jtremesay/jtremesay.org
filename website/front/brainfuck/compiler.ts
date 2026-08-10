/*
 * Brainfuck
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * compiler.ts
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Node, ProgramNode, LoopNode, IncNode, DecNode, OutputNode, InputNode, MoveLeftNode, MoveRightNode } from './ast';


export abstract class Compiler {
    indent_char: string = "    ";
    start_deep: number = 0;

    compile(program: ProgramNode): string {
        return this.visit_program(program);
    }

    indent(deep: number): string {
        return this.indent_char.repeat(deep);
    }

    visit(node: Node, deep: number): string {
        if (node instanceof ProgramNode) {
            return this.visit_program(node);
        } else if (node instanceof LoopNode) {
            return this.visit_loop(node, deep);
        } else if (node instanceof IncNode) {
            return this.visit_inc(node, deep);
        } else if (node instanceof DecNode) {
            return this.visit_dec(node, deep);
        } else if (node instanceof OutputNode) {
            return this.visit_output(node, deep);
        } else if (node instanceof InputNode) {
            return this.visit_input(node, deep);
        } else if (node instanceof MoveLeftNode) {
            return this.visit_move_left(node, deep);
        } else if (node instanceof MoveRightNode) {
            return this.visit_move_right(node, deep);
        } else {
            throw new Error("Unknown node type");
        }
    }

    visit_program(node: ProgramNode): string {
        let output = this.compile_header();
        for (let instruction of node.body) {
            output += this.visit(instruction, this.start_deep);
        }
        output += this.compile_footer();
        return output;
    }

    visit_loop(node: LoopNode, deep: number): string {
        let output = "";
        output += this.compile_loop_start(deep);
        for (let instruction of node.body) {
            output += this.visit(instruction, deep + 1);
        }
        output += this.compile_loop_end(deep);
        return output;
    }

    visit_inc(_node: IncNode, deep: number): string {
        return this.compile_inc(deep);
    }

    visit_dec(_node: DecNode, deep: number): string {
        return this.compile_dec(deep);
    }

    visit_output(_node: OutputNode, deep: number): string {
        return this.compile_output(deep);
    }

    visit_input(_node: InputNode, deep: number): string {
        return this.compile_input(deep);
    }

    visit_move_left(_node: MoveLeftNode, deep: number): string {
        return this.compile_move_left(deep);
    }

    visit_move_right(_node: MoveRightNode, deep: number): string {
        return this.compile_move_right(deep);
    }

    compile_header(): string {
        return "";
    }

    compile_footer(): string {
        return "";
    }

    abstract compile_loop_start(deep: number): string;
    abstract compile_loop_end(deep: number): string;
    abstract compile_inc(deep: number): string;
    abstract compile_dec(deep: number): string;
    abstract compile_output(deep: number): string;
    abstract compile_input(deep: number): string;
    abstract compile_move_left(deep: number): string;
    abstract compile_move_right(deep: number): string;
}

export class CCompiler extends Compiler {
    start_deep: number = 1;

    compile_header(): string {
        let output = ""
        output += "#include <stdlib.h>\n";
        output += "#include <stdio.h>\n";
        output += "#include <stdint.h>\n\n";
        output += "#define MEMORY_SIZE 30000\n\n";
        output += "uint8_t memory[MEMORY_SIZE] = {0};\n\n";
        output += "int main() {\n";
        output += "    int pointer = 0;\n";
        return output
    }

    compile_footer(): string {
        let output = ""
        output += "\n    return EXIT_SUCCESS;\n";
        output += "}\n";
        return output
    }

    compile_loop_start(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "while (memory[pointer] != 0) {\n";
        return output
    }

    compile_loop_end(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "}\n";
        return output
    }

    compile_inc(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "memory[pointer]++;\n";
        return output
    }

    compile_dec(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "memory[pointer]--;\n";
        return output
    }

    compile_output(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "putchar(memory[pointer]);\n";
        return output
    }

    compile_input(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "memory[pointer] = getchar();\n";
        return output
    }

    compile_move_left(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "pointer--;\n";
        return output
    }

    compile_move_right(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "pointer++;\n";
        return output
    }
}

export class PythonCompiler extends Compiler {
    compile_header(): string {
        let output = ""
        output += "memory = [0] * 30000\n";
        output += "pointer = 0\n\n";
        return output
    }

    compile_loop_start(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "while memory[pointer] != 0:\n";
        return output
    }

    compile_loop_end(_deep: number): string {
        return "";
    }

    compile_inc(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "memory[pointer] += 1\n";
        return output
    }

    compile_dec(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "memory[pointer] -= 1\n";
        return output
    }

    compile_output(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "print(chr(memory[pointer]), end=\"\")\n";
        return output
    }

    compile_input(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "memory[pointer] = ord(input())\n";
        return output
    }

    compile_move_left(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "pointer -= 1\n";
        return output
    }

    compile_move_right(deep: number): string {
        let output = ""
        output += this.indent(deep)
        output += "pointer += 1\n";
        return output
    }
}