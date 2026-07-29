/*
 * Raycaster
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * raytracer/scene.ts
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

import { Vector2 } from "./vector2"
import { rect_sdf, union_sdf, differance_sdf } from "./sdf";

class Room {
    center: Vector2;
    size: Vector2;

    constructor(center: Vector2, size: Vector2) {
        this.center = center;
        this.size = size;
    }
}

const DOOR_SIZE = new Vector2(1.1, 1.1);

export class Scene {
    rooms: Room[];

    constructor() {
        this.rooms = []
    }

    add_room(center: Vector2, size: Vector2): Room {
        let room = new Room(center, size);
        this.rooms.push(room);

        return room;
    }

    add_door(center: Vector2): Room {
        return this.add_room(center, DOOR_SIZE);
    }

    distance_to_neareast_object(point: Vector2): number {
        // Create an empty world
        let world = Infinity;

        // Add the rooms
        for (let room of this.rooms) {
            let room_sdf = rect_sdf(room.center, room.size, point);
            world = union_sdf(world, room_sdf);
        }

        // Do the magic!
        return differance_sdf(0, world);
    }
}
