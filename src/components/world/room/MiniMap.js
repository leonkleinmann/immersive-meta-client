import * as PIXI from "pixi.js";
import Avatar from "@/components/world/avatar/Avatar";
import InteractiveObject from "@/components/world/object/InteractiveObject";
import ExitObject from "@/components/world/object/ExitObject";

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

    //this.scale.set(mirrorScene.roomWidth / this.mapWidth, mirrorScene.roomHeight / this.mapHeight)

    //background
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, this.mapWidth, this.mapHeight);
    graphics.endFill();

    this.addChild(graphics);

    this.drawEntities();
    ticker.add(this.updateAvatar, this);
  }

  drawEntities() {
    this.mirrorScene.children.forEach((child) => {
      if (child instanceof Avatar) {
        //let avatarX = child.x * (this.mapWidth / this.mirrorScene.roomWidth);
        //let avatarY = child.y * (this.mapHeight / this.mirrorScene.roomHeight);

        let avatarGraphic = new PIXI.Graphics();
        avatarGraphic.beginFill(0xff0000);
        avatarGraphic.drawRect(0, 0, 10, 10);
        avatarGraphic.endFill();
        this.avatarGraphic = avatarGraphic;
        this.addChild(avatarGraphic);
      }
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
    });
  }
  updateAvatar() {
    let avatarX = this.avatar.x * (this.mapWidth / this.mirrorScene.roomWidth);
    let avatarY =
      this.avatar.y * (this.mapHeight / this.mirrorScene.roomHeight);

    this.avatarGraphic.x = avatarX;
    this.avatarGraphic.y = avatarY;
  }
}
