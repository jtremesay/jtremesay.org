/*
 * Pi Monte Carlo
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * pimontecarlo.ts
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
let app = document.getElementById("app")!
let canvas = app.querySelector("canvas[name=canvas]")! as HTMLCanvasElement
let samples_count_input = app.querySelector("input[name=samples_count]")! as HTMLInputElement
let samples_in_cirle_input = app.querySelector("input[name=samples_in_circle]")! as HTMLInputElement
let ratio_input = app.querySelector("input[name=ratio]")! as HTMLInputElement
let ctx = canvas.getContext("2d")!

// Clear
ctx.fillStyle = "#333"
ctx.fillRect(0, 0, canvas.width, canvas.height)

let samples_count = 0
let samples_in_circle = 0

function update() {

    ctx.fillStyle = "rgba(0, 0, 0, 0.002)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < 1000; ++i) {
        let x = Math.random()
        let y = Math.random()

        samples_count++
        if (Math.sqrt(x * x + y * y) < 1) {
            ctx.fillStyle = "#0d0"
            samples_in_circle++
        } else {
            ctx.fillStyle = "#d00"
        }
        ctx.fillRect(x * canvas.width, y * canvas.height, 1, 1)
    }
    samples_count_input.value = samples_count.toString()
    samples_in_cirle_input.value = samples_in_circle.toString()
    ratio_input.value = (4 * samples_in_circle / samples_count).toString()

    window.requestAnimationFrame(update)
}

window.requestAnimationFrame(update)
