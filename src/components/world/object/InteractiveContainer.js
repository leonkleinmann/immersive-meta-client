import * as PIXI from "pixi.js";
import store from "@/store";

export default class InteractiveObjectContainer extends PIXI.Container {
  constructor(x, y, interactiveObject) {
    super();

    this.position.set(x, y);

    const circle = new PIXI.Graphics()
      .beginFill(0x228b22)
      .drawCircle(20, 20, 10)
      .endFill();
    circle.position.set(
      interactiveObject.x / 2 - circle.x / 2,
      interactiveObject.y - store.getters.settingsData.tileSize
    );
    this.addChild(circle, interactiveObject);
  }
}
