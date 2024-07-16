/*
 * Particles
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * engine.ts
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


import { EngineRenderer, EngineUpdater } from "../jengine/engine";
import { EngineCanvas2DRenderer } from "../jengine/renderer_canvas";
import { Vector2 } from "../jengine/vector";
import { VectorSpace } from "../jengine/vector_space";

export class ParticleData {
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

export class ParticleEngineUpdater implements EngineUpdater<ParticleData> {
    update(data: ParticleData | null, dt: DOMHighResTimeStamp): ParticleData | null {
        if (data === null) {
            return null
        }

        for (let i = 0; i < data.particles_count; i++) {
            if (data.particles_lifes[i] <= 0 || data.particles_positions[i].x < 0 || data.particles_positions[i].x > data.width || data.particles_positions[i].y < 0 || data.particles_positions[i].y > data.height) {
                data.particles_positions[i] = new Vector2(Math.random() * data.width, Math.random() * data.height);
                data.particles_velocities[i] = new Vector2(Math.random(), Math.random());
                data.particles_lifes[i] = 30 + Math.random() * 60;
            } else {
                data.particles_velocities[i] = data.particles_velocities[i].add(data.vector_space.vector_at(data.particles_positions[i].x, data.particles_positions[i].y).mul(dt));
                data.particles_positions[i] = data.particles_positions[i].add(data.particles_velocities[i].mul(dt));
                data.particles_lifes[i] -= 1 * dt;
            }
        }

        return null
    }

}

export class ParticleEngineCanvas2DRenderer extends EngineCanvas2DRenderer<ParticleData> {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas)
    }

    render(data: ParticleData): void {
        if (data === null) {
            return
        }

        if (data.vector_space_ib === null) {
            let vs_canvas = new OffscreenCanvas(this.canvas.width, this.canvas.height)
            let vs_ctx = vs_canvas.getContext("2d")!

            // Draw each vector of the field
            for (let x = 0; x < this.canvas.width; x++) {
                for (let y = 0; y < this.canvas.height; y++) {
                    const vector = data.vector_space.vector_at(x, y)
                    vs_ctx.fillStyle = `hsl(${vector.angle() * 180 / Math.PI}, 50%, ${(vector.mag()) * 100}%)`
                    vs_ctx.fillRect(x, y, 1, 1)
                }
            }

            data.vector_space_ib = vs_canvas.transferToImageBitmap()
        }

        this.ctx.drawImage(data.vector_space_ib, 0, 0)

        this.ctx.fillStyle = "black"
        this.ctx.strokeStyle = "white"
        const particle_size = 1
        for (const position of data.particles_positions) {
            this.ctx.fillRect(position.x, position.y, particle_size, particle_size)
            this.ctx.strokeRect(position.x, position.y, particle_size, particle_size)
        }
    }
}