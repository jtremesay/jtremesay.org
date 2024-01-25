import axios from 'axios';
import { load_wad } from '../doom/loaders';
import { read_lumps } from '../doom/lumps';
import * as THREE from 'three';
import { DoomEngine } from '../doom/engine';
import { WAD } from '../doom/types';

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

function main() {
    let app = document.querySelector(".doom")! as HTMLElement

    let progress = document.createElement("p")
    app.appendChild(progress)

    download_wad(
        app.dataset.wadUrl!,
        (wad) => {
            let renderer = new THREE.WebGLRenderer()
            renderer.setSize(800, 600);

            app.appendChild(renderer.domElement)
            let engine = new DoomEngine(wad, renderer)
            engine.run()
        },
        progress
    )
}

main()
