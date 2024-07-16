/*
 * Particles
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * particles.ts
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

import { VectorSpace, QuantifiedVectorSpace } from "../jengine/vector_space";
import { Vector2 } from "../jengine/vector";
import { clamp } from "../jengine/maths";
import { Engine } from "../jengine/engine";
import { ParticleData, ParticleEngineUpdater, ParticleEngineCanvas2DRenderer } from "../particles/engine";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = CANVAS_WIDTH;



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

function create_engine(vector_space: VectorSpace, canvas_id: string, updater: ParticleEngineUpdater, particles_count: number = 10000): Engine<ParticleEngineUpdater, ParticleEngineCanvas2DRenderer, ParticleData> {
    let canvas = document.getElementById(canvas_id) as HTMLCanvasElement
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    let data = new ParticleData(
        new QuantifiedVectorSpace(vector_space, CANVAS_WIDTH, CANVAS_HEIGHT),
        CANVAS_WIDTH, CANVAS_HEIGHT, particles_count)
    let renderer = new ParticleEngineCanvas2DRenderer(canvas)
    let engine = new Engine(updater, renderer, data)

    return engine
}

function main() {
    const particles_count = 10000
    let updater = new ParticleEngineUpdater() // Mutualize the updater
    create_engine(new CircleVectorSpace(), "particles-canvas-direction", updater, particles_count).start()
    create_engine(new GradientVectorSpace(), "particles-canvas-intensity", updater, particles_count).start()
    create_engine(new DonutVectorSpace(), "particles-canvas-donut", updater, particles_count).start()
    create_engine(new VortexVectorSpace(), "particles-canvas-vortex", updater, particles_count).start()
    create_engine(new Demo1VectorSpace(), "particles-canvas-demo1", updater, particles_count).start()
}

main();