import * as PIXI from "@pixi/animate";

export default class ExitObject extends PIXI.Sprite {
  constructor(x, y, width, height, texture, nextRoom, zIndex = 0) {
    super(texture);
    this.x = x;
    this.y = y;
    this.nextRoom = nextRoom;
    this.width = width;
    this.zIndex = zIndex;
  }
}
