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
