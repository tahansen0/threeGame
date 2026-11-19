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

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


const camera = createCamera()
const player = createPlayer()

initializeMap()
const scene = createScene( camera, player, map)
const renderer = createRenderer()
const controller = createControls( camera, renderer)
console.log(scene.children[3])

controller.mouseButtons = {
    MIDDLE: THREE.MOUSE.ROTATE
}

let selectedObjects = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const loader = new GLTFLoader();
let mixer;
const clock = new THREE.Clock();

loader.load('/untitled.glb', (gltf) => {

 const model = gltf.scene;
  model.scale.setScalar(5);          // adjust until it looks right
  model.position.set(0, 0, 0);
  model.rotation.x = Math.PI / 2;     // see note below
  scene.add(model);

  console.log(gltf.animations);       // should list your clip(s)
  console.log(gltf.animations[0].duration)
  mixer = new THREE.AnimationMixer(model);
  gltf.animations.forEach((clip) => {
    mixer.clipAction(clip).play()
  })
})


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
    //camera.position.x = 100
    controller.update()
    //console.log(position)
    //console.log(movesQueue)

    if (movesQueue.length > 0) {
        resetQueue()
    }
    let xDifference = (worldPos.x - oldPos.x)/42 
    let yDifference = (worldPos.y - oldPos.y)/42
    buildQueue(xDifference, yDifference)
    console.log(movesQueue)
    
    
}) 


createGUI(outlinePass)
moveClock.start()
let tickCount = 0
const TICK_INTERVAL = 0.6;
let lastTickTime = 0;

const tick = () => {
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    camera.position.x = player.position.x + 300
    camera.position.y = player.position.y - 300
    controller.target = player.position
    controller.update()
   
    const elapsed = moveClock.getElapsedTime();
    const progress = Math.min((elapsed - lastTickTime) / TICK_INTERVAL, 1);
    setPosition(player, progress);
    
    while (elapsed - lastTickTime >= TICK_INTERVAL) {
        if (movesQueue.length > 0) {
            stepCompleted();
        }
        lastTickTime += TICK_INTERVAL;
        tickCount++;
    }

    effectComposer.render();
    requestAnimationFrame(tick);
};

requestAnimationFrame(tick);
