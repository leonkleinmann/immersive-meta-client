import store from "@/store";
import Tile from "@/components/game/tile";
import * as PIXI from "pixi.js";
import { Tilemap } from "@pixi/tilemap";
import { AnimatedSprite } from "pixi.js";

export default class VirtualWorld {
  tiles = [];
  objects = [];

  constructor(assetManager) {
    this.tileMap = new Tilemap([]);
    this.assetManager = assetManager;
    this.buildMap();
  }

  buildMap() {
    let mapData = store.getters.mapData;

    this.background = PIXI.TilingSprite.from(
      this.assetManager.getTexture(mapData.background),
      {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    );

    mapData.tiles.forEach((tile) => {
      this.tiles.push(
        new Tile(tile.x, tile.y, this.assetManager.getTexture(tile.type))
      );
    });
    mapData.objects.forEach((obj) => {
      if (obj.animated) {
        let animatedSprite = new AnimatedSprite(
          this.assetManager.getCorrespondingTextures(obj.type)
        );
        animatedSprite.x = obj.x * store.getters.settings.tileSize;
        animatedSprite.y = obj.y * store.getters.settings.tileSize;
        animatedSprite.width = store.getters.settings.tileSize;
        animatedSprite.height = store.getters.settings.tileSize;
        animatedSprite.animationSpeed = 1 / 15;
        animatedSprite.play();
        this.objects.push(animatedSprite);
      }
    });
  }

  renderMap(pixiApp) {
    this.tiles.forEach((tile) => {
      this.tileMap.setTileset(tile.getTexture().baseTexture);
      this.tileMap.tile(
        tile.getTexture(),
        tile.getX() * store.getters.settings.tileSize,
        tile.getY() * store.getters.settings.tileSize
      );
    });

    pixiApp.stage.addChild(this.background);
    pixiApp.stage.addChild(this.tileMap);

    this.objects.forEach((obj) => {
      pixiApp.stage.addChild(obj);
    });
  }
}
