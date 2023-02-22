import CommonObject from "@/components/world/object/CommonObject";

export default class ExitObject extends CommonObject {
  constructor(x, y, width, height, texture, nextRoom, zIndex = 0) {
    super(x, y, width, height, texture);
    this.nextRoom = nextRoom;
    this.zIndex = zIndex;
  }
}
