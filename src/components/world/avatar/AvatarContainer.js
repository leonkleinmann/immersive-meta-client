import * as PIXI from "@pixi/animate";

export default class AvatarContainer extends PIXI.Container {
  constructor(avatar, username, link) {
    super();
    this.avatar = avatar;
    this.username = username;
    this.link = link;

    this.build()
  }

  build() {
      var bg = new PIXI.Sprite(PIXI.Texture.WHITE);
      bg.width = 100;
      bg.height = 50;
      bg.tint = 0xff0000;
      bg.x = 0
      bg.y = 0
  }
}
