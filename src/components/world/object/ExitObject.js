import CommonObject from "@/components/world/object/CommonObject";

/**
 * Class which represents exits of a virtual room
 */
export default class ExitObject extends CommonObject {
  /**
   * Constructor of ExitObject
   * @param x x-position of exit object
   * @param y y-position of exit object
   * @param width width of exit object
   * @param height height of exit object
   * @param texture texture of exit object (usually a door)
   * @param nextRoom next room which exit object leads to
   * @param zIndex zIndex of the exit object (lower than avatar e.g.)
   */
  constructor(x, y, width, height, texture, nextRoom, zIndex = 3) {
    super(x, y, width, height, texture);
    this.nextRoom = nextRoom;
    this.zIndex = zIndex;
  }
}
