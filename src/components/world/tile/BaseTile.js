import * as PIXI from "@pixi/animate";

export default class BaseTile extends PIXI.Sprite {
  constructor(x, y, width, height, texture, zIndex=0) {
    super(texture);
    this.x = x;
    this.y = y;
    this.width = width;
    this.zIndex = zIndex
  }
}
