<template>
  <div class="multimedia">
    <h1>Are you ready for Interaction?</h1>
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
    <div class="cam">
      <video autoplay="true" id="cam"></video>
    </div>

    <AdvanceButton class="advance" @advance="advance" />
  </div>
</template>

<script>
import AdvanceButton from "@/components/ui/AdvanceButton";
export default {
  name: "MultimediaComponent",
  components: { AdvanceButton },
  data() {
    return {
      audioPermissionGranted: false,
      videoPermissionGranted: false,
      audioStream: undefined,
      videoStream: undefined,
    };
  },
  computed: {
    permissionsGranted() {
      return this.audioPermissionGranted && this.videoPermissionGranted;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // check if permissions were already granted
      /*
      navigator.permissions.query({ name: 'audio'}).then((result) => {
        if (result.state === 'granted') {
          this.audioPermissionGranted = true
        }
      })
      navigator.permissions.query({ name: 'video' }).then((result) => {
        if (result.state === 'granted') {
          this.videoPermissionGranted = true
        }
      })
      */

      navigator.mediaDevices
        .getUserMedia({
          video: false,
          audio: true,
        })
        .then((stream) => {
          let aCtx = new AudioContext();
          let microphone = aCtx.createMediaStreamSource(stream);
          let destination = aCtx.destination;
          microphone.connect(destination);
          this.audioPermissionGranted = true;
        })
        .catch(() => {
          console.log("Audio: Something went wrong!");
        });

      navigator.mediaDevices
        .getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        })
        .then((stream) => {
          let videoContainer = document.querySelector("#cam");
          videoContainer.srcObject = stream;
          this.videoPermissionGranted = true;
        })
        .catch(() => {
          console.log("Video: Something went wrong");
        });
    },
    completeSetup() {
      if (this.permissionsGranted) {
        this.$emit("mediaSetupComplete", true);
      }
    },
    advance() {
      this.$emit("advance");
    },
  },
};
</script>

<style lang="scss" scoped>
.multimedia {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-left: 20%;
  padding-right: 20%;

  .cam {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
