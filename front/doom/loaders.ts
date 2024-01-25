import * as THREE from "three"
import { Lump } from "./lumps"
import { read_int16, read_uint16 } from "./readers"
import { Level, LineDef, Segment, SideDef, SubSector, WAD } from "./types"

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
    level.vertexes.push(new THREE.Vector2(
        read_int16(lump.data, offset) / 32,
        read_int16(lump.data, offset + 2) / 32,
    ))
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
        read_int16(lump.data, offset + 6),
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
