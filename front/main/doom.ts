import axios from 'axios';
import * as d3 from 'd3'
import * as THREE from 'three'
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js'
import { WAD } from '../doom/WAD';
import { read_wad } from '../doom/wad_reader';


function doom_main(app: Element, wad: WAD) {
    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    app.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const controls = new FirstPersonControls(camera, renderer.domElement)
    const axesHelper = new THREE.AxesHelper(64000)
    scene.add(axesHelper)

    let map = wad.levels[0]
    for (let linedef of map.linedefs) {
        let v1 = map.vertexes[linedef.start_vertex]
        let v2 = map.vertexes[linedef.end_vertex]

        if (linedef.front_sidedef < map.sidedefs.length) {
            let sidedef = map.sidedefs[linedef.front_sidedef]
            let sector = map.sectors[sidedef.sector]

            let geometry = new THREE.BufferGeometry()
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
                v1.x, sector.ceil_height, v1.y,
                v2.x, sector.ceil_height, v2.y,
                v2.x, sector.floor_height, v2.y,
                v1.x, sector.ceil_height, v1.y,
                v2.x, sector.floor_height, v2.y,
                v1.x, sector.floor_height, v1.y,
            ]), 3))

            const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff | 0 })
            const cube = new THREE.Mesh(geometry, material)
            scene.add(cube)
        }



        if (linedef.back_sidedef < map.sidedefs.length && false) {
            let sidedef = map.sidedefs[linedef.back_sidedef]
            let sector = map.sectors[sidedef.sector]

            let geometry = new THREE.BufferGeometry()
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
                v1.x, sector.floor_height, v1.y,
                v2.x, sector.ceil_height, v2.y,
                v2.x, sector.floor_height, v2.y,
                v1.x, sector.floor_height, v1.y,
                v1.x, sector.ceil_height, v1.y,
                v2.x, sector.ceil_height, v2.y,
            ]), 3))

            const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff | 0 })
            const cube = new THREE.Mesh(geometry, material)
            scene.add(cube)
        }
    }

    let v = map.vertexes[288]
    let sector = map.sectors[0]
    camera.position.x = v.x
    camera.position.y = sector.ceil_height + 1
    camera.position.z = v.y

    function animate() {
        requestAnimationFrame(animate)

        controls.update(1 / 60)
        //camera.lookAt(new THREE.Vector3(v.x, sector.ceil_height + 10, v.y))

        renderer.render(scene, camera)
    }

    animate()
}

function main() {
    let $app = d3.select(".app")
    let url = $app.attr("data-wad-url")
    let $progress = $app.append("pre")
    axios.get(url, {
        responseType: "arraybuffer",
        transformResponse: (data) => new Uint8Array(data),
        onDownloadProgress: (event) => {
            $progress.text(`Downloading ${url}... ${event.progress! * 100}%`)
            console.log(event)
        }
    }).then((response) => {
        let wad = read_wad(response.data)
        doom_main($app.node()! as Element, wad)
    })
}

main()
