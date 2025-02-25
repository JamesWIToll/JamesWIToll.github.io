<script setup>
import RenderWindow from "@/components/RenderWindow.vue";
</script>

<style scoped>
</style>

<template>

  <h3 class="emphasis" style="text-align: center;">This page is under construction...</h3><br/>
  <h4 style="text-align: center; max-width: 70%" class="mx-auto">I'm working on an interactive 3D viewer for the 3D models/scenes I create in blender along with a gallery of 2D art/renders. Eventually I would like to add some inputs to customize the shaders for the 3D viewer<br/><br/>
                                                                 In the meantime... Enjoy this triangle! (Click on the image for WASD + mouse look controls)</h4>


  <div class="card-group">
    <div class="card">
      <render-window model="fiat"></render-window>
    </div>
  </div>
</template>
