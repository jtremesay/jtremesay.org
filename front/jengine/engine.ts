/*
 * JEngine
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * engine.ts
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

export interface EngineUpdater<D extends EngineData> {
    update(data: D | null, dt: DOMHighResTimeStamp): D | null;
}

export interface EngineRenderer<D extends EngineData> {
    render(data: D | null): void;
}

export interface EngineData {
}


export class Engine<U extends EngineUpdater<D>, R extends EngineRenderer<D>, D extends EngineData> {
    updater: U | null;
    renderer: R | null;
    data: D | null;

    constructor(updater: U | null, renderer: R | null, data: D | null) {
        this.updater = updater;
        this.renderer = renderer;
        this.data = data;
    }

    update(dt: DOMHighResTimeStamp) {
        if (this.updater !== null) {
            const new_data = this.updater.update(this.data, dt);
            if (new_data !== null) {
                this.data = new_data;
            }
        }
    }

    render() {
        if (this.renderer !== null) {
            this.renderer.render(this.data);
        }
    }

    run(dt: DOMHighResTimeStamp) {
        this.update(dt);
        this.render();

        window.requestAnimationFrame(this.run.bind(this));
    }

    start() {
        this.run(1 / 60)
    }
}
