/*
 * Scadaplayer
 * Copyright (C) 2024 Jonathan Tremesaygues
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
import { Metadata } from "../../models"
import { Simulation } from "../../simulation"
import { Size } from "./size"

export class Widget {
    constructor() {
    }

    update(_metadata: Metadata, _simulation: Simulation) { }

    draw(ctx: CanvasRenderingContext2D, size: Size) {
        // Debug background
        ctx.fillStyle = "magenta"
        ctx.fillRect(0, 0, size.width, size.height)
    }
}
