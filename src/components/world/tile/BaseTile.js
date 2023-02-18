import * as PIXI from "@pixi/animate";

export default class BaseTile extends PIXI.Sprite {
  constructor(x, y, width, height, texture) {
    super(texture);
    this.x = x;
    this.y = y;
    this.width = width;
  }
}
