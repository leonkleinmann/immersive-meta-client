import store from "@/store";
import * as PIXI from "pixi.js";

/**
 * Class which preloads all necessary assets (textures and animations) and puts them into pixi cache,
 * so it's not mandatory to reload them
 */
export default class AssetManager extends PIXI.Loader {
  /**
   * Constructor of Asset Manager
   * @param baseUrl base path of the assets folder
   */
  constructor(baseUrl = "/assets/") {
    super();
    this.reset();
    this.baseUrl = baseUrl;
  }

  /**
   * function which adds needed assets to loader and loads them afterwards
   */
  loadAssets() {
    this.addAssets();
    this.load();
  }

  /**
   * function which adds all necessary assets to the loader which will put them into cache
   */
  addAssets() {
    const spriteData = store.getters.assetData.sprites;
    spriteData.forEach((sprite) => this.add(sprite.identifier, sprite.src));
  }

  /**
   * function which generates textures of sprites by cutting the textures out of the sprite image
   * and saves them in store
   * @param resources array with the sprites
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
   * function which generates animations and stores them in store
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
