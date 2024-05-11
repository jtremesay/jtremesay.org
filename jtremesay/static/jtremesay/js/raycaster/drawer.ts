/*
 * Raycaster
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * raytracer/drawer.ts
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
 * @brief An interface for drawing stuff
 */
export interface Drawer {
    /**
     * @brief Clear the canvas
     */
    clear(): void;

    /**
     * @brief Draw the floor
     */
    draw_floor(): void;

    /**
     * @brief Draw the ceil
     */
    draw_ceil(): void;

    /**
     * @brief Draw a vertical wall portion
     * @param column
     * @param height Height of the wall portion, in pixels
     */
    draw_wall(column: number, height: number, color: string): void;
}
