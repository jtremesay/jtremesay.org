/*
 * Computer Generated Images
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * doom
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import * as THREE from "three"
import { Level, Sector } from "./types"

const WHITE_MESH_MATERIAL = new THREE.MeshBasicMaterial({ color: THREE.Color.NAMES.white })

function generate_sector_group(sector: Sector): THREE.Group {
    let paths = []
    let side_defs = [...sector.side_defs]
    let sd = side_defs.shift()!
    paths.push([sd.line_def.start, sd.line_def.end])

    while (side_defs.length) {
        let last_path = paths[paths.length - 1]
        let last_p = last_path[last_path.length - 1]

        let sd_i = 0
        for (; sd_i < side_defs.length; ++sd_i) {
            let sd = side_defs[sd_i]
            if (last_p.equals(sd.line_def.start)) {
                last_path.push(sd.line_def.start)
                last_path.push(sd.line_def.end)
                break
            } else if (last_p.equals(sd.line_def.end)) {
                last_path.push(sd.line_def.end)
                last_path.push(sd.line_def.start)
                break
            }
        }

        if (sd_i < side_defs.length) {
            side_defs.splice(sd_i, 1)
        } else {
            let sd = side_defs.shift()!
            paths.push([sd.line_def.start, sd.line_def.end])
        }
    }

    let material = new THREE.MeshBasicMaterial({ color: `hsl(${Math.random() * 360}, 100%, 40%)` })
    let g = new THREE.Group()
    for (let path of paths) {
        let shape = new THREE.Shape(path)
        g.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), material))

        let border = new THREE.Line(new THREE.BufferGeometry().setFromPoints(shape.getPoints()), WHITE_MESH_MATERIAL)
        border.position.z = 0.1
        g.add(border)
    }

    return g
}

function generate_sectors_group(sectors: Sector[]): THREE.Group {
    return sectors.reduce((g, s) => g.add(generate_sector_group(s)), new THREE.Group())
}

export class View2D {
    camera: THREE.OrthographicCamera = new THREE.OrthographicCamera()
    scene: THREE.Scene = new THREE.Scene()
    renderer: THREE.Renderer = new THREE.WebGLRenderer()
    constructor() {
        this.renderer.setSize(800, 600)
        this.camera.position.z = 1
    }

    load_level(level: Level) {
        this.scene.clear()
        this.scene.add(generate_sectors_group(level.sectors))
        let bb = level.root.bb.expandByScalar(100)
        this.camera.left = bb.min.x
        this.camera.right = bb.max.x
        this.camera.top = bb.max.y
        this.camera.bottom = bb.min.y
        this.camera.updateProjectionMatrix()
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }
}
