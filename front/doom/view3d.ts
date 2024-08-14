/*
 * Computer Generated Images
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * doom
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import * as THREE from "three"
import { Level } from "./types"



export class View3D {
    camera: THREE.Camera = new THREE.PerspectiveCamera(90, 4 / 3)
    scene: THREE.Scene = new THREE.Scene()
    renderer: THREE.Renderer = new THREE.WebGLRenderer()
    constructor() {
        this.renderer.setSize(800, 600)
    }

    load_level(level: Level) {
        this.scene.clear()
        let p1 = level.things[0]
        this.camera.position.x = p1.position.x
        this.camera.position.y = p1.position.y
        this.camera.rotateZ(2 * Math.PI * p1.angle / 0xfff)
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }
}
