<template>
  <div class="setup">
    <MultimediaComponent @mediaSetupComplete="mediaSetupComplete" />
    <button class="skip" @click="skipSetup">Skip Setup</button>
  </div>
</template>

<script>
import MultimediaComponent from "@/components/views/setup/MultimediaComponent";
export default {
  name: "SetupComponent",
  components: { MultimediaComponent },
  data() {
    return {};
  },
  methods: {
    mediaSetupComplete() {
      console.log(
        "Multimedia Setup was completed successfully! Starting User Setup.."
      );
      this.$store.commit("setSetupCompleted", true);
    },
    skipSetup() {
      this.$store.commit("setSetupCompleted", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.setup {
  height: 100%;
  margin-left: 200px;
  margin-right: 200px;
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
