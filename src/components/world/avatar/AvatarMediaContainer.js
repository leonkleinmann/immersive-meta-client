import * as PIXI from "pixi.js";
import MultimediaManager from "@/multimedia/MultimediaManager";
import store from "@/store";

export default class AvatarMediaContainer extends PIXI.Container {
  constructor(id) {
    super();
    this.id = id;
    this.zIndex = 1001;
    this.buildVideoSprite();
  }

  async buildVideoSprite() {
    this.stream = await MultimediaManager.getInstance().getVideoElement();
    await this.stream.play();
    const videoResource = new PIXI.VideoResource(this.stream);
    await videoResource.load();
    const videoTexture = new PIXI.Texture.from(videoResource);

    this.videoSprite = new PIXI.Sprite(videoTexture);
    this.videoSprite.position.set(0, 0);
    this.videoSprite.width = 120;
    this.videoSprite.height = 80;

    this.addChild(this.videoSprite);

    if (this.id !== store.getters.clientId) {
      store.watch(
        () => store.state.connectedClients[this.id],
        async (chunk) => {
          try {
            await this.stream.pause();

            const byteCharacters = atob(chunk);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "video/webm" });
            const blobURL = URL.createObjectURL(blob);
            this.stream.srcObject = null;
            this.stream.src = null;
            this.stream.src = blobURL;
            this.stream.play();
          } catch {
            console.log("Connection lost during updating");
          }
        },
        { deep: true }
      );
    }
  }
}
