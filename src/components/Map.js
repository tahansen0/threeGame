import * as THREE from "three"
import { Grass } from "./Grass.js"
import { tilesPerRow, minTileIndex, maxTileIndex } from "../constants.js"

export const map = new THREE.Group()

export function initializeMap() {
    // -8 to 8 to match width of 17
    for (let x = minTileIndex; x < maxTileIndex + 1; x++) {
        for (let y = minTileIndex; y < maxTileIndex + 1; y++) {
            const grass = Grass(x, y)
            map.add(grass)
        }
    }
    return map
}
