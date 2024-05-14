import * as d3 from 'd3';

const tile_size_px = 128;

export const HUES: number[] = [
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
}

export function vec2(x: number, y: number): Vec2 {
    return new Vec2(x, y);
}

export class Pill {
    match_id: number;
    position: Vec2;

    constructor(match_id: number, position: Vec2) {
        this.match_id = match_id;
        this.position = position;
    }
}

export class Flow {
    match_id: number;
    positions: Vec2[];

    constructor(match_id: number, positions: Vec2[] = []) {
        this.match_id = match_id;
        this.positions = positions;
    }
}

export class State {
    size: Vec2;
    pills: Pill[];
    flows: Flow[] = [];

    constructor(size: Vec2, pills: Pill[]) {
        this.size = size;
        this.pills = pills;
    }
}

let state = new State(vec2(5, 4), [[
    vec2(0, 0),
    vec2(3, 3),
], [
    vec2(1, 0),
    vec2(4, 3)
], [
    vec2(1, 2),
    vec2(2, 1)
], [
    vec2(2, 2),
    vec2(3, 1)
]].map((poss, i) => poss.map(pos => new Pill(i, pos))).flat());


state.flows.push(new Flow(0, [
    vec2(0, 0),
    vec2(0, 1),
    vec2(0, 2),
    vec2(0, 3),
    vec2(1, 3),
    vec2(2, 3),
    vec2(3, 3),
]));
state.flows.push(new Flow(1, [
    vec2(1, 0),
    vec2(2, 0),
    vec2(3, 0),
    vec2(4, 0),
    vec2(4, 1),
    vec2(4, 2),
    vec2(4, 3),
]));
state.flows.push(new Flow(2, [
    vec2(1, 2),
    vec2(1, 1),
    vec2(2, 1),
]));
state.flows.push(new Flow(3, [
    vec2(2, 2),
    vec2(3, 2),
    vec2(3, 1),
]));

let $svg = d3.select('#freeflow').append('svg');
$svg.style('background-color', 'black');
$svg.attr('width', `${state.size.x * tile_size_px}`);
$svg.attr('height', `${state.size.y * tile_size_px}`);

// Draw grid
$svg.append('g')
    .classed('grid', true)
    .call($grid => {

        $grid.append("g")
            .classed("hlines", true)
            .selectAll('line')
            .data(Array(state.size.y + 1).fill(null))
            .join('line')
            .attr('x1', 0)
            .attr('x2', state.size.x * tile_size_px)
            .attr('y1', (_, i) => i * tile_size_px)
            .attr('y2', (_, i) => i * tile_size_px)
            .attr('stroke', 'white');
        $grid.append("g")
            .classed("vlines", true)
            .selectAll('line')
            .data(Array(state.size.x + 1).fill(null))
            .join('line')
            .classed('vline', true)
            .attr('y1', 0)
            .attr('y2', state.size.y * tile_size_px)
            .attr('x1', (_, i) => i * tile_size_px)
            .attr('x2', (_, i) => i * tile_size_px)
            .attr('stroke', 'white');
    });

// draw pills
$svg.append('g')
    .classed('pills', true)
    .selectAll('circle')
    .data(state.pills)
    .join('circle')
    .attr('cx', pill => pill.position.x * tile_size_px + tile_size_px / 2)
    .attr('cy', pill => pill.position.y * tile_size_px + tile_size_px / 2)
    .attr('r', tile_size_px / 4)
    .attr('fill', pill => hsla(HUES[pill.match_id], 1, 0.5))
    .on("mouseover", function (event, pill) {
        d3.select(this).transition()
            .duration(1000)
            .ease(d3.easeElastic)
            .attr('r', tile_size_px / 2.5)
    }).on("mouseout", function (event, pill) {
        d3.select(this).transition()
            .duration(1000)
            .ease(d3.easeElastic)
            .attr('r', tile_size_px / 4)
    })

// draw flows
$svg.append('g')
    .classed('flows', true)
    .selectAll("path")
    .data(state.flows)
    .join('path')
    .attr('d', flow => {
        return flow.positions.map((pos, i) => {
            return `${i === 0 ? 'M' : 'L'} ${pos.x * tile_size_px + tile_size_px / 2} ${pos.y * tile_size_px + tile_size_px / 2}`;
        }).join(' ');
    })
    .attr('stroke', flow => hsla(HUES[flow.match_id], 1, 0.5))
    .attr('stroke-width', tile_size_px / 4)
    .attr("stroke-linejoin", "round")
    .attr('fill', 'none');
