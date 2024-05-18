import './style.css'
import * as d3 from 'd3';
const tile_size_px = 128;

const HUES: number[] = [
    0,
    60,
    120,
    180,
    240,
    300,
];

function hsla(h: number, s: number = 1, l: number = 0.5, a: number = 1): string {
    return `hsl(${h} ${s * 100}% ${l * 100}% / ${a})`;
}

class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    manhattan_distance(other: Vec2): number {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }

    eq(other: Vec2): boolean {
        return this.x == other.x && this.y == other.y;
    }
}

function vec2(x: number, y: number): Vec2 {
    return new Vec2(x, y);
}


class Tile {
    position: Vec2;
    pill_id: number | null;
    flow: Flow | null;

    constructor(position: Vec2, pill_id: number | null = null, flow: Flow | null = null) {
        this.position = position;
        this.pill_id = pill_id;
        this.flow = flow;
    }
}

class Flow {
    tiles: Tile[];

    constructor(tiles: Tile[] = []) {
        if (tiles.length == 0) {
            throw new Error("Empty flow");
        }
        this.tiles = tiles;
    }

    get pill_id(): number {
        return this.tiles[0].pill_id!;
    }

    get head(): Tile {
        return this.tiles[0];
    }

    get tail(): Tile {
        return this.tiles[this.tiles.length - 1];
    }

    get is_complete(): boolean {
        return this.tiles.length >= 2 && this.head.pill_id == this.tail.pill_id
    }
}

class State {
    grid_size: Vec2;
    tiles: Tile[][];
    flows: Flow[] = [];
    current_flow: Flow | null = null;

    constructor(grid_size: Vec2, pills_pairs: [Vec2, Vec2][]) {
        this.grid_size = grid_size;
        this.tiles = Array(grid_size.y).fill(null).map((_, y) => Array(grid_size.x).fill(null).map((_, x) => new Tile(vec2(x, y))))
        for (let i = 0; i < pills_pairs.length; ++i) {
            let pair = pills_pairs[i];
            this.tiles[pair[0].y][pair[0].x].pill_id = i;
            this.tiles[pair[1].y][pair[1].x].pill_id = i;
        }
    }
}

function draw($svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, state: State) {
    $svg.select(".tiles")
        .selectAll(".tile")
        .data(state.tiles.flat())
        .join("rect")
        .classed("tile", true)
        .attr("width", tile_size_px)
        .attr("height", tile_size_px)
        .attr("x", (tile) => tile.position.x * tile_size_px)
        .attr("y", (tile) => tile.position.y * tile_size_px)
        .attr("fill", (tile) => tile.flow ? tile.flow.is_complete ? hsla(HUES[tile.flow.pill_id], 1, 0.4) : hsla(HUES[tile.flow.pill_id], 0.9, 0.2) : "black");

    $svg.select(".flows")
        .selectAll(".flow")
        .data(state.flows)
        .join("path")
        .classed("flow", true)
        .attr("d", flow => {
            return (flow.tiles.length == 1 ? [flow.tiles[0], flow.tiles[0]] : flow.tiles).map((tile, i) => {
                return `${i === 0 ? 'M' : 'L'} ${tile.position.x * tile_size_px + tile_size_px / 2} ${tile.position.y * tile_size_px + tile_size_px / 2}`;
            }).join(' ');
        })
        .attr("stroke", flow => hsla(HUES[flow.pill_id]))
        .attr("stroke-width", tile_size_px / 4)

}

export function main() {
    let state = new State(
        vec2(5, 4),
        [
            [vec2(0, 0), vec2(3, 3),],
            [vec2(1, 0), vec2(4, 3)],
            [vec2(1, 2), vec2(2, 1)],
            [vec2(2, 2), vec2(3, 1)]
        ]
    );

    let $svg = d3.select('#freeflow')
        .append('svg')
        .classed("freeflow", true)
        .attr('width', `${state.grid_size.x * tile_size_px}`)
        .attr('height', `${state.grid_size.y * tile_size_px}`);

    // Bottom grid
    // Draw the colored bg (if flow present) and the borders
    $svg.append("g")
        .classed("tiles", true)

    // Flows
    $svg.append("g")
        .classed("flows", true)

    // Sensitive tiles
    $svg.append("g")
        .classed("sensitive-tiles", true)
        .selectAll(".sensitive-tile")
        .data(state.tiles.flat())
        .join("rect")
        .classed("sensitive-tile", true)
        .attr("width", tile_size_px)
        .attr("height", tile_size_px)
        .attr("x", (tile) => tile.position.x * tile_size_px)
        .attr("y", (tile) => tile.position.y * tile_size_px)
        .on("mouseenter", function (_, tile) {
            if (state.current_flow !== null) {
                if (state.current_flow.tail.position.manhattan_distance(tile.position) === 1) {
                    if (state.current_flow.tiles.length >= 2 && state.current_flow.tiles[state.current_flow.tiles.length - 2].position.eq(tile.position)) {
                        // pop last tile
                        state.current_flow.tail.flow = null;
                        state.current_flow.tiles.pop();

                        draw($svg, state)
                    } else if (tile.flow === null && tile.pill_id === null || tile.pill_id === state.current_flow.pill_id) {
                        // push new tile
                        state.current_flow.tiles.push(tile);
                        tile.flow = state.current_flow;

                        if (state.current_flow.is_complete) {
                            state.current_flow = null;
                        }

                        draw($svg, state)
                    }

                }
            }
        })

    // Pills
    $svg.append("g")
        .classed("pills", true)
        .selectAll(".pill")
        .data(state.tiles.flat().filter((tile) => tile.pill_id != null))
        .join("circle")
        .classed("pill", true)
        .attr("cx", (tile) => tile.position.x * tile_size_px + tile_size_px / 2)
        .attr("cy", (tile) => tile.position.y * tile_size_px + tile_size_px / 2)
        .attr("r", tile_size_px / 4)
        .attr("fill", (tile) => hsla(HUES[tile.pill_id!], 1, 0.5))
        .on("mouseover", function () {
            d3.select(this).transition()
                .duration(1000)
                .ease(d3.easeElastic)
                .attr('r', tile_size_px / 3)
        })
        .on("mouseout", function () {
            d3.select(this).transition()
                .duration(1000)
                .ease(d3.easeElastic)
                .attr('r', tile_size_px / 4)
        })
        .on("click", function (_event, tile) {
            // Remove previous flow connected to that pill
            for (let i = 0; i < state.flows.length; ++i) {
                if (state.flows[i].pill_id === tile.pill_id) {
                    for (let t of state.flows[i].tiles) {
                        t.flow = null;
                    }
                    state.flows.splice(i, 1);
                    break;
                }
            }

            // Start a new flow
            state.current_flow = new Flow([tile]);
            state.flows.push(state.current_flow);
            tile.flow = state.current_flow;

            draw($svg, state);
        })

    draw($svg, state)
}