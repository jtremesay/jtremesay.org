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
import { Lump } from "./lumps"
import { read_int16, read_uint16 } from "./readers"
import { Level, LineDef, Node, Segment, SideDef, SubSector, WAD } from "./types"

function read_vertex(data: ArrayBuffer, offset: number): THREE.Vector2 {
    return new THREE.Vector2(
        read_int16(data, offset),
        read_int16(data, offset + 2),
    )
}

function read_bb(data: ArrayBuffer, offset: number): THREE.Box2 {
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

function load_linedef(level: Level, lump: Lump, i: number): void {
    let offset = i * 14
    level.linedefs.push(new LineDef(
        level,
        read_uint16(lump.data, offset),
        read_uint16(lump.data, offset + 2),
        read_uint16(lump.data, offset + 10),
        read_uint16(lump.data, offset + 12),
    ))
}

function load_linedefs(level: Level, lump: Lump): void {
    let count = lump.data.byteLength / 14
    for (let i = 0; i < count; ++i) {
        load_linedef(level, lump, i)
    }
}

function load_sidedef(level: Level, lump: Lump, i: number): void {
    let offset = i * 30
    level.sidedefs.push(new SideDef(
        level,
        read_uint16(lump.data, offset + 28),
    ))
}

function load_sidedefs(level: Level, lump: Lump): void {
    let count = lump.data.byteLength / 30
    for (let i = 0; i < count; ++i) {
        load_sidedef(level, lump, i)
    }
}

function load_vertex(level: Level, lump: Lump, i: number): void {
    let offset = i * 4
    level.vertexes.push(read_vertex(lump.data, offset))
}

function load_vertexes(level: Level, lump: Lump): void {
    let count = lump.data.byteLength / 4
    for (let i = 0; i < count; ++i) {
        load_vertex(level, lump, i)
    }
}

function load_segment(level: Level, lump: Lump, i: number): void {
    let offset = i * 12
    level.segments.push(new Segment(
        level,
        read_int16(lump.data, offset),
        read_int16(lump.data, offset + 2),
        read_int16(lump.data, offset + 4),
        read_int16(lump.data, offset + 6),
        read_int16(lump.data, offset + 8) == 1,
        read_int16(lump.data, offset + 10),
    ))
}

function load_segments(level: Level, lump: Lump): void {
    let count = lump.data.byteLength / 4
    for (let i = 0; i < count; ++i) {
        load_segment(level, lump, i)
    }
}

function load_sub_sector(level: Level, lump: Lump, i: number): void {
    let offset = i * 4
    level.sub_sectors.push(new SubSector(
        level,
        read_int16(lump.data, offset),
        read_int16(lump.data, offset + 2),
    ))
}

function load_sub_sectors(level: Level, lump: Lump): void {
    let count = lump.data.byteLength / 4
    for (let i = 0; i < count; ++i) {
        load_sub_sector(level, lump, i)
    }
}


function load_node(level: Level, lump: Lump, i: number): void {
    let offset = i * 28
    level.nodes.push(new Node(
        level,
        read_vertex(lump.data, offset),
        read_vertex(lump.data, offset + 4),
        read_bb(lump.data, offset + 8),
        read_bb(lump.data, offset + 16),
        read_int16(lump.data, offset + 24),
        read_int16(lump.data, offset + 26),
    ))
}

function load_nodes(level: Level, lump: Lump): void {
    let count = lump.data.byteLength / 28
    for (let i = 0; i < count; ++i) {
        load_node(level, lump, i)
    }
}

function load_level(lumps: Lump[], i: number): { level: Level, i: number } {
    // Level
    let lump = lumps[i]
    let level = new Level(lump.name)
    ++i

    // Things
    lump = lumps[i]
    if (lump.name != "THINGS") {
        throw new Error(`Expected lump THINGS, found ${lump.name}`)
    }
    ++i

    // Linedefs
    lump = lumps[i]
    if (lump.name != "LINEDEFS") {
        throw new Error(`Expected lump LINEDEFS, found ${lump.name}`)
    }
    load_linedefs(level, lump)
    ++i

    // Sidedefs
    lump = lumps[i]
    if (lump.name != "SIDEDEFS") {
        throw new Error(`Expected lump SIDEDEFS, found ${lump.name}`)
    }
    load_sidedefs(level, lump)
    ++i

    // Vertexes
    lump = lumps[i]
    if (lump.name != "VERTEXES") {
        throw new Error(`Expected lump VERTEXES, found ${lump.name}`)
    }
    load_vertexes(level, lump)
    ++i

    // Segs
    lump = lumps[i]
    if (lump.name != "SEGS") {
        throw new Error(`Expected lump SEGS, found ${lump.name}`)
    }
    load_segments(level, lump)
    ++i

    // SSectors
    lump = lumps[i]
    if (lump.name != "SSECTORS") {
        throw new Error(`Expected lump SSECTORS, found ${lump.name}`)
    }
    load_sub_sectors(level, lump)
    ++i

    // Nodes
    lump = lumps[i]
    if (lump.name != "NODES") {
        throw new Error(`Expected lump NODES, found ${lump.name}`)
    }
    load_nodes(level, lump)
    ++i

    // Sectors
    lump = lumps[i]
    if (lump.name != "SECTORS") {
        throw new Error(`Expected lump SECTORS, found ${lump.name}`)
    }
    ++i

    // Reject ?
    lump = lumps[i]
    if (lump.name == "REJECT") {
        ++i;
    }

    // Bockmap
    lump = lumps[i]
    if (lump.name != "BLOCKMAP") {
        throw new Error(`Expected lump BLOCKMAP, found ${lump.name}`)
    }
    ++i

    return {
        level: level,
        i: i
    }
}

function load_levels(lumps: Lump[]): Level[] {
    let levels = []

    // Search first level
    let i = 0
    for (; i <= lumps.length && !lumps[i].name.match(/^E\d+M\d+$/); ++i) { }

    // Load levels
    do {
        let level_result = load_level(lumps, i)
        levels.push(level_result.level)
        i = level_result.i
    } while (i <= lumps.length && lumps[i].name.match(/^E\d+M\d+$/))

    return levels
}

export function load_wad(lumps: Lump[]): WAD {
    let wad = new WAD()
    wad.levels = load_levels(lumps)

    return wad
}
