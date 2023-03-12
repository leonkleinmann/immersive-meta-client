<template>
  <div class="settings">
    <div class="items">
      <div @click="logout" class="item">
        <img src="/assets/ui/logout.png" alt="mic_enabled" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsComponent",
  methods: {
    logout() {
      this.$store.commit('setIsPlaying', false)
    },
  },
};
</script>

<style lang="scss" scoped>
.settings {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  margin: 20px;

  .items {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      background: white;
      border-radius: 100%;
      cursor: pointer;

      img {
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>
