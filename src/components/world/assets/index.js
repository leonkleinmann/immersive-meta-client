import store from "@/store";
import * as PIXI from "pixi.js";

export default class AssetManager extends PIXI.Loader {
  constructor(baseUrl = "/assets/") {
    super();
    this.reset();
    this.baseUrl = baseUrl;
  }

  /**
   *
   */
  loadAssets() {
    this.addAssets();
    this.load();
  }

  /**
   *
   */
  addAssets() {
    const spriteData = store.getters.assetData.sprites;
    spriteData.forEach((sprite) => {
      this.add(sprite.identifier, sprite.src);
    });
  }

  /**
   *
   * @param resources
   */
  generateTextures(resources) {
    const spriteData = store.getters.assetData.sprites;

    spriteData.forEach((sprite) => {
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

  /**
   *
   * @param resources
   */
  generateAnimations() {
    const animationData = store.getters.assetData.animations;

    animationData.forEach((animation) => {
      store.state.animations[animation.identifier] = [];
      animation.textures.forEach((texture) => {
        store.state.animations[animation.identifier].push(
          store.getters.textures[texture.type]
        );
      });
    });
  }
}
