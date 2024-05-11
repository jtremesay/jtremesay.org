/*
 * Animated sorts
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * sorts.ts
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

function lerp(x: number, x0: number, x1: number, y0: number, y1: number): number {
    return y0 + (x - x0) * (y1 - y0) / (x1 - x0)
}

// randint() in [a, b[
function randint(a: number = 0, b: number = 2 * 32): number {
    return Math.floor(lerp(Math.random(), 0, 1, a, b))
}

function swap(array: Array<number>, a: number, b: number): Array<number> {
    let tmp = array[a]
    array[a] = array[b]
    array[b] = tmp

    return array
}

function shuffle(array: Array<number>): Array<number> {
    for (let i = 0; i < array.length - 1; ++i) {
        swap(array, i, randint(i, array.length))
    }

    return array
}

function* bubble_sort(samples: Array<number>): Generator<Array<number>> {
    let swapped = false
    do {
        swapped = false
        for (let i = 1; i < samples.length; ++i) {
            if (samples[i - 1] > samples[i]) {
                swap(samples, i, i - 1)
                swapped = true

                yield samples
            }
        }
    } while (swapped)
}

function* gnome_sort(samples: Array<number>): Generator<Array<number>> {
    for (let i = 0; i < samples.length;) {
        if (i == 0 || samples[i] >= samples[i - 1]) {
            ++i
        } else {
            swap(samples, i, i - 1)
            i--

            yield samples
        }
    }
}

function* insertion_sort(samples: Array<number>): Generator<Array<number>> {
    for (let i = 1; i < samples.length; ++i) {
        let j = i
        while (j > 0 && samples[j - 1] > samples[j]) {
            swap(samples, j, j - 1)
            j--

            yield samples
        }
    }
}

function* odd_even_sort(samples: Array<number>): Generator<Array<number>> {
    let sorted = false
    while (!sorted) {
        for (let j = 0; j < 2; ++j) {
            sorted = true
            for (let i = 1; i < samples.length - 1; i += 2) {
                if (samples[i] > samples[i + 1]) {
                    swap(samples, i, i + 1);
                    sorted = false;

                    yield samples
                }
            }
        }
        sorted = true
        for (let i = 0; i < samples.length - 1; i += 2) {
            if (samples[i] > samples[i + 1]) {
                swap(samples, i, i + 1);
                sorted = false;
                yield samples
            }
        }
    }
}

const SORTERS: Map<string, (samples: Array<number>) => Generator<Array<number>>> = new Map([
    ["bubble", bubble_sort],
    ["gnome", gnome_sort],
    ["insertion", insertion_sort],
    ["oddeven", odd_even_sort]
])


class Sorter {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    sorter: Generator<Array<number>> | null
    samples: Array<number>

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!
        this.sorter = null
        this.samples = []
    }

    reset(samples: Array<number>) {
        this.samples = samples
        this.sorter = SORTERS.get(this.canvas.dataset.sort!)!(samples)
    }

    update() {
        if (this.sorter != null) {
            let result = this.sorter.next()
            if (!result.done) {
                this.samples = result.value
            }
        }
    }

    render() {
        // Clear
        this.ctx.fillStyle = "#333"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.save()
        // Flip Y, so 0 is bottom and Y-max is up
        this.ctx.scale(1, -1)
        this.ctx.translate(0, -this.canvas.height)

        // Fill the entire canvas with the bars
        this.ctx.scale(this.canvas.width / this.samples.length, this.canvas.height / this.samples.length)

        // Draw the bar
        this.samples.forEach((sample, i) => {
            this.ctx.fillStyle = `hsl(${lerp(sample, 0, this.samples.length, 0, 360)}, 100%, 50%)`
            this.ctx.fillRect(i, 0, 1, sample)
        })
        this.ctx.restore()
    }
}


class Engine {
    samples_count_input: HTMLInputElement
    playback_input: HTMLInputElement
    sorters: Array<Sorter>

    constructor() {
        let app_node = document.getElementById("app")!
        this.samples_count_input = app_node.querySelector("input[name=samples_count]")! as HTMLInputElement
        this.samples_count_input.addEventListener("input", this.reset.bind(this))
        let reset_input = app_node.querySelector("input[name=reset]")! as HTMLInputElement
        reset_input.addEventListener("click", this.reset.bind(this))
        this.playback_input = app_node.querySelector("input[name=playback]")! as HTMLInputElement

        this.sorters = []
        for (let canvas of app_node.querySelectorAll("canvas") as NodeListOf<HTMLCanvasElement>) {
            this.sorters.push(new Sorter(canvas))
        }

        this.reset()
    }

    reset() {
        let samples = shuffle(Array(Math.pow(2, parseInt(this.samples_count_input.value))).fill(0).map((_k, i) => i))
        for (let sorter of this.sorters) {
            sorter.reset(new Array(...samples))
        }
    }

    start() {
        this.update()
        this.render()

        window.requestAnimationFrame(this.start.bind(this))
    }

    update() {
        if (this.playback_input.checked) {
            for (let sorter of this.sorters) {
                sorter.update()
            }
        }
    }

    render() {
        for (let sorter of this.sorters) {
            sorter.render()
        }
    }
}

new Engine().start()
