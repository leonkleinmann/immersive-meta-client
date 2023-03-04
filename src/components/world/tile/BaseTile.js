import * as PIXI from "@pixi/animate";

/**
 * Class which represents base tiles
 */
export default class BaseTile extends PIXI.Sprite {
  /**
   * Constructor of BaseTile
   * @param x x-position of base tile
   * @param y y-position of base tile
   * @param width width of base tile
   * @param height height of base tile
   * @param texture texture of base tile
   * @param zIndex zIndex of base tile
   */
  constructor(x, y, width, height, texture, zIndex = 0) {
    super(texture);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.zIndex = zIndex;
  }
}
