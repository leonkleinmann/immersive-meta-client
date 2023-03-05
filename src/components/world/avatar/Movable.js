import * as PIXI from "pixi.js";
import store from "@/store";
import gsap from "gsap";
import PF from "pathfinding";
import AvatarInfoContainer from "@/components/world/avatar/AvatarInfoContainer";
import AvatarMediaContainer from "@/components/world/avatar/AvatarMediaContainer";
import ExitObject from "@/components/world/object/ExitObject";

/**
 * Enumaration of possible walking directions for movable objects
 * @type {Readonly<{NORTH: string, WEST: string, SOUTH: string, EAST: string}>}
 */
export const Directions = Object.freeze({
  NORTH: "north",
  EAST: "east",
  SOUTH: "south",
  WEST: "west",
});

/**
 * Class Movable which represents any movable entity like avatars, client avatars or npcs
 */
export default class Movable extends PIXI.AnimatedSprite {
  /**
   * Constructor of Movable
   * @param x x-position of movable
   * @param y y-position of movable
   * @param gender gender of movable
   * @param username username of movable
   * @param link link provided by movable
   * @param direction initial direction movable is looking to
   */
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
    this.height = this.tileSize;
    this.width = this.tileSize;
  }

  /**
   * adds an info container to movable, needed for avatars and client avatars to represent corresponding information
   */
  addInfoContainer() {
    this.info = new AvatarInfoContainer(this.username, this.link);
    this.info.position.set(
      this.x -
        store.getters.settingsData.avatarInformationWidth / 2 +
        this.tileSize / 2,
      this.y - this.tileSize
    );
    this.parent.addChild(this.info);
  }

  /**
   * adds a video container to movable to display webcam video, needed for avatars and client avatars
   * @param id
   */
  addVideoContainer(id, direction) {
    if (!this.video) {
      this.video = new AvatarMediaContainer(id);

      let videoX = 0;
      let videoY = 0;

      console.log("DIRECTION", direction);
      if (direction === "LEFT") {
        videoX = this.x - store.getters.settingsData.avatarMediaWidth;
        videoY = this.y - this.getBounds().height / 2;
      }

      if (direction === "RIGHT") {
        videoX = this.x + this.getBounds().width;
        videoY = this.y - this.getBounds().height / 2;
      }
      if (direction === "UP") {
        videoX =
          this.x -
          store.getters.settingsData.avatarMediaWidth / 2 +
          this.tileSize / 2;

        videoY = this.info.y - 60;
      }
      if (direction === "DOWN") {
        videoX = this.x - store.getters.settingsData.avatarMediaWidth / 2;
        videoY = this.y + this.getBounds().height;
      }

      this.video.position.set(videoX, videoY);

      // update container position while communicating
      this.info.x = this.video.x;
      this.info.y = this.video.y + 60;

      this.parent.addChild(this.video);
    }
  }

  /**
   *  remove the info container
   */
  removeInfoContainer() {
    if (this.info) {
      this.parent.removeChild(this.info);
      this.info = undefined;
    }
  }

  /**
   * remove video container
   */
  removeVideoContainer() {
    if (this.video) {
      this.parent.removeChild(this.video);
      this.video = undefined;
      this.info.x =
        this.x -
        store.getters.settingsData.avatarInformationWidth / 2 +
        this.tileSize / 2;
      this.info.y = this.y - this.tileSize;
    }
  }

  /**
   * functiin which creates the idle sprite sheet for movables
   */
  buildAvatarIdleSheet() {
    const textures = store.getters.textures;
    const gender = store.getters.setupData.gender;

    for (const direction of Object.values(Directions)) {
      this.avatarIdleSheet[direction] = [
        textures[`${gender}_idle_${direction}`],
      ];
    }
  }

  /**
   * Function which moves the movable to a (x,y)-position by tweening
   * @param x new x-position
   * @param y new y-position
   * @param direction direction the movable should look to
   * @param callback callback function can be executed before beginning moving
   * @returns {Promise<void>} returns promise caller can wait for
   */
  async move(x, y, direction, callback) {
    if (!this.playing && !this.willCollide(x, y)) {
      const walkAnimation = this.animations[`${this.gender}_walk_${direction}`];
      this.textures = walkAnimation;
      this.animationSpeed = 1 / walkAnimation.length;

      let timeline = new gsap.timeline();
      timeline.to(
        this,
        {
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
          },
        },
        0
      );
      if (this.info) {
        timeline.to(
          this.info,
          {
            x:
              x -
              store.getters.settingsData.avatarInformationWidth / 2 +
              this.tileSize / 2,
            y: y - this.tileSize,
            duration: 0.5,
          },
          0
        );
      }
      await timeline.play();
    }
  }

  /**
   * function which finds a path to given (x,y)-position
   * @param xEnd aim x-position
   * @param yEnd aim y-position
   * @returns {Array<Array<number>>} returns array containing arrays with (x,y) pairs
   */
  findPath(xEnd, yEnd) {
    let matrix = this.parent.createMatrix();
    let grid = new PF.Grid(matrix);
    let finder = new PF.AStarFinder();
    return finder.findPath(
      this.x / this.tileSize,
      this.y / this.tileSize,
      xEnd,
      yEnd,
      grid
    );
  }

  /**
   * Function which checks if movable collides with object
   * @param x desired x-position
   * @param y y-position
   * @returns {boolean} true, if collision; false, if not.
   */
  willCollide(x, y) {
    let willColide = false;
    let tile = this.parent.getTile(x, y);

    if (tile !== null && tile !== undefined && !(tile instanceof ExitObject)) {
      willColide = true;
    }

    return willColide;
  }

  /**
   * Function which checks if user will stay inside room
   * @param x desired x-position
   * @param y desired y-position
   * @returns {boolean} true, if movable stays inside; false otherweise
   */
  willStayInside(x, y) {
    return (
      x >= 0 &&
      x < this.parent.roomWidth &&
      y >= 0 &&
      y < this.parent.roomHeight
    );
  }
}
