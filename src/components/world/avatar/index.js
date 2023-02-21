import ServerConnector from "@/connectors/server";
import Movable from "@/components/world/avatar/Movable";

export default class Avatar extends Movable {
  constructor(x, y, gender) {
    super(x, y, gender);
  }

  moveNorth() {
    if (!this.playing && this.willStayInside(this.x, this.y - this.tileSize)) {

      const toX = this.x;
      const toY = this.y - this.tileSize;
      this.notifyServer(toX, toY);
      this.move(toX, toY, "north")
    }
  }
  moveEast() {
    if (!this.playing && this.willStayInside(this.x + this.tileSize, this.x)) {

      const toX = this.x + this.tileSize;
      const toY = this.y;
      this.notifyServer(toX, toY);
      this.move(toX, toY, "east")

    }
  }

  moveSouth() {
    if (!this.playing && this.willStayInside(this.x, this.y + this.tileSize)) {

      const toX = this.x;
      const toY = this.y + this.tileSize;
      this.notifyServer(toX, toY);
      this.move(toX, toY, "south")
    }
  }
  moveWest() {
    if (!this.playing && this.willStayInside(this.x - this.tileSize, this.y)) {

      const toX = this.x - this.tileSize;
      const toY = this.y;
      this.notifyServer(toX, toY);
      this.move(toX, toY, "west")
    }
  }

  notifyServer(x, y) {
    ServerConnector.getInstance().sendMessage("AVATAR_STATE_UPDATE", {
      x: x,
      y: y,
    });
  }
}
