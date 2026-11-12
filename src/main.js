import * as THREE from "three"
import { createControls } from "./components/OrbitControls";
import { createCamera } from "./components/Camera.js";
import { createPlayer, position, movesQueue, resetQueue, setPosition, stepCompleted } from "./components/Player.js"
import { initializeMap, map } from "./components/Map.js";
import { createRenderer } from "./components/Renderer.js"
import { createScene } from "./components/Scene.js";
import "./style.css"

import { EffectComposer } from "three/examples/jsm/Addons.js"
import { RenderPass } from "three/examples/jsm/Addons.js"
import { OutlinePass } from "three/examples/jsm/Addons.js"

import { createGUI } from "./components/gui.js";
import { buildQueue } from "./animatePlayer.js";
import { resetRendererAndSceneState } from "three/src/renderers/common/RendererUtils.js";

const camera = createCamera()
const player = createPlayer()

initializeMap()
const scene = createScene( camera, player, map)
const renderer = createRenderer()
const controller = createControls( camera, renderer)

controller.mouseButtons = {
    MIDDLE: THREE.MOUSE.ROTATE
}

let selectedObjects = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


/**
 * Init Postprocessing
 */


const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(window.innerWidth, window.innerHeight)

const renderPass = new RenderPass( scene, camera );
effectComposer.addPass( renderPass );

const outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
effectComposer.addPass( outlinePass );


window.addEventListener('resize', () => {
  effectComposer.setSize(window.innerWidth, window.innerHeight);
  outlinePass.setSize(window.innerWidth, window.innerHeight);
});

renderer.domElement.addEventListener( 'pointermove', onPointerMove );

function onPointerMove( event ) {
    if ( event.isPrimary === false ) return;
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    checkIntersection();
}

function addSelectedObject( object ) {
    selectedObjects = [];
    selectedObjects.push( object );
}

function checkIntersection() {
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObject( scene, true );

    if ( intersects.length > 0 ) {
        const selectedObject = intersects[ 0 ].object;
        addSelectedObject( selectedObject );
        outlinePass.selectedObjects = selectedObjects;
    } else {
        outlinePass.selectedObjects = [];
    }
}

const moveClock = new THREE.Clock(false)

const worldPos = new THREE.Vector3();
const worldQuat = new THREE.Quaternion();
const worldScale = new THREE.Vector3();

const oldPos = new THREE.Vector3()

window.addEventListener( 'click', () => {
    //currentpos

    oldPos.x = position.currentTile * 42
    oldPos.y = position.currentRow * 42
    oldPos.z = 1.5
    //worldpos

    selectedObjects[0].updateMatrixWorld(true);
    selectedObjects[0].matrixWorld.decompose(worldPos, worldQuat, worldScale);
    //console.log(worldPos, oldPos)

    //console.log(position)
    //console.log(movesQueue)

    if (movesQueue.length > 0) {
        resetQueue()
    }
    buildQueue(worldPos, oldPos)
    console.log(movesQueue)
    
    
}) 


createGUI(outlinePass)
moveClock.start()
let tickCount = 0
const TICK_INTERVAL = 0.6;
let lastTickTime = 0;

let hasStepped = false;

const tick = () => {
    camera.lookAt(player.position) 
    controller.target = player.position
    controller.update()
    const elapsed = moveClock.getElapsedTime();

    const progress = Math.min((elapsed - lastTickTime) / TICK_INTERVAL, 1);
    if (hasStepped) {
        setPosition(player, progress);
    }

    while (elapsed - lastTickTime >= TICK_INTERVAL) {
        if (movesQueue.length > 0) {
            stepCompleted();
            hasStepped = true
        }
        lastTickTime += TICK_INTERVAL;
        tickCount++;
    }

    
    effectComposer.render();
    requestAnimationFrame(tick);
};

requestAnimationFrame(tick);