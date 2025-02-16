<script setup>
import {BNavbar, BNavbarNav, BNavItem, BCollapse, BNavbarToggle, BNavbarBrand} from "bootstrap-vue-next/components";

const contactShow = () => {
  alert("contact info lol")
}

</script>

<style scoped>
.icon {
  max-width: 50px;
  max-height: 50px;
  margin-right: 10px;
  opacity: 0.9;
  filter: brightness(2) drop-shadow(1px 2px 2px lightblue);
}

.icon:hover {
  max-height: 75px;
  max-width: 75px;
  background-color: transparent !important;
  filter: brightness(3) drop-shadow(1px 2px 5px lightblue);
}

</style>

<template>
  <BNavbar fixed="top" toggleable="lg" variant="primary">

      <a href="/" style="background: transparent !important;"><img src="/icoicon.png" class="icon" alt="icon"/></a>
      <BNavbarBrand href="/">
        <h4 class="emphasis">James Wesley Tolliver </h4> <h5>Systems Programmer</h5>
      </BNavbarBrand>
      <BNavbarToggle target="nav-collapse" class="ms-auto" href="/"/>
      <BCollapse id="nav-collapse" isNav="true" >
        <BNavbarNav class="ms-auto" style="font-size: large">
          <BNavItem href="/"> About Me </BNavItem>
          <BNavItem href="/#skills"> Skills </BNavItem>
          <BNavItem href="/#projects"> Software Projects </BNavItem>
          <BNavItem href="/#experience"> Education </BNavItem>
          <BNavItem href="/#experience"> Experience </BNavItem>
          <BNavItem href="/#Art">Art</BNavItem>
          <BNavItem @click="contactShow()"> Contact </BNavItem>
          <BNavItem href="">Resume</BNavItem>
        </BNavbarNav>
      </BCollapse>

  </BNavbar>


  <RouterView/>

</template>