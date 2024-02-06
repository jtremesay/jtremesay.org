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
import { WAD, Sector } from "./types"
import * as THREE from "three"
import * as d3 from "d3"

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

    let material = new THREE.MeshBasicMaterial({ color: `hsl(${Math.random() * 360}, 100%, 20%)` })
    let material1 = new THREE.MeshBasicMaterial({ color: THREE.Color.NAMES.white })
    let g = new THREE.Group()
    for (let path of paths) {
        let shape = new THREE.Shape(path)

        g.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), material))
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(shape.getPoints()), material1))
    }

    return g
}

function generate_sectors_group(sectors: Sector[], mask = -1): THREE.Group {
    let g = new THREE.Group()
    for (let i = 0; i < sectors.length; ++i) {
        if (mask == -1 || i == mask) {
            g.add(generate_sector_group(sectors[i]))
        }
    }
    return g
}

export class Engine {
    wad: WAD
    level_i: number = 0
    camera: THREE.Camera = new THREE.OrthographicCamera()
    renderer: THREE.Renderer
    scene: THREE.Scene = new THREE.Scene()
    level_selector: HTMLSelectElement
    draw_sectors_selector_cb: HTMLInputElement


    constructor(root: HTMLElement, wad: WAD) {
        this.wad = wad

        let $root = d3.select(root)

        let $level_selector = $root.append("div")
            .append("label")
            .text("Level:")
            .append("select")
            .on("change", this.reload.bind(this))
        $level_selector
            .selectAll("option")
            .data(this.wad.levels)
            .join("option")
            .attr("value", (_d, i) => i)
            .attr("label", (d) => d.name)
        this.level_selector = $level_selector.node()!

        this.draw_sectors_selector_cb = $root.append("div")
            .append("label")
            .text("Sector:")
            .append("input")
            .attr("type", "number")
            .attr("min", -1)
            .attr("value", -1)
            .on("input", this.reload.bind(this))
            .node()!
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(800, 600)
        root.appendChild(this.renderer.domElement)

        this.reload()
    }

    reload() {
        this.level_i = d3.select(this.level_selector).property("value")
        let level = this.wad.levels[this.level_i]
        let bb = level.root.bb.expandByScalar(100)
        this.camera = new THREE.OrthographicCamera(bb.min.x, bb.max.x, bb.max.y, bb.min.y)
        this.camera.position.z = 1;

        this.scene = new THREE.Scene()

        let $draw_sectors_selector = d3.select(this.draw_sectors_selector_cb)
        $draw_sectors_selector.attr("max", level.sectors.length - 1)
        let selected_sector_i = $draw_sectors_selector.property("value")
        this.scene.add(generate_sectors_group(level.sectors, selected_sector_i))
    }

    draw() {
        this.renderer.render(this.scene, this.camera)
    }

    run() {
        this.draw()
        window.requestAnimationFrame(this.run.bind(this))
    }
}
