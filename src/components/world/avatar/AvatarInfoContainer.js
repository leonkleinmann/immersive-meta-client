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
    background.width = store.getters.settingsData.avatarInformationWidth;
    background.height = store.getters.settingsData.avatarInformationHeight;
    background.position.set(0, 0);
    background.alpha = 0.5;
    background.zIndex = 2;
    this.addChild(background);

    const status = new PIXI.Graphics();
    status.beginFill(0x228b22);
    status.drawCircle(15, 15, 8);
    status.endFill();
    this.addChild(status);

    const usernameText = new PIXI.Text(this.username, {
      fontFamily: "Helvetica",
      fontSize: 10,
      fill: "black",
      align: "center",
    });
    usernameText.position.set(this.width / 2 - (this.username.length / 2) * 5, 10);
    this.addChild(usernameText);

    const link = new PIXI.Sprite(store.getters.textures["link"]);
    link.width = 20;
    link.height = 20;
    link.position.set(this.width - 25, 5);
    link.interactive = true;
    link.on("click", () => {
      window.open(this.link, "_blank").focus();
    });
    this.addChild(link);
  }
}
