import * as PIXI from "pixi.js";
import store from "@/store";
import gsap from "gsap";
import ExitObject from "@/components/world/object/ExitObject";

export const Directions = Object.freeze({
  NORTH: "north",
  EAST: "east",
  SOUTH: "south",
  WEST: "west",
});

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
    this.loop = true;
    this.buildAvatarIdleSheet();
    this.textures = this.avatarIdleSheet["south"];
  }

  buildAvatarIdleSheet() {
    const textures = store.getters.textures;
    const gender = store.getters.setupData.gender;

    Object.keys(Directions).forEach((direction) => {
      this.avatarIdleSheet[Directions[direction]] = [
        textures[`${gender}_idle_${Directions[direction]}`],
      ];
    });
  }

  move(x, y, direction, callback) {
    if (!this.playing && !this.willCollide(x, y)) {
      const walkAnimation = this.animations[`${this.gender}_walk_${direction}`];
      this.textures = walkAnimation;
      this.animationSpeed = 1 / walkAnimation.length;
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
          if (typeof callback === "function") {
            callback(x, y, direction);
          }
        },
      });
    }
  }

  willCollide(x, y) {
    let willColide = false;
    let tile = this.parent.getTile(x, y);

    if (tile !== null && tile !== undefined && !(tile instanceof ExitObject)) {
      willColide = true;
    }

    return willColide;
  }

  willStayInside(x, y) {
    return (
      x >= 0 &&
      x < this.parent.roomWidth &&
      y >= 0 &&
      y < this.parent.roomHeight
    );
  }
}
