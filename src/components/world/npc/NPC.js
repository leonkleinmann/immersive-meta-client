import Movable, { Directions } from "@/components/world/avatar/Movable";
import GotoCommand from "@/components/world/commands/GotoCommand";
import ContentCommand from "@/components/world/commands/ContentCommand";
import ActionAnimation from "@/components/world/ui/ActionAnimation";

/**
 * Class which represent NPCs which can execute different commands
 */
export default class NPC extends Movable {
  /**
   * Constructor of NPC
   * @param x x-position of NPC
   * @param y y-position of NPC
   * @param identifier identifier (gender) of npc, which is necessary to find corresponding assets
   * @param name name of the npc
   * @param chainedCommands array of commands the npc should execute
   */
  constructor(x, y, identifier, name, chainedCommands) {
    super(x, y, identifier, name, "", Directions.SOUTH);

    this.chain = [];
    this.chainedCommands = chainedCommands;

    this.buildChain();
  }

  /**
   * Function which creates a trigger animation since NPC is an interactive object
   */
  buildAnimation() {
    let actionAnimation = new ActionAnimation();
    actionAnimation.x =
      this.x +
      this.getBounds().width / 2 -
      actionAnimation.getBounds().width / 2;
    actionAnimation.y = this.y - 20;
    this.actionAnimation = actionAnimation;
    this.parent.addChild(actionAnimation);
  }

  /**
   * Build an array with objects which are executable for the npc
   */
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
    //go back
    this.chain.push(
      new GotoCommand(super.x / this.tileSize, super.y / this.tileSize, false)
    );
  }

  /**
   * function which starts trigger animation
   */
  triggerAnimation() {
    if (!this.actionAnimation.playing) {
      this.actionAnimation.play();
    }
  }

  /**
   * function which stops trigger animation
   */
  stopAnimation() {
    this.actionAnimation.reset();
    this.actionAnimation.stop();
  }

  /**
   * function which executes all chained commands once npc is triggered
   */
  trigger() {
    this.parent.removeChild(this.actionAnimation);
    this.chain.reduce(async (prev, current) => {
      await prev;
      await current.execute(this);
    }, Promise.resolve());
  }
}
