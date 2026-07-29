/*
 * Computer Generated Images
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * sierpinski.ts
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
const SVG_NS = "http://www.w3.org/2000/svg"
const NS = "sierpinski"

const TRIANGLES_POS = [[0.5, 0], [0.5 - Math.sin(Math.PI / 3) / 2, 0.75], [0.5 + Math.sin(Math.PI / 3) / 2, 0.75]]
const TRIANGLE_PATH = `M${TRIANGLES_POS.map(([x, y]) => `${x},${y}`).join("L")}Z`

function create_def_triangle_n(level: number): SVGElement {
    if (level <= 0) {
        return document.createElementNS(SVG_NS, "g");
    }

    if (level === 1) {
        const path = document.createElementNS(SVG_NS, "path")
        path.setAttribute("d", TRIANGLE_PATH)
        path.setAttribute("fill", "yellow")

        return path
    }

    const g = document.createElementNS(SVG_NS, "g")
    const href = `#${NS}-def_triangle_${level - 1}`
    for (const [x, y] of TRIANGLES_POS) {
        const use = document.createElementNS(SVG_NS, "use")
        use.setAttribute("href", href)
        use.setAttribute("transform", `scale(0.5) translate(${x}, ${y})`)
        g.appendChild(use)
    }

    return g
}

export function main() {
    document.addEventListener("DOMContentLoaded", () => {
        for (const container of document.querySelectorAll(`.${NS}`)) {
            const level_input = container.querySelector(`input.${NS}-level`) as HTMLInputElement
            const level_min = parseInt(level_input.getAttribute("min") || "0")
            const level_max = parseInt(level_input.getAttribute("max") || "10")

            const svg = container.querySelector(`svg.${NS}-svg`) as SVGElement
            svg.setAttribute("viewBox", "0 0 1 1")
            const defs = svg.querySelector("defs") || document.createElementNS(SVG_NS, "defs")
            if (!defs.parentNode) {
                svg.appendChild(defs)
            }

            for (let level = level_min; level <= level_max; level++) {
                const def = create_def_triangle_n(level)
                def.setAttribute("id", `${NS}-def_triangle_${level}`)
                defs.appendChild(def)
            }

            const top = document.createElementNS(SVG_NS, "use")
            top.setAttribute("href", `#${NS}-def_triangle_${parseInt(level_input.value)}`)
            top.setAttribute("y", (.1).toString())
            svg.appendChild(top)

            level_input.addEventListener("input", () => {
                top.setAttribute("href", `#${NS}-def_triangle_${parseInt(level_input.value)}`)
            })
        }
    })
}