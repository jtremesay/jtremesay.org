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

import { ParticleEngine } from "../particles/engine";
import { VectorSpace, QuantifiedVectorSpace } from "../jengine/vector_space";
import { Vector2 } from "../jengine/vector";
import { clamp } from "../jengine/maths";

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

function main() {
    // Direction simulation
    new ParticleEngine(
        new QuantifiedVectorSpace(
            new CircleVectorSpace(),
            CANVAS_WIDTH,
            CANVAS_HEIGHT
        ),
        "particles-canvas-direction", 10000, CANVAS_WIDTH, CANVAS_HEIGHT
    ).start();

    // Intentensity simulation
    new ParticleEngine(
        new QuantifiedVectorSpace(
            new GradientVectorSpace(),
            CANVAS_WIDTH,
            CANVAS_HEIGHT
        ),
        "particles-canvas-intensity", 10000, CANVAS_WIDTH, CANVAS_HEIGHT
    ).start();

    // Donut simulation
    new ParticleEngine(
        new QuantifiedVectorSpace(
            new DonutVectorSpace(),
            CANVAS_WIDTH,
            CANVAS_HEIGHT
        ),
        "particles-canvas-donut", 10000, CANVAS_WIDTH, CANVAS_HEIGHT
    ).start();

    // Vortex simulation
    new ParticleEngine(
        new QuantifiedVectorSpace(
            new VortexVectorSpace(),
            CANVAS_WIDTH,
            CANVAS_HEIGHT
        ),
        "particles-canvas-vortex", 10000, CANVAS_WIDTH, CANVAS_HEIGHT
    ).start();

    // Demo 1 simulation
    new ParticleEngine(
        new QuantifiedVectorSpace(
            new Demo1VectorSpace(),
            CANVAS_WIDTH,
            CANVAS_HEIGHT
        ),
        "particles-canvas-demo1", 10000, CANVAS_WIDTH, CANVAS_HEIGHT
    ).start();
}

main();