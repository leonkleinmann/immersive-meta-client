import * as PIXI from "pixi.js";
import store from "@/store";

export default class AvatarInfoContainer extends PIXI.Container {
  constructor(username, link) {
    super();
    this.username = username;
    this.link = link;
    this.zIndex = 11;
    this.build();
  }

  build() {
    const background = new PIXI.Sprite(PIXI.Texture.WHITE);
    background.width = 120;
    background.height = 40;
    background.position.set(0, 0);
    background.alpha = 0.5;
    background.zIndex = 2;
    this.addChild(background);

    const status = new PIXI.Graphics();
    status.beginFill(0x228b22);
    status.drawCircle(20, 20, 10);
    status.endFill();
    this.addChild(status);

    const usernameText = new PIXI.Text(this.username, {
      fontFamily: "Helvetica",
      fontSize: 12,
      fill: "black",
      align: "center",
    });
    usernameText.position.set(status.x + 40, status.y + 12);
    this.addChild(usernameText);

    const link = new PIXI.Sprite(store.getters.textures["link"])
    link.width = 20
    link.height = 20
    link.x = usernameText.x + 55
    link.y = 10
    link.interactive = true
    link.on('click', () => {
      window.open(this.link, '_blank').focus();
    })
    this.addChild(link)

  }
}
