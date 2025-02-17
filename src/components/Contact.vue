<script setup>

import {contactList} from "../data/contact.json";
import {ref} from "vue";
const list = ref(contactList);
</script>


<template>

<div class="card ms-auto me-auto" style="min-height: 300px !important; padding: 20px;">
  <h3 class="emphasis"> Contact Me...</h3>
  <div class="row justify-content-center" style="padding-top: 3rem;">
    <div v-for="contact in list" class="col-md-4" style="text-align: center;">
      <a :href="contact.link" style="background-color: transparent !important;" >
        <img :src="contact.icon" class="icon contrast" alt="icon" style="max-width: 60px !important; min-width: 60px !important;">
        {{ contact.display}}
      </a>
    </div>
  </div>
</div>

</template>