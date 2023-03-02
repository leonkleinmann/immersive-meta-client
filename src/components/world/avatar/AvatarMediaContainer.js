import * as PIXI from "pixi.js";
import store from "@/store";

export default class AvatarMediaContainer extends PIXI.Container {
  constructor(id) {
    super();
    this.id = id;
    this.zIndex = 1001;
    this.buildVideoSprite();
  }

  async buildVideoSprite() {
    this.stream = document.createElement("video");
    this.mediaSource = new MediaSource();
    this.stream.src = null;
    this.stream.srcObj = this.mediaSource;

    this.videoSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.videoSprite.position.set(0, 0);
    this.videoSprite.width = 120;
    this.videoSprite.height = 80;

    this.mediaSource.addEventListener("sourceopen", () => {
      this.buffer = this.mediaSource.addSourceBuffer(
        'video/webm; codecs="opus, vp9"'
      );
    });

    this.addChild(this.videoSprite);

    if (this.id !== store.getters.clientId) {
      store.watch(
        () => store.state.connectedClients[this.id],
        async (chunk) => {
          try {
            const byteCharacters = atob(chunk);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            this.buffer.appendBuffer(byteArray);
            const videoResource = new PIXI.VideoResource(this.stream, {
              autoLoad: true,
            });
            this.videoSprite.texture = new PIXI.Texture.from(videoResource);
          } catch {
            console.log("Connection lost during updating");
          }
        },
        { deep: true }
      );
    }
  }
}
