/*
 * JEngine
 * Copyright (C) 2024 Jonathan Tremesaygues
 *
 * maths.ts
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
export function clamp(x: number, min: number = 0, max: number = 1): number {
    return Math.min(Math.max(x, min), max);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
    x = clamp((x - edge0) / (edge1 - edge0));
    return x * x * (3 - 2 * x);
}