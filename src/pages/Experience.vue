<script setup>
import {BCard, BCardText, BCardTitle, BCardImg} from "bootstrap-vue-next/components";
import {jobList} from "../data/experience.json"
import {ref} from "vue";

const list = ref(jobList)

</script>

<style scoped>
.card {
  margin: auto;
  margin-bottom: 20px;
  max-width: 80% !important;
}
</style>

<template>


    <BCard v-for="job in list" >
      <div class="row">
        <div class="col-sm-4"  style="align-self: center; min-width: 250px !important;">
          <BCardImg :src="job.image" style="max-height: 300px !important; min-height: 200px !important; min-width: 200px !important;"></BCardImg>
        </div>
        <div class="col-sm-5" style="align-self: center;">
          <BCardTitle> {{ job.title}}</BCardTitle>
          <BCardText>
            {{ job.employer }} <br/>
            {{ job.timespan }} <br/> <br/>
            {{ job.description }} <br/>
          </BCardText>
        </div>
        <div class="col-sm-3">
          <div v-for="skill in job.skills" class="row">
              <div class="skill col-auto" > {{skill}}</div>
          </div>
        </div>

      </div>

    </BCard>


</template>

