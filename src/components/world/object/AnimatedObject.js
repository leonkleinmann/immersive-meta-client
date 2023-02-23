import * as PIXI from "pixi.js";
import store from "@/store";

export default class AnimatedObject extends PIXI.AnimatedSprite {
  constructor(x, y, animation_type) {
    super(store.getters.animations[animation_type]);

    this.position.set(x, y);
    this.zIndex = 10;
    this.animationSpeed = 1 / this.textures.length;
    this.loop = true;
    this.play();
  }
}
