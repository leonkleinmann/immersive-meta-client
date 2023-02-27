import * as PIXI from "pixi.js";
import InteractiveObject from "@/components/world/object/InteractiveObject";
import ExitObject from "@/components/world/object/ExitObject";
import NPC from "@/components/world/npc/NPC";

export default class MiniMap extends PIXI.Container {
  constructor(x, y, width, height, mirrorScene, avatar, ticker) {
    super();

    this.x = x;
    this.y = y;
    this.mapWidth = width;
    this.mapHeight = height;
    this.mirrorScene = mirrorScene;
    this.avatar = avatar;
    this.avatarGraphic = undefined;

    ticker.add(this.updateAvatar, this);
  }

  draw() {
    this.drawBackground()
    this.drawAvatar()
    this.drawEntities()
  }

  drawBackground() {
    //background
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, this.mapWidth, this.mapHeight);
    graphics.endFill();
    this.addChild(graphics);
  }

  drawAvatar() {
    let avatarGraphic = new PIXI.Graphics();
    avatarGraphic.beginFill(0xff0000);
    avatarGraphic.drawRect(0, 0, 10, 10);
    avatarGraphic.endFill();
    this.avatarGraphic = avatarGraphic;
    this.addChild(avatarGraphic);
  }

  drawEntities() {
    this.drawBackground()
    this.mirrorScene.children.forEach((child) => {
      if (child instanceof InteractiveObject) {
        let objectX = child.x * (this.mapWidth / this.mirrorScene.roomWidth);
        let objectY = child.y * (this.mapHeight / this.mirrorScene.roomHeight);

        let objectGraphic = new PIXI.Graphics();
        objectGraphic.beginFill(0x000000);
        objectGraphic.drawRect(objectX, objectY, 10, 10);
        objectGraphic.endFill();

        this.addChild(objectGraphic);
      }
      if (child instanceof ExitObject) {
        let exitX = child.x * (this.mapWidth / this.mirrorScene.roomWidth);
        let exitY = child.y * (this.mapHeight / this.mirrorScene.roomHeight);

        let objectGraphic = new PIXI.Graphics();
        objectGraphic.beginFill(0x00ff00);
        objectGraphic.drawRect(exitX, exitY, 10, 10);
        objectGraphic.endFill();

        this.addChild(objectGraphic);
      }
      if (child instanceof NPC) {
        let exitX = child.x * (this.mapWidth / this.mirrorScene.roomWidth);
        let exitY = child.y * (this.mapHeight / this.mirrorScene.roomHeight);

        let objectGraphic = new PIXI.Graphics();
        objectGraphic.beginFill(0x6495ED);
        objectGraphic.drawRect(exitX, exitY, 10, 10);
        objectGraphic.endFill();

        this.addChild(objectGraphic);
      }
    });
  }
  updateAvatar() {
    if (this.avatar !== undefined && this.avatarGraphic !== undefined) {
      let avatarX =
        this.avatar.x * (this.mapWidth / this.mirrorScene.roomWidth);
      let avatarY =
        this.avatar.y * (this.mapHeight / this.mirrorScene.roomHeight);

      this.avatarGraphic.x = avatarX;
      this.avatarGraphic.y = avatarY;
    }
  }
  setAvatar(avatar) {
    this.removeChild(this.avatar)
    this.avatar = avatar;
    this.drawAvatar()
  }
  setMirrorScene(mirrorScene) {
    this.mirrorScene = mirrorScene;
    this.removeChildren();
    this.drawEntities();
  }
}
