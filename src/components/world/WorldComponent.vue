<template>
  <div class="metaspace">
    <ModalComponent title="Content">
      <div v-html="modalContent"></div>
    </ModalComponent>
    <div class="world"></div>
    <ChatComponent />
  </div>
</template>

<script>
import AssetManager from "@/components/world/assets/index";
import axios from "axios";
import { mapGetters } from "vuex";
import ChatComponent from "@/components/chat/ChatComponent";
import Avatar from "@/components/world/avatar/Avatar";
import AvatarContainer from "@/components/world/avatar/AvatarContainer";
import ServerConnector from "@/connectors/server";
import ModalComponent from "@/components/ui/ModalComponent";
import VirtualRoom from "@/components/world/room/VirtualRoom";
import Movable from "@/components/world/avatar/Movable";
import gsap from "gsap";

export default {
  name: "WorldComponent",
  components: { ModalComponent, ChatComponent },
  mounted() {
    this.$store.commit("setIsLoading", true);
    document.querySelectorAll(".world")[0].appendChild(this.$pixiApp.view);
    this.$pixiApp.loader = new AssetManager();

    this.loadSettings();
    this.loadAssets().then(() => {
      this.$pixiApp.loader.loadAssets();
    });

    this.$pixiApp.loader.onComplete.add((loader, resources) => {
      loader.generateTextures(resources);
      loader.generateAnimations();
      this.loadWorld().then(() => {
        this.loadRoom(this.worldData.initial_room);
      });

      this.$store.commit("setIsLoading", false);
    });
  },
  data() {
    return {
      room: undefined,
      avatar: undefined,
      avatarContainer: undefined,
      clientAvatars: {},
      clientAvatarContainers: {},
      mustScrollX: false,
      mustScrollY: false,
    };
  },
  computed: {
    ...mapGetters([
      "server",
      "setupData",
      "settingsData",
      "currentRoom",
      "worldData",
      "modalContent",
    ]),
  },
  watch: {
    "$store.state.clientAvatars"(updatedAvatars) {
      this.modifyClientAvatars(updatedAvatars);
    },
    "$store.state.currentRoom"() {
      this.changeRoom();
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
      this.$store.commit("setIsLoading", true);

      if (this.room !== undefined) {
        this.$pixiApp.stage.removeChild(this.room);
        ServerConnector.getInstance().sendMessage("ROOM_LEAVE");
        this.clientAvatars = {};
        this.clientAvatarContainers = {};
      }

      this.room = new VirtualRoom(this.currentRoom);

      this.avatar = new Avatar(
        0,
        0,
        this.setupData.gender
      );

      this.avatarContainer = new AvatarContainer(
        this.setupData.username,
        this.setupData.link
      );
      this.avatarContainer.x =
        this.avatar.x -
        this.avatarInformationWidth / 2 +
        this.settingsData.tileSize / 2;
      this.avatarContainer.y = this.avatar.y - this.settingsData.tileSize;

      this.room.addChild(this.avatar);
      this.room.addChild(this.avatarContainer);
      this.$pixiApp.stage.addChild(this.room);
      this.room.addObjects();

      this.$pixiApp.ticker.add(this.animationUpdate);
      this.$pixiApp.ticker.add(this.collisionUpdate);
      this.$pixiApp.ticker.add(this.scroll);

      ServerConnector.getInstance().sendMessage("ROOM_ENTRY", {
        x: this.avatar.x,
        y: this.avatar.y,
        room_id: this.currentRoom._id,
      });

      this.mustScrollX = this.room.roomWidth > window.innerWidth;
      this.mustScrollY = this.room.roomHeight > window.innerHeight;

      this.scroll();

      this.$store.commit("setIsLoading", false);
    },
    modifyClientAvatars(updatedAvatars) {
      if (
        Object.keys(this.clientAvatars).length >
        Object.keys(updatedAvatars).length
      ) {
        const keys1 = Object.keys(this.clientAvatars);
        const keys2 = Object.keys(updatedAvatars);

        const diff = keys1.filter((key) => !keys2.includes(key))[0];
        let avatar = this.clientAvatars[diff];
        let avatarInfo = this.clientAvatarContainers[diff];
        this.room.removeChild(avatar);
        this.room.removeChild(avatarInfo);
      }

      updatedAvatars.forEach((clientAvatar) => {
        let clientId = clientAvatar.clientId;
        let clientX = clientAvatar.x;
        let clientY = clientAvatar.y;

        if (this.clientAvatars[clientId] === undefined) {
          let ava = new Movable(clientX, clientY, clientAvatar.gender);
          let avaContainer = new AvatarContainer(
            clientAvatar.username,
            clientAvatar.link
          );
          avaContainer.x =
            ava.x -
            this.avatarInformationWidth / 2 +
            this.settingsData.tileSize / 2;
          avaContainer.y = ava.y - this.settingsData.tileSize;

          this.clientAvatars[clientId] = ava;
          this.clientAvatarContainers[clientId] = avaContainer;
          this.room.addChild(this.clientAvatars[clientId]);
          this.room.addChild(this.clientAvatarContainers[clientId]);
        } else {
          let cpy = this.clientAvatars[clientId];
          if (cpy.x !== clientX || cpy.y !== clientY) {
            this.clientAvatars[clientId].move(
              clientAvatar.x,
              clientAvatar.y,
              clientAvatar.direction
            );
          }
        }
      });
    },
    animationUpdate() {
      /* UPDATE USER AVATAR */
      this.avatarContainer.x =
        this.avatar.x -
        this.avatarInformationWidth / 2 +
        this.settingsData.tileSize / 2;
      this.avatarContainer.y = this.avatar.y - this.settingsData.tileSize;

      /* UPDATE CLIENT AVATARS */
      for (const client in this.clientAvatars) {
        let clientAvatar = this.clientAvatars[client];
        let clientContainer = this.clientAvatarContainers[client];
        if (
          clientAvatar &&
          clientAvatar.x !== undefined &&
          clientAvatar.y !== undefined
        ) {
          clientContainer.x =
            clientAvatar.x -
            this.avatarInformationWidth / 2 +
            this.settingsData.tileSize / 2;
          clientContainer.y = clientAvatar.y - this.settingsData.tileSize;
        }
      }
    },
    collisionUpdate() {
      this.room.getExitObjects().forEach((exitObject) => {
        if (exitObject.x === this.avatar.x && exitObject.y === this.avatar.y) {
          this.loadRoom(exitObject.nextRoom);
        }
      });
    },
    scroll() {
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
