import axios from 'axios';
import { load_wad } from '../doom/loaders';
import { read_lumps } from '../doom/lumps';
import { WAD } from '../doom/types';
import * as THREE from 'three';

class DoomEngine {
    wad: WAD
    scene: THREE.Scene
    camera: THREE.Camera
    renderer: THREE.Renderer

    constructor(wad: WAD, renderer: THREE.Renderer) {
        this.wad = wad
        this.renderer = renderer

        let level = this.wad.levels[0]
        this.scene = new THREE.Scene()

        let left = Infinity
        let right = -Infinity
        let bottom = Infinity
        let top = -Infinity
        for (let vertex of level.vertexes) {
            if (vertex.x < left) {
                left = vertex.x
            }
            if (vertex.x > left) {
                right = vertex.x
            }
            if (vertex.y < bottom) {
                bottom = vertex.y
            }
            if (vertex.y > top) {
                top = vertex.y
            }
        } console.log(left, right, top, bottom)
        this.camera = new THREE.OrthographicCamera(left, right, top, bottom)

        for (let ss of level.sub_sectors) {
            let shape = new THREE.Shape()
            for (let i = 0; i < ss.segments_count; ++i) {
                let seg = level.segments[ss.segments_i + i]
                if (i == 0) {
                    let vertex = level.vertexes[seg.start_vertex]
                    shape.moveTo(vertex.x, vertex.y)
                }
                let vertex = level.vertexes[seg.end_vertex]
                shape.lineTo(vertex.x, vertex.y)
            }
            let geometry = new THREE.ShapeGeometry(shape)
            let material = new THREE.MeshBasicMaterial({
                color: (Math.random() * 0xffffff << 8 | 0xff)
            })
            let mesh = new THREE.Mesh(geometry, material)
            this.scene.add(mesh)
        }

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        this.camera.position.z = 5;
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
        this.frame()
        window.requestAnimationFrame(this.run.bind(this))
    }
}

function main() {
    let app = document.querySelector(".doom")! as HTMLElement

    let progress = document.createElement("p")
    app.appendChild(progress)

    // We don't really need axios for that,
    // but I wanted to pex with this lib
    let url = app.dataset.wadUrl!
    axios.get(url, {
        responseType: "arraybuffer",
        onDownloadProgress: (event) => {
            progress.textContent = `Downloading ${url}... ${event.progress! * 100}%`
        },
        transformResponse: (data) => load_wad(read_lumps(data))
    }).then((response) => {
        let renderer = new THREE.WebGLRenderer()
        renderer.setSize(800, 600);

        app.appendChild(renderer.domElement)
        let engine = new DoomEngine(response.data, renderer)
        engine.run()
    })
}

main()
