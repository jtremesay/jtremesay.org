export class Vertex {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

export class LineDef {
    start_vertex: number
    end_vertex: number
    front_sidedef: number
    back_sidedef: number

    constructor(start_vertex: number, end_vertex: number, front_sidedef: number, back_sidedef: number) {
        this.start_vertex = start_vertex
        this.end_vertex = end_vertex
        this.front_sidedef = front_sidedef
        this.back_sidedef = back_sidedef
    }
}

export class SideDef {
    sector: number

    constructor(sector: number) {
        this.sector = sector
    }
}

export class Segment {
    start_vertex: number
    end_vertex: number
    linedef: number
    offset: number

    constructor(start_vertex: number, end_vertex: number, linedef: number, offset: number) {
        this.start_vertex = start_vertex
        this.end_vertex = end_vertex
        this.linedef = linedef
        this.offset = offset
    }
}

export class SubSector {
    segments_count: number
    segments_i: number

    constructor(segments_count: number, segments_i: number) {
        this.segments_count = segments_count
        this.segments_i = segments_i
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
    vertexes: Vertex[] = []
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
