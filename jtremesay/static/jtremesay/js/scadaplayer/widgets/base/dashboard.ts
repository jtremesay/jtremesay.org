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
import { Widget } from "./widget"
import { DashboardItem } from "./dashboard_item"
import { Size } from "./size"
import { Point } from "./point"
import { Metadata } from "../../models"
import { GRID_SIZE, ITEM_SIZE } from "../../config"
import { Simulation } from "../../simulation"

export class Dashboard extends Widget {
    items: DashboardItem[]
    display_grid: boolean

    constructor() {
        super()
        this.items = []
        this.display_grid = false
    }

    add_item(widget: Widget, size: Size, position: Point): DashboardItem {
        let item = new DashboardItem(position, size, widget)
        this.items.push(item)

        return item
    }

    update(metadata: Metadata, simulation: Simulation) {
        this.items.forEach((item) => {
            item.update(metadata, simulation)
        })
    }

    draw(ctx: CanvasRenderingContext2D, size: Size) {
        super.draw(ctx, size)

        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, size.width, size.height)

        // Draw debug grid
        if (this.display_grid) {
            ctx.beginPath()
            ctx.lineWidth = 1
            ctx.strokeStyle = "white"
            for (let x = 0; x < GRID_SIZE.width; ++x) {
                ctx.moveTo(x * ITEM_SIZE.width, 0)
                ctx.lineTo(x * ITEM_SIZE.width, GRID_SIZE.height * ITEM_SIZE.height)
            }
            for (let y = 0; y < GRID_SIZE.height; ++y) {
                ctx.moveTo(0, y * ITEM_SIZE.height)
                ctx.lineTo(GRID_SIZE.width * ITEM_SIZE.width, y * ITEM_SIZE.height)
            }
            ctx.stroke()
        }

        this.items.forEach((item) => {
            item.draw(ctx, size)
        })
    }
}
