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
