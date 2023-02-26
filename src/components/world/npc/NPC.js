import Movable, { Directions } from "@/components/world/avatar/Movable";
import GotoCommand from "@/components/world/npc/GotoCommand";
import ContentCommand from "@/components/world/npc/ContentCommand";

export default class NPC extends Movable {
  constructor(x, y, identifier, name, chainedCommands) {
    super(x, y, identifier, name, "", Directions.SOUTH);

    this.chain = [];
    this.chainedCommands = chainedCommands;
    this.buildChain();
  }

  buildChain() {
    this.chainedCommands.forEach((command) => {
      if (command.type === "goto") {
        this.chain.push(
          new GotoCommand(command.x, command.y, command.with_user)
        );
      }
      if (command.type === "content") {
        this.chain.push(new ContentCommand(command.content));
      }
    });
  }

  trigger() {
    this.chain.reduce(async (prev, current) => {
      await prev;
      await current.execute(this);
    }, Promise.resolve());
  }
}
