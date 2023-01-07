<template>
  <div id="app">
    <template v-if="!isMobile">
      <template v-if="!isPlaying">
        <HeaderComponent />
      </template>

      <template v-if="setupCompleted">
        <GameComponent />
      </template>

      <template v-if="!setupCompleted">
        <SetupComponent />
      </template>

      <template v-if="!isPlaying">
        <FooterComponent />
      </template>

      <LoadingComponent />
    </template>
    <template v-if="isMobile">
      <div class="mobile-support">
        Sorry, mobile devices are not supported yet!
      </div>
    </template>
  </div>
</template>

<script>
import Bowser from 'bowser';
import {mapGetters} from "vuex";

import HeaderComponent from "@/components/HeaderComponent";
import GameComponent from "@/components/game/GameComponent";
import FooterComponent from "@/components/FooterComponent";
import LoadingComponent from "@/components/LoadingComponent";
import SetupComponent from "@/components/views/SetupComponent";

export default {
  name: 'App',
  components: {
    SetupComponent,
    HeaderComponent,
    GameComponent,
    FooterComponent,
    LoadingComponent,
  },
  computed: {
    ...mapGetters(['isMobile', 'setupCompleted', 'isPlaying'])
  },
  mounted() {
    // check if mobile
    let isMobile = Bowser.getParser(window.navigator.userAgent)
    if (isMobile.parsedResult.platform.type !== 'desktop') {
      this.$store.commit('setIsMobile', true)
    }
    this.$store.commit('setSetupCompleted', false)
  },
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
}

.mobile-support {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
