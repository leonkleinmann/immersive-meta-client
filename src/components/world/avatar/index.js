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
    this.texture = store.getters.textures["male_idle_north"];
    this.textures = [this.texture];
    this.animationSpeed = 1 / store.getters.settingsData.avatarAnimationSize;
    this.loop = false;

    this.buildAvatarIdleSheet();
    this.buildAvatarWalkSheet();
    this.init();
  }

  buildAvatarIdleSheet() {
    const textures = store.getters.textures;
    const gender = store.getters.setupData.gender;

    this.avatarIdleSheet["north"] = [textures[gender + "_idle_north"]];
    this.avatarIdleSheet["east"] = [textures[gender + "_idle_east"]];
    this.avatarIdleSheet["south"] = [textures[gender + "_idle_south"]];
    this.avatarIdleSheet["west"] = [textures[gender + "_idle_west"]];
  }

  buildAvatarWalkSheet() {
    this.avatarWalkSheet["north"] = [];
    this.avatarWalkSheet["east"] = [];
    this.avatarWalkSheet["south"] = [];
    this.avatarWalkSheet["west"] = [];

    const gender = store.getters.setupData.gender;
    const animationSize = store.getters.settingsData.avatarAnimationSize;
    const textures = store.getters.textures;

    for (let i = 0; i < animationSize; i++) {
      this.avatarWalkSheet["north"].push(textures[gender + "_walk_south_" + i]);
      this.avatarWalkSheet["east"].push(textures[gender + "_walk_south_" + i]);
      this.avatarWalkSheet["south"].push(textures[gender + "_walk_south_" + i]);
      this.avatarWalkSheet["west"].push(textures[gender + "_walk_south_" + i]);
    }
  }

  init() {
    this.textures = this.avatarWalkSheet["north"];
  }

  moveNorth() {
    if (!this.playing) {
      this.textures = this.avatarWalkSheet["north"];
      this.animationSpeed = 1 / this.avatarWalkSheet["north"].length;
      this.play();
      gsap.to(this, {
        y: this.y - store.getters.settingsData.tileSize,
        duration: .5,
      });
    }
    //this.textures = this.avatarIdleSheet["north"]
  }
  moveEast() {
    if (!this.playing) {
      this.textures = this.avatarWalkSheet["east"];
      this.animationSpeed = 1 / this.avatarWalkSheet["east"].length;
      this.play();
      gsap.to(this, {
        x: this.x + store.getters.settingsData.tileSize,
        duration: .5,
      });
    }
    //this.textures = this.avatarIdleSheet["east"]
  }
  moveSouth() {
    if (!this.playing) {
      this.textures = this.avatarWalkSheet["south"];
      this.animationSpeed = 1 / this.avatarWalkSheet["south"].length;
      this.play();
      gsap.to(this, {
        y: this.y + store.getters.settingsData.tileSize,
        duration: .5,
      });
    }
  }
  moveWest() {
    if (!this.playing) {
      this.textures = this.avatarWalkSheet["west"];
      this.animationSpeed = 1 / this.avatarWalkSheet["west"].length;
      this.play();
      gsap.to(this, {
        x: this.x - store.getters.settingsData.tileSize,
        duration: .5,
      });
    }
    //this.textures = this.avatarIdleSheet["west"]
  }
}
