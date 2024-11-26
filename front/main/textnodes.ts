/*
 * Text nodes
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * textnodes.ts
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
import 'vite/modulepreload-polyfill';
import { Vector2 } from '../jengine/vector';
import { BaseEngine, } from '../jengine/engine';

const FONT: string = "30px Arial";

class Particle {
    origin: Vector2;
    position: Vector2;
    acceleration: Vector2 = new Vector2(0, 0);
    velocity: Vector2 = new Vector2(0, 0);

    constructor(origin: Vector2) {
        this.origin = origin;
        this.position = origin;
    }

    update(dt: number, mouse_position: Vector2 | null) {
        let repulsion = new Vector2(0, 0);
        if (mouse_position) {
            const diff = this.position.sub(mouse_position);
            const distance = diff.mag();
            if (distance > .1) {
                const distance_squared = distance * distance;
                const direction = diff.normalize();
                repulsion = direction.mul(1 / distance_squared);
            }
        }

        let attraction = new Vector2(0, 0);
        {
            const diff = this.position.sub(this.origin);
            const distance = diff.mag();
            if (distance > .1) {
                const direction = diff.normalize().mul(-1);
                attraction = direction.mul(distance);
            }
        }

        const force = attraction.mul(10).add(repulsion.mul(10));
        this.acceleration = force;
        this.velocity = this.velocity.add(this.acceleration.mul(dt)).mul(0.99);
        this.position = this.position.add(this.velocity.mul(dt));

    }
}

class GNEngine extends BaseEngine {
    input: HTMLInputElement;
    headless_canvas: HTMLCanvasElement = document.createElement("canvas");
    headless_ctx: CanvasRenderingContext2D = this.headless_canvas.getContext("2d")!;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    particles: Particle[] = [];
    mouse_position: Vector2 | null = null;

    constructor(input: HTMLInputElement, canvas: HTMLCanvasElement) {
        super();
        this.input = input;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        input.addEventListener("input", this.on_input.bind(this));
        canvas.addEventListener("mousemove", this.on_mousemove.bind(this));
        canvas.addEventListener("mouseleave", this.on_mousseleave.bind(this));
        this.set_text(input.value);
    }


    on_input(event: Event) {
        const text = (event.target as HTMLInputElement).value;
        this.set_text(text);
    }

    set_text(text: string) {
        // Get the size of the bounding box
        this.headless_ctx.font = FONT;
        const textMetrics = this.headless_ctx.measureText(text);
        const width = Math.ceil(textMetrics.width);
        const height = Math.ceil(textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent);

        // Resize the canvas to the bounding box
        this.headless_canvas.width = width;
        this.headless_canvas.height = height;
        this.canvas.width = width * 10;
        this.canvas.height = height * 10;

        // Draw the text
        this.headless_ctx.font = "30px Arial";
        this.headless_ctx.fillStyle = "black";
        this.headless_ctx.textAlign = "center";
        this.headless_ctx.textBaseline = "middle";
        this.headless_ctx.fillText(text, width / 2, height / 2);

        // Read the pixels
        const imageData = this.headless_ctx.getImageData(0, 0, width, height);
        const pixels_data = imageData.data;

        this.particles = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = pixels_data[index];
                const g = pixels_data[index + 1];
                const b = pixels_data[index + 2];
                const a = pixels_data[index + 3];
                // Fun fact: firefox use the alpha channel
                // instead of the rgb channels to render the text
                // so basically, all pixels are (0, 0, 0, a)
                // where a is the alpha value of the pixel
                // No idea if this tricks is used by the other browsers.
                // So we just filter on any non null channel value
                const val = Math.max(r, g, b, a);
                if (val > 0) {
                    this.particles.push(new Particle(new Vector2(x, y)));
                }
            }
        }
    }


    on_mousemove(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.mouse_position = new Vector2(x / 10, y / 10);
    }

    on_mousseleave() {
        this.mouse_position = null;
    }

    update(dt: number): void {
        for (const particle of this.particles) {
            particle.update(dt, this.mouse_position);
        }
    }

    render(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.beginPath();
        this.ctx.fillStyle = "black";
        for (const particle of this.particles) {
            // Draw circles
            this.ctx.moveTo(particle.position.x * 10 + 5, particle.position.y * 10 + 5);
            this.ctx.arc(particle.position.x * 10 + 5, particle.position.y * 10 + 5, 5, 0, 2 * Math.PI);
        }
        this.ctx.fill();
    }
}



function main() {
    const engine = new GNEngine(document.querySelector("#textnodes-input")!, document.querySelector("#textnodes-canvas")!);
    engine.start();
}

main();