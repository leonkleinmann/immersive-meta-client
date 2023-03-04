import AnimatedObject from "@/components/world/object/AnimatedObject";
import store from "@/store";
import ActionAnimation from "@/components/world/ui/ActionAnimation";

/**
 * Class which represents interactive objects
 */
export default class InteractiveObject extends AnimatedObject {
  /**
   * Constructor of InteractiveObject
   * @param x x-position of interactive object
   * @param y y-position of interactive object
   * @param textures_identifier animation identifier
   * @param content content interactive object will display on trigger
   */
  constructor(x, y, textures_identifier, content) {
    super(x, y, textures_identifier);
    this.content = content;
  }

  /**
   * function which builds a trigger animation above interactive object
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
   * function which starts the trigger animation
   */
  triggerAnimation() {
    if (!this.actionAnimation.playing) {
      this.actionAnimation.play();
    }
  }

  /**
   * function which stops the trigger animation
   */
  stopAnimation() {
    this.actionAnimation.stop();
    this.actionAnimation.reset();
  }

  /**
   * function which triggers the interactive objects and displays the corresponding content
   */
  trigger() {
    store.commit("setModalContent", this.content);
    store.commit("setModalOpen", true);
  }
}
