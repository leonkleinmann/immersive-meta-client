import ServerConnector from "@/connectors/server";
import Movable, { Directions } from "@/components/world/avatar/Movable";

export default class Avatar extends Movable {
  constructor(x, y, gender, username, link) {
    super(x, y, gender, username, link);
    this.registerKeyEvents();
    this.zIndex = 10;
  }

  registerKeyEvents() {
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.code === "ArrowUp" || event.code === "KeyW") {
          this.moveToDirection(Directions.NORTH);
        }
        if (event.code === "ArrowRight" || event.code === "KeyD") {
          this.moveToDirection(Directions.EAST);
        }
        if (event.code === "ArrowDown" || event.code === "KeyS") {
          this.moveToDirection(Directions.SOUTH);
        }
        if (event.code === "ArrowLeft" || event.code === "KeyA") {
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

  hitTestRectangle(a, b) {
    const aBounds = a.getBounds();
    const bBounds = b.getBounds();
    let result = false;

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

  notifyServer(x, y, direction) {
    ServerConnector.getInstance().sendMessage("AVATAR_STATE_UPDATE", {
      x,
      y,
      direction,
    });
  }
}
