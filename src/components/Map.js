import * as THREE from "three"
import { Grass } from "./Grass.js"
import { tilesPerRow, minTileIndex } from "../constants.js"

export const map = new THREE.Group()
const rowIndex = minTileIndex


export function initializeMap() {
    // -8 to 8 to match width of 17
    for (let x = rowIndex; x <= tilesPerRow; x++) {
        for (let y = rowIndex; y <= tilesPerRow; y++) {
            const grass = Grass(x, y)
            map.add(grass)
        }
    }
    return map
}