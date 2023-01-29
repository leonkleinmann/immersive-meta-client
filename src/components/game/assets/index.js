import store from "@/store";
import * as PIXI from "pixi.js";

export default class AssetManager {
  sprites = {};
  textures = {};

  constructor(pixiLoader, baseUrl = "/assets/") {
    this.pixiLoader = pixiLoader;
    this.pixiLoader.baseUrl = baseUrl;
    this.pixiLoader.reset();
  }

  preloadAssets() {
    this.assetData = store.getters.assetData;

    for (const [key, value] of Object.entries(this.assetData)) {
      value.forEach((item) => {
        this.pixiLoader.add(key + "_" + item.id, item.src);
      });
    }
    this.pixiLoader.load();
  }

  generatePixiAssets() {
    let tileSize = store.getters.settings.tileSize;

    for (const [key, sprites] of Object.entries(this.assetData)) {
      sprites.forEach((sprite) => {
        this.sprites[key + "_" + sprite.id] = new PIXI.BaseTexture.from(
          this.pixiLoader.resources[key + "_" + sprite.id].url
        );

        sprite.items.forEach((texture) => {
          let pixiTexture = new PIXI.Texture(
            this.sprites[key + "_" + sprite.id],
            new PIXI.Rectangle(
              texture.x * tileSize,
              texture.y * tileSize,
              tileSize,
              tileSize
            )
          );
          this.textures[texture.id] = pixiTexture;
          this.sprites[key + "_" + sprite.id][texture.id] = pixiTexture;
        });
      });
    }
  }

  getSprite(type, id) {
    return this.sprites[`${type}_${id}`];
  }

  getTexture(type) {
    return this.textures[type];
  }

  getCorrespondingTextures(type) {
    let result = [];

    for (const [key, texture] of Object.entries(this.textures)) {
      if (key.includes(type)) {
        result.push(texture);
      }
    }
    return result;
  }
}
