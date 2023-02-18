<template>
  <div class="introduction">
    <h1>Before we go..</h1>
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

    <h2>1. Use Headphones</h2>
    <h2>2. Dimm the light</h2>
    <h2>3. Be ready for immersion</h2>

    <AdvanceButton class="advance" @advance="advance" />
  </div>
</template>

<script>
import AdvanceButton from "@/components/ui/AdvanceButton";
export default {
  name: "IntroductionComponent",
  components: { AdvanceButton },
  methods: {
    advance() {
      this.$emit("advance");
    },
  },
};
</script>

<style lang="scss" scoped>
.introduction {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-left: 20%;
  padding-right: 20%;
}
</style>
