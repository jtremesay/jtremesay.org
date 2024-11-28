/*
 * JEngine
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * vector.ts
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