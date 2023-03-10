import * as PIXI from "pixi.js";
import store from "@/store";
import BaseTile from "@/components/world/tile/BaseTile";
import ExitObject from "@/components/world/object/ExitObject";
import CommonObject from "@/components/world/object/CommonObject";
import AnimatedObject from "@/components/world/object/AnimatedObject";
import InteractiveObject from "@/components/world/object/InteractiveObject";
import NPC from "@/components/world/npc/NPC";
import AnimatedTile from "@/components/world/tile/AnimatedTile";

/**
 * Class which represents virtual rooms
 */
export default class VirtualRoom extends PIXI.Container {
  tiles = [];
  exitObjects = [];
  interactiveEntities = [];

  /**
   * Constructor of VirtualRoom
   * @param roomData data of the room
   */
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
    backgroundContainer.position.set(0, 0);
    backgroundContainer.cacheAsBitmap = true;
    this.backgroundContainer = backgroundContainer;

    this.buildTileMap();
    this.buildBackground();

    this.addTiles();
    this.addObjects();
    this.addExits();
    this.addNpcs();

    this.addChild(this.backgroundContainer);

    store.commit("setIsLoading", false);
  }

  /**
   * function which builds the tile map which is mandatory for collision checking etc.
   */
  buildTileMap() {
    for (let y = 0; y < this.roomHeight / this.tileSize; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.roomWidth / this.tileSize; x++) {
        this.tiles[y][x] = null;
      }
    }
  }

  /**
   * function which will create and draw the background of this room
   */
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

  /**
   * function which adds the tiles to the rooom
   */
  addTiles() {
    const tiles = this.roomData.tiles;
    tiles.forEach((tile) => {
      if (tile.__t === "base_tile") {
        const texture = store.getters.textures[tile.texture.type];
        this.backgroundContainer.addChild(
          new BaseTile(
            tile.x * this.tileSize,
            tile.y * this.tileSize,
            tile.texture.width,
            tile.texture.height,
            texture
          )
        );
      }
      if (tile.__t === "animated_tile") {
        this.addChild(
          new AnimatedTile(tile.x, tile.y, tile.animation.identifier)
        );
      }
    });
  }

  /**
   * function which will add any map object to the room (common objects, animated objects, ..)
   */
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
        this.interactiveEntities.push(toAdd);
      }

      if (toAdd !== null) {
        this.addChild(toAdd);
        if (toAdd instanceof InteractiveObject) {
          toAdd.buildAnimation();
        }
        this.addToTilemap(toAdd)
      }
    });
  }

  /**
   * function which will add exits to the room
   */
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

  /**
   * function which will add npcs to the room
   */
  addNpcs() {
    this.roomData.npcs.forEach((npc) => {
      let npcToAdd = new NPC(
        npc.x * this.tileSize,
        npc.y * this.tileSize,
        npc.animation_identifier,
        npc.name,
        npc.chain.commands
      );
      this.interactiveEntities.push(npcToAdd);
      this.addChild(npcToAdd);
      npcToAdd.buildAnimation();
      this.addToTilemap(npcToAdd)
    });
  }

  /**
   * function whoch will add entries to the tilemap and calculates which places it will take
   * @param toAdd object to add
   */
  addToTilemap(toAdd) {
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

  /**
   * create a matrix of the tile map
   * 0 = empty tile
   * 1 = object on the tile
   * @returns {*[]}
   */
  createMatrix() {
    let array = this.tiles;
    const matrix = [];
    for (let y = 0; y < array.length; y++) {
      matrix[y] = [];
      for (let x = 0; x < array[y].length; x++) {
        matrix[y][x] = array[y][x] === null ? 0 : 1;
      }
    }
    return matrix;
  }

  /**
   * function which returns the object on a tile
   * @param x x-position of tile
   * @param y y-position of tile
   * @returns {*} room object
   */
  getTile(x, y) {
    return this.tiles[x / this.tileSize][y / this.tileSize];
  }

  /**
   * function which returns exits of a room
   * @returns {*[]} array with exits which lead out of room
   */
  getExitObjects() {
    return this.exitObjects;
  }

  /**
   * function which returns interactive entities of the room
   * @returns {*[]}  array with interactive entities (interactive object, npc, ..)
   */
  getInteractiveEntities() {
    return this.interactiveEntities;
  }
}
