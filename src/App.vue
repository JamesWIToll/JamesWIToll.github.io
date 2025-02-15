<script setup>
import {BNavbar, BNavbarNav, BNavItem, BCollapse, BNavbarToggle, BNavbarBrand} from "bootstrap-vue-next/components";

const contactShow = () => {
  alert("contact info lol")
}

</script>

<template>
  <BNavbar fixed="top" toggleable="lg" variant="primary">
    <BNavbarBrand href="/"><h4 class="emphasis">James Wesley Tolliver </h4> <h5>Systems Programmer</h5></BNavbarBrand>
    <BNavbarToggle target="nav-collapse"/>
    <BCollapse id="nav-collapse" isNav="true" >
      <BNavbarNav class="ms-auto" style="font-size: large">
        <BNavItem href="/"> About Me </BNavItem>
        <BNavItem href="/skills"> Skills </BNavItem>
        <BNavItem href="/projects"> Software Projects </BNavItem>
        <BNavItem href="/experience"> Experience </BNavItem>
        <BNavItem href="/ThreeDArt">3D Art</BNavItem>
        <BNavItem @click="contactShow()"> Contact </BNavItem>
        <BNavItem href="">Resume</BNavItem>
      </BNavbarNav>
    </BCollapse>
  </BNavbar>


  <RouterView/>

</template>