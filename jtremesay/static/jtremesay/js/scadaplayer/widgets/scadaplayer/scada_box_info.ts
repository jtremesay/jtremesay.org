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
import { BoxInfo } from "../base/box_info";
import { TitledWidget } from "../base/titled_widget";

export class ScadaBoxInfo extends TitledWidget {
    constructor() {
        let box_info = new BoxInfo(["Start", "End", "Records count", "Current record", "Timestamp"])

        super("Scada info", box_info)
    }

    update(_metadata: Metadata, simulation: Simulation): void {
        let box_info = this.widget as BoxInfo
        box_info.values = [
            simulation.records[0].timestamp.toISOString(),
            simulation.records[simulation.records.length - 1].timestamp.toISOString(),
            simulation.records.length.toFixed(),
            (simulation.i + 1).toFixed(),
            simulation.record!.timestamp.toISOString()
        ]
    }
}
