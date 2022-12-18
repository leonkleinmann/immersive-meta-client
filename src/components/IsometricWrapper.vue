<template>
  <div :class="[border ? 'border' : '', clickable ? 'clickable' : '']" ref="iso-wrapper" class="iso-wrapper">
    <slot>
      Slot content goes here
    </slot>
  </div>
</template>

<script>
export default {
  name: "IsometricWrapper",
  props: {
    border: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.iso-wrapper {
  width: 100%;
  height: 100%;
  box-shadow: 10px 10px 2px 1px grey;

  &.border {
    padding: 10px;
    border: 1px solid black;
  }
  &.clickable {
    &:active {
      transform: translate(10px, 10px);
      box-shadow: none;
    }
    &:hover {
      a {
        text-decoration: black;
      }
    }
  }
}
</style>