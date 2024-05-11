/*
 * Raycaster
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * raytracer/maths.ts
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
 * @brief A linear interpolation
 * @param x The value to interpolate
 * @param x0 First reference
 * @param x1 Second reference
 * @param y0 Result of f(x0)
 * @param y1 Result of f(x1)
 * @returns the interpolated value
 */
export function lerp(x: number, x0: number, x1: number, y0: number, y1: number): number {
    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
}
