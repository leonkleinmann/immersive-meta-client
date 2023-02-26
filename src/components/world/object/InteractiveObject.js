import AnimatedObject from "@/components/world/object/AnimatedObject";
import store from "@/store";
import ActionAnimation from "@/components/world/ui/ActionAnimation";

export default class InteractiveObject extends AnimatedObject {
  constructor(x, y, textures_identifier, content) {
    super(x, y, textures_identifier);
    this.content = content;
  }

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

  triggerAnimation() {
    if (!this.actionAnimation.playing) {
      this.actionAnimation.play();
    }
  }

  stopAnimation() {
    this.actionAnimation.stop();
    this.actionAnimation.reset();
  }

  trigger() {
    store.commit("setModalContent", this.content);
    store.commit("setModalOpen", true);
  }
}
