/*
 * Text nodes
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * textnodes.ts
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
import 'vite/modulepreload-polyfill';
import * as d3 from "d3";



function generate_pixmap(text: string): [number, number, boolean[][]] {
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;

    // Get the size of the bounding box
    ctx.font = "30px Arial";
    const textMetrics = ctx.measureText(text);
    const width = Math.ceil(textMetrics.width);
    const height = Math.ceil(textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent);

    // Resize the canvas to the bounding box
    canvas.width = width;
    canvas.height = height;

    // Draw the text
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);

    // Read the pixels
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels_data = imageData.data;
    const pixmap: boolean[][] = [];
    for (let y = 0; y < height; y++) {
        pixmap[y] = [];
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = pixels_data[index];
            const g = pixels_data[index + 1];
            const b = pixels_data[index + 2];
            const a = pixels_data[index + 3];
            // Fun fact: firefox use the alpha channel
            // instead of the rgb channels to render the text
            // so basically, all pixels are (0, 0, 0, a)
            // where a is the alpha value of the pixel
            // No idea if this tricks is used by the other browsers.
            // So we just filter on any non null channel value
            const val = Math.max(r, g, b, a);
            pixmap[y][x] = val > 0;
        }
    }

    return [width, height, pixmap];
}

function generate_pixlist(pixmap: boolean[][]): [number, number][] {
    const pixlist: [number, number][] = [];
    for (let y = 0; y < pixmap.length; y++) {
        for (let x = 0; x < pixmap[y].length; x++) {
            if (pixmap[y][x]) {
                pixlist.push([x, y]);
            }
        }
    }

    return pixlist;
}

function main() {
    const text = "Hello, world!";
    const [width, height, pixmap] = generate_pixmap(text);
    const pixlist = generate_pixlist(pixmap);
    console.log(pixlist);

    const $svg = d3.select("main").append("svg")
        .attr("width", width * 10)
        .attr("height", height * 10);
    $svg.selectAll("circle")
        .data(pixlist)
        .join("circle")
        .attr("cx", d => d[0] * 10 + 5)
        .attr("cy", d => d[1] * 10 + 5)
        .attr("r", 5)
        .attr("fill", "black");

}


main();