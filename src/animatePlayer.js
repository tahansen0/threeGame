import * as THREE from "three"
import { movesQueue, queueMove, stepCompleted, setPosition, position } from "./components/Player"
import { tileSize } from "./constants"

function vec3Equal(a, b) {
  return a.x === b.x && a.y === b.y;
}

function moveX(xDifference) {
    if (xDifference < 0) {
        queueMove("left")
        xDifference++        
    }
    else {  
        queueMove("right")
        xDifference--  
    } 
    return xDifference   
      
}
function moveY(yDifference) {
    if (yDifference > 0) {
        queueMove("forward") 
        yDifference-- 
             
    }
    else {
        queueMove("backward")
        yDifference++
    }
    //console.log(yDifference)
    return yDifference
    
}

export function buildQueue(endPos, startPos) {
    if (vec3Equal(endPos, startPos)) return
    let startX = startPos.x / 42
    let startY = startPos.y / 42

    let endX = endPos.x / 42
    let endY = endPos.y / 42

    let xDifference = endX - startX 
    let yDifference = endY - startY  

    let absValueX = Math.abs(xDifference)
    let absValueY = Math.abs(yDifference)

    //console.log(xDifference, yDifference)
    //console.log(absValueX, absValueY)

    let steps = absValueX + absValueY
    //console.log(steps)
    for (let i = 0; i < steps; i++) {
        if (absValueX > absValueY) {
            xDifference = moveX(xDifference)
            absValueX--

        }
        else if (absValueY > absValueX) {
            yDifference = moveY(yDifference)
            absValueY--

        }
        else if (absValueX === absValueY) {
            //console.log(yDifference)
            if (xDifference + yDifference > 0) {
                queueMove("forwardright" ) 
                xDifference--
                yDifference--
                i++
            }
            else if (xDifference + yDifference < 0) {
                queueMove("backwardleft")
                xDifference++
                yDifference++
                i++
            }
            else if (xDifference + yDifference === 0) {
                if (xDifference < 0) {
                    queueMove("forwardleft") 
                    xDifference++
                    yDifference--
                    i++
                }
                if (yDifference < 0) {
                    queueMove("backwardright")
                    xDifference--
                    yDifference++
                    i++
                }
            }
        }
        
    }
}

