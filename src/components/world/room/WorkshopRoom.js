import VirtualRoom from "@/components/world/room/VirtualRoom";
import InteractiveWorkshopObject from "@/components/world/object/InteractiveWorkshopObject";

/**
 * Class which represents workshop rooms
 */
export default class WorkshopRoom extends VirtualRoom {
  /**
   * Constructor of WorkshopRoom
   * @param roomData data of the room
   */
  constructor(roomData) {
    super(roomData);
    this.addWorkshopObjects();
  }

  /**
   * function which adds workshop objects to room
   */
  addWorkshopObjects() {
    this.roomData.workshopObjects.forEach((object) => {
      if (object.__t === "interactive_workshop_object") {
        let obj = new InteractiveWorkshopObject(
          object._id,
          object.x * this.tileSize,
          object.y * this.tileSize,
          object.texture.type
        );
        this.addChild(obj);
        this.interactiveEntities.push(obj);
        this.addToTilemap(obj);
        obj.buildAnimation()
      }
    });
  }
}
