import axios from 'axios';
import * as d3 from 'd3'
import { load_wad } from '../doom/loaders';
import { read_lumps } from '../doom/lumps';
import { WAD } from '../doom/types';


class DoomEngine {
    wad: WAD
    ctx: WebGLRenderingContext

    constructor(wad: WAD, canvas: HTMLCanvasElement) {
        this.wad = wad
        this.ctx = canvas.getContext("webgl")!
    }

    draw() {

    }

    update() {
    }

    frame() {
        this.update()
        this.draw()
    }

    run() {
        this.frame()
        window.requestAnimationFrame(this.run.bind(this))
    }
}

function main() {
    // We don't really need d3 and axios for that,
    // but I wanted to pex with these libs
    let $app = d3.select(".doom")
    let url = $app.attr("data-wad-url")
    let $progress = $app.append("pre")
    axios.get(url, {
        responseType: "arraybuffer",
        onDownloadProgress: (event) => {
            $progress.text(`Downloading ${url}... ${event.progress! * 100}%`)
        },
        transformResponse: (data) => load_wad(read_lumps(data))
    }).then((response) => {
        let $canvas = $app.append("canvas")
            .attr("width", 800)
            .attr("height", 600)
        let engine = new DoomEngine(response.data, $canvas.node()!)
        engine.run()
    })
}

main()
