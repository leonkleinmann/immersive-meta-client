import ServerConnector from "@/connectors/server";
import Movable, { Directions } from "@/components/world/avatar/Movable";
import store from "@/store";

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
          const objects = this.parent.getInteractiveObjects();
          objects.forEach((object) => {
            if (object.canInteract(this)) {
              store.commit("setModalContent", object.content);
              store.commit("setModalOpen", true);
            }
          });
        }
      },
      false
    );
  }

  moveToDirection(direction) {
    if (!this.playing) {
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
        this.notifyServer(toX, toY, direction);
        this.move(toX, toY, direction);
      }
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
