import * as PIXI from "@pixi/animate";

export default class Tile {
    constructor(x, y, texture) {
        this.x = x
        this.y = y
        this.texture = texture
    }

    getX() {
        return this.x
    }
    getY() {
        return this.y
    }
    getTexture() {
        return this.texture
    }
    getSprite() {
        let tileSprite = new PIXI.Sprite(this.getTexture())
        tileSprite.x = this.getX()
        tileSprite.y = this.getY()
        tileSprite.width = 32
        tileSprite.height = 32

        return tileSprite
    }
}