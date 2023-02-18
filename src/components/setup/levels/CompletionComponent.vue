<template>
  <div class="completion">
    <h1>You are ready!</h1>
    <p>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
      clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
      amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
      nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
      diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
      sit amet.
    </p>

    <div class="info">
      <div class="item">
        <div class="img">
          <img alt="avatar" src="/assets/setup/action.png" />
        </div>
        <div class="description">
          <h2>Interact with Objects!</h2>
        </div>
      </div>
    </div>

    <h2>1. Use arrow keys for movement</h2>
    <h2>2. use X to interact with objects</h2>
    <h2>3. use symbols to mute/unmute</h2>

    <AdvanceButton class="advance" @advance="advance" />
  </div>
</template>

<script>
import AdvanceButton from "@/components/ui/AdvanceButton";
export default {
  name: "CompletionComponent",
  components: { AdvanceButton },
  methods: {
    advance() {
      this.$store.commit("setIsPlaying", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.completion {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-left: 20%;
  padding-right: 20%;

  .info {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .item {
      display: flex;
      flex-direction: row;
      align-items: center;

      img {
        width: 50px;
        height: 50px;
      }
    }
  }
}
</style>
