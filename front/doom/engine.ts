import { WAD, Node, SubSector } from "./types"
import * as THREE from "three"

function visit_subsector(ss: SubSector, scene: THREE.Scene) {
    let shape = new THREE.Shape()

    for (let seg of ss.segments()) {
        let svertex = seg.start
        shape.moveTo(svertex.x, svertex.y)
        let evertex = seg.end
        shape.lineTo(evertex.x, evertex.y)
    }
    let geometry = new THREE.ShapeGeometry(shape)
    let material = new THREE.MeshBasicMaterial({
        color: (Math.random() * 0xff << 16) | (Math.random() * 0xff << 8) | 0xff,
    })
    let mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
}

function visit_node(node: Node, scene: THREE.Scene) {
    visit_tree(node.left, scene)
    visit_tree(node.right, scene)
}

function visit_tree(node: Node | SubSector, scene: THREE.Scene) {
    if (node instanceof SubSector) {
        visit_subsector(node, scene)
    } else {
        visit_node(node, scene)
    }
}

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

        let bb = new THREE.Box2()
        level.vertexes.map((v) => bb.expandByPoint(v))
        bb.expandByVector(bb.getSize(new THREE.Vector2()).multiplyScalar(0.05))

        this.camera = new THREE.OrthographicCamera(bb.min.x, bb.max.x, bb.max.y, bb.min.y)

        visit_tree(level.nodes[level.nodes.length - 1], this.scene)
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
