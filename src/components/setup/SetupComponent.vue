<template>
  <div class="setup">
    <div class="slider">
      <div class="level avatar" :class="{ active: 0 === activeIndex }">
        <AvatarComponent @advance="next()" />
      </div>
      <div class="level multimedia" :class="{ active: 1 === activeIndex }">
        <MultimediaComponent @advance="next()" />
      </div>
      <div class="level completion" :class="{ active: 2 === activeIndex }">
        <CompletionComponent />
      </div>
    </div>
    <div class="controls">
      <!--<button @click="prev">PREV</button>-->

      <div class="dot avatar" :class="{ active: 0 === activeIndex }"></div>
      <div class="dot multimedia" :class="{ active: 1 === activeIndex }"></div>
      <div class="dot completion" :class="{ active: 2 === activeIndex }"></div>

      <!--<button @click="next">NEXT</button>-->
    </div>

    <button v-if="devMode" class="skip" @click="skipSetup">Skip Setup</button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MultimediaComponent from "@/components/setup/levels/MultimediaComponent";
import AvatarComponent from "@/components/setup/levels/AvatarComponent";
import CompletionComponent from "@/components/setup/levels/CompletionComponent";

export default {
  name: "SetupComponent",
  components: { CompletionComponent, AvatarComponent, MultimediaComponent },
  data() {
    return {
      activeIndex: 0,
    };
  },
  computed: {
    ...mapGetters(["devMode"]),
  },
  mounted() {
    if (this.devMode) {
      this.skipSetup();
    }
  },
  methods: {
    skipSetup() {
      this.$store.commit("setIsPlaying", true);
    },
    prev() {
      if (this.activeIndex - 1 < 0) {
        this.activeIndex = 3;
      } else {
        this.activeIndex--;
      }
    },
    next() {
      if (this.activeIndex + 1 > 3) {
        this.activeIndex = 0;
      } else {
        this.activeIndex++;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.setup {
  position: relative;
  width: 100vw;
  height: 100vh;

  .slider {
    display: flex;
    overflow: hidden;
    width: 100%;
    height: 90%;

    .level {
      flex: 1;
      width: 100%;
      height: 100%;
      display: none;

      &.active {
        display: flex;
      }
    }
  }

  .controls {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    height: 10%;

    .dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: lightgray;

      &.active {
        background: black;
      }
    }

    .prev {
      width: 120px;
      height: 40px;
    }

    .next {
      width: 120px;
      height: 40px;
    }
  }
}

.skip {
  position: absolute;
  width: 120px;
  height: 40px;
  top: 10px;
  right: 10px;
  z-index: 10002;
}
</style>
