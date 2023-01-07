import * as PIXI from 'pixi.js'
import { Tilemap } from '@pixi/tilemap'
import * as metamap from './map.json'

export function setTileBackground(pixiApp, texture) {
    //var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight)
    let backgroundTile = PIXI.TilingSprite.from(texture, {
        width: window.innerWidth,
        height: window.innerHeight,
    })
    pixiApp.stage.addChild(backgroundTile)
}

export function generateMaptileSheet(pixiLoader) {
    let tileSheet = new PIXI.BaseTexture.from(pixiLoader.resources['tiles'].url)
    let tileWidth = 32
    let tileHeight = 32
    tileSheet['grass'] = new PIXI.Texture(tileSheet, new PIXI.Rectangle(tileWidth, 0, tileWidth, tileHeight))
    tileSheet['stone'] = new PIXI.Texture(tileSheet, new PIXI.Rectangle(0, 0, tileWidth, tileHeight))

    return tileSheet
}

export function buildTileMap(tileSheet) {
    let tilemap = new Tilemap(tileSheet)
    Object.values(metamap.mapData.tiles).forEach((tile) => {
        tilemap.tile(tileSheet[tile.type], tile.x, tile.y)
    })

    return tilemap
}