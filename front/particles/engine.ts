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
import { EngineCanvasRenderer } from "../jengine/renderer_canvas";
import { VectorSpace } from "../jengine/vector_space";

export class ParticleData {
    vector_space: VectorSpace;

    constructor(vector_space: VectorSpace) {
        this.vector_space = vector_space;
    }
}

export class ParticleUpdater implements EngineUpdater<ParticleData> {
    update(data: ParticleData | null, _dt: DOMHighResTimeStamp): ParticleData | null {
        if (data === null) {
            return null
        }

        return null
    }
}

export class ParticleRenderer extends EngineCanvasRenderer<ParticleData> {

}