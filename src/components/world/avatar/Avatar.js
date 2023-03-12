import ServerConnector from "@/connectors/server";
import Movable, { Directions } from "@/components/world/avatar/Movable";

/**
 * Class Avatar represents the users avatar
 */
export default class Avatar extends Movable {
  /**
   * Constructor of Avatar
   * @param x position x
   * @param y position y
   * @param gender gender of the user
   * @param username username of the user
   * @param link link provided by the user
   */
  constructor(x, y, gender, username, link) {
    super(x, y, gender, username, link);
    this.registerKeyEvents();
    this.zIndex = 10;
  }

  /**
   * Function which registers buttons users can press and executes corresponding action
   */
  registerKeyEvents() {
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.code === "ArrowUp") {
          this.moveToDirection(Directions.NORTH);
        }
        if (event.code === "ArrowRight") {
          this.moveToDirection(Directions.EAST);
        }
        if (event.code === "ArrowDown") {
          this.moveToDirection(Directions.SOUTH);
        }
        if (event.code === "ArrowLeft") {
          this.moveToDirection(Directions.WEST);
        }
        if (event.code === "KeyX") {
          const interactiveObjects = this.parent.getInteractiveEntities();
          interactiveObjects.forEach((obj) => {
            if (this.hitTestRectangle(this, obj)) {
              obj.trigger();
            }
          });
        }
      },
      false
    );
  }

  /**
   * Function which checks whether two objects intersect
   * @param a object a
   * @param b object b
   * @returns {boolean} true if intersection; false if not
   */
  hitTestRectangle(a, b) {
    const aBounds = a.getBounds();
    const bBounds = b.getBounds();
    let result = false;

    if (
      aBounds.x === bBounds.x &&
      aBounds.y === bBounds.y &&
      aBounds.width === bBounds.width &&
      aBounds.height === bBounds.height
    ) {
      return false;
    }

    if (
      aBounds.x + aBounds.width >= bBounds.x &&
      aBounds.x <= bBounds.x + bBounds.width &&
      aBounds.y + aBounds.height >= bBounds.y &&
      aBounds.y <= bBounds.y + bBounds.height
    ) {
      result = true;
    }

    return result;
  }

  /**
   * Function which moves a character to another tile
   * @param direction direction of the movement
   */
  moveToDirection(direction) {
    let toX = this.x;
    let toY = this.y;

    switch (direction) {
      case Directions.NORTH:
        toY -= this.tileSize;
        break;
      case Directions.EAST:
        toX += this.tileSize;
        break;
      case Directions.SOUTH:
        toY += this.tileSize;
        break;
      case Directions.WEST:
        toX -= this.tileSize;
        break;
      default:
        return;
    }

    if (this.willStayInside(toX, toY)) {
      this.move(toX, toY, direction, this.notifyServer);
    }
  }

  /**
   * Function which will notify server about position updates of the avatar
   * @param x new x
   * @param y new y
   * @param direction direction of movement
   */
  notifyServer(x, y, direction) {
    ServerConnector.getInstance().sendMessage("AVATAR_STATE_UPDATE", {
      x,
      y,
      direction,
    });
  }
}
