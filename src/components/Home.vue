<script setup>
import Contact from "@/components/Contact.vue";
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
  <div class="card" style="min-width: 90% !important; margin: auto; padding: 20px !important; opacity: 1 !important;">
    <div class="row" >
      <div class="col-md-5" style="text-align: center;">
        <h3 class="emphasis">Hi, I'm Wesley</h3> <br/><br/>
        <img src="/me.jpeg" alt="picture of me">
      </div>
      <div class="col-md-7" style="align-self: center;">

        <h4 class="emphasis">
          Ever since my middle school Lego Robotics club (and winning our first competition!),
          I've been fascinated with computers and programming. Initially a dual major in Environmental Science and
          Computer Science, I kept prioritizing my CS classes over and over again for one simple reason - I couldn't
          stop feeling drawn to them. I'm passionate about learning as much as I can about as many aspects of computing
          as I can. Throughout college, I soaked up information on every topic possible and earned recognition from my
          professors and peers. Since graduating, I have been working at RTI International, a government contractor that
          takes on a variety of research projects for the betterment of humanity. In this position I have learned a great
          deal about full stack web development and database management.<br/><br/>

          In addition to programming, I am also passionate about creating art in every form. The ability to create things
          and give them meaning and purpose has driven me in everything I do. At the intersection of all my interests sits
          game development and graphics programming - both of which I am consistently inspired to learn.
        </h4>

        <Contact/>
      </div>
    </div>

  </div>

</template>