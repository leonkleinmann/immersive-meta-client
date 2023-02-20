<template>
  <div class="metaspace">
    <div class="world"></div>
    <ChatComponent />
  </div>
</template>

<script>
import AssetManager from "@/components/world/assets/index";
import axios from "axios";
import { mapGetters } from "vuex";
import ChatComponent from "@/components/chat/ChatComponent";
import VirtualRoom from "@/components/world/room";
import Avatar from "@/components/world/avatar";
import AvatarContainer from "@/components/world/avatar/AvatarContainer";
import gsap from "gsap";

export default {
  name: "WorldComponent",
  components: { ChatComponent },
  mounted() {
    this.$store.commit("setIsLoading", true);
    document.querySelectorAll(".world")[0].appendChild(this.$pixiApp.view);
    window.addEventListener("resize", this.scrollRoom);
    this.$pixiApp.loader = new AssetManager();

    this.loadSettings();
    this.loadAssets().then(() => {
      this.$pixiApp.loader.loadAssets();
    });

    this.$pixiApp.loader.onComplete.add((loader, resources) => {
      loader.generateTextures(resources);
      loader.generateAnimations();
      this.registerKeyEvents();
      this.loadWorld().then(() => {
        this.loadRoom(this.worldData.initial_room);
        this.$pixiApp.ticker.add(this.animationUpdate);
      });

      this.$store.commit("setIsLoading", false);
    });
  },
  data() {
    return {
      worldId: undefined,
      room: undefined,
      avatar: undefined,
      avatarContainer: undefined,
      mustScrollX: false,
      mustScrollY: false,
    };
  },
  computed: {
    ...mapGetters([
      "server",
      "setupData",
      "settingsData",
      "textures",
      "currentRoom",
      "avatarInformationWidth",
      "avatarInformationHeight",
      "exitObjects",
      "worldData",
      "avatarMoved",
    ]),
  },
  watch: {
    "$store.state.currentRoom"() {
      this.$store.commit("setIsLoading", true);
      this.changeRoom();
      this.$store.commit("setIsLoading", false);
    },
  },
  methods: {
    async loadSettings() {
      try {
        await axios
          .get(this.server.host + ":" + this.server.api_port + "/settings")
          .then((settings) => {
            this.$store.commit("setSettingsData", settings.data);
          });
      } catch {
        console.log("ERROR LOADING SETTINGS");
      }
    },
    async loadAssets() {
      try {
        await axios
          .get(this.server.host + ":" + this.server.api_port + "/assets")
          .then((assets) => {
            this.$store.commit("setAssetData", assets.data);
          });
      } catch {
        console.log("ERROR LOADING ASSETS");
      }
    },
    async loadWorld() {
      try {
        await axios
          .get(this.server.host + ":" + this.server.api_port + "/map/world")
          .then((world) => {
            this.$store.commit("setWorldData", world.data);
          });
      } catch {
        console.log("ERROR LOADING WORLD");
      }
    },
    async loadRoom(roomId) {
      try {
        await axios
          .get(
            this.server.host +
              ":" +
              this.server.api_port +
              "/map/room/" +
              roomId
          )
          .then((room) => {
            this.$store.commit("setCurrentRoom", room.data);
          });
      } catch {
        console.log("ERROR LOADING ROOM");
      }
    },
    changeRoom() {
      if (this.room !== undefined) {
        this.$pixiApp.stage.removeChild(this.room);
      }

      this.room = new VirtualRoom(this.currentRoom);

      this.avatar = new Avatar(
        this.currentRoom.initial_position.x * this.settingsData.tileSize,
        this.currentRoom.initial_position.y * this.settingsData.tileSize
      );

      this.mustScrollX = this.room.roomWidth > window.innerWidth;
      this.mustScrollY = this.room.roomHeight > window.innerHeight;

      this.avatarContainer = new AvatarContainer();
      this.avatarContainer.x =
        this.avatar.x -
        this.avatarInformationWidth / 2 +
        this.settingsData.tileSize / 2;
      this.avatarContainer.y = this.avatar.y - this.settingsData.tileSize;

      this.room.addChild(this.avatar);
      this.room.addChild(this.avatarContainer);
      this.$pixiApp.stage.addChild(this.room);

      this.scrollRoom();
    },
    registerKeyEvents() {
      document.addEventListener(
        "keydown",
        (event) => {
          if (event.code === "ArrowUp" || event.code === "KeyW") {
            this.avatar.moveNorth();
          }
          if (event.code === "ArrowRight" || event.code === "KeyD") {
            this.avatar.moveEast();
          }
          if (event.code === "ArrowDown" || event.code === "KeyS") {
            this.avatar.moveSouth();
          }
          if (event.code === "ArrowLeft" || event.code === "KeyA") {
            this.avatar.moveWest();
          }
        },
        false
      );
    },
    scrollRoom() {
      if (this.mustScrollX) {
        gsap.to(this.room, {
          x: window.innerWidth / 2 - this.avatar.x,
          duration: 0.5,
        });
      }
      if (this.mustScrollY) {
        gsap.to(this.room, {
          y: window.innerHeight / 2 - this.avatar.y,
          duration: 0.5,
        });
      }
    },
    animationUpdate() {
      if (this.avatarMoved) {
        this.avatarContainer.x =
          this.avatar.x -
          this.avatarInformationWidth / 2 +
          this.settingsData.tileSize / 2;
        this.avatarContainer.y = this.avatar.y - this.settingsData.tileSize;

        this.$store.commit("setAvatarMoved", false);
        //COLLISION
        this.exitObjects.forEach((exitObject) => {
          if (
            exitObject.x === this.avatar.x &&
            exitObject.y === this.avatar.y
          ) {
            this.loadRoom(exitObject.nextRoom);
          }
        });
        this.scrollRoom()
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.metaspace {
  position: relative;
  width: 100vw;
  height: 100vh;

  .world {
    position: relative;
    width: 100vw;
    height: 100vh;
    z-index: 1;
  }
}
</style>