import VirtualRoom from "@/components/world/room/VirtualRoom";
import InteractiveWorkshopObject from "@/components/world/object/InteractiveWorkshopObject";

export default class WorkshopRoom extends VirtualRoom {
  constructor(roomData) {
    super(roomData);
    this.addWorkshopObjects();
  }

  addWorkshopObjects() {
    console.log("ROOM_DATA", this.roomData);
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
      }
    });
  }
}
