import store from '@/store'
import Tile from "@/components/game/tile";
import * as PIXI from "pixi.js";
import {Tilemap} from "@pixi/tilemap";

export default class TileMap {
    tiles = []

    constructor(assetManager) {
        this.assetManager = assetManager
        this.buildMap()
    }

    buildMap() {
        let mapData = store.getters.mapData

        this.background = PIXI.TilingSprite.from(this.assetManager.getTexture(mapData.background), {
            width: window.innerWidth,
            height: window.innerHeight,
        })

        mapData.tiles.forEach((tile) => {
            this.tiles.push(new Tile(
                tile.x,
                tile.y,
                this.assetManager.getTexture(tile.type)
            ))
        })
    }

    getTile(x, y) {
        console.log(x, y)
    }

    render(pixiApp) {
        this.tileMap = new Tilemap(this.assetManager.getSpriteGroup('tiles'))

        this.tiles.forEach((tile) => {
            this.tileMap.tile(
                tile.getTexture(),
                tile.getX() * store.getters.settings.tileSize,
                tile.getY() * store.getters.settings.tileSize
            )
        })

        pixiApp.stage.addChild(this.background)
        pixiApp.stage.addChild(this.tileMap)
    }
}