<script setup>
import {BCard, BCardText, BCardGroup} from "bootstrap-vue-next/components";
import {skillList} from "../data/skills.json"
import {ref} from "vue";

const list = ref(skillList);

</script>

<template>


  <BCardGroup>
    <BCard v-for="cat in list" :title="cat.category">
      <BCardText class="row" style="padding-top: 10%;">
        <div v-for="skill in cat.skills" class="skill col-auto">
          {{ skill }}
        </div>
      </BCardText>
    </BCard>
  </BCardGroup>

</template>