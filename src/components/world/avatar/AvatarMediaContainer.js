import * as PIXI from "pixi.js";
import MultimediaManager from "@/multimedia/MultimediaManager";

export default class AvatarMediaContainer extends PIXI.Container {
  constructor(muted) {
    super();
    this.muted = muted;

    this.zIndex = 1001;
    this.buildVideoSprite();
  }

  async buildVideoSprite() {
    let stream = await MultimediaManager.getInstance().getVideoStream();
    const videoResource = new PIXI.VideoResource(stream);
    await videoResource.load();
    const videoTexture = new PIXI.Texture.from(videoResource);
    const videoSprite = new PIXI.Sprite(videoTexture);
    videoSprite.position.set(0, 0);
    videoSprite.width = 120;
    videoSprite.height = 80;
    this.addChild(videoSprite);
  }
}
