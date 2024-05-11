/*
 * Raycaster
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * raytracer/engine.ts
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

import { Camera } from "./camera";
import { Drawer } from "./drawer";
import { render } from "./render";
import { Scene } from "./scene";
import { Vector2 } from "./vector2";
import { CanvasDrawer } from "./drawer_canvas";
import { DrawerMultiplexer } from "./drawer_multiplexer";
import { SVGDrawer } from "./drawer_svg";


function default_scene(): Scene {
    let scene = new Scene();
    scene.add_room(new Vector2(0, 0), new Vector2(3, 3));
    scene.add_door(new Vector2(0, -2.0));
    scene.add_room(new Vector2(0, -3.5), new Vector2(5, 2));

    return scene;
}


class RaycasterUI {
    canvas_output: HTMLCanvasElement;
    svg_output: SVGElement;

    constructor(node: HTMLElement) {
        this.canvas_output = node.getElementsByClassName("rc-output-canvas")[0] as unknown as HTMLCanvasElement;
        this.svg_output = node.getElementsByClassName("rc-output-svg")[0] as unknown as SVGElement;
    }
}


class SimulationState {
    moving: number; // 0 = stationary, > 0 = moving forward, < 0 = moving backward
    rotating: number;// 0 = stationary, < 0 = rotating left, > 0 = rotating right

    constructor() {
        this.moving = 0;
        this.rotating = 0;
    }
}

export class Raycaster {
    ui: RaycasterUI;
    scene: Scene;
    camera: Camera;
    drawer: Drawer;
    output_size: Vector2;
    dt: number;

    state: SimulationState;

    constructor(node: HTMLElement) {
        this.dt = 1 / 60;
        this.ui = new RaycasterUI(node);
        this.setup_ui();

        // Load the scene
        this.scene = default_scene();

        // Create the camera
        this.camera = new Camera();

        // Build a drawing pipelines to do the render on
        // multiple outputs
        const drawer = new DrawerMultiplexer();

        const canvas_size = new Vector2(this.ui.canvas_output.width, this.ui.canvas_output.height);
        let canvas_ctx = this.ui.canvas_output.getContext('2d');
        if (canvas_ctx === null) {
            throw new Error("Cannot create a canvas context");

        }
        drawer.drawers.push(new CanvasDrawer(canvas_ctx, canvas_size));
        this.output_size = canvas_size;

        drawer.drawers.push(new SVGDrawer(this.ui.svg_output, canvas_size));
        this.drawer = drawer;

        // Create the simulation state
        this.state = new SimulationState();

        this.render();
    }

    setup_ui() {
        console.log("setup ui")
        let self = this;
        window.addEventListener("keydown", function (event) {
            //console.log(`key down, code: ${event.code}`);
            switch (event.code) {
                case "KeyW":
                    self.state.moving = 1.0;
                    break;

                case "KeyS":
                    self.state.moving = -1.0;
                    break;

                case "KeyA":
                    self.state.rotating = -1.0;
                    break;

                case "KeyD":
                    self.state.rotating = 1.0;
                    break;
            }
        });
        window.addEventListener("keyup", function (event) {
            //console.log(`key up, code: ${event.code}`);
            switch (event.code) {
                case "KeyW":
                case "KeyS":
                    self.state.moving = 0.0;
                    break;

                case "KeyA":
                case "KeyD":
                    self.state.rotating = 0.0;
                    break;

            }
        });
    }

    update() {
        //console.log("update");

        // Update the position of the camera
        this.camera.direction = this.camera.direction.rotate_by(this.dt * this.state.rotating);
        let target_position = this.camera.position.add(this.camera.direction.mul(this.state.moving * this.dt));
        let distance = this.scene.distance_to_neareast_object(target_position);
        if (distance > 0.01) {
            this.camera.position = target_position;
        }
    }

    render() {
        render(this.scene, this.camera, this.drawer, this.output_size);
    }

    frame() {
        // Update the simulation
        this.update();

        // Render the scene
        this.render()
    }

    run() {
        setTimeout(() => {
            this.frame();

            this.run();
        }, this.dt);
    }
}
