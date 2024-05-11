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
import { Point } from "./point"
import { Size } from "./size"
import { Widget } from "./widget"


export class Gauge extends Widget {
    value: number
    min: number
    max: number
    short_tick_step: number
    long_tick_step: number
    theta: number
    phase: number
    unit: string
    precision: number

    constructor(min: number, max: number) {
        super()
        this.value = min
        this.min = min
        this.max = max
        this.short_tick_step = 1
        this.long_tick_step = 5
        this.theta = 3 * Math.PI / 2
        this.phase = (2 * Math.PI - this.theta) / 2 + Math.PI / 2
        this.unit = ""
        this.precision = 0
    }

    draw(ctx: CanvasRenderingContext2D, size: Size): void {
        ctx.save()

        let center = new Point(
            size.width / 2,
            size.height / 2,
        )
        let radius = Math.min(center.x, center.y);
        let val_range = this.max - this.min
        let inlong_radius = 0.7 * radius
        let inshort_radius = 0.75 * radius
        let out_radius = 0.8 * radius
        let needle_radius = 0.6 * radius

        // Ticks
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = "white"
        for (let i = 0; i <= val_range; i += 1) {
            let j = this.phase + i / val_range * this.theta

            let in_radius = 0
            if (i % this.long_tick_step == 0) {
                in_radius = inlong_radius
            } else if (i % this.short_tick_step == 0) {
                in_radius = inshort_radius
            } else {
                continue
            }

            let cos = Math.cos(j)
            let sin = Math.sin(j)
            ctx.moveTo(
                center.x + in_radius * cos,
                center.y + in_radius * sin)
            ctx.lineTo(
                center.x + out_radius * cos,
                center.y + out_radius * sin
            )
        }
        ctx.stroke()

        // Needle
        let theta_needle = this.phase + (this.value - this.min) / (this.max - this.min) * this.theta
        let cos_needle = Math.cos(theta_needle)
        let sin_needle = Math.sin(theta_needle)
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.strokeStyle = "red"
        ctx.moveTo(
            center.x,
            center.y)
        ctx.lineTo(
            center.x + needle_radius * cos_needle,
            center.y + needle_radius * sin_needle
        )
        ctx.stroke()

        // Value
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center"
        ctx.fillStyle = "white"
        ctx.fillText(`${this.value.toFixed(this.precision)}${this.unit}`, size.width / 2, size.height - 15, size.width)

        ctx.restore()
    }
}
