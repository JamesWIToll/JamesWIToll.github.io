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
const ambientIntensity = ref(0.05);

const useSobel = ref(false);
const sobelThreshold = ref(0.5);
const lineColor = ref("#000000");


let lastX = 0;
let lastY = 0;
let sceneRotate = vec3.create();
const axisToMove = ref("");
const moveAmt = 0.5;

const getColorFromHexStr = (hex) => {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return vec3.fromValues(r / 255, g / 255, b / 255);
}

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
  let vStartPos = vertSrc.indexOf("#version");
  vertSrc = vertSrc.substring(vStartPos, vertSrc.length);

  let fragSrc = document.getElementById("fragmentShader").text;
  let fStartPos = fragSrc.indexOf("#version");
  fragSrc = fragSrc.substring(fStartPos, fragSrc.length);

  let postProcessVertSrc = document.getElementById("vert-postprocess").text;
  let vppStartPos = postProcessVertSrc.indexOf("#version");
  postProcessVertSrc = postProcessVertSrc.substring(vppStartPos, postProcessVertSrc.length);

  let postProcessFragmentSrc = document.getElementById("fragment-finalPostProcess").text;
  let fppStartPos = postProcessFragmentSrc.indexOf("#version");
  postProcessFragmentSrc = postProcessFragmentSrc.substring(fppStartPos, postProcessFragmentSrc.length);

  let sobelFragmentSrc = document.getElementById("frag-sobel").text;
  let fSobelStartPos = sobelFragmentSrc.indexOf("#version");
  sobelFragmentSrc = sobelFragmentSrc.substring(fSobelStartPos, sobelFragmentSrc.length);

  let blurFragmentSrc = document.getElementById("frag-blur").text;
  let fBlurStartPos = blurFragmentSrc.indexOf("#version");
  blurFragmentSrc = blurFragmentSrc.substring(fBlurStartPos, blurFragmentSrc.length);


  renderer.value = new Renderer(gl);
  renderer.value.shaderProg =  new Shader(gl, vertSrc, fragSrc);
  renderer.value.postProcessProg = new Shader(gl, postProcessVertSrc, postProcessFragmentSrc);
  renderer.value.sobelProg = new Shader(gl, postProcessVertSrc, sobelFragmentSrc);
  renderer.value.blurProg = new Shader(gl, postProcessVertSrc, blurFragmentSrc);

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
  renderer.value.ambientIntensity = ambientIntensity.value;

  renderer.value.useSobel = useSobel.value;
  renderer.value.sobelThreshold = sobelThreshold.value;

  if (lineColor.value){
    renderer.value.linesColor = getColorFromHexStr(lineColor.value);
  }

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
          <label>Ambient Intensity:<input type="number" v-model="ambientIntensity" step="0.01" max="0.8" min="0.01" style="max-width: 100px;"/></label>
        </span>
      </div>
      <br/>
      <div class="row">
        <span class="col-md-6">
          <label><input type="checkbox" v-model="useQuantization">Cell Shading</label>
        </span>
        <span class="col-md-6">
          <label v-show="useQuantization" >Cells:<input type="number" v-model="colorQuantity" step="1" max="10" min="1" style="max-width: 50px;"/></label>
        </span>
      </div>
      <br/>
      <div class="row">
        <span class="col-md-6">
          <label><input type="checkbox" v-model="useHatching" />Hatching</label>
        </span>
        <span class="col-md-6">
          <label v-show="useHatching">Size:<input type="number"  v-model="hatchingSize" step="1" min="2" max="10" style="max-width: 50px;"/></label>
        </span>
      </div>
      <br/>
      <div class="row">
        <span class="col-md-6">
          <label><input type="checkbox" v-model="useSobel">Outlines</label>
        </span>
        <span class="col-md-6">
          <label v-show="useSobel" >Threshold:<input type="number" v-model="sobelThreshold" step="0.1" min="0.1" max="0.9" style="max-width: 50px;"/></label>
        </span>
      </div>
      <br/>
      <div class="row">
        <span class="col-md-6">
          <label v-show="useSobel || useHatching">Line Color: <input type="color" v-model="lineColor" style="max-width: 50px;"/></label>
        </span>
      </div>

    </div>
  </div>

</template>
