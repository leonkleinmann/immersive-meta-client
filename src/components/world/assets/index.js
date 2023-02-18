import store from "@/store";
import * as PIXI from "pixi.js";

export default class AssetManager extends PIXI.Loader {
  constructor(baseUrl = "/assets/") {
    super();
    this.reset()
    this.baseUrl = baseUrl;
  }

  loadAssets() {
    this.addAssets()
    this.load()
  }

  addAssets() {
    const assetData = store.getters.assetData;
    assetData.forEach((sprite) => {
      this.add(sprite.identifier, sprite.src);
    });
  }

  generateTextures(resources) {
    const assetData = store.getters.assetData;

    assetData.forEach((sprite) => {
      const spriteTexture = resources[sprite.identifier].texture.baseTexture;
      sprite.textures.forEach((texture) => {
        store.state.textures[texture.type] = new PIXI.Texture(
          spriteTexture,
          new PIXI.Rectangle(
            texture.x,
            texture.y,
            texture.width,
            texture.height
          )
        );
      });
    });
  }
}
