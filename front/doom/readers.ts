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
import * as THREE from "three"
import { LineDef, Sector, Segment, SideDef, SubSector, Thing, Node, Level, WAD } from "./types"
import { Lump } from "./lumps"

export function read_string(data: ArrayBuffer, offset: number = 0, length: number = 8): string {
    return String.fromCharCode(...new Uint8Array(data.slice(offset, offset + length)).filter((v) => v != 0))
}

export function read_int16(data: ArrayBuffer, offset: number = 0): number {
    return new Int16Array(data.slice(offset, offset + 2))[0]
}

export function read_uint32(data: ArrayBuffer, offset: number = 0): number {
    return new Uint32Array(data.slice(offset, offset + 4))[0]
}

function read_vector2(data: ArrayBuffer, offset: number): THREE.Vector2 {
    return new THREE.Vector2(
        read_int16(data, offset),
        read_int16(data, offset + 2),
    )
}

function read_vertices(data: ArrayBuffer): THREE.Vector2[] {
    let size = 4
    let count = data.byteLength / size
    return [...Array(count)].map((_, i) => read_vector2(data, i * size))
}

function read_box2(data: ArrayBuffer, offset: number = 0): THREE.Box2 {
    return new THREE.Box2(
        new THREE.Vector2(
            read_int16(data, offset + 4),
            read_int16(data, offset + 2),
        ),
        new THREE.Vector2(
            read_int16(data, offset + 6),
            read_int16(data, offset),
        )
    )
}

function read_thing(data: ArrayBuffer, offset: number = 0): Thing {
    return new Thing(
        read_vector2(data, offset + 0),
        read_int16(data, offset + 4),
        read_int16(data, offset + 6),
        read_int16(data, offset + 8)
    )
}

function read_things(data: ArrayBuffer): Thing[] {
    let size = 10
    let count = data.byteLength / size
    return [...Array(count)].map((_, i) => read_thing(data, i * size))
}

function read_line_def(data: ArrayBuffer, vertices: THREE.Vector2[], side_defs: SideDef[], offset: number = 0): LineDef {
    let front_i = read_int16(data, offset + 10)
    let back_i = read_int16(data, offset + 12)




    let ld = new LineDef(
        vertices[read_int16(data, offset)],
        vertices[read_int16(data, offset + 2)],
        read_int16(data, offset + 4),
        read_int16(data, offset + 6),
        read_int16(data, offset + 8),
        front_i > 0xffff ? null : side_defs[front_i],
        back_i == 0xffff ? null : side_defs[back_i],
    )

    if (front_i > -1) {
        side_defs[front_i]._line_def = ld
    }
    if (back_i > -1) {
        side_defs[back_i]._line_def = ld
    }

    return ld
}

function read_line_defs(data: ArrayBuffer, vertices: THREE.Vector2[], side_defs: SideDef[]): LineDef[] {
    let size = 14
    let count = data.byteLength / size
    return [...Array(count)].map((_, i) => read_line_def(data, vertices, side_defs, i * size))
}

function read_side_def(data: ArrayBuffer, sectors: Sector[], offset: number = 0): SideDef {
    return new SideDef(
        read_vector2(data, offset),
        read_string(data, offset + 4),
        read_string(data, offset + 12),
        read_string(data, offset + 20),
        sectors[read_int16(data, offset + 28)],
    )
}

function read_side_defs(data: ArrayBuffer, sectors: Sector[]): SideDef[] {
    let size = 30
    let count = data.byteLength / size
    return [...Array(count)].map((_, i) => read_side_def(data, sectors, i * size))
}

function read_segment(data: ArrayBuffer, vertices: THREE.Vector2[], line_defs: LineDef[], offset: number = 0): Segment {
    return new Segment(
        vertices[read_int16(data, offset)],
        vertices[read_int16(data, offset + 2)],
        read_int16(data, offset + 4),
        line_defs[read_int16(data, offset + 6)],
        read_int16(data, offset + 8) == 1,
        read_int16(data, offset + 10),
    )
}

function read_segments(data: ArrayBuffer, vertices: THREE.Vector2[], line_defs: LineDef[]): Segment[] {
    let size = 12
    let count = data.byteLength / size
    return [...Array(count)].map((_, i) => read_segment(data, vertices, line_defs, i * size))
}

function read_sub_sector(data: ArrayBuffer, segments: Segment[], offset: number = 0): SubSector {
    let count = read_int16(data, offset)
    let start = read_int16(data, offset + 2)

    let ss = new SubSector(
        segments.slice(start, start + count)
    )
    ss.segments[0].side_def.sector.sub_sectors.push(ss)

    return ss
}

