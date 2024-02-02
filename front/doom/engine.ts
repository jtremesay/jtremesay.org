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
import { WAD, Node, SubSector, LineDef } from "./types"
import * as THREE from "three"

function generate_bbox(bb: THREE.Box2, color: number): THREE.Object3D {
    let shape = new THREE.Shape()
    shape.moveTo(bb.min.x, bb.min.y)
    shape.lineTo(bb.min.x, bb.max.y)
    shape.lineTo(bb.max.x, bb.max.y)
    shape.lineTo(bb.max.x, bb.min.y)
    shape.lineTo(bb.min.x, bb.min.y)

    //Lines
    return new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(shape.getPoints()),
        new THREE.LineBasicMaterial({ color: color })
    )
}

function generate_line(start: THREE.Vector2, end: THREE.Vector2, color: number): THREE.Object3D {
    let shape = new THREE.Shape()
    shape.moveTo(start.x, start.y)
    shape.lineTo(end.x, end.y)

    return new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(shape.getPoints()),
        new THREE.LineBasicMaterial({ color: color })
    )
}

function generate_sub_sector(sub_sector: SubSector): THREE.Object3D {
    let shape = new THREE.Shape()
    for (let seg of sub_sector.segments) {
        let svertex = seg.start
        shape.moveTo(svertex.x, svertex.y)
        let evertex = seg.end
        shape.lineTo(evertex.x, evertex.y)
    }

    return new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({
        color: (Math.random() * 0xff << 16) | (Math.random() * 0xff << 8) | 0xff,
    }))
}

function generate_sub_sectors(node: Node | SubSector): THREE.Object3D {
    if (node instanceof SubSector) {
        return generate_sub_sector(node)
    }

    let group = new THREE.Group()
    group.add(generate_sub_sectors(node.left))
    group.add(generate_sub_sectors(node.right))

    return group
}



function generate_bboxes(node: Node): THREE.Object3D {
    let group = new THREE.Group()
    if (node.left instanceof Node) {
        group.add(generate_bboxes(node.left))
    }

    if (node.right instanceof Node) {
        group.add(generate_bboxes(node.right))
    }

    group.add(generate_bbox(node.left_bb, THREE.Color.NAMES.green))
    group.add(generate_bbox(node.right_bb, THREE.Color.NAMES.red))
    return group
}

function generate_line_defs(line_defs: LineDef[]): THREE.Object3D {
    let group = new THREE.Group()
    for (let line_def of line_defs) {
        group.add(generate_line(
            line_def.start,
            line_def.end,
            THREE.Color.NAMES.white
        ))
    }

    return group
}

function generate_partition(node: Node): THREE.Object3D {
    let group = new THREE.Group()
    {
        let intersect = new THREE.Box2().union(node.left_bb).intersect(node.right_bb)

        if (node.rel_end.x == 0) {
            group.add(generate_line(intersect.min, intersect.max, THREE.Color.NAMES.blue))
        } else if (node.rel_end.y == 0) {
            group.add(generate_line(intersect.min, intersect.max, THREE.Color.NAMES.red))
        } else {
            group.add(generate_line(intersect.min, intersect.max, THREE.Color.NAMES.magenta))
            group.add(generate_line(new THREE.Vector2(intersect.min.x, intersect.max.y), new THREE.Vector2(intersect.max.x, intersect.min.y), THREE.Color.NAMES.cyan))
        }


    }

    {
        group.add(generate_line(node.start, node.end, THREE.Color.NAMES.yellow))
    }

    return group
}

function generate_partition_lines(node: Node): THREE.Object3D {
    let group = new THREE.Group()
    if (node.left instanceof Node) {
        group.add(generate_partition_lines(node.left))
    }

    if (node.right instanceof Node) {
        group.add(generate_partition_lines(node.right))
    }
    group.add(generate_partition(node))
    return group
}

export class DoomEngine {
    should_run: boolean = true
    wad: WAD
    scene: THREE.Scene
    camera: THREE.Camera
    renderer: THREE.Renderer
    line_defs: THREE.Object3D
    bboxes: THREE.Object3D
    sub_sectors: THREE.Object3D
    partition_lines: THREE.Object3D

    constructor(wad: WAD, level_i: number, renderer: THREE.Renderer) {
        this.wad = wad
        this.renderer = renderer

        let level = this.wad.levels[level_i]
        console.log(level)
        this.scene = new THREE.Scene()

        let bb = level.root.bb.expandByScalar(100)
        this.camera = new THREE.OrthographicCamera(bb.min.x, bb.max.x, bb.max.y, bb.min.y)


        // Sub sectors
        this.sub_sectors = generate_sub_sectors(level.root)
        this.scene.add(this.sub_sectors)

        // BBoxes
        this.bboxes = generate_bboxes(level.root)
        this.scene.add(this.bboxes)

        // Linedefs
        this.line_defs = generate_line_defs(level.line_defs)
        this.scene.add(this.line_defs)

        // Partition lines
        this.partition_lines = generate_partition_lines(level.root)
        this.scene.add(this.partition_lines)

        this.camera.position.z = 1;
    }

    draw() {
        this.renderer.render(this.scene, this.camera)
    }

    update() {
    }

    frame() {
        this.update()
        this.draw()
    }

    run() {
        if (!this.should_run) {
            return
        }
        this.frame()
        window.requestAnimationFrame(this.run.bind(this))
    }

    stop() {
        this.should_run = false
    }
}
