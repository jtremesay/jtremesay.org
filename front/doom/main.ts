/*
 * Computer Generated Images
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * doom
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
import axios from 'axios';
import * as d3 from "d3"
import { Engine } from './engine';
import { read_lumps } from './lumps';
import { read_wad } from './readers';
import { WAD } from './types';

function download_wad(url: string, callback: (wad: WAD) => void) {
    // We don't really need axios for that,
    // but I wanted to pex with this lib
    axios.get(url, {
        responseType: "arraybuffer",
        transformResponse: (data) => read_wad(read_lumps(data))
    }).then((response) => callback(response.data))
}

export function main() {
    const $app = d3.select(".doom")

    const url = $app.attr("data-wad-url")
    $app.append("p").text(`Downloading ${url}…`)
    download_wad(url, (wad) => {
        let engine = new Engine($app.node()! as HTMLElement, wad)
        engine.run()
    })
}
