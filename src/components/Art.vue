<script setup>
import RenderWindow from "@/components/RenderWindow.vue";
import { ref } from "vue";
import { BFormSelect } from "bootstrap-vue-next";

const renderWindow = ref(null);

const currModel = ref("fiat")
const modelList = ref([
    "fiat",
    "geomountains"
])

</script>

<style scoped>
</style>

<template>

  <h4 style="text-align: center; max-width: 70%" class="mx-auto">
    A gallery of 3D models/art displayed using a custom renderer written using WebGL 2.0.
    3D models are loaded from GLTF2 (not GLB yet) files using a from-scratch importer.
    <br/><br/>In progress features: GLB importer and More Models/Art for the gallery

  </h4>

  <div class="form-group mx-auto" style="max-width: 60%">
    <BFormSelect v-model="currModel" :options="modelList"/>
  </div>
  <render-window :model="currModel" ref="renderWindow"></render-window>
</template>
