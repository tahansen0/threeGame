import * as THREE from "three"
import { tilesPerRow, tileSize } from "../constants.js"

export function Grass(rowIndex, columnIndex) {
    const grass = new THREE.Group()
    grass.position.x = rowIndex * tileSize
    grass.position.y = columnIndex * tileSize

    const foundation = new THREE.Mesh(
        new THREE.BoxGeometry(tileSize, tileSize, 3),
        new THREE.MeshLambertMaterial({color: "red"})
    )
    foundation.position.z = 1.5
    grass.add(foundation)

    return grass
}