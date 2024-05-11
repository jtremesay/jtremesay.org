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
import { Size } from "./size";
import { Widget } from "./widget";

export class BoxInfo extends Widget {
    labels: string[]
    values: string[]

    constructor(labels: string[]) {
        super()
        this.labels = labels
        this.values = labels.map(() => "")
    }

    draw(ctx: CanvasRenderingContext2D, size: Size): void {
        ctx.save()
        ctx.translate(0, 20)
        this.labels.forEach((label, i) => {
            ctx.font = "12px monospace"
            ctx.textAlign = "left"
            ctx.fillStyle = "white"
            ctx.fillText(label.toUpperCase() + ":", 10, i * 15, size.width)
            ctx.textAlign = "right"
            ctx.fillText(this.values[i], size.width - 10, i * 15, size.width)
        })
        ctx.restore()
    }
}
