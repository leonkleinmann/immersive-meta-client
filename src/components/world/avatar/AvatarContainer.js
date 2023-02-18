import * as PIXI from "pixi.js";
import store from "@/store";

export default class AvatarContainer extends PIXI.Container {
  constructor() {
    super();
    this.build();
  }

  build() {
    let background = new PIXI.Sprite(PIXI.Texture.WHITE);
    background.width = 120;
    background.height = 40;
    background.x = 0;
    background.y = 0;
    this.addChild(background);

    const gr = new PIXI.Graphics();
    gr.beginFill(0x228b22);
    gr.drawCircle(20, 20, 10);
    gr.endFill();
    this.addChild(gr);

    const username = new PIXI.Text(store.getters.setupData.username, {
      fontFamily: "Helvetica",
      fontSize: 12,
      fill: "black",
      align: "center",
    });
    username.x = gr.x + 40;
    username.y = gr.y + 12;
    this.addChild(username);
  }
}
