/*
 * Raycaster
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * raytracer/render.ts
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

import { Camera } from "./camera";
import { Vector2 } from "./vector2";
import { Scene } from "./scene";
import { Drawer } from "./drawer";

/**
 * @brief Get the distance to the nearest object
 * @param point The point
 * @param direction The direction
 * @returns The distance to the nearest objects
 */
function ray_marching(scene: Scene, point: Vector2, direction: Vector2): number {
    let current_depth = 0;
    const max_depth = 256;
    const max_steps = 256;
    const depth_threshold = 0.001;

    for (let step = 0; step < max_steps; ++step) {
        // Get the current position of the ray in the scene
        // which is origin position + direction * current_depth
        let current_position = point.add(direction.mul(current_depth));
        // console.log(`current position: ${current_position.to_str()}, depth: ${current_depth}`);

        // Get the distance to the nearest object
        let distance = scene.distance_to_neareast_object(current_position);
        // console.log(`distance: ${distance}`);

        // Return if we have found something
        if (distance < depth_threshold) {
            return current_depth;
        }

        // Return if we are too deep
        current_depth += distance;
        if (current_depth >= max_depth) {
            break;
        }
    }

    // Nothing found
    return Infinity;
}




/**
 * @brief Render a frame
 * @param ctx Canvas context
 * @param root SVG root node
 * @param viewport_size The size of the output viewport
 */
export function render(scene: Scene, camera: Camera, drawer: Drawer, viewport_size: Vector2) {
    // Clear the screen
    drawer.clear();

    // Draw the ceil and floor
    drawer.draw_floor();
    drawer.draw_ceil();

    // Draw the walls, column of pixel per column of pixel
    // We start by the left side of the view port and scan
    // the scene to right side
    let start_direction = camera.left();
    let fov_per_column = camera.fov / viewport_size.x;
    for (let column = 0; column < viewport_size.x; ++column) {
        // Compute the direction of the ray for the current column
        let ray_direction = start_direction.rotate_by(fov_per_column * column);
        //console.log(`ray direction: ${ray_direction.to_str()}`);

        // Get the distance to the nearest
        let wall_distance = ray_marching(scene, camera.position, ray_direction);
        //console.log(`column: ${column}, distance: ${wall_distance}`);

        // Only draw the segment if the wall is visible
        if (wall_distance > 0 && wall_distance < Infinity) {
            // Compute the color
            let color = `rgb(0, 0, ${255 - (2 * wall_distance) ** 2})`;

            // Try to map the sphere projection of the ray marching algo to
            // a planar one. Doesn't work for fov > 90°. Kind of work for fov >= 90°
            let angle_from_center = ray_direction.angle() - camera.direction.angle();
            wall_distance = wall_distance * Math.cos(angle_from_center);

            // Compute the scale ratio
            // the nearest, the biggest
            let scale_ratio = 1.0 / wall_distance; // Basic persupective transformation

            // Compute the final height and do the the drawing
            let wall_height = viewport_size.y * scale_ratio;


            drawer.draw_wall(column, wall_height, color);
        }
    }
}
