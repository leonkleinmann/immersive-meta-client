import * as PIXI from "pixi.js";
import store from "@/store";
export default class extends PIXI.Container {
  constructor(x, y, interactiveObject) {
    super();

    this.x = x;
    this.y = y;

    const gr = new PIXI.Graphics();
    gr.beginFill(0x228b22);
    gr.drawCircle(20, 20, 10);
    gr.endFill();
    this.addChild(gr);

    gr.x = interactiveObject.x / 2 - gr.x / 2;
    gr.y = interactiveObject.y - store.getters.settingsData.tileSize;

    this.addChild(interactiveObject);
  }
}
