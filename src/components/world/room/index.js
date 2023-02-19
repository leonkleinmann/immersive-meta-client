import * as PIXI from "pixi.js";
import store from "@/store";
import BaseTile from "@/components/world/tile/BaseTile";

export default class VirtualRoom extends PIXI.Container {
  constructor(roomData) {
    super();
    this.roomData = roomData;
    this.tileSize = store.getters.settingsData.tileSize;
    this.x = window.innerWidth / 2 - (roomData.width * this.tileSize) / 2;
    this.y = window.innerHeight / 2 - (roomData.height * this.tileSize) / 2;

    this.roomWidth = roomData.width * this.tileSize;
    this.roomHeight = roomData.height * this.tileSize;

    this.buildBackground();
  }

  buildBackground() {
    const backgroundTexture =
      store.getters.textures[this.roomData.base_texture.type];

    for (let x = 0; x < this.roomWidth; x = x + this.tileSize) {
      for (let y = 0; y < this.roomHeight; y = y + this.tileSize) {
        this.addChild(
          new BaseTile(x, y, this.tileSize, this.tileSize, backgroundTexture)
        );
      }
    }
  }
}
