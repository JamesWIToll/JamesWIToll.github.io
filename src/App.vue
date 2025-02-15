<script setup>
import {BNavbar, BNavbarNav, BNavItem, BCollapse, BNavbarToggle, BNavbarBrand} from "bootstrap-vue-next/components";

const contactShow = () => {
  alert("contact info lol")
}

</script>

<template>
  <BNavbar fixed="top" toggleable="lg" variant="primary">
    <BNavbarBrand class="emphasis"><h4>James Wesley Tolliver</h4></BNavbarBrand>
    <BNavbarToggle target="nav-collapse"/>
    <BCollapse id="nav-collapse" isNav="true" >
      <BNavbarNav class="ms-auto" style="font-size: large">
        <BNavItem href="/"> About Me </BNavItem>
        <BNavItem @click="contactShow()"> Contact </BNavItem>
        <BNavItem href="/projects"> Software Projects </BNavItem>
        <BNavItem href="/ThreeDArt">3D Art</BNavItem>
        <BNavItem href="">Resume</BNavItem>
      </BNavbarNav>
    </BCollapse>
  </BNavbar>


  <RouterView/>

</template>