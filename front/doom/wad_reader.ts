import { WAD, Level, Sector, Vertex, SideDef, LineDef } from "./WAD"

function read_string(data: Uint8Array, index: number, length: number): string {
    let str = ""
    for (let val of data.slice(index, index + length)) {
        if (val == 0) {
            break
        }
        str += String.fromCharCode(val)
    }

    return str
}

function read_uint16(data: Uint8Array, index: number): number {
    return data[index] | (data[index + 1] << 8)
}

function read_int16(data: Uint8Array, index: number): number {
    let val = read_uint16(data, index)
    if (val & 0x8000) {
        return -((~val & 0xffff) + 1)
    } else {
        return val
    }
}

function read_uint32(data: Uint8Array, index: number): number {
    return data[index] | (data[index + 1] << 8) | (data[index + 2] << 16) | (data[index + 3] << 24)
}


export function read_wad(data: Uint8Array): WAD {
    let wad = new WAD()
    let lumps_count = read_uint32(data, 4)
    let lumps_ptr = read_uint32(data, 8)

    let level = null
    for (let lump_i = 0; lump_i < lumps_count; ++lump_i) {
        let lump_offset = lumps_ptr + lump_i * 16
        let lump_ptr = read_uint32(data, lump_offset)
        let lump_size = read_uint32(data, lump_offset + 4)
        let lump_name = read_string(data, lump_offset + 8, 8)

        if (level != null) {
            if (lump_name == "LINEDEFS") {
                let linedefs_count = lump_size / 14
                for (let linedef_i = 0; linedef_i < linedefs_count; ++linedef_i) {
                    let linedef_offset = lump_ptr + linedef_i * 14
                    level.linedefs.push(new LineDef(
                        read_uint16(data, linedef_offset),
                        read_uint16(data, linedef_offset + 2),
                        read_uint16(data, linedef_offset + 10),
                        read_uint16(data, linedef_offset + 12),
                    ))
                }
            } else if (lump_name == "SIDEDEFS") {
                let sidedefs_count = lump_size / 30
                for (let sidedef_i = 0; sidedef_i < sidedefs_count; ++sidedef_i) {
                    let sidedef_offset = lump_ptr + sidedef_i * 30
                    level.sidedefs.push(new SideDef(
                        read_uint16(data, sidedef_offset + 28),
                    ))
                }
            } else if (lump_name == "VERTEXES") {
                let vertexes_count = lump_size / 4
                for (let vertex_i = 0; vertex_i < vertexes_count; ++vertex_i) {
                    let vertex_offset = lump_ptr + vertex_i * 4
                    level.vertexes.push(new Vertex(
                        read_int16(data, vertex_offset) / 32,
                        read_int16(data, vertex_offset + 2) / 32,
                    ))
                }
            } else if (lump_name == "SECTORS") {
                let sectors_count = lump_size / 26
                for (let sector_i = 0; sector_i < sectors_count; ++sector_i) {
                    let sector_offset = lump_ptr + sector_i * 26
                    level.sectors.push(new Sector(
                        read_int16(data, sector_offset) / 32,
                        read_int16(data, sector_offset + 2) / 32,
                    ))
                }
            } else if (lump_name == "BLOCKMAP") {
                level = null
            }
        } else if (lump_name.match(/^E\d+M\d+$/)) {
            level = new Level(lump_name)
            wad.levels.push(level)
        }
    }

    return wad
}
