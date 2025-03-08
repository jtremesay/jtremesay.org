/*
 * Brainfuck
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * parser.ts
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

import { DecNode, IncNode, InputNode, MoveLeftNode, MoveRightNode, OutputNode, ProgramNode, Node, LoopNode } from "./ast";
import { Token } from "./token";

export function parse(tokens: Token[]): ProgramNode {
    return parse_program(tokens);
}

function parse_program(tokens: Token[]): ProgramNode {
    let body: Node[] = [];
    while (tokens.length > 0 && tokens[0] != Token.EOF) {
        body.push(parse_statement(tokens));
    }

    return new ProgramNode(body);
}

function parse_statement(tokens: Token[]): Node {
    const t = tokens.shift();
    switch (t) {
        case Token.INC:
            return new IncNode();
        case Token.DEC:
            return new DecNode();
        case Token.MOVE_LEFT:
            return new MoveLeftNode();
        case Token.MOVE_RIGHT:
            return new MoveRightNode();
        case Token.INPUT:
            return new InputNode();
        case Token.OUTPUT:
            return new OutputNode();
        case Token.LOOP_BEGIN:
            return parse_loop(tokens);
        default:
            throw new Error(`Unexpected token: ${t}`);
    }
}

function parse_loop(tokens: Token[]): Node {
    let body: Node[] = [];
    while (tokens[0] != Token.LOOP_END && tokens[0] != Token.EOF) {
        body.push(parse_statement(tokens));
    }
    if (tokens[0] == Token.EOF) {
        throw new Error("EOF reached before end of loop");
    }

    tokens.shift();

    return new LoopNode(body);
}