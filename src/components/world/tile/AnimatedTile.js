import * as PIXI from "pixi.js";
import store from "@/store";

export default class AnimatedTile extends PIXI.AnimatedSprite {
  constructor(x, y, animation_type) {
    super(store.getters.animations[animation_type]);

    this.x = x * store.getters.settingsData.tileSize;
    this.y = y * store.getters.settingsData.tileSize;
    this.animationSpeed = 1 / this.textures.length;
    this.loop = true;
    this.zIndex = 1;
    this.play();
  }
}
