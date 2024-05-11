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
import { ScadaRecord } from "./models"

export function parse_scada(scada: string): ScadaRecord[] {
    let lines = scada.split("\n")

    // Parse headers
    let lut: Record<string, number> = {}
    lines[0].split(",").forEach((value, i) => {
        lut[value] = i
    })
    lines.splice(0, 1)

    return lines.map((value) => value.trim()).filter((value) => value.length).map((line) => {
        let values = line.split(",")

        return {
            timestamp: new Date(values[lut["timestamp"]]),
            wind_speed: Number.parseFloat(values[lut["wind_speed"]]),
            wind_direction: Number.parseFloat(values[lut["wind_direction"]]),
            air_temperature: Number.parseFloat(values[lut["air_temperature"]]),
            nacelle_direction: Number.parseFloat(values[lut["nacelle_direction"]]),
            active_power: Number.parseFloat(values[lut["active_power"]]),
            pitch_angle: Number.parseFloat(values[lut["pitch_angle"]]),
        }
    })
}
