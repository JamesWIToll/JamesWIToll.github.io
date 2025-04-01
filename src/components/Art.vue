<script setup>
import RenderWindow from "@/components/RenderWindow.vue";
</script>

<style scoped>
</style>

<template>

  <h3 class="emphasis" style="text-align: center;">This page is under construction...</h3><br/>
  <h4 style="text-align: center; max-width: 70%" class="mx-auto">
    A gallery of 3D and 2D art displayed using a custom renderer written using WebGL 2.0.
    3D models are loaded from GLTF2 (not GLB yet) files using a from-scratch importer.
    <br/><br/>In progress features: Lighting, 2D image importer, GLB importer,
    Post Processing Options, Customizable Shader Params, More Models/Art for the gallery

  </h4>

  <render-window model="geomountains"></render-window>
</template>
