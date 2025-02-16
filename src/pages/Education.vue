<script setup>
import {BCard, BCardText, BCardTitle, BCardImg} from "bootstrap-vue-next/components";
import {schoolList} from "../data/education.json"
import {ref} from "vue";

const list = ref(schoolList)

</script>

<style scoped>
.card {
  margin: auto;
  margin-bottom: 20px;
  max-width: 80% !important;
}
</style>

<template>

  <BCard v-for="edu in list" >
    <div class="row">
      <div class="col-sm-4"  style="align-self: center; min-width: 250px !important;">
        <BCardImg :src="edu.image" style="max-height: 300px !important; min-height: 200px !important; min-width: 200px !important;"></BCardImg>
      </div>
      <div class="col-sm-5" style="align-self: center;">
        <BCardTitle> {{ edu.degree}}</BCardTitle>
        <BCardText>
          {{ edu.institution }} <br/>
          Graduated: {{ edu.graduation }} <br/>
          GPA: {{ edu.gpa }} <br/>
        </BCardText>
      </div>
      <div class="col-sm-3">
        <div v-if="edu.recognition"><br/>
          <h5>Recognition:</h5>
          <div v-for="award in edu.recognition" class="row">
            <div class="skill col-auto" > {{award}}</div>
          </div>
        </div>
      </div>

    </div>

  </BCard>

</template>

