/*
 * Raycaster
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * raytracer/camera.ts
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

import { Vector2 } from "./vector2";

/**
 * @brief A camera
 */
export class Camera {
    /** @brief Position of the camera in the word */
    position: Vector2;

    /** @brief Direction of the camera (where it look in the world) */
    direction: Vector2;

    /** @brief Horizontal field of view, in radians */
    fov: number;

    /**
     * @brief Construct a new camera
     * @param position Position of the camera. (default=Vector2.zero)
     * @param direction Direction of the camera. (default = north)
     * @param fov Horizontal field of view, in radians (default=90`)
     */
    constructor(position?: Vector2, direction?: Vector2, fov?: number) {
        this.position = position !== undefined ? position : Vector2.zero();
        this.direction = direction !== undefined ? direction : new Vector2(0, -1);
        this.fov = fov !== undefined ? fov : Math.PI / 2; // 90° = Pi / 2
    }

    /**
     * @brief get the direction of the right side of the camera
     * @returns the direction to the left side
     */
    left(): Vector2 {
        return this.direction.rotate_by(-this.fov / 2);
    }
}
