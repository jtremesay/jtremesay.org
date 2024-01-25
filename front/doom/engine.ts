import { WAD } from "./types"
import * as THREE from "three"

export class DoomEngine {
    should_run: boolean = true
    wad: WAD
    scene: THREE.Scene
    camera: THREE.Camera
    renderer: THREE.Renderer

    constructor(wad: WAD, level_i: number, renderer: THREE.Renderer) {
        this.wad = wad
        this.renderer = renderer

        let level = this.wad.levels[level_i]
        console.log(level)
        this.scene = new THREE.Scene()

        let left = Infinity
        let right = -Infinity
        let bottom = Infinity
        let top = -Infinity
        for (let vertex of level.vertexes) {
            if (vertex.x < left) {
                left = vertex.x
            }
            if (vertex.x > right) {
                right = vertex.x
            }
            if (vertex.y < bottom) {
                bottom = vertex.y
            }
            if (vertex.y > top) {
                top = vertex.y
            }
        }

        let width = right - left
        let height = top - bottom
        this.camera = new THREE.OrthographicCamera(left - width * 0.05, right + width * 0.05, top + height * 0.05, bottom - height * 0.05)

        for (let ss of level.sub_sectors) {
            let shape = new THREE.Shape()

            for (let seg of ss.segments()) {
                let svertex = seg.start
                shape.moveTo(svertex.x, svertex.y)
                let evertex = seg.end
                shape.lineTo(evertex.x, evertex.y)
            }
            let geometry = new THREE.ShapeGeometry(shape)
            let material = new THREE.MeshBasicMaterial({
                color: (Math.random() * 0xff << 24) | (Math.random() * 0xff << 16) | (Math.random() * 0xff << 8) | 0xff,
            })
            let mesh = new THREE.Mesh(geometry, material)
            this.scene.add(mesh)
        }
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