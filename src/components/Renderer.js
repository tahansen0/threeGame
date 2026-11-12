import * as THREE from "three"


export function createRenderer() {
    const canvas = document.querySelector('canvas.webgl')
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: canvas
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    return renderer

}