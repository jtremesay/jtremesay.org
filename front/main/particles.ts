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

import { ParticleData, ParticleRenderer, ParticleUpdater } from "../particles/engine";
import { Engine } from "../jengine/engine";
import { VectorSpace } from "../jengine/vector_space";
import { Vector2 } from "../jengine/vector";


class MyVectorSpace implements VectorSpace {
    vector_at(x: number, y: number): Vector2 {
        return new Vector2(Math.sin(x), Math.cos(y));
    }
}

function main() {
    const canvas = document.getElementById("particles-canvas")! as HTMLCanvasElement;
    canvas.width = 800;
    canvas.height = 600;


    const vector_space = new MyVectorSpace();
    const data = new ParticleData(vector_space);
    const updater = new ParticleUpdater();
    const renderer = new ParticleRenderer(canvas);
    const engine = new Engine(updater, renderer, data);
    engine.start();
}


main();