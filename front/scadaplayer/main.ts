/*
 * Scadaplayer
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * main.ts
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

import { Engine } from "../jengine/engine"
import { ScadaPlayerData, ScadaPlayerRenderer, ScadaPlayerUpdater } from "./engine"
import { parse_scada } from "./parser"


export function main() {
    const metadata = JSON.parse((document.getElementById("metadata")! as HTMLTextAreaElement).value)
    const records = parse_scada((document.getElementById("scada")! as HTMLTextAreaElement).value)
    const data = new ScadaPlayerData(metadata, records)
    const updater = new ScadaPlayerUpdater()
    const renderer = new ScadaPlayerRenderer(document.getElementById("canvas")! as HTMLCanvasElement)
    const engine = new Engine(updater, renderer, data)
    engine.start()
}