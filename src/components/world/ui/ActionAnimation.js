import * as PIXI from "pixi.js";
import store from "@/store";

export default class ActionAnimation extends PIXI.AnimatedSprite {
  constructor() {
    super([PIXI.Texture.WHITE]);
    this.textures = store.getters.animations["action"];
    this.zIndex = 1001;
    this.animationSpeed = 0.1;
  }

  reset() {
    this.textures = store.getters.animations["action"];
  }
}
