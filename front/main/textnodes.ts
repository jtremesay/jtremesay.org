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

function main() {
    const text = "Hello, world!";

    const $main = d3.select("main");
    const $input = $main.append("input")
        .attr("type", "text")
        .attr("value", "Hello, world!");

    const $headless_canvas = d3.create("canvas")
    const ctx = $headless_canvas.node()!.getContext("2d")!;


    const $svg = d3.select("main").append("svg")
    function update(text: string) {

        // Get the size of the bounding box
        ctx.font = "30px Arial";
        const textMetrics = ctx.measureText(text);
        const width = Math.ceil(textMetrics.width);
        const height = Math.ceil(textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent);

        // Resize the canvas to the bounding box
        $headless_canvas
            .property("width", width)
            .property("height", height);
        // Draw the text
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, width / 2, height / 2);

        // Read the pixels
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels_data = imageData.data;
        const pixlist = [];
        for (let y = 0; y < height; y++) {
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
                if (val > 0) {
                    pixlist.push([x, y]);
                }
            }
        }

        $svg
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


    $input.on("input", function () {
        const text = this.value;
        update(text);
    });

    update(text)
}


main();