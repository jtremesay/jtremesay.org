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
import { lerp } from "./maths";
import { ScadaRecord } from "./models";

export class Simulation {
    records: ScadaRecord[]
    record: ScadaRecord | null
    i: number

    constructor(records: ScadaRecord[]) {
        this.records = records
        this.i = 0
        this.record = records.length > 0 ? records[0] : null
    }

    update(dt: number) {
        this.i += dt

        // No records
        if (this.records.length == 0) {
            this.record = null
            return
        }

        // One record, just use it
        if (this.records.length == 1) {
            this.record = this.records[0]
            return
        }

        // Simulation is finished, use last record and reset
        if (this.i >= this.records.length - 1) {
            this.record = this.records[this.records.length - 1]
            this.i = 0
        }

        // At least two records, do a linear interpol between them
        let i = Math.floor(this.i)
        let curr = this.records[i]
        let next = this.records[i + 1]
        let j = this.i - i
        this.record = {
            timestamp: curr.timestamp,
            wind_speed: lerp(j, 0, 1, curr.wind_speed, next.wind_speed),
            wind_direction: lerp(j, 0, 1, curr.wind_direction, next.wind_direction),
            air_temperature: lerp(j, 0, 1, curr.air_temperature, next.air_temperature),
            nacelle_direction: lerp(j, 0, 1, curr.nacelle_direction, next.nacelle_direction),
            active_power: lerp(j, 0, 1, curr.active_power, next.active_power),
            pitch_angle: lerp(j, 0, 1, curr.pitch_angle, next.pitch_angle),
        }
    }
}
