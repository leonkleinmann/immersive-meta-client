<template>
  <div v-if="modalOpen" class="modal">
    <div class="background" />
    <div class="wrapper">
      <div class="title">{{ title }}</div>
      <div class="content"><slot>Lorem Ipsum</slot></div>
      <div class="close" @click="closeModal()"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ModalComponent",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  mounted() {
    document.addEventListener("keydown", this.keyEvent)
  },
  destroyed() {
    document.removeEventListener("keydown", this.keyEvent)
  },
  computed: mapGetters(["modalOpen"]),
  methods: {
    closeModal() {
      this.$store.commit("setModalOpen", false);
    },
    keyEvent(event) {
      if(event.code === "Space") {
        this.closeModal()
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: transparent;

  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: gray;
    opacity: 0.5;
    z-index: 1000;
  }

  .wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    width: 80%;
    height: 80%;
    background: white;
    z-index: 1000;
    padding: 10px;

    .title {
      font-size: 32px;
      text-align: center;
    }

    .content {
      font-size: 20px;
      position: relative;
      overflow-y: scroll;
      margin: 20px;
    }

    .close {
      position: absolute;
      top: 10px;
      right: 40px;
      width: 40px;
      height: 40px;
      cursor: pointer;

      &:after {
        display: inline-block;
        font-size: 30px;
        content: "✕"; /* This will render the 'X' */
      }
    }
  }
}
</style>
