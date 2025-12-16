/*
 * Computer Generated Images
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * doom
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
import { read_string, read_uint32 } from "./readers"

export class Lump {
    name: string
    data: ArrayBuffer

    constructor(name: string, data: ArrayBuffer) {
        this.name = name
        this.data = data
    }
}

export function read_lump(wad_data: ArrayBuffer, i: number, lumps_ptr: number): Lump {
    let offset = lumps_ptr + i * 16
    let ptr = read_uint32(wad_data, offset)
    let size = read_uint32(wad_data, offset + 4)
    let name = read_string(wad_data, offset + 8)
    let lump_data = wad_data.slice(ptr, ptr + size)

    return new Lump(
        name,
        lump_data
    )
}

export function read_lumps(wad_data: ArrayBuffer): Lump[] {
    let lumps = []
    let lumps_count = read_uint32(wad_data, 4)
    let lumps_ptr = read_uint32(wad_data, 8)
    for (let i = 0; i < lumps_count; ++i) {
        let lump = read_lump(wad_data, i, lumps_ptr)
        lumps.push(lump)
    }

    return lumps
}
