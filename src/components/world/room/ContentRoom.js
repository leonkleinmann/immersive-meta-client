import VirtualRoom from "@/components/world/room/VirtualRoom";

/**
 * Class which represents Content Rooms
 */
export default class ContentRoom extends VirtualRoom {
  /**
   * Constructor of ContentRoom
   * @param roomData data of the room, such as objects, tiles, ..
   */
  constructor(roomData) {
    super(roomData);
  }
}
