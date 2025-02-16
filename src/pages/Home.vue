<script setup>
</script>

<style scoped>

img {
  border-radius: 50%;
  max-width: 80%;
  filter: drop-shadow(4px 4px 5px var(--accent-secondary));
  opacity: 0.8;
}
img:hover {
  max-width: 90%;
  box-shadow: 6px 5px var(--accent-secondary);
  opacity: 1;
}

</style>

<template>
  <div class="card" style="min-width: 80% !important; margin: auto; padding: 20px !important; opacity: 1 !important;">
    <div class="row" >
      <div class="col-md-5" style="text-align: center;">
        <h3 class="emphasis">Hi, I'm Wesley</h3> <br/><br/>
        <img src="../assets/me.jpeg" alt="picture of me">
      </div>
      <div class="col-md-7" style="align-self: center;">

        <h4 class="emphasis">
          Developing software is one of my biggest passions in life. I'm devoted to
          constantly developing my ability to learn computer systems and
          architectures to create meaningful, solid, efficient software. Whether it be
          web development, game programming, or building low level software to
          interface with components more directly, I am dedicated to mastering
          anything required.
        </h4>
      </div>
    </div>

  </div>
</template>