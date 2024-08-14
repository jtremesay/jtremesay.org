/*
 * Scadaplayer
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
import { EngineUpdater } from "../jengine/engine"
import { EngineCanvas2DRenderer } from "../jengine/renderer_canvas"
export class ScadaPlayerData {
    metadata: Metadata
    dashboard: Dashboard
    simulation: Simulation
    last_time: number | null

    constructor(metadata: Metadata, records: ScadaRecord[]) {
        this.metadata = metadata
        this.simulation = new Simulation(records)
        this.last_time = null
        this.dashboard = new Dashboard()
        this.dashboard.add_item(new MetadataBoxInfo(), new Size(2, 1), new Point(0, 0))
        this.dashboard.add_item(new ScadaBoxInfo(), new Size(2, 1), new Point(0, 1))
        this.dashboard.add_item(new AirTemperatureGauge(), new Size(2, 2), new Point(0, 2))
        this.dashboard.add_item(new Compass(), new Size(4, 4), new Point(2, 0))
        this.dashboard.add_item(new PitchAngleGauge(), new Size(2, 2), new Point(0, 4))
        this.dashboard.add_item(new ActivePowerGauge(), new Size(2, 2), new Point(2, 4))
        this.dashboard.add_item(new WindSpeedGauge(), new Size(2, 2), new Point(4, 4))
    }
}

export class ScadaPlayerUpdater implements EngineUpdater<ScadaPlayerData> {
    update(data: ScadaPlayerData | null, dt: number): ScadaPlayerData | null {
        if (data === null) {
            return null
        }

        data.simulation.update(dt)
        data.dashboard.update(data.metadata, data.simulation)

        return null
    }
}

export class ScadaPlayerRenderer extends EngineCanvas2DRenderer<ScadaPlayerData> {
    render(data: ScadaPlayerData | null): void {
        if (data === null) {
            return
        }

        data.dashboard.draw(this.ctx, CANVAS_SIZE)
    }
}