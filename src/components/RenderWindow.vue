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

const axisToRotate = ref(null);
const rotationDegrees = ref(5);

let gl = null;

const update = () => {
  if (axisToRotate.value && rotationDegrees.value) {
    let axis = axisToRotate.value;
    let deg = rotationDegrees.value;
    if (axis.includes('-')){
      axis = axis.substring(1);
      deg = -deg;
    }

    scene.value.addRotation(axis, deg);
  }

  renderer.value.render();

  requestAnimationFrame(update);
}


window.onresize = () => {
  let bb = document.querySelector ('#canvasBox').getBoundingClientRect();
  gl.canvas.width = bb.width;
  gl.canvas.height = bb.height;
}


onMounted(async () => {
  gl = canvas.value.getContext('webgl2');
  if(!gl) {
    alert("WebGL2 not supported!");
    return;
  }


  let bb = document.querySelector ('#canvasBox').getBoundingClientRect();
  gl.canvas.width = bb.width;
  gl.canvas.height = bb.height;

  let vertSrc = document.getElementById("vertexShader").innerText;
  let fragSrc = document.getElementById("fragmentShader").innerText;

  let vStartPos = vertSrc.indexOf("#version");
  vertSrc = vertSrc.substring(vStartPos, vertSrc.length);

  let fStartPos = fragSrc.indexOf("#version");
  fragSrc = fragSrc.substring(fStartPos, fragSrc.length);

  let prog = new Shader(gl, vertSrc, fragSrc);
  renderer.value = new Renderer(gl);
  renderer.value.setShaderProgram(prog);

  scene.value = (await importer.importGLTF2(props.model, gl));
  scene.value._transform.position = vec3.fromValues(0,-2,20);

  renderer.value.setCurrentScene(scene.value);
  requestAnimationFrame(update);

});
</script>

<style scoped>

.canvasContainer {
  border-radius: 50px;
  width: 80%;
  min-height: 500px;
  background-color: var(--accent-primary);
  padding: 50px;
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
    <div class="col-md-8" id="canvasBox">
      <canvas ref="canvas"></canvas>
    </div>
    <div class="col-md-4">
      <div class="row" @mouseup="axisToRotate=null" @touchend="axisToRotate=null">
        <img src="/arrowUp.png" class="contrast col-md-3" @mousedown="axisToRotate = 'X';" @touchstart="axisToRotate = 'X';" />
        <img src="/arrowDown.png" class="contrast col-md-3" @mousedown="axisToRotate = '-X';" @touchstart="axisToRotate = '-X';" />
        <img src="/arrowLeft.png" class="contrast col-md-3" @mousedown="axisToRotate = '-Y';" @touchstart="axisToRotate = '-Y';" />
        <img src="/arrowRight.png" class="contrast col-md-3" @mousedown="axisToRotate = 'Y';" @touchstart="axisToRotate = 'Y';" />
      </div>
      <div class="row" style="margin-top: 50px;">
        <img src="/ZoomPlus.png" class="contrast col-md-4" @click="renderer.camera.zoom(-5)"/>
        <img src="/ZoomMinus.png" class="contrast col-md-4" @click="renderer.camera.zoom(5)"/>
      </div>
    </div>
  </div>

</template>
