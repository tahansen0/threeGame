import * as THREE from "three"

export function ambientLight() {
    const ambientLight = new THREE.AmbientLight()
    return ambientLight
}

export function directionalLight() {
    const directionalLight = new THREE.DirectionalLight()
    directionalLight.position.set(-100, -100, 200)
    return directionalLight
}