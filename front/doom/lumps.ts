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
