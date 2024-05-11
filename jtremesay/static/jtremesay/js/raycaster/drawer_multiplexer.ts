/*
 * Raycaster
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * raytracer/drawer_multiplexer.ts
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

import { Drawer } from "./drawer";


/**
 * @brief Redispatch of drawer commands
 * @implements Drawer
 */
export class DrawerMultiplexer implements Drawer {
    drawers: Drawer[];

    constructor() {
        this.drawers = []
    }


    // Implements Drawer
    clear() {
        for (let drawer of this.drawers) {
            drawer.clear();
        }
    }

    draw_floor() {
        for (let drawer of this.drawers) {
            drawer.draw_floor();
        }
    }

    draw_ceil() {
        for (let drawer of this.drawers) {
            drawer.draw_ceil();
        }
    }

    draw_wall(column: number, height: number, color: string) {
        for (let drawer of this.drawers) {
            drawer.draw_wall(column, height, color);
        }
    }
}
