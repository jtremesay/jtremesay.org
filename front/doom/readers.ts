/*
 * Computer Generated Images
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * doom
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <https://www.gnu.org/licenses/>.
 */
export function read_string(data: ArrayBuffer, offset: number = 0, length: number = 8): string {
    return String.fromCharCode(...new Uint8Array(data.slice(offset, offset + length)).filter((v) => v != 0))
}

export function read_uint16(data: ArrayBuffer, offset: number = 0): number {
    return new Uint16Array(data.slice(offset, offset + 2))[0]
}

export function read_int16(data: ArrayBuffer, offset: number = 0): number {
    return new Int16Array(data.slice(offset, offset + 2))[0]
}

export function read_uint32(data: ArrayBuffer, offset: number = 0): number {
    return new Uint32Array(data.slice(offset, offset + 4))[0]
}
