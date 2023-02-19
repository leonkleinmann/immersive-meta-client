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
import store from "@/store";
import AvatarContainer from "@/components/world/avatar/AvatarContainer";

export default {
  name: "WorldComponent",
  components: { ChatComponent },
  mounted() {
    this.$store.commit("setIsLoading", true);
    document.querySelectorAll(".world")[0].appendChild(this.$pixiApp.view);
    window.addEventListener("resize", this.scrollRoom);
    this.$pixiApp.loader = new AssetManager();

    this.loadData().then(() => {
      this.$pixiApp.loader.loadAssets();
    });

    this.$pixiApp.loader.onComplete.add((loader, resources) => {
      loader.generateTextures(resources);
      loader.generateAnimations(resources);
      this.changeRoom();
      this.registerKeyEvents();
      this.$store.commit("setIsLoading", false);
    });
  },
  data() {
    return {
      room: undefined,
      avatar: undefined,
      avatarMoved: false,
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
    ]),
  },
  methods: {
    async loadData() {
      try {
        await axios
          .get(this.server.host + ":" + this.server.api_port + "/settings")
          .then((settings) => {
            this.$store.commit("setSettingsData", settings.data);
          });

        await axios
          .get(this.server.host + ":" + this.server.api_port + "/assets")
          .then((assets) => {
            this.$store.commit("setAssetData", assets.data);
          });

        let world = await axios.get(
          this.server.host + ":" + this.server.api_port + "/map/world"
        );
        await axios
          .get(
            this.server.host +
              ":" +
              this.server.api_port +
              "/map/room/" +
              world.data.initial_room
          )
          .then((room) => {
            this.$store.commit("setCurrentRoom", room.data);
          });
      } catch {
        console.log("ERROR LOADING DATA");
      }
    },
    changeRoom() {
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

      this.scrollRoom()
      this.$pixiApp.ticker.add(this.animationUpdate);
    },
    registerKeyEvents() {
      document.addEventListener(
        "keydown",
        (event) => {
          const tileSize = store.getters.settingsData.tileSize;
          const avatarX = this.avatar.x;
          const avatarY = this.avatar.y;

          if (event.code === "ArrowUp" || event.code === "KeyW") {
            if (this.willIntersect(avatarX, avatarY - tileSize)) {
              this.avatarMoved = true;
              this.avatar.moveNorth();
            }
          }
          if (event.code === "ArrowDown" || event.code === "KeyS") {
            if (this.willIntersect(avatarX, avatarY + tileSize)) {
              this.avatarMoved = true;
              this.avatar.moveSouth();
            }
          }
          if (event.code === "ArrowLeft" || event.code === "KeyA") {
            if (this.willIntersect(avatarX - tileSize, avatarY)) {
              this.avatarMoved = true;
              this.avatar.moveWest();
            }
          }
          if (event.code === "ArrowRight" || event.code === "KeyD") {
            if (this.willIntersect(avatarX + tileSize, avatarY)) {
              this.avatarMoved = true;
              this.avatar.moveEast();
            }
          }
        },
        false
      );
    },
    willIntersect(x, y) {
      let intersection = false;
      if (
        x >= 0 &&
        x < this.room.roomWidth &&
        y >= 0 &&
        y < this.room.roomHeight
      ) {
        intersection = true;
      }
      return intersection;
    },
    scrollRoom() {
      if (this.mustScrollX) {
        this.room.x = window.innerWidth / 2 - this.avatar.x;
      }
      if (this.mustScrollY) {
        this.room.y = window.innerHeight / 2 - this.avatar.y;
      }
    },
    animationUpdate() {
      if (this.avatarMoved) {
        this.avatarContainer.x =
          this.avatar.x -
          this.avatarInformationWidth / 2 +
          this.settingsData.tileSize / 2;
        this.avatarContainer.y = this.avatar.y - this.settingsData.tileSize;
        this.scrollRoom();
        this.avatarMoved = true;
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
