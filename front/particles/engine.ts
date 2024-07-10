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


import { Vector2 } from "../jengine/vector";
import { EngineUpdater } from "../jengine/engine";
import { EngineCanvasRenderer } from "../jengine/renderer_canvas";
import { VectorSpace } from "../jengine/vector_space";

export class Particle {
    position: Vector2;
    velocity: Vector2;
    remaining_life: number;

    constructor(position: Vector2, velocity: Vector2, remaining_life: number) {
        this.position = position;
        this.velocity = velocity;
        this.remaining_life = remaining_life;
    }
}


export class ParticleData {
    vector_space: VectorSpace;
    particles: Particle[] = [];

    constructor(vector_space: VectorSpace, particles_count: number = 1000) {
        this.vector_space = vector_space;
        for (let i = 0; i < particles_count; i++) {
            const position = new Vector2(0, 0);
            const velocity = new Vector2(0, 0);
            const life = -1;
            this.particles.push(new Particle(position, velocity, life));
        }
    }
}

export class ParticleUpdater implements EngineUpdater<ParticleData> {
    update(data: ParticleData | null, dt: DOMHighResTimeStamp): ParticleData | null {
        if (data === null) {
            return null
        }

        for (const particle of data.particles) {
            if (particle.remaining_life <= 0 || particle.position.x < 0 || particle.position.x > 800 || particle.position.y < 0 || particle.position.y > 600) {
                particle.position = new Vector2(Math.random() * 800, Math.random() * 600);
                particle.velocity = new Vector2(0, 0);
                particle.remaining_life = Math.random() * 60;
            } else {
                particle.velocity = particle.velocity.add(data.vector_space.vector_at(particle.position.x, particle.position.y).mul(dt));
                particle.position = particle.position.add(particle.velocity.mul(dt));
                particle.remaining_life -= 1 * dt;
            }
        }

        return null
    }
}

export class ParticleRenderer extends EngineCanvasRenderer<ParticleData> {
    vector_space_ib: ImageBitmap | null = null


    render(data: ParticleData | null): void {
        if (data === null) {
            return
        }

        if (this.vector_space_ib === null) {
            let vs_canvas = new OffscreenCanvas(this.canvas.width, this.canvas.height)
            let vs_ctx = vs_canvas.getContext("2d")!

            // Draw each vector of the field
            for (let x = 0; x < this.canvas.width; x++) {
                for (let y = 0; y < this.canvas.height; y++) {
                    const vector = data.vector_space.vector_at(x, y)
                    vs_ctx.fillStyle = `hsl(${vector.angle() * 180 / Math.PI}, 50%, ${(1 - vector.mag()) * 100}%)`
                    vs_ctx.fillRect(x, y, 1, 1)
                }
            }

            this.vector_space_ib = vs_canvas.transferToImageBitmap()
        }

        this.ctx.drawImage(this.vector_space_ib, 0, 0)

        this.ctx.fillStyle = "black"
        this.ctx.strokeStyle = "white"
        const particle_size = 2
        for (const particle of data.particles) {
            this.ctx.fillRect(particle.position.x, particle.position.y, particle_size, particle_size)
            this.ctx.strokeRect(particle.position.x, particle.position.y, particle_size, particle_size)
        }
    }
}