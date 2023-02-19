import * as PIXI from "pixi.js";
import store from "@/store";
import gsap from "gsap";

export default class Avatar extends PIXI.AnimatedSprite {
  constructor(x, y) {
    super([PIXI.Texture.WHITE]);
    this.avatarWalkSheet = {};
    this.avatarIdleSheet = {};
    this.x = x;
    this.y = y;
    this.gender = store.getters.setupData.gender;
    this.texture = store.getters.textures["male_idle_north"];
    this.textures = [this.texture];
    this.animationSpeed = 1 / store.getters.settingsData.avatarAnimationSize;
    this.loop = false;

    this.buildAvatarIdleSheet();
    this.textures = store.getters.animations["male_walk_south"];
  }

  buildAvatarIdleSheet() {
    const textures = store.getters.textures;
    const gender = store.getters.setupData.gender;

    this.avatarIdleSheet["north"] = [textures[gender + "_idle_north"]];
    this.avatarIdleSheet["east"] = [textures[gender + "_idle_east"]];
    this.avatarIdleSheet["south"] = [textures[gender + "_idle_south"]];
    this.avatarIdleSheet["west"] = [textures[gender + "_idle_west"]];
  }

  moveNorth() {
    if (!this.playing) {
      this.textures = store.getters.animations[this.gender + "_walk_north"];
      this.animationSpeed =
        1 / store.getters.animations[this.gender + "_walk_north"].length;
      this.play();
      gsap.to(this, {
        y: this.y - store.getters.settingsData.tileSize,
        duration: 0.5,
        onComplete: () => {
          this.textures = this.avatarIdleSheet["north"];
        },
      });
    }
  }
  moveEast() {
    if (!this.playing) {
      this.textures = store.getters.animations[this.gender + "_walk_east"];
      this.animationSpeed =
        1 / store.getters.animations[this.gender + "_walk_east"].length;
      this.play();
      gsap.to(this, {
        x: this.x + store.getters.settingsData.tileSize,
        duration: 0.5,
        onComplete: () => {
          this.textures = this.avatarIdleSheet["east"];
        },
      });
    }
  }
  moveSouth() {
    if (!this.playing) {
      this.textures = store.getters.animations[this.gender + "_walk_south"];
      this.animationSpeed =
        1 / store.getters.animations[this.gender + "_walk_south"].length;
      this.play();
      gsap.to(this, {
        y: this.y + store.getters.settingsData.tileSize,
        duration: 0.5,
        onComplete: () => {
          this.textures = this.avatarIdleSheet["south"];
        },
      });
    }
  }
  moveWest() {
    if (!this.playing) {
      this.textures = store.getters.animations[this.gender + "_walk_west"];
      this.animationSpeed =
        1 / store.getters.animations[this.gender + "_walk_west"].length;
      this.play();
      gsap.to(this, {
        x: this.x - store.getters.settingsData.tileSize,
        duration: 0.5,
        onComplete: () => {
          this.textures = this.avatarIdleSheet["west"];
        },
      });
    }
  }
}
