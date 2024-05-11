/*
 * Raycaster
 * Copyright (C) 2023 Jonathan Tremesaygues
 *
 * raytracer/scene.ts
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

import { Vector2 } from "./vector2"
import { rect_sdf, union_sdf, differance_sdf } from "./sdf";

/**
 * @brief Get the distance to the nearest object
 * @param point The point
 * @returns the distance between the point and the nearest object or Infinity if no objects
 */

class Door {
    center: Vector2;
    constructor(center: Vector2) {
        this.center = center;
    }
}

class Room {
    center: Vector2;
    size: Vector2;

    constructor(center: Vector2, size: Vector2) {
        this.center = center;
        this.size = size;
    }
}

export class Scene {
    rooms: Room[];
    doors: Door[];

    constructor() {
        this.rooms = []
        this.doors = []
    }

    add_room(center: Vector2, size: Vector2) {
        let room = new Room(center, size);
        this.rooms.push(room);
    }

    add_door(center: Vector2) {
        let door = new Door(center);
        this.doors.push(door);
    }

    distance_to_neareast_object(point: Vector2) {
        // Create an empty world
        let world = Infinity;

        // Add the rooms
        for (let room of this.rooms) {
            let room_sdf = rect_sdf(room.center, room.size, point);
            world = union_sdf(world, room_sdf);
        }

        // Add the doors
        let door_size = new Vector2(1.1, 1.1);
        for (let door of this.doors) {
            let door_sdf = rect_sdf(door.center, door_size, point);
            world = union_sdf(world, door_sdf);
        }

        // Do the magic!
        return differance_sdf(0, world);
    }
}
