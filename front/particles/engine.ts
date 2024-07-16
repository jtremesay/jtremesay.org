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


import { EngineUpdater } from "../jengine/engine";
import { EngineCanvas2DRenderer, EngineCanvasWebGLRenderer } from "../jengine/renderer_canvas";
import { Vector2 } from "../jengine/vector";
import { VectorSpace } from "../jengine/vector_space";
import { init_shader_program } from "../jengine/webgl";

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

const VERTEX_SHADER_SOURCE = `
attribute vec4 aVertexPosition;

void main() {
  gl_Position = aVertexPosition;
}
  `

const FRAGMENT_SHADER = `
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    }
  `;

export class ParticleEngineCanvasWebGLRenderer extends EngineCanvasWebGLRenderer<ParticleData> {
    shader_program: WebGLProgram
    vertex_position: GLint
    position_buffer: WebGLBuffer

    constructor(canvas: HTMLCanvasElement) {
        super(canvas)

        this.shader_program = init_shader_program(this.ctx, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER)!
        this.vertex_position = this.ctx.getAttribLocation(this.shader_program, "aVertexPosition")
        this.position_buffer = this.ctx.createBuffer()!
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.position_buffer)
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            1.0, 1.0,
        ]), this.ctx.STATIC_DRAW)


    }

    render(data: ParticleData | null): void {
        if (data === null) {
            return
        }

        this.ctx.clearColor(0.0, 0.0, 0.0, 1.0)
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT)

        const numComponents = 2; // pull out 2 values per iteration
        const type = this.ctx.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.position_buffer);
        this.ctx.vertexAttribPointer(
            this.vertex_position,
            numComponents,
            type,
            normalize,
            stride,
            offset,
        );
        this.ctx.enableVertexAttribArray(this.vertex_position);
        this.ctx.useProgram(this.shader_program);


        {
            const offset = 0;
            const vertexCount = 4;
            this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, offset, vertexCount);
        }
    }
}