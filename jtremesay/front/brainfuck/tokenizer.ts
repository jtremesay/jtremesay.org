/*
 * Brainfuck
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * tokenizer.ts
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
import { Token } from './token';

export function tokenizer(code: string): Token[] {
    const tokens: Token[] = []
    for (let i = 0; i < code.length; i++) {
        switch (code[i]) {
            case '<':
                tokens.push(Token.MOVE_LEFT)
                break
            case '>':
                tokens.push(Token.MOVE_RIGHT)
                break
            case '+':
                tokens.push(Token.INC)
                break
            case '-':
                tokens.push(Token.DEC)
                break
            case '.':
                tokens.push(Token.OUTPUT)
                break
            case ',':
                tokens.push(Token.INPUT)
                break
            case '[':
                tokens.push(Token.LOOP_BEGIN)
                break
            case ']':
                tokens.push(Token.LOOP_END)
                break
        }
    }
    tokens.push(Token.EOF)

    return tokens
}