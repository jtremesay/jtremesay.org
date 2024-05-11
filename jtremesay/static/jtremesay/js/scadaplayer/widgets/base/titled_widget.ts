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
import { TITLE_HEIGHT } from "../../config";
import { Metadata } from "../../models";
import { Simulation } from "../../simulation";
import { Size } from "./size";
import { Widget } from "./widget";

export class TitledWidget extends Widget {
    label: string
    widget: Widget

    constructor(label: string, widget: Widget) {
        super()
        this.label = label
        this.widget = widget
    }

    update(metadata: Metadata, simulation: Simulation): void {
        this.widget.update(metadata, simulation)
    }

    draw(ctx: CanvasRenderingContext2D, size: Size): void {
        ctx.save()

        // Title
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center"
        ctx.fillStyle = "white"
        ctx.fillText(this.label.toUpperCase(), size.width / 2, 15, size.width)

        // Inner widget
        ctx.translate(0, TITLE_HEIGHT)
        this.widget.draw(
            ctx,
            new Size(size.width, size.height - TITLE_HEIGHT)
        )

        // Border
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = "white"
        ctx.moveTo(0, 0)
        ctx.lineTo(size.width, 0)
        ctx.stroke()

        ctx.restore()
    }
}
