/*
 * Brainfuck
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * branfuck.ts
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

import 'vite/modulepreload-polyfill';
import { preprocess } from './pre_processor';
import { Token } from './token';
import { tokenizer } from './tokenizer';
import { Node, ProgramNode, LoopNode, IncNode, DecNode, OutputNode, InputNode, MoveLeftNode, MoveRightNode } from './ast';
import { parse } from './parser';
import * as d3 from "d3";

class UI {
    input: HTMLTextAreaElement
    preprocessor_output: HTMLTextAreaElement
    tokenizer_output: HTMLTextAreaElement
    parser_output: HTMLElement

    constructor() {
        this.input = document.getElementById('brainfuck-input') as HTMLTextAreaElement;
        this.preprocessor_output = document.getElementById('brainfuck-preprocessor') as HTMLTextAreaElement;
        this.tokenizer_output = document.getElementById('brainfuck-tokenizer') as HTMLTextAreaElement;
        this.parser_output = document.getElementById('brainfuck-parser')!;
    }

    update_preprocessor(value: string) {
        this.preprocessor_output.value = value
    }

    update_tokenizer(value: string) {
        this.tokenizer_output.value = value
    }

    update_parser(ast: ProgramNode) {
        this.parser_output.innerHTML = "";
        this._update_parser_node(ast, this.parser_output);
    }

    _get_node_name(node: Node) {
        switch (node.constructor) {
            case ProgramNode:
                return "Program";
            case LoopNode:
                return "Loop";
            case IncNode:
                return "Inc";
            case DecNode:
                return "Dec";
            case MoveLeftNode:
                return "MoveLeft";
            case MoveRightNode:
                return "MoveRight";
            case InputNode:
                return "Input";
            case OutputNode:
                return "Output";
            default:
                return `Unknown(${node.constructor.name})`;
        }
    }

    _update_parser_node(node: Node, e: Element) {
        const $node = d3.select(e).append('li');
        $node.append("code").text(this._get_node_name(node));
        if (node instanceof LoopNode || node instanceof ProgramNode) {
            const $ul = $node.append('ul');
            node.body.forEach((child) => this._update_parser_node(child, $ul.node()!));
        }
    }
}

class Engine {
    source_code: string = ""
    preprocessed_code: string = ""
    tokens: Token[] = []
    ast: ProgramNode | null = null

    ui: UI = new UI()

    constructor() {
        this.ui.input.addEventListener('input', this.on_input_change.bind(this))
        this.on_input_change()
    }

    on_input_change() {
        this.source_code = this.ui.input.value
        this.ui.update_preprocessor(this.source_code)
        this.preprocess()
    }

    preprocess() {
        this.preprocessed_code = preprocess(this.source_code)
        this.ui.update_preprocessor(this.preprocessed_code)
        this.tokenize()
    }

    tokenize() {
        this.tokens = tokenizer(this.preprocessed_code)
        this.ui.update_tokenizer(this.tokens.join(' '))
        this.parse()
    }

    parse() {
        try {
            this.ast = parse(this.tokens)
        } catch (e) {
            this.ui.parser_output.innerHTML = `<p class="error">${(e as Error).message}</p>`
            return
        }

        this.ui.update_parser(this.ast)
    }
}

export function main() {
    new Engine()
}