import * as PIXI from "pixi.js";
import store from "@/store";

export default class AnimatedObject extends PIXI.AnimatedSprite {
  constructor(x, y, width, height, animation_type) {
    super([PIXI.Texture.WHITE]);

    this.x = x;
    this.y = y;
    //this.width = width;
    //this.height = height;
    this.textures = store.getters.animations[animation_type];

    this.animationSpeed = 1 / this.textures.length;
    this.loop = true;
    this.play()
  }
}
