/*
 * Raycaster
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * raytracer/vector2.ts
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

/**
 * @brief A 2D vector
 */
export class Vector2 {
    //* @brief X coordinate */
    x: number;

    //* @brief Y coordinates */
    y: number;

    /**
      * @brief Construct a new vector
      * @param x X coordinate (default=0)
      * @param y Y coordinate (default=x)
      */
    constructor(x?: number | Vector2, y?: number) {
        if (typeof x === "object") {
            let v = x;
            this.x = v.x;
            this.y = v.y;
        } else {
            this.x = x !== undefined ? x : 0;
            this.y = y !== undefined ? y : this.x
        }
    }

    /**
     * @brief Get the angle in radians of the vector
     *
     * This is the angle formed by the point (x, y) relative to the origin
     *
     * @returns the angle
     */
    angle(): number {
        return Math.atan2(this.y, this.x);
    }

    /**
     * @brief Add two vectors
     *
     * new_x = this.x + o.x
     * new_y = this.y + o.y
     *
     * @param o The vector to add
     * @returns a new vector
     */
    add(o: Vector2): Vector2 {
        return new Vector2(this.x + o.x, this.y + o.y);
    }

    /**
     * @brief Substract two vectors
     *
     * new_x = this.x - o.x
     * new_y = this.y - o.y
     *
     * @param o The vector to substract
     * @returns a new vector
     */
    sub(o: Vector2): Vector2 {
        return new Vector2(this.x - o.x, this.y - o.y);
    }

    /**
     * @brief Multiply a vector with a scalar
     *
     * new_x = this.x * o
     * new_y = this.y * o
     *
     * @param o The scalar to muliply by
     * @returns a new vector
     */
    mul(o: number): Vector2 {
        return new Vector2(this.x * o, this.y * o);
    }

    /**
     * @brief Divide a vector by a scalar
     *
     * new_x = this.x / o
     * new_y = this.y / o
     *
     * @param o The scalar to divide by
     * @returns a new vector
     */
    div(o: number): Vector2 {
        return new Vector2(this.x / o, this.y / o);
    }

    /**
     * @brief Get the length of the vector
     * @returns the length of the vector
     */
    length(): number {
        return Math.sqrt(this.dot(this));
    }

    /**
     * @brief Do a dot product between two vectors
     *
     * dot product = this.x * o.x + this.y * o.y
     *
     * @param o The other vector
     * @returns the dot product
     */
    dot(o: Vector2): number {
        return this.x * o.x + this.y * o.y;
    }

    /**
     * @brief Get the abs value of the vector
     * @returns a new vector
     */
    abs(): Vector2 {
        return new Vector2(Math.abs(this.x), Math.abs(this.y));
    }

    /**
     * @brief Get the max value of the vector with a scalar
     * @param o The scalar
     * @returns a new vector
     */
    max(o: number) {
        return new Vector2(Math.max(this.x, o), Math.max(this.y, o));
    }

    /**
     * Rotate the vector by an angle
     * @param theta The angle of rotation
     * @returns a mew vector
     */
    rotate_by(theta: number): Vector2 {
        let sin_theta = Math.sin(theta);
        let cos_theta = Math.cos(theta);
        return new Vector2(this.x * cos_theta - this.y * sin_theta, this.x * sin_theta + this.y * cos_theta);
    }

    /**
     * @brief Get a string representation of the vector
     * @returns A string represation of the vector
     */
    to_str(): string {
        return `(${this.x}, ${this.y})`;
    }

    /**
     * @brief Create a zero vector
     * @return a zero vector ({0, 0})
     */
    static zero(): Vector2 {
        return new Vector2();
    }
}
