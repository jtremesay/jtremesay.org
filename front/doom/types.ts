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
export class Thing {
    position: THREE.Vector2
    angle: number
    type: number
    flags: number

    constructor(position: THREE.Vector2, angle: number, type: number, flags: number) {
        this.position = position
        this.angle = angle
        this.type = type
        this.flags = flags
    }
}

export class LineDef {
    start: THREE.Vector2
    end: THREE.Vector2
    flags: number
    type: number
    tag: number
    front: SideDef | null
    back: SideDef | null

    constructor(start: THREE.Vector2, end: THREE.Vector2, flags: number, type: number, tag: number, front: SideDef | null, back: SideDef | null) {
        this.start = start
        this.end = end
        this.flags = flags
        this.type = type
        this.tag = tag
        this.front = front
        this.back = back
    }
}

export class SideDef {
    offset: THREE.Vector2
    upper_tex: string
    lower_tex: string
    middle_tex: string
    sector: Sector
    _line_def: LineDef | null = null

    constructor(offset: THREE.Vector2, upper_tex: string, lower_tex: string, middle_tex: string, sector: Sector) {
        this.offset = offset
        this.upper_tex = upper_tex
        this.lower_tex = lower_tex
        this.middle_tex = middle_tex
        this.sector = sector
    }

    get line_def(): LineDef {
        return this._line_def!
    }
}

export class Segment {
    start: THREE.Vector2
    end: THREE.Vector2
    angle: number
    line_def: LineDef
    direction: boolean
    offset: number

    constructor(start: THREE.Vector2, end: THREE.Vector2, angle: number, line_def: LineDef, direction: boolean, offset: number) {
        this.start = start
        this.end = end
        this.angle = angle
        this.line_def = line_def
        this.direction = direction
        this.offset = offset
    }

    get side_def(): SideDef {
        return (this.direction ? this.line_def.back : this.line_def.front)!
    }
}

export class SubSector {
    segments: Segment[]

    constructor(segments: Segment[]) {
        this.segments = segments
    }

    get sector(): Sector {
        return this.segments[0].side_def.sector
    }
}

export class Node {
    start: THREE.Vector2
    rel_end: THREE.Vector2
    left_bb: THREE.Box2
    right_bb: THREE.Box2
    left: Node | SubSector
    right: Node | SubSector

    constructor(start: THREE.Vector2, rel_end: THREE.Vector2, left_bb: THREE.Box2, right_bb: THREE.Box2, left: Node | SubSector, right: Node | SubSector) {
        this.start = start
        this.rel_end = rel_end
        this.left_bb = left_bb
        this.right_bb = right_bb
        this.left = left
        this.right = right
    }

    get end(): THREE.Vector2 {
        return new THREE.Vector2().add(this.start).add(this.rel_end)
    }

    get bb(): THREE.Box2 {
        return new THREE.Box2().union(this.left_bb).union(this.right_bb)
    }
}

export class Sector {
    floor_height: number
    ceil_height: number
    floor_tex: string
    ceil_tex: string
    light_height: number
    special_type: number
    tag: number
    sub_sectors: SubSector[] = []

    constructor(floor_height: number, ceil_height: number, floor_tex: string, ceil_tex: string, light_height: number, special_type: number, tag: number) {
        this.floor_height = floor_height
        this.ceil_height = ceil_height
        this.floor_tex = floor_tex
        this.ceil_tex = ceil_tex
        this.light_height = light_height
        this.special_type = special_type
        this.tag = tag
    }
}

export class Level {
    name: string
    things: Thing[]
    line_defs: LineDef[]
    root: Node
    sectors: Sector[]

    constructor(name: string, things: Thing[], line_defs: LineDef[], root: Node, sectors: Sector[]) {
        this.name = name
        this.things = things
        this.line_defs = line_defs
        this.root = root
        this.sectors = sectors
    }
}

export class WAD {
    levels: Level[]

    constructor(levels: Level[]) {
        this.levels = levels
    }
}
