<script setup>
import {skillList} from "../data/skills.json"

</script>

<template>

  <div v-for="cat in skillList">
    {{ cat.category }}
    <div v-for="skill in cat.skills">
      {{ skill }}
    </div>
  </div>

</template>