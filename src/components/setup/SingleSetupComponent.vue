<template>
  <div class="setup">
    <div class="description">
      <h1>Before we go..</h1>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </p>
    </div>

    <div class="content">
      <div class="result">
        <div class="avatar">
          <div class="webcam">
            <video :autoplay="true" id="cam"></video>
          </div>
          <div class="information">
            <div class="circle"></div>
            <div class="username"><input v-model="username" type="text" /></div>
            <div class="link">
              <a :href="link">
                <img alt="link" src="/assets/setup/link.svg" />
              </a>
            </div>
          </div>
          <div class="character">
            <img
              v-if="gender === 'male'"
              alt="avatar_male"
              src="/assets/setup/avatar_male.svg"
            />
            <img
              v-if="gender === 'female'"
              alt="avatar_male"
              src="/assets/setup/avatar_female.svg"
            />
            <div class="gender">
              <button
                :class="[gender === 'male' ? 'active' : '']"
                @click="gender = 'male'"
              >
                Male
              </button>
              <button
                :class="[gender === 'female' ? 'active' : '']"
                @click="gender = 'female'"
              >
                Female
              </button>
            </div>
            <div class="social">
              Social Media (URL):<br />
              <input v-model="link" type="text" />
            </div>
          </div>
        </div>
      </div>
      <div class="enter">
        <AdvanceButton class="advance" @advance="completeSetup" />
      </div>
    </div>
  </div>
</template>

<script>
import AdvanceButton from "@/components/ui/AdvanceButton";
import { mapGetters } from "vuex";
import ServerConnector from "@/connectors/server";

export default {
  name: "SingleSetupComponent",
  components: { AdvanceButton },
  data() {
    return {
      gender: "male",
      username: "Username",
      link: "https://google.com",
      audioPermissionGranted: false,
      videoPermissionGranted: false,
      micStream: undefined,
      camStream: undefined,
    };
  },
  computed: {
    ...mapGetters(["devMode"]),
  },
  mounted() {
    if (this.devMode) {
      this.$store.commit("setIsPlaying", true);
    } else {
      this.initAudio();
      this.initVideo();
    }
  },
  destroyed() {
    this.micStream.getTracks().forEach((track) => track.stop())
    this.camStream.getTracks().forEach((track) => track.stop());
  },
  methods: {
    initAudio() {
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
          this.micStream = microphone.mediaStream;
          this.audioPermissionGranted = true;
        })
        .catch(() => {
          console.log("Audio: Something went wrong!");
        });
    },
    initVideo() {
      navigator.mediaDevices
        .getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        })
        .then((stream) => {
          let videoContainer = document.querySelector("#cam");
          videoContainer.srcObject = stream;
          this.camStream = stream;
          this.videoPermissionGranted = true;
        })
        .catch(() => {
          console.log("Video: Something went wrong");
        });
    },
    completeSetup() {
      if (this.audioPermissionGranted && this.videoPermissionGranted) {
        this.$store.commit("setSetupConfig", {
          gender: this.gender,
          username: this.username,
          link: this.link,
        });
        ServerConnector.getInstance()
        this.$store.commit("setIsPlaying", true);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.setup {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-family: "VT323", serif;

  .description {
    padding-left: 20%;
    padding-right: 20%;
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 50px;
    margin-top: 20px;
    padding-left: 20%;
    padding-right: 20%;

    .result {
      display: flex;
      flex-direction: column;
      align-items: center;
      //width: 50%;
      .avatar {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;

        .webcam {
          width: 256px;
          height: 144px;
          border: 1px solid black;

          #cam {
            width: 100%;
            height: 100%;
          }
        }

        .information {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 200px;
          height: 50px;
          border: 1px solid black;
          background: white;

          .circle {
            width: 20px;
            height: 20px;
            background: green;
            border-radius: 100%;
          }

          .username {
            input {
              width: 80px;
            }
          }

          .link {
            width: 20px;
            height: 20px;

            img {
              width: 20px;
              height: 20px;
            }
          }
        }

        .character {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;

          img {
            width: 100px;
          }

          .gender {
            display: flex;
            flex-direction: row;
            gap: 10px;
            justify-content: center;

            button {
              width: 80px;
              height: 30px;

              background: white;
              border: 1px solid black;

              &:hover,
              &.active {
                background: black;
                color: white;
              }
            }
          }

          .social {
            text-align: center;
          }
        }
      }
    }
  }
  input {
    font-family: "VT323", serif;
  }
}
</style>
