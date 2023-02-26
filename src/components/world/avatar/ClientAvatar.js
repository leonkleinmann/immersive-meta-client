import Movable from "@/components/world/avatar/Movable";

export default class ClientAvatar extends Movable {
  constructor(x, y, gender, username, link, direction = "south") {
    super(x, y, gender, username, link, direction);
  }
}
