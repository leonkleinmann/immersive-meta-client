import ServerConnector from "@/connectors/server";
import Movable, { Directions } from "@/components/world/avatar/Movable";
import store from "@/store";
import InteractiveObject from "@/components/world/object/InteractiveObject";

export default class Avatar extends Movable {
  constructor(x, y, gender) {
    super(x, y, gender);
    this.registerKeyEvents();
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
          let triggerTile = undefined;

          let northTile = this.parent.getTile(this.x, this.y - this.tileSize);
          let eastTile = this.parent.getTile(this.x + this.tileSize, this.y);
          let southTile = this.parent.getTile(this.x, this.y + this.tileSize);
          let westTile = this.parent.getTile(this.x - this.tileSize, this.y);

          if (northTile instanceof InteractiveObject) {
            triggerTile = northTile;
          }
          if (eastTile instanceof InteractiveObject) {
            triggerTile = eastTile;
          }
          if (southTile instanceof InteractiveObject) {
            triggerTile = southTile;
          }
          if (westTile instanceof InteractiveObject) {
            triggerTile = westTile;
          }
          if (triggerTile !== undefined) {
            store.commit("setModalContent", triggerTile.content);
            store.commit("setModalOpen", true);
          }
        }
      },
      false
    );
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
