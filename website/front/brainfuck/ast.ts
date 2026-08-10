/*
 * Brainfuck
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * ast.ts
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


export class Node { }

export class NodeList extends Node {
    body: Node[];

    constructor(body: Node[]) {
        super();
        this.body = body;
    }
}

export class InstructionNode extends Node { }
export class IncNode extends Node { }
export class DecNode extends Node { }
export class MoveLeftNode extends Node { }
export class MoveRightNode extends Node { }
export class InputNode extends Node { }
export class OutputNode extends Node { }
export class LoopNode extends NodeList { }
export class ProgramNode extends NodeList { }