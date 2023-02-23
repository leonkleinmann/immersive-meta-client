import * as PIXI from "pixi.js";
import store from "@/store";
import BaseTile from "@/components/world/tile/BaseTile";
import ExitObject from "@/components/world/object/ExitObject";
import CommonObject from "@/components/world/object/CommonObject";
import AnimatedObject from "@/components/world/object/AnimatedObject";
import InteractiveObject from "@/components/world/object/InteractiveObject";
import InteractiveContainer from "@/components/world/object/InteractiveContainer";

export default class VirtualRoom extends PIXI.Container {
  interactiveObjects = [];
  collidableObjects = []

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

    this.buildBackground();
    this.addChild(this.backgroundContainer);

    this.addExits();
    store.commit("setIsLoading", false);
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
      if (object.__t === "common_object") {
        const objectTexture = store.getters.textures[object.texture.type];
        let commonObject = new CommonObject(
          object.x * this.tileSize,
          object.y * this.tileSize,
          object.texture.width,
          object.texture.height,
          objectTexture
        );
        this.collidableObjects.push(commonObject)
        this.addChild(commonObject);
      }
      if (object.__t === "animated_object") {
        let animatedObject = new AnimatedObject(
          object.x * this.tileSize,
          object.y * this.tileSize,
          object.animation.identifier
        );
        this.addChild(animatedObject);
      }
      if (object.__t === "interactive_object") {
        let interactiveObject = new InteractiveObject(
          0,
          0,
          object.animation.identifier,
          object.content.html
        );
        let interactiveContainer = new InteractiveContainer(
          object.x * this.tileSize,
          object.y * this.tileSize,
          interactiveObject
        );
        this.interactiveObjects.push(interactiveObject);
        this.collidableObjects.push(interactiveObject)
        this.addChild(interactiveContainer);
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
      store.state.exitObjects.push(exitObject);
      this.addChild(exitObject);
    });
  }

  getInteractiveObjects() {
    return this.interactiveObjects;
  }

  getCollidableObjects() {
    return this.collidableObjects
  }
}
