<template>
  <div class="metaspace">
    <ModalComponent title="Content">
      <div v-html="modalContent"></div>
    </ModalComponent>
    <SoundComponent />
    <div class="world"></div>
    <ChatComponent />
    <MultimediaComponent />
    <SettingsComponent />
  </div>
</template>

<script>
import AssetManager from "@/components/world/assets/index";
import { mapGetters } from "vuex";
import ChatComponent from "@/components/chat/ChatComponent";
import Avatar from "@/components/world/avatar/Avatar";
import ServerConnector from "@/connectors/server";
import ModalComponent from "@/components/ui/ModalComponent";
import gsap from "gsap";
import MiniMap from "@/components/world/room/MiniMap";
import SoundComponent from "@/components/sound/SoundComponent";
import MultimediaComponent from "@/components/ui/MultimediaComponent";
import SettingsComponent from "@/components/ui/SettingsComponent";
import ClientAvatar from "@/components/world/avatar/ClientAvatar";
import MultimediaManager from "@/multimedia/MultimediaManager";
import ContentRoom from "@/components/world/room/ContentRoom";
import WorkshopRoom from "@/components/world/room/WorkshopRoom";

export default {
  name: "WorldComponent",
  components: {
    SettingsComponent,
    MultimediaComponent,
    SoundComponent,
    ModalComponent,
    ChatComponent,
  },
  data() {
    return {
      room: undefined,
      avatar: undefined,
      clientAvatars: {},
      mustScrollX: false,
      mustScrollY: false,
      miniMap: undefined,
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
      "connectedClients",
      "clientId",
    ]),
  },
  mounted() {
    this.$store.commit("setIsLoading", true);
    document.querySelectorAll(".world")[0].appendChild(this.$pixiApp.view);
    this.$pixiApp.loader = new AssetManager();
    MultimediaManager.getInstance().sendVideoChunks(1);

    this.$store.dispatch("loadSettings").then(() => {
      this.$store.dispatch("loadAssets").then(() => {
        this.$pixiApp.loader.loadAssets();
      });
    });

    this.$pixiApp.loader.onComplete.add((loader, resources) => {
      loader.generateTextures(resources);
      loader.generateAnimations();
      this.addEntities();
      this.$store.dispatch("loadWorld").then(() => {
        this.loadRoom(this.worldData.initial_room);
      });
    });
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
    addEntities() {
      this.miniMap = new MiniMap(
        0,
        0,
        200,
        200,
        undefined,
        undefined,
        this.$pixiApp.ticker
      );
      this.avatar = new Avatar(
        0,
        0,
        this.setupData.gender,
        this.setupData.username,
        this.setupData.link,
        "south"
      );
    },
    async loadRoom(roomId) {
      if (this.room !== undefined) {
        this.removeRoom();
      }
      this.$store.dispatch("loadRoom", roomId);
    },
    removeRoom() {
      ServerConnector.getInstance().sendMessage("ROOM_LEAVE");

      this.$pixiApp.ticker.remove(this.animationTrigger);
      this.$pixiApp.ticker.remove(this.avatarCollision);
      this.$pixiApp.ticker.remove(this.collisionUpdate);
      this.$pixiApp.ticker.remove(this.scroll);
      this.$pixiApp.stage.removeChild(this.room, this.miniMap);

      this.clientAvatars = {};
      this.$store.commit("clearClientAvatars");
    },
    changeRoom() {
      this.$store.commit("setIsLoading", true);

      if (this.currentRoom.__t === "content_room") {
        this.room = new ContentRoom(this.currentRoom);
      }
      if (this.currentRoom.__t === "workshop_room") {
        this.room = new WorkshopRoom(this.currentRoom);
      }

      this.avatar.position.set(
        this.currentRoom.initial_position.x * this.settingsData.tileSize,
        this.currentRoom.initial_position.y * this.settingsData.tileSize
      );

      this.room.addChild(this.avatar);
      this.avatar.addInfoContainer();
      //this.avatar.addVideoContainer(this.clientId);
      this.miniMap.setMirrorScene(this.room);
      this.miniMap.setAvatar(this.avatar);

      this.$pixiApp.stage.addChild(this.room, this.miniMap);

      this.$pixiApp.ticker.add(this.animationTrigger);
      this.$pixiApp.ticker.add(this.avatarCollision);
      this.$pixiApp.ticker.add(this.collisionUpdate);
      this.$pixiApp.ticker.add(this.scroll);

      this.mustScrollX = this.room.roomWidth > window.innerWidth;
      this.mustScrollY = this.room.roomHeight > window.innerHeight;

      ServerConnector.getInstance().sendMessage("ROOM_ENTRY", {
        x: this.avatar.x,
        y: this.avatar.y,
        room_id: this.currentRoom._id,
      });

      this.$store.commit("setAudioSource", this.currentRoom.music);
    },
    modifyClientAvatars(updatedAvatars) {
      const oldKeys = Object.keys(this.clientAvatars);
      const newKeys = Object.keys(updatedAvatars);

      oldKeys
        .filter((key) => !newKeys.includes(key))
        .forEach((key) => {
          const avatar = this.clientAvatars[key];
          avatar.removeInfoContainer();
          this.room.removeChild(avatar);
          delete this.clientAvatars[key];
        });

      updatedAvatars.forEach(
        ({ clientId, x, y, gender, username, link, direction, ip }) => {
          if (!this.clientAvatars[clientId]) {
            const ava = new ClientAvatar(
              x,
              y,
              gender,
              username,
              link,
              direction,
              clientId,
              ip
            );
            this.clientAvatars[clientId] = ava;
            this.room.addChild(ava);
            ava.addInfoContainer();
          } else if (
            this.clientAvatars[clientId].x !== x ||
            this.clientAvatars[clientId].y !== y
          ) {
            this.clientAvatars[clientId].move(x, y, direction);
          }
        }
      );
    },
    collisionUpdate() {
      this.room.getExitObjects().forEach((exitObject) => {
        if (exitObject.x === this.avatar.x && exitObject.y === this.avatar.y) {
          this.loadRoom(exitObject.nextRoom);
        }
      });
    },
    animationTrigger() {
      const avaX = this.avatar.x;
      const avaY = this.avatar.y;
      const interactiveEntities = this.room.getInteractiveEntities();
      if (avaX % 1 === 0 && avaY % 1 === 0) {
        interactiveEntities.forEach((interactive) => {
          if (this.avatar.hitTestRectangle(this.avatar, interactive)) {
            interactive.triggerAnimation();
          } else {
            interactive.stopAnimation();
          }
        });
      }
    },
    avatarCollision() {
      Object.values(this.clientAvatars).forEach((clientAvatar) => {
        // eslint-disable-next-line no-prototype-builtins
        if (!this.connectedClients.hasOwnProperty(clientAvatar.id)) {
          if (
            !(this.room instanceof WorkshopRoom) &&
            this.avatar.hitTestRectangle(clientAvatar, this.avatar)
          ) {
            this.$store.commit("addConnectedClient", clientAvatar.id);

            let direction = "UP";

            if (this.avatar.x < clientAvatar.x) {
              direction = "RIGHT";
              this.avatar.addVideoContainer(this.clientId, "LEFT");
            }
            if (this.avatar.x > clientAvatar.x) {
              direction = "LEFT";
              this.avatar.addVideoContainer(this.clientId, "RIGHT");
            }
            if (this.avatar.y < clientAvatar.y) {
              direction = "DOWN";
              this.avatar.addVideoContainer(this.clientId, "UP");
            }
            if (this.avatar.y > clientAvatar.y) {
              direction = "UP";
              this.avatar.addVideoContainer(this.clientId, "DOWN");
            }

            clientAvatar.addVideoContainer(clientAvatar.id, direction);
          }
        } else {
          if (
            !(this.room instanceof WorkshopRoom) &&
            this.avatar.hitTestRectangle(clientAvatar, this.avatar) === false
          ) {
            this.$store.commit("removeConnectedClient", clientAvatar.id);
            clientAvatar.removeVideoContainer();
          }
        }

        let realLen = 0;
        this.connectedClients.forEach((key) => {
          if (key !== undefined) {
            realLen = realLen + 1;
          }
        });
        if (realLen === 0) {
          this.avatar.removeVideoContainer();
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
