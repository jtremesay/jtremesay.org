/*
 * Particles
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * particles.ts
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


const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = CANVAS_WIDTH;

export function clamp(x: number, min: number = 0, max: number = 1): number {
    return Math.min(Math.max(x, min), max);
}

export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    sub(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    mul(k: number): Vector2 {
        return new Vector2(this.x * k, this.y * k);
    }

    div(k: number): Vector2 {
        return new Vector2(this.x / k, this.y / k);
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    distance(v: Vector2): number {
        return v.sub(this).mag();
    }

    normalize(): Vector2 {
        return this.div(this.mag());
    }

    dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    cross(v: Vector2): number {
        return this.x * v.y - this.y * v.x;
    }

    angle_to(v: Vector2): number {
        return Math.acos(this.dot(v) / (this.mag() * v.mag()));
    }

    angle(): number {
        return Math.atan2(this.y, this.x);
    }

    rotate_by(a: number): Vector2 {
        return new Vector2(
            this.x * Math.cos(a) - this.y * Math.sin(a),
            this.x * Math.sin(a) + this.y * Math.cos(a)
        );
    }
}

export interface VectorSpace {
    vector_at(x: number, y: number): Vector2;
}

export class LazyQuantifiedVectorSpace implements VectorSpace {
    vector_space: VectorSpace;
    cached_vectors: Map<number, Map<number, Vector2>> = new Map();

    constructor(vector_space: VectorSpace) {
        this.vector_space = vector_space;
    }

    vector_at(x: number, y: number): Vector2 {
        if (!this.cached_vectors.has(x)) {
            this.cached_vectors.set(x, new Map());
        }

        if (!this.cached_vectors.get(x)!.has(y)) {
            this.cached_vectors.get(x)!.set(y, this.vector_space.vector_at(x, y));
        }

        return this.cached_vectors.get(x)!.get(y)!;
    }
}

export class QuantifiedVectorSpace implements VectorSpace {
    cached_vectors: Vector2[][] = [];

    constructor(vector_space: VectorSpace, width: number, height: number) {
        for (let y = 0; y < height; y++) {
            this.cached_vectors.push([]);
            for (let x = 0; x < width; x++) {
                this.cached_vectors[y].push(vector_space.vector_at(x, y));
            }
        }
    }

    vector_at(x: number, y: number): Vector2 {
        y = y | 0
        x = x | 0
        return this.cached_vectors[y][x];
    }
}

class DistanceToCenterVectorSpace implements VectorSpace {
    vector_at(x: number, y: number): Vector2 {
        let p = new Vector2(x / CANVAS_WIDTH, y / CANVAS_HEIGHT) // normalize
        p = p.sub(new Vector2(0.5, 0.5)) // From center to border
        return p
    }
}


class CircleVectorSpace implements VectorSpace {
    offset: number
    distance_to: DistanceToCenterVectorSpace = new DistanceToCenterVectorSpace()

    constructor(offset: number = 0) {
        this.offset = offset
    }


    vector_at(x: number, y: number): Vector2 {
        let p = this.distance_to.vector_at(x, y)
        p = p.normalize() // normalize, so we only have the direction
        p = p.mul(0.5) // reduce the magnitude
        p = p.rotate_by(this.offset) // rotate
        return p
    }
}

class GradientVectorSpace implements VectorSpace {
    vector_at(_x: number, y: number): Vector2 {
        return new Vector2(1 - y / CANVAS_HEIGHT, 0)
    }
}


class DonutVectorSpace implements VectorSpace {
    distance_to = new DistanceToCenterVectorSpace()
    radius = 0.35

    vector_at(x: number, y: number): Vector2 {
        let p = this.distance_to.vector_at(x, y)
        if (p.mag() > this.radius) {
            p = p.rotate_by(Math.PI)
        }
        return p
    }
}
class VortexVectorSpace implements VectorSpace {
    circle = new DistanceToCenterVectorSpace()

    vector_at(x: number, y: number): Vector2 {
        let p = this.circle.vector_at(x, y)
        p = p.rotate_by(Math.PI / 3) // Rotatiion force
        return p
    }
}

class Demo1VectorSpace implements VectorSpace {
    vector_at(x: number, y: number): Vector2 {
        let p = new Vector2(1 - x / CANVAS_WIDTH, y / CANVAS_HEIGHT) // normalize
        p = p.sub(new Vector2(0.5, 0.5)) // From center to border
        p = p.rotate_by(-Math.PI * Math.sin(p.mag() + 2 * Math.sin(x / CANVAS_HEIGHT) + 4 * Math.sin(x / CANVAS_HEIGHT) + 8 * Math.sin(x / CANVAS_HEIGHT) + 16 * Math.sin(x / CANVAS_HEIGHT))) // rotate
        p = p.rotate_by(2 * Math.PI * p.mag()) // rotate
        p.y = clamp(1 / p.y, 0, 0.5)
        return p
    }
}

class ParticleData {
    vector_space: VectorSpace;
    width: number;
    height: number;
    vector_space_ib: ImageBitmap | null = null
    particles_count: number
    particles_lifes: number[] = []
    particles_positions: Vector2[] = []
    particles_velocities: Vector2[] = []

    constructor(vector_space: VectorSpace, width: number, height: number, particles_count: number = 100) {
        this.vector_space = vector_space;
        this.width = width;
        this.height = height;
        this.particles_count = particles_count
        this.particles_lifes = Array.from({ length: particles_count }, () => -1)
        this.particles_positions = Array.from({ length: particles_count }, () => new Vector2(0, 0))
        this.particles_velocities = Array.from({ length: particles_count }, () => new Vector2(0, 0))
    }
}


class Engine {
    data: ParticleData;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    last_time: DOMHighResTimeStamp = 0;

    constructor(data: ParticleData, canvas: HTMLCanvasElement) {
        this.data = data;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;
    }

    update(dt: DOMHighResTimeStamp): void {
        for (let i = 0; i < this.data.particles_count; i++) {
            if (this.data.particles_lifes[i] <= 0 || this.data.particles_positions[i].x < 0 || this.data.particles_positions[i].x > this.data.width || this.data.particles_positions[i].y < 0 || this.data.particles_positions[i].y > this.data.height) {
                this.data.particles_positions[i] = new Vector2(Math.random() * this.data.width, Math.random() * this.data.height);
                this.data.particles_velocities[i] = new Vector2(Math.random(), Math.random());
                this.data.particles_lifes[i] = 30 + Math.random() * 60;
            } else {
                this.data.particles_velocities[i] = this.data.particles_velocities[i].add(this.data.vector_space.vector_at(this.data.particles_positions[i].x, this.data.particles_positions[i].y).mul(dt));
                this.data.particles_positions[i] = this.data.particles_positions[i].add(this.data.particles_velocities[i].mul(dt));
                this.data.particles_lifes[i] -= 1 * dt;
            }
        }
    }

    render(): void {


        if (this.data.vector_space_ib === null) {
            let vs_canvas = new OffscreenCanvas(this.canvas.width, this.canvas.height)
            let vs_ctx = vs_canvas.getContext("2d")!

            // Draw each vector of the field
            for (let x = 0; x < this.canvas.width; x++) {
                for (let y = 0; y < this.canvas.height; y++) {
                    const vector = this.data.vector_space.vector_at(x, y)
                    vs_ctx.fillStyle = `hsl(${vector.angle() * 180 / Math.PI}, 50%, ${(vector.mag()) * 100}%)`
                    vs_ctx.fillRect(x, y, 1, 1)
                }
            }

            this.data.vector_space_ib = vs_canvas.transferToImageBitmap()
        }

        this.ctx.drawImage(this.data.vector_space_ib, 0, 0)

        this.ctx.fillStyle = "black"
        this.ctx.strokeStyle = "white"
        const particle_size = 1
        for (const position of this.data.particles_positions) {
            this.ctx.fillRect(position.x, position.y, particle_size, particle_size)
            this.ctx.strokeRect(position.x, position.y, particle_size, particle_size)
        }
    }



    run(timestamp: DOMHighResTimeStamp = 0) {
        const dt = (timestamp - this.last_time) / 1000;
        this.last_time = timestamp;

        this.update(dt);
        this.render();

        window.requestAnimationFrame(this.run.bind(this));
    }

    start() {
        this.last_time = 0
        this.run(1 / 60)
    }
}

function create_engine(vector_space: VectorSpace, canvas_id: string, particles_count: number = 10000): Engine {
    let canvas = document.getElementById(canvas_id) as HTMLCanvasElement
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    let data = new ParticleData(
        new QuantifiedVectorSpace(vector_space, CANVAS_WIDTH, CANVAS_HEIGHT),
        CANVAS_WIDTH, CANVAS_HEIGHT, particles_count)
    let engine = new Engine(data, canvas)

    return engine
}

function main() {
    const particles_count = 10000
    create_engine(new CircleVectorSpace(), "particles-canvas-direction", particles_count).start()
    create_engine(new GradientVectorSpace(), "particles-canvas-intensity", particles_count).start()
    create_engine(new DonutVectorSpace(), "particles-canvas-donut", particles_count).start()
    create_engine(new VortexVectorSpace(), "particles-canvas-vortex", particles_count).start()
    create_engine(new Demo1VectorSpace(), "particles-canvas-demo1", particles_count).start()
}

main();