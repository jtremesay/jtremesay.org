/*
 * Raycaster
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * raytracer/sdf.ts
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
 * @brief Do the union of two areas
 * @param a first area
 * @param b second area
 * @returns a | b
 */
export function union_sdf(a: number, b: number): number {
    return Math.min(a, b);
}

/**
 * @brief Do the intersection of two areas
 * @param a first area
 * @param b second area
 * @returns a & b
 */
export function intersect_sdf(a: number, b: number): number {
    return Math.max(a, b);
}

/**
 * @brief Do the differance of two areas
 * @param a first area
 * @param b second area
 * @returns a - b
 */
export function differance_sdf(a: number, b: number): number {
    return Math.max(a, -b);
}

/**
 * @brief Compute the signed distance of a point to a circle
 * @param center Center of the circle
 * @param radius Radius of the circle
 * @param point
 * @returns
 */
export function circle_sdf(center: Vector2, radius: number, point: Vector2): number {
    return point.sub(center).length() - radius;
}

/**
 * @brief Compute the signed distance of a point to a rect
 * @param center Center of
 * @param size
 * @param point
 * @returns
 */
export function rect_sdf(center: Vector2, size: Vector2, point: Vector2): number {
    // Compute the relative position of the point to the center of the box
    let a = point.sub(center).abs().sub(size.div(2));

    // Measure the distance of the point to the exterior of the rect
    let outside_distance = a.max(0).length();

    // Measure the distance of the point to the interior of the rect
    let inside_distance = Math.min(Math.max(a.x, a.y), 0);

    // compute the final distance
    let sdf = outside_distance + inside_distance;

    return sdf;

}
