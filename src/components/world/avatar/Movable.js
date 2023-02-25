import * as PIXI from "pixi.js";
import store from "@/store";
import gsap from "gsap";
import ExitObject from "@/components/world/object/ExitObject";
import AvatarInfoContainer from "@/components/world/avatar/AvatarContainer";

export const Directions = Object.freeze({
  NORTH: "north",
  EAST: "east",
  SOUTH: "south",
  WEST: "west",
});

export default class Movable extends PIXI.AnimatedSprite {
  constructor(x, y, gender, username, link, direction = "south") {
    super([PIXI.Texture.WHITE]);
    this.x = x;
    this.y = y;
    this.gender = gender;
    this.username = username;
    this.link = link;
    this.tileSize = store.getters.settingsData.tileSize;
    this.avatarIdleSheet = {};
    this.animations = store.getters.animations;
    this.zIndex = 9;
    this.loop = true;
    this.buildAvatarIdleSheet();
    this.textures = this.avatarIdleSheet[direction];
  }

  addInfoContainer() {
    this.info = new AvatarInfoContainer(this.username, this.link);
    this.info.position.set(
      this.x - 60 + this.tileSize / 2,
      this.y - this.tileSize
    );
    this.parent.addChild(this.info);
  }

  removeInfoContainer() {
    this.parent.removeChild(this.info)
    this.info = undefined
  }

  buildAvatarIdleSheet() {
    const textures = store.getters.textures;
    const gender = store.getters.setupData.gender;

    for (const direction of Object.values(Directions)) {
      this.avatarIdleSheet[direction] = [
        textures[`${gender}_idle_${direction}`],
      ];
    }
  }

  move(x, y, direction, callback) {
    if (!this.playing && !this.willCollide(x, y)) {
      const walkAnimation = this.animations[`${this.gender}_walk_${direction}`];
      this.textures = walkAnimation;
      this.animationSpeed = 1 / walkAnimation.length;

      let timeline = new gsap.timeline({
        onStart: function() {
          console.log("Die Timeline wurde gestartet");
        },
        onComplete: function() {
          console.log("Die Timeline wurde abgeschlossen");
        }
      });
      timeline.to(this, {
        onStart: () => {
          this.play();
          if (typeof callback === "function") {
            callback(x, y, direction);
          }
        },
        x: x,
        y: y,
        duration: 0.5,
        onComplete: () => {
          this.stop();
          this.textures = this.avatarIdleSheet[direction];
        }
      }, 0)
      if (this.info) {
        timeline.to(this.info, {
          x: x - 60 + this.tileSize / 2,
          y: y - this.tileSize,
        }, 0)
      }
      timeline.play()
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
