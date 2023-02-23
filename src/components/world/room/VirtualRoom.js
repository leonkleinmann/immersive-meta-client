import * as PIXI from "pixi.js";
import store from "@/store";
import BaseTile from "@/components/world/tile/BaseTile";
import ExitObject from "@/components/world/object/ExitObject";
import CommonObject from "@/components/world/object/CommonObject";
import AnimatedObject from "@/components/world/object/AnimatedObject";
import InteractiveObject from "@/components/world/object/InteractiveObject";

export default class VirtualRoom extends PIXI.Container {
  tiles = [];
  interactiveObjects = [];
  exitObjects = [];

  constructor(roomData) {
    super();
    store.commit("setIsLoading", true);

    this.roomData = roomData;
    this.tileSize = store.getters.settingsData.tileSize;
    this.x = window.innerWidth / 2 - (roomData.width * this.tileSize) / 2;
    this.y = window.innerHeight / 2 - (roomData.height * this.tileSize) / 2;

    this.roomWidth = roomData.width * this.tileSize;
    this.roomHeight = roomData.height * this.tileSize;

    this.sortableChildren = true;

    let backgroundContainer = new PIXI.Container();
    backgroundContainer.x = 0;
    backgroundContainer.y = 0;
    backgroundContainer.cacheAsBitmap = true;
    this.backgroundContainer = backgroundContainer;

    this.buildTileMap();
    this.buildBackground();
    this.addChild(this.backgroundContainer);
    this.addExits();

    store.commit("setIsLoading", false);
  }

  buildTileMap() {
    console.log("ROOM WIDTH / HEIGHT", this.roomWidth, this.roomHeight);
    for (let y = 0; y < this.roomHeight / this.tileSize; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.roomWidth / this.tileSize; x++) {
        this.tiles[y][x] = null;
      }
    }
    console.log("TILEMAP CREATED", this.tiles.length, this.tiles[0].length);
  }

  buildBackground() {
    const backgroundTexture =
      store.getters.textures[this.roomData.base_texture.type];

    for (let x = 0; x < this.roomWidth; x = x + this.tileSize) {
      for (let y = 0; y < this.roomHeight; y = y + this.tileSize) {
        this.backgroundContainer.addChild(
          new BaseTile(
            x,
            y,
            this.tileSize,
            this.tileSize,
            backgroundTexture,
            -1
          )
        );
      }
    }
  }

  addObjects() {
    const objectData = this.roomData.objects;
    objectData.forEach((object) => {
      let toAdd = null;

      if (object.__t === "common_object") {
        const objectTexture = store.getters.textures[object.texture.type];
        toAdd = new CommonObject(
          object.x * this.tileSize,
          object.y * this.tileSize,
          object.texture.width,
          object.texture.height,
          objectTexture
        );
      }
      if (object.__t === "animated_object") {
        toAdd = new AnimatedObject(
          object.x * this.tileSize,
          object.y * this.tileSize,
          object.animation.identifier
        );
      }
      if (object.__t === "interactive_object") {
        toAdd = new InteractiveObject(
          object.x * this.tileSize,
          object.y * this.tileSize,
          object.animation.identifier,
          object.content.html
        );
      }

      if (toAdd !== null) {
        this.addChild(toAdd);

        let toAddBounds = toAdd.getBounds();
        let n_width = toAddBounds.width;
        let n_height = toAddBounds.height;
        for (
          let i = toAdd.x;
          i < toAdd.x + Math.round(n_width);
          i = i + this.tileSize
        ) {
          for (
            let j = toAdd.y;
            j < toAdd.y + Math.round(n_height);
            j = j + this.tileSize
          ) {
            this.tiles[i / this.tileSize][j / this.tileSize] = toAdd;
          }
        }
      }
    });
  }

  addExits() {
    this.roomData.exits.forEach((exit) => {
      let exitTexture = store.getters.textures[exit.texture.type];

      let exitObject = new ExitObject(
        exit.x * this.tileSize,
        exit.y * this.tileSize,
        this.tileSize,
        this.tileSize,
        exitTexture,
        exit.next_room
      );
      this.exitObjects.push(exitObject);
      this.addChild(exitObject);
    });
  }

  getTile(x, y) {
    return this.tiles[y / this.tileSize][x / this.tileSize];
  }

  getExitObjects() {
    return this.exitObjects;
  }
}
