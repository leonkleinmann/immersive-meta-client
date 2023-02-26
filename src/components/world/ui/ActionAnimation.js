import * as PIXI from 'pixi.js'
import store from "@/store";

export default class ActionAnimation extends PIXI.AnimatedSprite {
    constructor() {
        super([PIXI.Texture.WHITE])
        console.log('TEXTURES', store.getters.animations["action"])
        this.textures = store.getters.animations["action"]
        this.zIndex = 1000;
    }
}