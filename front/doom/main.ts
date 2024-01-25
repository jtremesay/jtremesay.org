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

    const $level_sel = $app.append("label").text("Level: ").append("select");
    ($app.node()! as HTMLElement).appendChild(renderer.domElement)

    download_wad(
        $app.attr("data-wad-url"),
        (wad) => {
            let engine = new DoomEngine(wad, 0, renderer)

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
                engine.run()
            })

            engine.run()
        },
        $progress.node()!
    )
}
