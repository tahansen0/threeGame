import * as THREE from "three"


export function createPlayer() {
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(15, 15, 20),
        new THREE.MeshLambertMaterial({
            color: "white",
            flatShading: true
        })
    )
    body.position.z = 10

    return body
}

export const position = {
    oldRow: 0,
    oldTile: 0,
    currentRow: 0,
    currentTile: 0
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
    
    if (Math.round(player.position.x) === endX && Math.round(player.position.y) === endY) return
    
    player.position.x = THREE.MathUtils.lerp(startX, endX, progress)
    player.position.y = THREE.MathUtils.lerp(startY, endY, progress)
        
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
