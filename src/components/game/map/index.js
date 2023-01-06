import * as PIXI from 'pixi.js'
import { Tilemap } from '@pixi/tilemap'
import * as metamap from './map.json'

/**
 *
 * @param pixiApp
 * @param pixiLoader
 * @returns {Tilemap}
 */
export function buildTileMap(pixiApp, pixiLoader) {
    const tilemap = new Tilemap([PIXI.Texture.from(pixiLoader.resources['tiles'].url).baseTexture])
    Object.values(metamap.mapData.tiles).forEach((tile) => {
        tilemap.tile('/assets/tiles/' + tile.type + '.png', tile.x, tile.y)
    })

    return tilemap
}