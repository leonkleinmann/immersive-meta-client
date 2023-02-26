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
    return npc
      .move(this.x * tileSize, this.y * tileSize, Directions.NORTH, () => {})
      .then(() => {
        return;
      });
  }
}
