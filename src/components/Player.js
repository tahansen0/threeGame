import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


async function loadModel(url) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url)
    return gltf
}

export async function createPlayer() {
    const model = await loadModel('./untitled.glb');
    model.scene.scale.setScalar(5);          
    model.scene.position.set(0, 0, 0);
    model.scene.rotation.x = Math.PI / 2; 
    console.log(model.animations);      
    console.log(model.animations[0].duration)

    return model
}

export const position = {
    oldRow: 0,
    oldTile: 0,
    currentRow: 0,
    currentTile: 0,
    isStopped: true
}

export const movesQueue = []

export function queueMove(direction) {
    movesQueue.push(direction)
}
export function resetQueue() {
    movesQueue.length = 0
}

const directionLookup = {
    forward:{x:0,y:1},
    backward:{x:0,y:-1},
    left:{x:-1,y:0},
    right:{x:1,y:0},
    forwardright:{x:1,y:1},
    forwardleft:{x:-1,y:1},
    backwardright:{x:1,y:-1},
    backwardleft:{x:-1,y:-1}
}

export function setPosition(player, progress) {
    
    let startX = position.oldTile * 42
    let startY = position.oldRow * 42
    let endX = position.currentTile * 42
    let endY = position.currentRow * 42
    
    if (Math.round(player.scene.position.x) === endX && Math.round(player.scene.position.y) === endY) {
	position.isStopped = true
	return
    }
    
    position.isStopped = false    
    player.scene.position.x = THREE.MathUtils.lerp(startX, endX, progress)
    player.scene.position.y = THREE.MathUtils.lerp(startY, endY, progress)
        
    // player.position.x = position.currentTile * 42
    // player.position.y = position.currentRow * 42
    
}

export function stepCompleted() {
    
    //console.log(movesQueue[0])
    const direction = movesQueue.shift()
    position.oldRow = position.currentRow
    position.oldTile = position.currentTile
    position.currentTile += directionLookup[direction].x 
    position.currentRow += directionLookup[direction].y 
    

    
}
