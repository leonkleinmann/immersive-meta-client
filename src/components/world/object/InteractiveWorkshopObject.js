import * as PIXI from "pixi.js";
import CommonObject from "@/components/world/object/CommonObject";
import store from "@/store";
import MultimediaManager from "@/multimedia/MultimediaManager";

export default class InteractiveWorkshopObject extends PIXI.Container {
  constructor(id, x, y, texture_type) {
    super();
    this.id = id;
    this.x = x;
    this.y = y;
    this.addCommonObject(texture_type);
    this.addScreenSprite();
  }

  addCommonObject(texture_type) {
    const texture = store.getters.textures[texture_type];
    this.backgroundSprite = new CommonObject(0, 0, 128, 128, texture);
    this.addChild(this.backgroundSprite);
  }

  trigger() {
    MultimediaManager.getInstance().sendScreenChunks(1, this.id);
  }

  async addScreenSprite() {
    this.stream = await MultimediaManager.getInstance().getVideoElement();
    await this.stream.play()

    const videoResource = new PIXI.VideoResource(this.stream);
    await videoResource.load();
    const videoTexture = new PIXI.Texture.from(videoResource);

    this.videoSprite = new PIXI.Sprite(videoTexture);
    this.videoSprite.position.set(10, 10);
    this.videoSprite.width = this.backgroundSprite.getBounds().width - 20;
    this.videoSprite.height = this.backgroundSprite.getBounds().height - 20;
    this.videoSprite.zIndex = 100
    console.log('VIDEO SPRITE', this.videoSprite)

    this.addChild(this.videoSprite)

    store.watch(
      () => store.state.workshopObjectData[this.id],
      async (chunk) => {
        try {
          this.stream.pause();
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
          console.log("CHUNK ERROR");
        }
      },
      { deep: true }
    );
  }

  stopAnimation() {}
  triggerAnimation() {}
}
