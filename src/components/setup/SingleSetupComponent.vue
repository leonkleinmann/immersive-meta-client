<template>
  <div class="setup">
    <div class="header">
      <h1>IMMERSIVE META SPACE</h1>
    </div>
    <div class="description">
      <h2>Bevor's los geht!</h2>
      <p>
        Du stehst kurz davor, den Meta Space der Scholz&Volkmer GmbH zu betreten
        und dieses Unternehmen in einer immersiven Erfahrung kennen zu lernen.
        Bitte beachte, dass die Erfahrung auch von Dir abhängt. Der Grad an
        mentaler Immersion der in diesem Meta Space erreicht wird hängt nämlich
        von deiner Bereitschat ab, neue Dinge auszuprobieren!
      </p>
      <p>
        Bevor du die virtuelle Welt des Meta Space betreten kannst, musst du
        noch ein paar kleine Schritte durchführen.
      </p>
      <p>Bitte stelle sicher, dass:</p>
      <ul>
        <li>Du Zugriff auf deine Kamera hast.</li>
        <li>Du dich selbst hörst.</li>
        <li>Du Dir einen Username gegeben hast.</li>
        <li>
          Du einen Link angegeben hast, welcher zu einem deiner
          Social-Media-Kanäle führt.
        </li>
      </ul>
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
              <img alt="link" src="/assets/setup/link.svg" />
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
      link: "https://yourlink.io",
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
    this.micStream.getTracks().forEach((track) => track.stop());
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
        ServerConnector.getInstance();
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
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;
  font-family: "VT323", serif;

  .header {
    position: absolute;
    left: 50px;
    top: 50px;
    padding: 5px;
    border: 4px solid black;
  }

  .description {
    width: 50%;
    padding: 50px;
    font-size: 20px;
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 50%;

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
              height: 20px;
              font-size: 16px;
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
            display: flex;
            align-items: center;
            gap: 10px;
            text-align: center;

            & input {
              width: 200px;
              height: 20px;
              font-size: 16px;
            }

            img {
              width: 40px;
              height: 40px;
            }
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
