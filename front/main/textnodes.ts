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
import { Engine, EngineUpdater } from '../jengine/engine';
import { EngineCanvas2DRenderer } from '../jengine/renderer_canvas';

const FONT: string = "30px Arial";

class Particle {
    origin: Vector2;
    constructor(origin: Vector2) {
        this.origin = origin;
    }
}

class GNData {
    particles: Particle[] = [];
    text_size: Vector2 | null = null;
    mouse_position: Vector2 | null = null;
}

class GNUpdater implements EngineUpdater<GNData> {

    text: string | null = null;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    out_canvas: HTMLCanvasElement;
    mouse_position: Vector2 | null = null;

    constructor(input: HTMLInputElement, canvas: HTMLCanvasElement) {
        input.addEventListener("input", this.on_input.bind(this));
        this.text = input.value;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d")!;

        this.out_canvas = canvas;
        canvas.addEventListener("mousemove", this.on_mousemove.bind(this));
    }

    on_input(event: Event) {
        this.text = (event.target as HTMLInputElement).value;
    }

    on_mousemove(event: MouseEvent) {
        const rect = this.out_canvas.getBoundingClientRect();


        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.mouse_position = new Vector2(x, y);
    }

    update(data: GNData | null, _dt: DOMHighResTimeStamp): GNData | null {
        if (!data) {
            return null;
        }


        if (this.text) {
            // Get the size of the bounding box
            this.ctx.font = FONT;
            const textMetrics = this.ctx.measureText(this.text);
            const width = Math.ceil(textMetrics.width);
            const height = Math.ceil(textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent);
            data.text_size = new Vector2(width, height);

            // Resize the canvas to the bounding box
            this.canvas.width = width;
            this.canvas.height = height;


            // Draw the text
            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = "black";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(this.text, width / 2, height / 2);
            this.text = null;

            // Read the pixels
            const imageData = this.ctx.getImageData(0, 0, width, height);
            const pixels_data = imageData.data;

            data.particles = [];
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
                        data.particles.push(new Particle(new Vector2(x, y)));
                    }
                }
            }
        }

        return data;
    }
}


class GNRenderer extends EngineCanvas2DRenderer<GNData> {
    render(data: GNData | null): void {
        if (data === null) {
            return
        }

        if (data.text_size) {
            this.canvas.width = data.text_size.x * 10;
            this.canvas.height = data.text_size.y * 10;
            data.text_size = null;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.beginPath();
        this.ctx.fillStyle = "black";
        for (const particle of data.particles) {
            // Draw circles
            this.ctx.moveTo(particle.origin.x * 10 + 5, particle.origin.y * 10 + 5);
            this.ctx.arc(particle.origin.x * 10 + 5, particle.origin.y * 10 + 5, 5, 0, 2 * Math.PI);
        }
        this.ctx.fill();
    }
}

function create_engine(): Engine<GNUpdater, GNRenderer, GNData> {
    const canvas = document.querySelector("#textnodes-canvas") as HTMLCanvasElement;
    const data = new GNData();
    const updater = new GNUpdater(document.querySelector("#textnodes-input")!, canvas);
    const renderer = new GNRenderer(canvas);
    return new Engine(updater, renderer, data);
}

function main() {
    const engine = create_engine();
    engine.start();
}

main();