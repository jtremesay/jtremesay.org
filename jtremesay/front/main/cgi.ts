/*
 * Computer Generated Images
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * cgi.ts
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

function sierpinski_create_triangle(level: number): SVGElement {
    if (level <= 0) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
        path.setAttribute("d", `M 0.5,0L${0.5 - Math.sin(Math.PI / 3) / 2},0.75 ${0.5 + Math.sin(Math.PI / 3) / 2},0.75Z`)
        path.setAttribute("fill", "yellow")
        path.classList.add("triangle")
        return path
    }

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    g.classList.add("triangle")

    const triangle_a = sierpinski_create_triangle(level - 1)
    triangle_a.setAttribute("transform", `scale(0.5, 0.5) translate(0.5, 0)`)
    g.appendChild(triangle_a)

    const triangle_b = sierpinski_create_triangle(level - 1)
    triangle_b.setAttribute("transform", `scale(0.5, 0.5) translate(${0.5 - Math.sin(Math.PI / 3) / 2}, 0.75)`)
    g.appendChild(triangle_b)

    const triangle_c = sierpinski_create_triangle(level - 1)
    triangle_c.setAttribute("transform", `scale(0.5, 0.5) translate(${0.5 + Math.sin(Math.PI / 3) / 2}, 0.75)`)
    g.appendChild(triangle_c)

    return g

}

function draw_sierpinski(svg: SVGElement, input: HTMLInputElement) {
    svg.querySelectorAll(".triangle").forEach((triangles) => triangles.remove())
    svg.appendChild(sierpinski_create_triangle(parseInt(input.value)))
}


function main_sierpinski() {
    let container = document.getElementById("sierpinski")!
    let svg = container.querySelector("svg")!

    let input = container.querySelector("input")!
    input.addEventListener("input", () => {
        draw_sierpinski(svg, input)
    })

    draw_sierpinski(svg, input)
}


main_sierpinski()
