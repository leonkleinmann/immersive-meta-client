import * as PIXI from "pixi.js";

export default class AvatarContainer extends PIXI.Container {
  constructor(username, link) {
    super();
    this.username = username;
    this.link = link;
    this.build();
  }

  build() {
    let background = new PIXI.Sprite(PIXI.Texture.WHITE);
    background.width = 120;
    background.height = 40;
    background.x = 0;
    background.y = 0;
    background.zIndex = 2
    background.alpha = 0.5
    this.addChild(background);

    const gr = new PIXI.Graphics();
    gr.beginFill(0x228b22);
    gr.drawCircle(20, 20, 10);
    gr.endFill();
    this.addChild(gr);

    const username = new PIXI.Text(this.username, {
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
