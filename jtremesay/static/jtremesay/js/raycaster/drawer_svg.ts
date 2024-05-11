/*
 * Raycaster
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * raytracer/drawer_svg.ts
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

import { Vector2 } from "./vector2";
import { Drawer } from "./drawer";

/**
 * @brief Draw in a svg node
 * @implements Drawer
 */
export class SVGDrawer implements Drawer {
    root: SVGElement;
    viewport_size: Vector2;

    constructor(root: SVGElement, viewport_size: Vector2) {
        this.root = root;
        this.viewport_size = viewport_size
    }

    // Implements Drawer
    clear() {
        // Clear the svg node
        this.root.innerHTML = "";

        // Create the clear background
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect") as unknown as SVGRectElement;
        rect.setAttribute("width", this.viewport_size.x.toString());
        rect.setAttribute("height", this.viewport_size.y.toString());
        rect.setAttribute("fill", "magenta");
        this.root.appendChild(rect);
    }

    draw_floor() {
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect") as unknown as SVGRectElement;
        rect.setAttribute("y", (this.viewport_size.y / 2).toString());
        rect.setAttribute("width", this.viewport_size.x.toString());
        rect.setAttribute("height", (this.viewport_size.y / 2).toString());
        rect.setAttribute("fill", "#d3d3d3");
        this.root.appendChild(rect);
    }

    draw_ceil() {
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect") as unknown as SVGRectElement;
        rect.setAttribute("width", this.viewport_size.x.toString());
        rect.setAttribute("height", (this.viewport_size.y / 2).toString());
        rect.setAttribute("fill", "#797979");
        this.root.appendChild(rect);
    }


    draw_wall(column: number, height: number, color: string) {
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect") as unknown as SVGRectElement;
        rect.setAttribute("x", column.toString());
        rect.setAttribute("y", ((this.viewport_size.y / 2) - (height / 2)).toString());
        rect.setAttribute("width", "1");
        rect.setAttribute("height", height.toString());
        rect.setAttribute("fill", color);
        this.root.appendChild(rect);
    }
}
