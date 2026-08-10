/*
 * Brainfuck
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * interpreter.ts
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

import { Node, ProgramNode, IncNode, DecNode, MoveLeftNode, MoveRightNode, InputNode, OutputNode, LoopNode } from "./ast"

const MEMORY_SIZE: number = 30000;

export class Interpreter {
    memory: Array<number> = new Array(MEMORY_SIZE).fill(0);
    pointer: number = 0;

    read: () => string;
    write: (value: string) => void;

    constructor(read: () => string, write: (value: string) => void) {
        this.read = read;
        this.write = write;
    }

    reset() {
        this.memory = new Array(MEMORY_SIZE).fill(0);
        this.pointer = 0;
    }

    run(node: ProgramNode) {
        this.reset();
        this.visit(node);
    }

    visit(node: Node) {
        if (node instanceof ProgramNode) {
            //console.log("ProgramNode");
            for (const child of node.body) {
                this.visit(child);
            }
            return;
        }


        if (node instanceof LoopNode) {
            //console.log("LoopNode");
            while (this.memory[this.pointer] !== 0) {
                for (const child of node.body) {
                    this.visit(child);
                }
            }
            return;
        }

        if (node instanceof IncNode) {
            //console.log("IncNode");
            this.memory[this.pointer]++;
            return;
        }

        if (node instanceof DecNode) {
            //console.log("DecNode");
            this.memory[this.pointer]--;
            return;
        }

        if (node instanceof MoveLeftNode) {
            //console.log("MoveLeftNode");
            if (this.pointer <= 0) {
                this.pointer = MEMORY_SIZE - 1;
            } else {
                this.pointer--;
            }
            return;
        }

        if (node instanceof MoveRightNode) {
            //console.log("MoveRightNode");
            if (this.pointer >= MEMORY_SIZE - 1) {
                this.pointer = 0;
            } else {
                this.pointer++;
            }
            return;
        }

        if (node instanceof InputNode) {
            //console.log("InputNode");
            this.memory[this.pointer] = this.read().charCodeAt(0);
            return;
        }

        if (node instanceof OutputNode) {
            //console.log("OutputNode");
            this.write(String.fromCharCode(this.memory[this.pointer]));
            return;
        }

        throw new Error(`Unknown(${node})`);
    }
}