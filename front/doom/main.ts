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
import axios from 'axios';
import { load_wad } from './loaders';
import { read_lumps } from './lumps';
import * as THREE from 'three';
import { DoomEngine } from './engine';
import { WAD } from './types';
import * as d3 from "d3"

function download_wad(url: string, callback: (wad: WAD) => void, progress?: HTMLElement) {
    // We don't really need axios for that,
    // but I wanted to pex with this lib
    axios.get(url, {
        responseType: "arraybuffer",
        onDownloadProgress: (event) => {
            if (progress) {
                progress.textContent = `Downloading ${url}... ${event.progress! * 100}%`
            }
        },
        transformResponse: (data) => load_wad(read_lumps(data))
    }).then((response) => callback(response.data))
}


export function main() {
    const $app = d3.select(".doom")
    const $progress = $app.append("p")

    let renderer = new THREE.WebGLRenderer()
    renderer.setSize(800, 600);

    const $level_sel = $app.append("div").append("label").text("Level: ").append("select");
    const $draw_linedefs = $app.append("div").append("label").text("Draw linedef: ").append("input").attr("type", "checkbox").attr("checked", true);
    const $draw_subsectors = $app.append("div").append("label").text("Draw sub sectors (bugged): ").append("input").attr("type", "checkbox");
    const $draw_bboxes = $app.append("div").append("label").text("Draw bounding boxes: ").append("input").attr("type", "checkbox");
    ($app.node()! as HTMLElement).appendChild(renderer.domElement)

    download_wad(
        $app.attr("data-wad-url"),
        (wad) => {
            let engine = new DoomEngine(wad, 0, renderer)
            engine.linedefs.visible = $draw_linedefs.node()!.checked
            engine.bboxes.visible = $draw_bboxes.node()!.checked
            engine.subsectors.visible = $draw_subsectors.node()!.checked

            $level_sel.selectAll("option")
                .data(wad.levels.map((l) => l.name))
                .join("option")
                .attr("label", function (d) {
                    return d
                })
                .attr("value", function (_d, i) {
                    return i
                })
            $level_sel.on("change", function () {
                engine.stop()

                engine = new DoomEngine(wad, $level_sel.property("value"), renderer)
                engine.linedefs.visible = $draw_linedefs.node()!.checked
                engine.bboxes.visible = $draw_bboxes.node()!.checked
                engine.subsectors.visible = $draw_subsectors.node()!.checked
                engine.run()
            })
            $draw_linedefs.on("change", function () {
                engine.linedefs.visible = this.checked
            })
            $draw_bboxes.on("change", function () {
                engine.bboxes.visible = this.checked
            })
            $draw_subsectors.on("change", function () {
                engine.subsectors.visible = this.checked
            })

            engine.run()
        },
        $progress.node()!
    )
}
