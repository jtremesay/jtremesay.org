import { Lump } from "./lumps"
import { read_int16, read_uint16 } from "./readers"
import { Level, LineDef, Segment, SideDef, SubSector, Vertex, WAD } from "./types"

function load_linedef(lump: Lump, i: number): LineDef {
    let offset = i * 14
    return new LineDef(
        read_uint16(lump.data, offset),
        read_uint16(lump.data, offset + 2),
        read_uint16(lump.data, offset + 10),
        read_uint16(lump.data, offset + 12),
    )
}

function load_linedefs(lump: Lump): LineDef[] {
    let linedefs = []
    let count = lump.data.byteLength / 14
    for (let i = 0; i < count; ++i) {
        linedefs.push(load_linedef(lump, i))
    }

    return linedefs
}

function load_sidedef(lump: Lump, i: number): SideDef {
    let offset = i * 30
    return new SideDef(
        read_uint16(lump.data, offset + 28),
    )
}

function load_sidedefs(lump: Lump): SideDef[] {
    let sidedefs = []
    let count = lump.data.byteLength / 30
    for (let i = 0; i < count; ++i) {
        sidedefs.push(load_sidedef(lump, i))
    }
    return sidedefs
}

function load_vertex(lump: Lump, i: number): Vertex {
    let offset = i * 4
    return new Vertex(
        read_int16(lump.data, offset) / 32,
        read_int16(lump.data, offset + 2) / 32,
    )
}

function load_vertexes(lump: Lump): Vertex[] {
    let vertexes = []
    let count = lump.data.byteLength / 4
    for (let i = 0; i < count; ++i) {
        vertexes.push(load_vertex(lump, i))
    }

    return vertexes
}

function load_segment(lump: Lump, i: number): Segment {
    let offset = i * 12
    return new Segment(
        read_int16(lump.data, offset),
        read_int16(lump.data, offset + 2),
        read_int16(lump.data, offset + 6),
        read_int16(lump.data, offset + 10),
    )
}

function load_segments(lump: Lump): Segment[] {
    let segments = []
    let count = lump.data.byteLength / 4
    for (let i = 0; i < count; ++i) {
        segments.push(load_segment(lump, i))
    }

    return segments
}


function load_sub_sector(lump: Lump, i: number): SubSector {
    let offset = i * 4
    return new SubSector(
        read_int16(lump.data, offset),
        read_int16(lump.data, offset + 2),
    )
}

function load_sub_sectors(lump: Lump): SubSector[] {
    let sub_sectors = []
    let count = lump.data.byteLength / 4
    for (let i = 0; i < count; ++i) {
        sub_sectors.push(load_sub_sector(lump, i))
    }

    return sub_sectors
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
    level.linedefs = load_linedefs(lump)
    ++i

    // Sidedefs
    lump = lumps[i]
    if (lump.name != "SIDEDEFS") {
        throw new Error(`Expected lump SIDEDEFS, found ${lump.name}`)
    }
    level.sidedefs = load_sidedefs(lump)
    ++i

    // Vertexes
    lump = lumps[i]
    if (lump.name != "VERTEXES") {
        throw new Error(`Expected lump VERTEXES, found ${lump.name}`)
    }
    level.vertexes = load_vertexes(lump)
    ++i

    // Segs
    lump = lumps[i]
    if (lump.name != "SEGS") {
        throw new Error(`Expected lump SEGS, found ${lump.name}`)
    }
    level.segments = load_segments(lump)
    ++i

    // SSectors
    lump = lumps[i]
    if (lump.name != "SSECTORS") {
        throw new Error(`Expected lump SSECTORS, found ${lump.name}`)
    }
    level.sub_sectors = load_sub_sectors(lump)
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
