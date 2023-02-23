import * as PIXI from "@pixi/animate";

export default class CommonObject extends PIXI.Sprite {
    constructor(x, y, width, height, texture) {
        super(texture);
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.zIndex = 10
    }
}