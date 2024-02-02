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
import { WAD, Node, SubSector } from "./types"
import * as THREE from "three"

function visit_subsector(ss: SubSector, subsectors: THREE.Object3D) {
    let shape = new THREE.Shape()

    for (let seg of ss.segments) {
        let svertex = seg.start
        shape.moveTo(svertex.x, svertex.y)
        let evertex = seg.end
        shape.lineTo(evertex.x, evertex.y)
    }

    subsectors.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({
        color: (Math.random() * 0xff << 16) | (Math.random() * 0xff << 8) | 0xff,
    })))
}

function add_bb(bb: THREE.Box2, bboxes: THREE.Object3D, color: number) {
    let shape = new THREE.Shape()
    shape.moveTo(bb.min.x, bb.min.y)
    shape.lineTo(bb.min.x, bb.max.y)
    shape.lineTo(bb.max.x, bb.max.y)
    shape.lineTo(bb.max.x, bb.min.y)
    shape.lineTo(bb.min.x, bb.min.y)

    //Lines
    bboxes.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(shape.getPoints()),
        new THREE.LineBasicMaterial({ color: color })
    ))
}

function visit_node(node: Node, bboxes: THREE.Object3D, subsectors: THREE.Object3D) {
    visit_tree(node.left, bboxes, subsectors)
    visit_tree(node.right, bboxes, subsectors)
    add_bb(node.left_bb, bboxes, THREE.Color.NAMES.green)
    add_bb(node.right_bb, bboxes, THREE.Color.NAMES.blue)
}

function visit_tree(node: Node | SubSector, bboxes: THREE.Object3D, subsectors: THREE.Object3D) {
    if (node instanceof SubSector) {
        visit_subsector(node, subsectors)
    } else {
        visit_node(node, bboxes, subsectors)
    }
}

export class DoomEngine {
    should_run: boolean = true
    wad: WAD
    scene: THREE.Scene
    camera: THREE.Camera
    renderer: THREE.Renderer
    linedefs: THREE.Object3D
    bboxes: THREE.Object3D
    subsectors: THREE.Object3D

    constructor(wad: WAD, level_i: number, renderer: THREE.Renderer) {
        this.wad = wad
        this.renderer = renderer

        let level = this.wad.levels[level_i]
        console.log(level)
        this.scene = new THREE.Scene()

        let bb = level.root.left_bb.union(level.root.right_bb).expandByScalar(100)
        this.camera = new THREE.OrthographicCamera(bb.min.x, bb.max.x, bb.max.y, bb.min.y)

        // BBoxes & subsectors
        this.bboxes = new THREE.Object3D()
        this.subsectors = new THREE.Object3D()
        visit_tree(level.root, this.bboxes, this.subsectors)
        this.scene.add(this.bboxes)
        this.scene.add(this.subsectors)

        // Linedefs
        this.linedefs = new THREE.Object3D()
        this.scene.add(this.linedefs)
        for (let linedef of level.line_defs) {
            let shape = new THREE.Shape()
            shape.moveTo(linedef.start.x, linedef.start.y)
            shape.lineTo(linedef.end.x, linedef.end.y)

            //Lines
            this.linedefs.add(new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(shape.getPoints()),
                new THREE.LineBasicMaterial({ color: THREE.Color.NAMES.red })
            ))
        }

        // BLAAAAAA

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
