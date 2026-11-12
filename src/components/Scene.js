import * as THREE from "three"
import { ambientLight, directionalLight } from "./Lights"


export function createScene( camera, player, map) {
    const scene = new THREE.Scene()
    scene.add(player)
    
    /**
     * Lights
     */
    const ambLight = ambientLight()
    scene.add(ambLight)
    
    const dirLight = directionalLight()
    scene.add(dirLight)
    
    scene.add(map)
    scene.add(camera)
    
    return scene
}