import { Directions } from "@/components/world/avatar/Movable";
import store from "@/store";

/**
 * Class which represents GotoCommand NPC can execute
 */
export default class GotoCommand {
  /**
   * Constructor of GotoCommand
   * @param x x-position npc should move to
   * @param y y-position npc should move to
   * @param withUser bool if npc should take user with him
   */
  constructor(x, y, withUser) {
    this.x = x;
    this.y = y;
    this.withUser = withUser;
  }

  /**
   * Function which npc can execute
   * @param npc npc needs to pass himself as he will be moved
   * @returns {Promise<unknown>} promise caller wait for fullfillment
   */
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

  /**
   * Function which checks the direction of the next step
   * @param npcX current npc x-position
   * @param npcY current npc-y position
   * @param nextX next npc x-position
   * @param nextY next npc y-position
   * @returns {string} direction npc will move to
   */
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