function read_sub_sectors(data: ArrayBuffer, segments: Segment[]): SubSector[] {
    let size = 4
    let count = data.byteLength / size
    return [...Array(count)].map((_, i) => read_sub_sector(data, segments, i * size))
}

function read_node(data: ArrayBuffer, sub_sectors: SubSector[], offset: number = 0): Node {
    let size = 28
    let left_i = read_int16(data, offset + 24)
    let right_i = read_int16(data, offset + 26)

    return new Node(
        read_vector2(data, offset),
        read_vector2(data, offset + 4),
        read_box2(data, offset + 8),
        read_box2(data, offset + 16),
        left_i & 0x8000 ? sub_sectors[left_i & 0x7fff] : read_node(data, sub_sectors, left_i * size),
        right_i & 0x8000 ? sub_sectors[right_i & 0x7fff] : read_node(data, sub_sectors, right_i * size),
    )
}

function read_nodes(data: ArrayBuffer, sub_sectors: SubSector[]): Node {
    let size = 28
    return read_node(data, sub_sectors, data.byteLength - size)
}

function read_sector(data: ArrayBuffer, offset: number = 0): Sector {
    return new Sector(
        read_int16(data, offset),
        read_int16(data, offset + 2),
        read_string(data, offset + 4),
        read_string(data, offset + 12),
        read_int16(data, offset + 20),
        read_int16(data, offset + 22),
        read_int16(data, offset + 24)
    )
}

function read_sectors(data: ArrayBuffer): Sector[] {
    let size = 26
    let count = data.byteLength / size
    return [...Array(count)].map((_, i) => read_sector(data, i * size))
}

function read_level(lumps: Lump[], i: number): Level {
    // Level
    let lump = lumps[i]
    let level_name = lump.name

    // Things
    lump = lumps[i + 1]
    if (lump.name != "THINGS") {
        throw new Error(`Expected lump THINGS, found ${lump.name}`)
    }
    let things = read_things(lump.data)

    // Sectors
    lump = lumps[i + 8]
    if (lump.name != "SECTORS") {
        throw new Error(`Expected lump SECTORS, found ${lump.name}`)
    }
    let sectors = read_sectors(lump.data)

    // Vertices
    lump = lumps[i + 4]
    if (lump.name != "VERTEXES") {
        throw new Error(`Expected lump VERTEXES, found ${lump.name}`)
    }
    let vertices = read_vertices(lump.data)

    // Side defs
    lump = lumps[i + 3]
    if (lump.name != "SIDEDEFS") {
        throw new Error(`Expected lump SIDEDEFS, found ${lump.name}`)
    }
    let sidedefs = read_side_defs(lump.data, sectors)

    // Line defs
    lump = lumps[i + 2]
    if (lump.name != "LINEDEFS") {
        throw new Error(`Expected lump LINEDEFS, found ${lump.name}`)
    }
    let linedefs = read_line_defs(lump.data, vertices, sidedefs)

    // Segments
    lump = lumps[i + 5]
    if (lump.name != "SEGS") {
        throw new Error(`Expected lump SEGS, found ${lump.name}`)
    }
    let segments = read_segments(lump.data, vertices, linedefs)

    // Sub sectors
    lump = lumps[i + 6]
    if (lump.name != "SSECTORS") {
        throw new Error(`Expected lump SSECTORS, found ${lump.name}`)
    }
    let sub_sectors = read_sub_sectors(lump.data, segments)

    // Nodes
    lump = lumps[i + 7]
    if (lump.name != "NODES") {
        throw new Error(`Expected lump NODES, found ${lump.name}`)
    }
    let root = read_nodes(lump.data, sub_sectors)

    // Reject ?
    lump = lumps[i + 9]
    if (lump.name == "REJECTS") {
        throw new Error(`Expected lump REJECTS, found ${lump.name}`)
    }

    // Blockmap
    lump = lumps[i + 10]
    if (lump.name != "BLOCKMAP") {
        throw new Error(`Expected lump BLOCKMAP, found ${lump.name}`)
    }

    return new Level(level_name,
        things,
        linedefs,
        root,
        sectors
    )
}

function read_levels(lumps: Lump[]): Level[] {
    let levels = []
    let level_regex = /^E\d+M\d+$/

    // Search first level
    let i = 0
    for (; i <= lumps.length && !lumps[i].name.match(level_regex); ++i) { }

    // Load levels
    do {
        levels.push(read_level(lumps, i))
        i += 11
    } while (i <= lumps.length && lumps[i].name.match(level_regex))

    return levels
}

export function read_wad(lumps: Lump[]): WAD {
    return new WAD(read_levels(lumps))
}
