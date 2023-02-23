import * as PIXI from "pixi.js";
import store from "@/store";
import gsap from "gsap";

export default class Movable extends PIXI.AnimatedSprite {
  constructor(x, y, gender) {
    super([PIXI.Texture.WHITE]);
    this.x = x;
    this.y = y;
    this.gender = gender;

    this.tileSize = store.getters.settingsData.tileSize;
    this.avatarIdleSheet = {};
    this.animations = store.getters.animations;

    this.zIndex = 9;
    this.loop = false;

    this.buildAvatarIdleSheet();

    this.textures = this.avatarIdleSheet["south"];
  }

  buildAvatarIdleSheet() {
    const textures = store.getters.textures;
    const gender = store.getters.setupData.gender;

    this.avatarIdleSheet["north"] = [textures[gender + "_idle_north"]];
    this.avatarIdleSheet["east"] = [textures[gender + "_idle_east"]];
    this.avatarIdleSheet["south"] = [textures[gender + "_idle_south"]];
    this.avatarIdleSheet["west"] = [textures[gender + "_idle_west"]];
  }

  move(x, y, direction) {
    if (!this.willCollide(x, y)) {
      this.textures = this.animations[this.gender + "_walk_" + direction];
      this.animationSpeed =
        1 / this.animations[this.gender + "_walk_" + direction].length;

      gsap.to(this, {
        onStart: () => {
          this.play();
        },
        x: x,
        y: y,
        duration: 0.5,
        onComplete: () => {
          this.stop();
          this.textures = this.avatarIdleSheet[direction];
        },
      });
    }
  }

  willCollide(x, y) {
    let collide = false;

    const collidableObjects = this.parent.getCollidableObjects();
    collidableObjects.forEach((object) => {
      const objectBounds = object.getBounds();


      console.log(
          x,
          y,
          "/",
          object.x,
          object.y,
          objectBounds.width,
          objectBounds.height
      );
      if (
        x >= object.x &&
        x < object.x + objectBounds.width &&
        y >= object.y &&
        y < object.y + objectBounds.height
      ) {
        collide = true;
      }
    });

    console.log("collide", collide);
    return collide;
  }

  willStayInside(x, y) {
    let intersection = false;
    if (
      x >= 0 &&
      x < this.parent.roomWidth &&
      y >= 0 &&
      y < this.parent.roomHeight
    ) {
      intersection = true;
    }
    return intersection;
  }
}
