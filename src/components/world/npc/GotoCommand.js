import { Directions } from "@/components/world/avatar/Movable";
import store from "@/store";

export default class GotoCommand {
  constructor(x, y, withUser) {
    this.x = x;
    this.y = y;
    this.withUser = withUser;
  }

  execute(npc) {
    const tileSize = store.getters.settingsData.tileSize;
    const direction = this.determineDirection(npc)

    return npc
      .move(this.x * tileSize, this.y * tileSize, direction, () => {})
      .then(() => {
        return;
      });
  }

  determineDirection(npc) {
    const npcX = npc.x
    const npcY = npc.y

    if (npcX === this.x && npcY === this.y) {
      return Directions.SOUTH
    }

    const xDistance = Math.abs(npcX - this.x)
    const yDistance = Math.abs(npcY - this.y)

    if (xDistance > yDistance) {
      return npcX < this.x ? Directions.EAST : Directions.WEST
    } else {
      return npcY < this.y ? Directions.SOUTH : Directions.NORTH
    }
  }
}


