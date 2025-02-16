<script setup>
import {BCard, BCardText, BCardTitle, BCardImg} from "bootstrap-vue-next/components";
import {projectList} from "../data/projects.json"
import {ref} from "vue";

const list = ref(projectList);
</script>

<style scoped>
.card {
  margin: auto;
  margin-bottom: 20px;
  max-width: 80% !important;
}
</style>

<template>

  <BCard v-for="proj in list" class="card" >
    <div class="row">
      <div class="col-sm-4"  style="align-self: center; min-width: 250px !important;">
        <BCardImg :src="proj.image" style="max-height: 400px !important; min-height: 200px !important; min-width: 200px !important;"></BCardImg>
      </div>
      <div class="col-sm-5" style="align-self: center;">
        <BCardTitle> {{ proj.title}}</BCardTitle>
        <BCardText>
          {{ proj.group }} <br/>
          {{ proj.timespan }} <br/>
          <a :href="proj.link">{{ proj.link }}</a> <br/> <br/>
          {{ proj.description }} <br/>
        </BCardText>
      </div>
      <div class="col-sm-3">
        <div v-for="skill in proj.skills" class="row">
          <div class="skill col-auto" > {{skill}}</div>
        </div>
      </div>

    </div>
  </BCard>

</template>

