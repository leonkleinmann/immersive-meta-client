import * as PIXI from "pixi.js";
import store from "@/store";
import BaseTile from "@/components/world/tile/BaseTile";

export default class VirtualRoom extends PIXI.Container {
  constructor(roomData, tileSize) {
    super();
    console.log('ROOM_DATA', roomData);
    this.roomData = roomData;
    this.tileSize = tileSize;
    this.x = window.innerWidth / 2 - (roomData.width * tileSize) / 2;
    this.y = window.innerHeight / 2 - (roomData.height * tileSize) / 2;

    this.roomWidth = roomData.width * tileSize;
    this.roomHeight = roomData.height * tileSize;

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
