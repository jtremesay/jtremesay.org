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
export class LineDef {
    _level: Level
    _start_i: number
    _end_i: number
    _front_i: number
    _back_i: number

    constructor(level: Level, start_i: number, end_i: number, front_i: number, back_i: number) {
        this._level = level
        this._start_i = start_i
        this._end_i = end_i
        this._front_i = front_i
        this._back_i = back_i
    }

    get start(): THREE.Vector2 {
        return this._level.vertexes[this._start_i]
    }

    get end(): THREE.Vector2 {
        return this._level.vertexes[this._end_i]
    }

    get front(): SideDef | null {
        if (this._front_i == 0xffff) {
            return null
        }

        return this._level.sidedefs[this._front_i]
    }

    get back(): SideDef | null {
        if (this._back_i == 0xffff) {
            return null
        }

        return this._level.sidedefs[this._back_i]
    }
}

export class SideDef {
    _level: Level
    _sector_i: number

    constructor(level: Level, sector_i: number) {
        this._level = level
        this._sector_i = sector_i
    }

    get sector(): Sector {
        return this._level.sectors[this._sector_i]
    }
}

export class Segment {
    _level: Level
    _start_i: number
    _end_i: number
    _linedef_i: number
    offset: number

    constructor(level: Level, start_i: number, end_i: number, linedef_i: number, offset: number) {
        this._level = level
        this._start_i = start_i
        this._end_i = end_i
        this._linedef_i = linedef_i
        this.offset = offset
    }

    get start(): THREE.Vector2 {
        return this._level.vertexes[this._start_i]
    }

    get end(): THREE.Vector2 {
        return this._level.vertexes[this._end_i]
    }

    get linedef(): LineDef {
        return this._level.linedefs[this._linedef_i]
    }
}

export class SubSector {
    _level: Level
    segments_count: number
    _segments_i: number

    constructor(level: Level, segments_count: number, segments_i: number) {
        this._level = level
        this.segments_count = segments_count
        this._segments_i = segments_i
    }

    get_segment(i: number): Segment {
        return this._level.segments[this._segments_i + i]
    }

    *segments() {
        for (let i = 0; i < this.segments_count; ++i) {
            yield this.get_segment(i)
        }
    }
}

export class Node {
    _level: Level
    start: THREE.Vector2
    rel_end: THREE.Vector2
    left_bb: THREE.Box2
    right_bb: THREE.Box2
    _left_i: number
    _right_i: number

    constructor(level: Level, start: THREE.Vector2, rel_end: THREE.Vector2, left_bb: THREE.Box2, right_bb: THREE.Box2, left_i: number, right_i: number) {
        this._level = level
        this.start = start
        this.rel_end = rel_end
        this.left_bb = left_bb
        this.right_bb = right_bb
        this._left_i = left_i
        this._right_i = right_i
    }

    get end(): THREE.Vector2 {
        return this.start.add(this.rel_end)
    }

    get left(): Node | SubSector {
        if (this._left_i & 0x8000) {
            return this._level.sub_sectors[this._left_i & 0x7fff]
        } else {
            return this._level.nodes[this._left_i]
        }
    }

    get right(): Node | SubSector {
        if (this._right_i & 0x8000) {
            return this._level.sub_sectors[this._right_i & 0x7fff]
        } else {
            return this._level.nodes[this._right_i]
        }
    }
}



export class Sector {
    floor_height: number
    ceil_height: number

    constructor(floor_height: number, ceil_height: number) {
        this.floor_height = floor_height
        this.ceil_height = ceil_height
    }
}

export class Level {
    name: string
    vertexes: THREE.Vector2[] = []
    linedefs: LineDef[] = []
    sidedefs: SideDef[] = []
    segments: Segment[] = []
    sub_sectors: SubSector[] = []
    nodes: Node[] = []
    sectors: Sector[] = []

    constructor(name: string) {
        this.name = name
    }
}

export class WAD {
    levels: Level[] = []

    constructor() {
    }
}
