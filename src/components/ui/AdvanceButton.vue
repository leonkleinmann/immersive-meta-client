<template>
  <div
    class="advance"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    @click="$emit('advance')"
  >
    <img
      v-if="hovered === false"
      alt="checkmark"
      src="/assets/setup/checkmark_black.svg"
    />
    <img
      v-if="hovered"
      alt="checkmark"
      src="/assets/setup/checkmark_white.svg"
    />
  </div>
</template>

<script>
export default {
  name: "AdvanceButton",
  data() {
    return {
      hovered: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.advance {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  border: 2px solid black;
  border-radius: 100%;

  &:hover {
    background: black;
  }

  img {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
