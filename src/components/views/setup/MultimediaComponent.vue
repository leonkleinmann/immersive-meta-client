<template>
  <div class="setup">
    <div class="title">
      Setup
    </div>
    <div class="cam">
      <video autoplay="true" id="cam">

      </video>
    </div>
    <div class="complete">
      <IsometricWrapper
          :clickable="permissionsGranted"
          :border="true"
          :error="!permissionsGranted"
          @clicked="completeSetup()"
      >
        Weiter
      </IsometricWrapper>
    </div>
  </div>
</template>

<script>
import IsometricWrapper from "@/components/IsometricWrapper";
export default {
  name: "MultimediaComponent",
  components: {IsometricWrapper},
  data() {
    return {
      audioPermissionGranted: false,
      videoPermissionGranted: false,
      audioStream: undefined,
      videoStream: undefined
    }
  },
  computed: {
    permissionsGranted() {
      return this.audioPermissionGranted && this.videoPermissionGranted
    }
  },
  mounted() {
    this.init()
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

      navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
      }).then((stream) => {
        let aCtx = new AudioContext();
        let microphone = aCtx.createMediaStreamSource(stream);
        let destination= aCtx.destination;
        microphone.connect(destination);
        this.audioPermissionGranted = true
      }).catch(() => {
        console.log('Audio: Something went wrong!')
      })

      navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      }).then((stream) => {
        let videoContainer = document.querySelector('#cam')
        videoContainer.srcObject = stream
        this.videoPermissionGranted = true
      }).catch(() => {
        console.log('Video: Something went wrong')
      })
    },
    completeSetup() {
      if (this.permissionsGranted) {
        this.$emit('mediaSetupComplete', true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.setup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  height: 100%;
  margin-left: 200px;
  margin-right: 200px;

  .title {
    font-size: 48px;
  }

  .cam {
    width: 1280px;
    height: 720px;
    border: 1px solid black;
  }
  .complete {
    width: 120px;
    height: 40px;
  }
}
</style>