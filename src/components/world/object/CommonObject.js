import * as PIXI from "@pixi/animate";

/**
 * Class which represents common objects (not animated)
 */
export default class CommonObject extends PIXI.Sprite {
  /**
   * Constructor of CommonObject
   * @param x x-position of common object
   * @param y y-position of common object
   * @param width width of common object
   * @param height height of common object
   * @param texture texture of common object
   */
  constructor(x, y, width, height, texture) {
    super(texture);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.zIndex = 10;
  }
}
