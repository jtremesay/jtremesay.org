/*
 * Scadaplayer
 * Copyright (C) 2024 Jonathan Tremesaygues
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
import { Size } from "./widgets/base/size"

export const ITEM_SIZE = new Size(160, 135)
export const GRID_SIZE = new Size(6, 6)
export const CANVAS_SIZE = new Size(ITEM_SIZE.width * GRID_SIZE.width, ITEM_SIZE.height * GRID_SIZE.height)
export const TITLE_HEIGHT: number = 20
