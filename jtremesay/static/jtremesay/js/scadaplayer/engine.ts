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
import { CANVAS_SIZE } from "./config"
import { Metadata, ScadaRecord } from "./models"
import { Simulation } from "./simulation"
import { ActivePowerGauge } from "./widgets/scadaplayer/active_power_gauge"
import { AirTemperatureGauge } from "./widgets/scadaplayer/air_temperature_gauge"
import { Compass } from "./widgets/base/compass"
import { Dashboard } from "./widgets/base/dashboard"
import { MetadataBoxInfo } from "./widgets/scadaplayer/metadata_box_info"
import { PitchAngleGauge } from "./widgets/scadaplayer/pitch_angle_gauge"
import { Point } from "./widgets/base/point"
import { ScadaBoxInfo } from "./widgets/scadaplayer/scada_box_info"
import { Size } from "./widgets/base/size"
import { WindSpeedGauge } from "./widgets/scadaplayer/wind_speed_gauge"

export class Engine {
    metadata: Metadata
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    dashboard: Dashboard
    simulation: Simulation
    last_time: number | null

    constructor(metadata: Metadata, records: ScadaRecord[]) {
        this.metadata = metadata
        this.simulation = new Simulation(records)
        this.last_time = null
        this.canvas = document.getElementById("canvas")! as HTMLCanvasElement
        this.canvas.width = CANVAS_SIZE.width
        this.canvas.height = CANVAS_SIZE.height
        this.ctx = this.canvas.getContext("2d")! as CanvasRenderingContext2D
        this.dashboard = new Dashboard()
        this.dashboard.add_item(new MetadataBoxInfo(), new Size(2, 1), new Point(0, 0))
        this.dashboard.add_item(new ScadaBoxInfo(), new Size(2, 1), new Point(0, 1))
        this.dashboard.add_item(new AirTemperatureGauge(), new Size(2, 2), new Point(0, 2))
        this.dashboard.add_item(new Compass(), new Size(4, 4), new Point(2, 0))
        this.dashboard.add_item(new PitchAngleGauge(), new Size(2, 2), new Point(0, 4))
        this.dashboard.add_item(new ActivePowerGauge(), new Size(2, 2), new Point(2, 4))
        this.dashboard.add_item(new WindSpeedGauge(), new Size(2, 2), new Point(4, 4))
    }

    render(time: DOMHighResTimeStamp) {
        time /= 1000
        if (this.last_time == null) {
            this.last_time = time - 1 / 60
        }
        let dt = time - this.last_time
        this.last_time = time

        this.simulation.update(dt)
        this.dashboard.update(this.metadata, this.simulation)
        this.dashboard.draw(this.ctx, CANVAS_SIZE)

        this.request_frame()
    }

    request_frame() {
        window.requestAnimationFrame(this.render.bind(this))
    }
}
