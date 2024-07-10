/*
 * JEngine
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * vector_space.ts
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
import { Vector2 } from "./vector";

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