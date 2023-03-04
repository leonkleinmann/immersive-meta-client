import Movable from "@/components/world/avatar/Movable";

/**
 * Class which represents client avatars (avatars of foreign users)
 */
export default class ClientAvatar extends Movable {
  /**
   * Constructor of ClientAvatar
   * @param x x-position of client avatar
   * @param y y-position of client avatar
   * @param gender gender of client avatar
   * @param username username of client avatar
   * @param link link provided by client avatar
   * @param direction direction client avatar is initially looking to
   * @param id id of client avatar
   * @param ip ip of client avatar
   */
  constructor(x, y, gender, username, link, direction = "south", id, ip) {
    super(x, y, gender, username, link, direction);
    this.id = id;
    this.ip = ip;
  }
}
