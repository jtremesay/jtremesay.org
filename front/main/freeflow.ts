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
    building_flow: Flow | null = null;

    constructor(size: Vec2, pills: Pill[]) {
        this.size = size;
        this.pills = pills;
    }

    pill_at(position: Vec2): Pill | null {
        for (let pill of this.pills) {
            if (pill.position.x === position.x && pill.position.y === position.y) {
                return pill;
            }
        }
        return null;
    }

    flow_at(position: Vec2): Flow | null {
        for (let flow of this.flows) {
            for (let flow_pos of flow.positions) {
                if (flow_pos.x === position.x && flow_pos.y === position.y) {
                    return flow;
                }
            }
        }
        return null;
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


let $svg = d3.select('#freeflow').append('svg');

function init(svg: SVGElement, state: State) {
    let $svg = d3.select(svg);
    $svg.style('background-color', 'black');
    $svg.attr('width', `${state.size.x * tile_size_px}`);
    $svg.attr('height', `${state.size.y * tile_size_px}`);

    // draw tiles
    $svg.append('g').classed('tiles', true)

    // Draw grid
    $svg.append('g')
        .classed('grid', true)
        .selectAll("rect")
        .data(Array(state.size.x * state.size.y).fill(null).map((_, i) => vec2(i % state.size.x, Math.floor(i / state.size.x))))
        .join('rect')
        .attr('x', (_, i) => (i % state.size.x) * tile_size_px)
        .attr('y', (_, i) => Math.floor(i / state.size.x) * tile_size_px)
        .attr('width', tile_size_px)
        .attr('height', tile_size_px)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 1)

    // draw flows
    $svg.append('g').classed('flows', true);

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
        .on("mouseover", function () {
            d3.select(this).transition()
                .duration(1000)
                .ease(d3.easeElastic)
                .attr('r', tile_size_px / 3)
        }).on("mouseout", function () {
            d3.select(this).transition()
                .duration(1000)
                .ease(d3.easeElastic)
                .attr('r', tile_size_px / 4)
        })


    $svg.on('click', (event) => {
        let coords = vec2(Math.floor(event.offsetX / tile_size_px), Math.floor(event.offsetY / tile_size_px));
        let pill = state.pill_at(coords);
        if (pill !== null) {
            state.building_flow = new Flow(pill.match_id, [pill.position]);
            state.flows = state.flows.filter(flow => flow.match_id !== pill.match_id);
            draw(svg, state);
        } else {
            let flow = state.flow_at(coords);
            if (flow !== null) {
                state.flows = state.flows.filter(f => f !== flow);
                draw(svg, state);
            }
        }
    });

    $svg.on("mousemove", function (event) {
        let coords = vec2(Math.floor(event.offsetX / tile_size_px), Math.floor(event.offsetY / tile_size_px));
        if (state.building_flow !== null) {
            let last_pos = state.building_flow.positions[state.building_flow.positions.length - 1];
            let dx = coords.x - last_pos.x;
            let dy = coords.y - last_pos.y;
            if (Math.abs(dx) + Math.abs(dy) === 1 && state.flow_at(coords) === null) {
                let pill = state.pill_at(coords);
                if (pill === null || pill.match_id === state.building_flow.match_id) {
                    state.building_flow.positions.push(coords);

                    if (pill !== null) {
                        state.flows.push(state.building_flow);
                        state.building_flow = null;
                    }

                }

                draw(svg, state);
            }
        }
    });
}


function draw(svg: SVGElement, state: State) {
    let $svg = d3.select(svg);

    // draw tiles
    $svg.select('.tiles')
        .selectAll("path")
        .data(state.flows)
        .join('path')
        .attr('d', flow => {
            return (flow.positions.length == 1 ? [flow.positions[0], flow.positions[0]] : flow.positions).map((pos, i) => {
                return `${i === 0 ? 'M' : 'L'} ${pos.x * tile_size_px + tile_size_px / 2} ${pos.y * tile_size_px + tile_size_px / 2}`;
            }).join(' ');
        })
        .attr('stroke', flow => hsla(HUES[flow.match_id], 9, 0.2))
        .attr('stroke-width', tile_size_px)
        .attr("stroke-linejoin", "square")
        .attr("stroke-linecap", "square")
        .attr('fill', 'none');

    // draw flows
    $svg.select('.flows')
        .selectAll("path")
        .data(state.flows.concat(state.building_flow || []))
        .join('path')
        .attr('d', flow => {
            return (flow.positions.length == 1 ? [flow.positions[0], flow.positions[0]] : flow.positions).map((pos, i) => {
                return `${i === 0 ? 'M' : 'L'} ${pos.x * tile_size_px + tile_size_px / 2} ${pos.y * tile_size_px + tile_size_px / 2}`;
            }).join(' ');
        })
        .attr('stroke', flow => hsla(HUES[flow.match_id], 1, 0.5))
        .attr('stroke-width', tile_size_px / 4)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr('fill', 'none');

}
init($svg.node()!, state);
draw($svg.node()!, state);