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
const focused = ref(false);
let gl = null;

const focus = (obj) => {
  focused.value = !focused.value;
  if (focused.value) {
    obj.target.requestPointerLock();
    document.body.classList.add("overflow-y-hidden")
  } else {
    document.exitPointerLock();
    document.body.classList.remove("overflow-y-hidden")
  }
}

const move_amt = 0.1;
const mouse_sensitivity = 0.1;

window.addEventListener("pointerlockchange", (e) => {
  if(document.pointerLockElement == null){
    document.body.classList.remove("overflow-y-hidden");
    focused.value = false;
  }
});

window.addEventListener("keydown", (e) => {
  if (document.pointerLockElement !== null) {
    if (e.key === "D" || e.key === "d") {
      renderer.value.camera.move("left", move_amt);
    }
    if (e.key === "A" || e.key === "a") {
      renderer.value.camera.move("right", move_amt);
    }
    if (e.key === "W" || e.key === "w") {
      renderer.value.camera.move("forward", move_amt);
    }
    if (e.key === "S" || e.key === "s") {
      renderer.value.camera.move("backward", move_amt);
    }

    if (e.key === "E" || e.key === "e") {
      renderer.value.camera.move("up", move_amt);
    }
    if (e.key === "Q" || e.key === "q") {
      renderer.value.camera.move("down", move_amt);
    }
  }
});

window.addEventListener("mousemove", (e) => {
  if(document.pointerLockElement !== null) {
    renderer.value.camera.look("horizontal", mouse_sensitivity*e.movementX);
    renderer.value.camera.look("vertical", -mouse_sensitivity*e.movementY);
  }
});

window.addEventListener("wheel", (e) => {
  if (document.pointerLockElement !== null) {
    renderer.value.camera.zoom(e.deltaY*mouse_sensitivity);
  }
})

onMounted(async () => {
  gl = canvas.value.getContext('webgl2');
  if(!gl) {
    alert("WebGL2 not supported!");
    return;
  }

  let vertSrc = document.getElementById("vertexShader").innerText;
  let fragSrc = document.getElementById("fragmentShader").innerText;

  let vStartPos = vertSrc.indexOf("#version");
  vertSrc = vertSrc.substring(vStartPos, vertSrc.length);

  let fStartPos = fragSrc.indexOf("#version");
  fragSrc = fragSrc.substring(fStartPos, fragSrc.length);

  let prog = new Shader(gl, vertSrc, fragSrc);
  renderer.value = new Renderer(gl);
  renderer.value.setShaderProgram(prog);


  scene.value = (await importer.importGLTF2("fiat", gl));
  scene.value._transform.position = vec3.fromValues(0,0,50);

  renderer.value.setCurrentScene(scene.value);
  requestAnimationFrame(renderer.value.render);

});
</script>

<style scoped>

canvas {
  min-height: 300px;
  border-radius: 10px;
  margin: 10px;
}

</style>

<template style="align-content: center;">

  <canvas ref="canvas" @click="focus"></canvas>

</template>
