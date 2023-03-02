import Movable from "@/components/world/avatar/Movable";

export default class ClientAvatar extends Movable {
  constructor(x, y, gender, username, link, direction = "south", id, ip) {
    super(x, y, gender, username, link, direction);
    this.id = id;
    this.ip = ip;
  }
}
