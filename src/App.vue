<script setup>
import {BNavbar, BNavbarNav, BNavItem, BCollapse, BNavbarToggle, BNavbarBrand} from "bootstrap-vue-next/components";
</script>

<style scoped>
</style>

<template>
  <BNavbar toggleable="lg" variant="primary">
    <a href="/" style="background: transparent !important;"><img src="/icoicon.png" class="icon" alt="icon"/></a>
    <BNavbarBrand>
      <h4 class="emphasis">James Wesley Tolliver </h4> <h5>Systems Programmer</h5>
    </BNavbarBrand>
    <BNavbarToggle target="nav-collapse" class="ms-auto contrast" href="/"/>
    <BCollapse id="nav-collapse" isNav >
      <BNavbarNav class="ms-auto" style="font-size: large">
        <BNavItem href="/"> About Me </BNavItem>
        <BNavItem href="/#skills"> Skills </BNavItem>
        <BNavItem href="/#projects"> Projects </BNavItem>
        <BNavItem href="/#education"> Education </BNavItem>
        <BNavItem href="/#experience"> Experience </BNavItem>
        <BNavItem href="/#art">3D Viewer</BNavItem>
        <BNavItem href="/#contact"> Contact </BNavItem>
        <BNavItem href="/resume.pdf">Resume</BNavItem>
      </BNavbarNav>
    </BCollapse>
  </BNavbar>


  <div class="container-fluid" style="margin-top: 2%;">
    <RouterView/>
  </div>






</template>