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
import { Metadata } from "../../models";
import { Simulation } from "../../simulation";
import { Point } from "./point";
import { Size } from "./size";
import { Widget } from "./widget";

export class Compass extends Widget {
    nacelle_direction: number
    wind_direction: number

    constructor() {
        super()
        this.nacelle_direction = 0
        this.wind_direction = 0
    }

    update(_metadata: Metadata, simulation: Simulation): void {
        this.nacelle_direction = simulation.record!.nacelle_direction
        this.wind_direction = simulation.record!.wind_direction
    }

    draw(ctx: CanvasRenderingContext2D, size: Size): void {
        ctx.save()

        let center = new Point(
            size.width / 2,
            size.height / 2,
        )
        let radius = Math.min(center.x, center.y);
        let inlong_radius = 0.7 * radius
        let inshort_radius = 0.75 * radius
        let out_radius = 0.8 * radius

        // Ticks
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = "white"
        for (let i = 0; i <= 360; i += 1) {
            let j = i * Math.PI / 180
            let cos = Math.cos(j)
            let sin = Math.sin(j)
            let in_radius = i % 5 ? inshort_radius : inlong_radius
            ctx.moveTo(
                center.x + in_radius * cos,
                center.y + in_radius * sin)
            ctx.lineTo(
                center.x + out_radius * cos,
                center.y + out_radius * sin
            )
        }
        ctx.stroke()

        // wind needle
        let wind_theta = this.wind_direction * Math.PI / 180 - Math.PI / 2
        let radius_in_needle = 0.82 * radius
        let radius_out_needle = 0.90 * radius
        let wind_p1_cos = Math.cos(wind_theta)
        let wind_p1_sin = Math.sin(wind_theta)
        let wind_p2_cos = Math.cos(wind_theta - 0.1)
        let wind_p2_sin = Math.sin(wind_theta - 0.1)
        let wind_p3_cos = Math.cos(wind_theta + 0.1)
        let wind_p3_sin = Math.sin(wind_theta + 0.1)

        ctx.beginPath()
        ctx.fillStyle = "red"
        ctx.moveTo(
            center.x + radius_in_needle * wind_p1_cos,
            center.y + radius_in_needle * wind_p1_sin
        )
        ctx.lineTo(
            center.x + radius_out_needle * wind_p2_cos,
            center.y + radius_out_needle * wind_p2_sin
        )
        ctx.lineTo(
            center.x + radius_out_needle * wind_p3_cos,
            center.y + radius_out_needle * wind_p3_sin
        )
        ctx.fill()

        // turbine needle
        let nacelle_theta = this.nacelle_direction * Math.PI / 180 - Math.PI / 2
        let radius_in_nacelle = 0.68 * radius
        let radius_out_nacelle = 0.60 * radius
        let nacelle_p1_cos = Math.cos(nacelle_theta)
        let nacelle_p1_sin = Math.sin(nacelle_theta)
        let nacelle_p2_cos = Math.cos(nacelle_theta - 0.1)
        let nacelle_p2_sin = Math.sin(nacelle_theta - 0.1)
        let nacelle_p3_cos = Math.cos(nacelle_theta + 0.1)
        let nacelle_p3_sin = Math.sin(nacelle_theta + 0.1)

        ctx.beginPath()
        ctx.fillStyle = "green"
        ctx.moveTo(
            center.x + radius_in_nacelle * nacelle_p1_cos,
            center.y + radius_in_nacelle * nacelle_p1_sin
        )
        ctx.lineTo(
            center.x + radius_out_nacelle * nacelle_p2_cos,
            center.y + radius_out_nacelle * nacelle_p2_sin
        )
        ctx.lineTo(
            center.x + radius_out_nacelle * nacelle_p3_cos,
            center.y + radius_out_nacelle * nacelle_p3_sin
        )
        ctx.fill()

        // Labels
        ctx.font = "16px monospace"
        ctx.textAlign = "center"
        ctx.fillStyle = "green"
        ctx.fillText("Nacelle direction:", center.x, center.y - 50)
        ctx.fillStyle = "red"
        ctx.fillText("Wind direction:", center.x, center.y + 50)


        ctx.fillStyle = "white"
        ctx.font = "bold 20px monospace"
        ctx.fillText(`${this.nacelle_direction.toFixed(1)}°`, center.x, center.y - 20)
        ctx.fillText(`${this.wind_direction.toFixed(1)}°`, center.x, center.y + 80)

        ctx.restore()
    }
}
