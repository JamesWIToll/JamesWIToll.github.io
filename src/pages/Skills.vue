<script setup>
import {skillList} from "../data/skills.json"
import {ref} from "vue";

const list = ref(skillList);

</script>

<template>

  <div v-for="cat in list">
    {{ cat.category }}
    <div v-for="skill in cat.skills">
      {{ skill }}
    </div>
  </div>

</template>