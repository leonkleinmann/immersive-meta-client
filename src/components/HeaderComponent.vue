<template>
  <div class="header">
    <div class="wrapper">
      <div v-if="!isPlaying" class="logo">
          <IsometricWrapper>
            <img alt="logo" src="https://via.placeholder.com/100" />
          </IsometricWrapper>
      </div>
      <div v-if="!isPlaying" class="links">
        <IsometricWrapper :border="true" :clickable="true">
          <div class="link">
              <router-link to="/tutorial">Tutorial</router-link>
          </div>
        </IsometricWrapper>
        <IsometricWrapper :border="true" :clickable="true">
        <div class="link">
          <router-link to="/about">About</router-link>
        </div>
        </IsometricWrapper>
      </div>
    </div>
  </div>
</template>

<script>
import IsometricWrapper from "@/components/IsometricWrapper";
import {mapGetters} from "vuex";
export default {
  name: "HeaderComponent",
  components: {
    IsometricWrapper
  },
  computed: {
    ...mapGetters(['isPlaying'])
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 150px;
  z-index: 2;

  .wrapper {
    height: 100%;
    position: relative;

    .logo {
      width: 100px;
      height: 100px;
      position: absolute;
      left: 50%;
      top:50%;
      transform: translate(-50%, -50%);
    }

    .links {
      display: flex;
      flex-direction: row;
      gap: 20px;
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);

      .link {
        width: 120px;
        height: 40px;
        padding: 5px;
        text-align: center;
        background-color: white;

        a {
          font-size: 32px;
          text-decoration: none;
          color: black;
        }
      }
    }
  }
}
</style>