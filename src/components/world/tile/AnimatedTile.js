import * as PIXI from "pixi.js";
import store from "@/store";

/**
 * Class which represents animated tiles
 */
export default class AnimatedTile extends PIXI.AnimatedSprite {
  /**
   * Constructor of AnimatedTile
   * @param x x-position of the animated tile
   * @param y y-position of the animated tile
   * @param animation_type animation identifier
   */
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
