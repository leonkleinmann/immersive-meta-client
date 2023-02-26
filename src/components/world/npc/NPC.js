import Movable, { Directions } from "@/components/world/avatar/Movable";
import GotoCommand from "@/components/world/npc/GotoCommand";
import ContentCommand from "@/components/world/npc/ContentCommand";
import ActionAnimation from "@/components/world/ui/ActionAnimation";

export default class NPC extends Movable {
  constructor(x, y, identifier, name, chainedCommands) {
    super(x, y, identifier, name, "", Directions.SOUTH);

    this.chain = [];
    this.chainedCommands = chainedCommands;

    this.buildChain();
  }

  buildAnimation() {
    let actionAnimation = new ActionAnimation()
    actionAnimation.x = this.x
    actionAnimation.y = this.y
    this.actionAnimation = actionAnimation
    this.parent.addChild(actionAnimation)
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

  triggerAnimation() {
    if (!this.actionAnimation.playing) {
      this.actionAnimation.play()
    }
  }
  stopAnimation() {
    this.actionAnimation.stop()
  }

  trigger() {
    this.chain.reduce(async (prev, current) => {
      await prev;
      await current.execute(this);
    }, Promise.resolve());
  }
}
