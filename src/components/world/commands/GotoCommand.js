import { Directions } from "@/components/world/avatar/Movable";
import store from "@/store";

export default class GotoCommand {
  constructor(x, y, withUser) {
    this.x = x;
    this.y = y;
    this.withUser = withUser;
  }

  async execute(npc) {
    const tileSize = store.getters.settingsData.tileSize;
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const path = npc.findPath(this.x, this.y);
      for (let i = 0; i < path.length; i++) {
        const pair = path[i];
        await npc.move(
          pair[0] * tileSize,
          pair[1] * tileSize,
          this.determineDirection(
            npc.x,
            npc.y,
            pair[0] * tileSize,
            pair[1] * tileSize
          ),
          () => {}
        );
      }
      resolve();
    });
  }

  determineDirection(npcX, npcY, nextX, nextY) {
    if (npcX < nextX) {
      return Directions.EAST;
    }
    if (npcX > nextX) {
      return Directions.WEST;
    }
    if (npcY > nextY) {
      return Directions.NORTH;
    }
    if (npcY < nextY) {
      return Directions.SOUTH;
    }
    return Directions.SOUTH;
  }
}
