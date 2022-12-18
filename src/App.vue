<template>
  <div id="app">
    <HeaderComponent />
    <ModalComponent title="Modal-Test"/>
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterComponent";
import ModalComponent from "@/components/ModalComponent";

export default {
  name: 'App',
  components: {
    ModalComponent,
    HeaderComponent,
    FooterComponent,
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=VT323');

html, body{
  font-family: 'VT323',serif;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden;
}

#app {
  position: relative;
  width: 100vw;
  height: 100vh;

  //background-color: #4158D0;
  //background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
}
</style>
