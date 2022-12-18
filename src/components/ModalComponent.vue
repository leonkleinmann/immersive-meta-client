<template>
  <div class="modal">
    <div class="wrapper">
      <div class="title">
       {{ title }}
      </div>
      <div class="content">
        <slot>
          Lorem Ipsum
        </slot>
      </div>
      <div class="close">
        <IsometricWrapper :clickable="true" :border="true">
          lorem
        </IsometricWrapper>
      </div>
    </div>
  </div>
</template>

<script>
import IsometricWrapper from "@/components/IsometricWrapper";

export default {
  name: "ModalComponent",
  components: { IsometricWrapper },
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: lightgray;
  opacity: 0.5;
  z-index: 100;

  .wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    width: 80vw;
    height: 80vh;
    background: white;
    z-index: 1000;
    opacity: 1;

    .title {
      font-size: 32px;
    }

    .content {

    }

    .close {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>