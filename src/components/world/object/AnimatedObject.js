import * as PIXI from "pixi.js";
import store from "@/store";

/**
 * Class which represents animated objects
 */
export default class AnimatedObject extends PIXI.AnimatedSprite {
  /**
   * Constructor of AnimatedObject
   * @param x x-position of animated object
   * @param y y-position of animated object
   * @param animation_type identifier for animations
   */
  constructor(x, y, animation_type) {
    super(store.getters.animations[animation_type]);

    this.position.set(x, y);
    this.zIndex = 10;
    this.animationSpeed = 1 / this.textures.length;
    this.loop = true;
    this.play();
  }
}
