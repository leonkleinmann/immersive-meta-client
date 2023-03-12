<template>
  <div class="settings">
    <div class="interaction">
      <div class="audio item" @click="audio = !audio">
        <img
          :src="
            '/assets/ui/microphone_' + (audio ? 'enabled' : 'disabled') + '.svg'
          "
          alt="mic_enabled"
        />
      </div>
      <div class="video item" @click="video = !video">
        <img
          :src="
            '/assets/ui/webcam_' + (video ? 'enabled' : 'disabled') + '.svg'
          "
          alt="mic_enabled"
        />
      </div>
    </div>
    <div class="system"></div>
  </div>
</template>

<script>
export default {
  name: "MultimediaComponent",
  data() {
    return {
      audio: false,
      video: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.settings {
  .interaction {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }
  .system {
    position: absolute;
    top: 0;
    right: 0;
  }

  .item {
    display: flex;
    justify-content: center;
    align-items: center;

    background: white;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    cursor: pointer;

    img {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
