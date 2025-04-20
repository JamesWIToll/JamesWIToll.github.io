<script setup>
import {onMounted, ref} from "vue";
import {Shader} from "@/models/Shader.js";
import {Renderer} from "@/models/Renderer.js";
import importer from "@/models/Importer.js";
import {vec3} from "gl-matrix";

const props = defineProps({model: String});

const canvas = ref(null);
const renderer = ref(null);
const scene = ref(null);
const loaded = ref(false);
const currModel = ref(null);
let gl = null;

const useQuantization = ref(false);
const colorQuantity = ref(5);
const useHatching = ref(false);
const hatchingSize = ref(4);


let lastX = 0;
let lastY = 0;
let sceneRotate = vec3.create();
const axisToMove = ref("");
const moveAmt = 0.5;


const loadScene = async () => {
  loaded.value = false;
  gl = canvas.value.getContext('webgl2');
  if(!gl) {
    alert("WebGL2 not supported!");
    return;
  }


  let bb = document.querySelector ('#canvasBox').getBoundingClientRect();
  gl.canvas.width = bb.width;
  gl.canvas.height = bb.height;

  let vertSrc = document.getElementById("vertexShader").text;
  let fragSrc = document.getElementById("fragmentShader").text;

  let vStartPos = vertSrc.indexOf("#version");
  vertSrc = vertSrc.substring(vStartPos, vertSrc.length);

  let fStartPos = fragSrc.indexOf("#version");
  fragSrc = fragSrc.substring(fStartPos, fragSrc.length);

  let prog = new Shader(gl, vertSrc, fragSrc);
  renderer.value = new Renderer(gl);
  renderer.value.setShaderProgram(prog);

  scene.value = (await importer.importGLTF2(currModel.value, gl));
  scene.value._transform.position = vec3.fromValues(0,-2,20);


  renderer.value.setCurrentScene(scene.value);
  await renderer.value.loadResources();

  loaded.value = true;
}

const update = async () => {
  if (currModel.value !== props.model) {
    currModel.value = props.model;
    await loadScene();
  }

  renderer.value.useColorQuantization = useQuantization.value;
  renderer.value.colorQuantity = colorQuantity.value;
  renderer.value.useHatching = useHatching.value;
  renderer.value.hatchingSize = hatchingSize.value;

  switch (axisToMove.value.toLowerCase()) {
    case "x":
      scene.value.move(moveAmt, 0, 0);
      break;
    case "y":
      scene.value.move(0, moveAmt, 0);
      break;
    case "-x":
      scene.value.move(-moveAmt, 0, 0);
      break;
    case "-y":
      scene.value.move(0, -moveAmt, 0);
      break;
  }

  scene.value.addRotation(sceneRotate[0], sceneRotate[1], sceneRotate[2]);

  await renderer.value.render();

  requestAnimationFrame(update);
}


const captured = ref(false);

const capture = async (event) => {
  if (event.type === "touchstart") {
    lastX = event.targetTouches[0].clientX;
    lastY = event.targetTouches[0].clientY;
  }else {
    lastX = event.clientX;
    lastY = event.clientY;
  }
  captured.value = true;
}

const release = async () => {
  captured.value = false;
}
const rotateScene = async (event) => {
  event.preventDefault();

  if (captured.value){
    let currX;
    let currY;
    if (event.type === "touchmove"){
      currX = event.targetTouches[0].clientX;
      currY = event.targetTouches[0].clientY;
    } else {
      currX = event.clientX;
      currY = event.clientY;
    }

    let deltaX = currX - lastX;
    let deltaY = currY - lastY;

    vec3.add(sceneRotate, sceneRotate, vec3.fromValues(-deltaY*45, deltaX*45, 0));

    lastX = currX;
    lastY = currY;
  }
}


window.onresize = () => {
  let bb = document.querySelector ('#canvasBox').getBoundingClientRect();
  gl.canvas.width = bb.width;
  gl.canvas.height = bb.height;
}

onMounted(async () => {
  requestAnimationFrame(update);

});
</script>

<style scoped>

.canvasContainer {
  border-radius: 50px;
  width: 80%;
  min-height: 500px;
  background-color: var(--accent-primary);
  padding: 2%;
  margin: 2%;
}

canvas {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

img {
  width : 70px;
}

</style>

<template>

  <div class="row mx-auto canvasContainer">
    <h3 v-if="!loaded">Loading...</h3>
    <div class="col-md-8" id="canvasBox">
      <canvas ref="canvas" @mousedown="capture"
                            @touchstart="capture"
                            @touchend="release"
                            @mouseup="release"
                            @mousemove="rotateScene"
                            @touchmove="rotateScene">
      </canvas>
    </div>
    <div class="col-md-4">
      <div class="row" @mouseup="axisToMove=''" @touchend="axisToMove=''">
        <img src="/arrowUp.png" class="contrast col-md-3" @mousedown="axisToMove = 'Y';" @touchstart="axisToMove = 'Y';"  alt="arrow-up"/>
        <img src="/arrowDown.png" class="contrast col-md-3" @mousedown="axisToMove = '-Y';" @touchstart="axisToMove = '-Y';" alt="arrow-down"/>
        <img src="/arrowLeft.png" class="contrast col-md-3" @mousedown="axisToMove = 'X';" @touchstart="axisToMove = 'X';" alt="arrow-left"/>
        <img src="/arrowRight.png" class="contrast col-md-3" @mousedown="axisToMove = '-X';" @touchstart="axisToMove = '-X';" alt="arrow-right"/>
      </div>
      <div class="row" style="margin-top: 50px;">
        <img src="/ZoomPlus.png" class="contrast col-md-4" @click="renderer.camera.zoom(-5)" alt="zoom-plus"/>
        <img src="/ZoomMinus.png" class="contrast col-md-4" @click="renderer.camera.zoom(5)" alt="zoom-minus"/>
      </div>

      <br/><br/>
      <div class="row">
        <span class="col-md-6">
          <label><input type="checkbox" v-model="useQuantization">Cell Shading</label>
        </span>
        <span class="col-md-6">
          <label v-show="useQuantization" ><input type="number" v-model="colorQuantity" style="max-width: 50px;">Cells</label>
        </span>
      </div>
      <br/><br/>
      <div class="row">
        <span class="col-md-6">
          <label><input type="checkbox" v-model="useHatching" />Hatching</label>
        </span>
        <span class="col-md-6">
          <label v-show="useHatching"><input type="number"  v-model="hatchingSize" style="max-width: 50px;">Size</label>
        </span>
      </div>
    </div>
  </div>

</template>
