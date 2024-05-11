/*
 * Raycaster
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * raytracer/drawer_canvas.ts
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
import { Drawer } from "./drawer";

/**
 * @brief Draw on a canvas context
 * @implements Drawer
 */
export class CanvasDrawer implements Drawer {
    ctx: CanvasRenderingContext2D;

    viewport_size: Vector2;
    constructor(ctx: CanvasRenderingContext2D, viewport_size: Vector2) {
        this.ctx = ctx;
        this.viewport_size = viewport_size
    }

    // Implements Drawer
    clear() {
        this.ctx.fillStyle = 'magenta';
        this.ctx.fillRect(0, 0, this.viewport_size.x, this.viewport_size.y);

    }

    draw_floor() {
        this.ctx.fillStyle = "#d3d3d3";
        this.ctx.fillRect(0, this.viewport_size.y / 2, this.viewport_size.x, this.viewport_size.y / 2);
    }

    draw_ceil() {
        this.ctx.fillStyle = "#797979";
        this.ctx.fillRect(0, 0, this.viewport_size.x, this.viewport_size.y / 2);
    }


    draw_wall(column: number, height: number, color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(column, this.viewport_size.y / 2 - height / 2, 1, height);
    }
}
