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
import { WAD, Level } from "./types"
import * as THREE from "three"
import * as d3 from "d3"
import { View2D } from "./view2d"
import { View3D } from "./view3d"
import { EngineRenderer } from "../jengine/engine"

export class DoomData {
    wad: WAD
    camera: THREE.Camera = new THREE.OrthographicCamera()
    scene: THREE.Scene = new THREE.Scene()
    level_selector: HTMLSelectElement
    view2D: View2D
    view3D: View3D

    constructor(root: HTMLElement, wad: WAD) {
        this.wad = wad

        let $root = d3.select(root)

        let $level_selector = $root.append("div")
            .append("label")
            .text("Level:")
            .append("select")
            .on("change", this.on_level_selected.bind(this))
        $level_selector
            .selectAll("option")
            .data(this.wad.levels)
            .join("option")
            .attr("value", (_d, i) => i)
            .attr("label", (d) => d.name)
        this.level_selector = $level_selector.node()!

        this.view2D = new View2D()
        root.appendChild(this.view2D.renderer.domElement)

        this.view3D = new View3D()
        root.appendChild(this.view3D.renderer.domElement)

        this.on_level_selected()
    }

    on_level_selected() {
        let level_i = d3.select(this.level_selector).property("value")
        let level = this.wad.levels[level_i]
        this.load_level(level)
    }

    load_level(level: Level) {
        console.log(level)
        this.view2D.load_level(level)
        this.view3D.load_level(level)
    }
}

export class DoomRenderer implements EngineRenderer<DoomData> {
    constructor() {
    }

    render(data: DoomData | null): void {
        if (data === null) {
            return
        }

        data.view2D.render()
        data.view3D.render()
    }
}