<template>
  <div class="sound">
    <div class="controls">
      <img @click="pause()" v-if="playing" src="/assets/ui/pause.png" alt="pause" />
      <img @click="play()" v-if="!playing" src="/assets/ui/play.png" alt="play" />
    </div>
    <audio :src="audioSource" muted autoplay></audio>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SoundComponent",
  data() {
    return {
      player: undefined,
      playing: true,
    };
  },
  mounted() {
    this.player = document.querySelectorAll(".sound audio")[0];
    this.player.muted = false;
    this.player.volume = 1;
    this.player.play();
  },
  computed: {
    ...mapGetters(["audioSource"]),
  },
  watch: {
    "$store.state.playMusic"(play) {
      if (play) {
        this.player.play();
        this.playing = true;
      } else {
        this.player.pause();
        this.playing = false;
      }
    },
  },
  methods: {
    pause() {
      this.player.pause();
      this.playing = false
    },
    play() {
      this.player.play();
      this.playing = true
    },
  },
};
</script>

<style lang="scss" scoped>
.sound {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin-right: 20px;
  margin-bottom: 20px;
  z-index: 999;

  .controls {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 50px;
    height: 50px;
    border-radius: 100%;
    background: white;

    img {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
