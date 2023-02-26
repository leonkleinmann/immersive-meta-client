import AnimatedObject from "@/components/world/object/AnimatedObject";
import store from "@/store";
import ActionAnimation from "@/components/world/ui/ActionAnimation";

export default class InteractiveObject extends AnimatedObject {
  constructor(x, y, textures_identifier, content) {
    super(x, y, textures_identifier);
    this.content = content;
  }

  buildAnimation() {
    let actionAnimation = new ActionAnimation()
    actionAnimation.x = this.x
    actionAnimation.y = this.y
    this.actionAnimation = actionAnimation
    this.parent.addChild(actionAnimation)
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
    store.commit("setModalContent", this.content);
    store.commit("setModalOpen", true);
  }

  canInteract(avatar) {
    const tileSize = store.getters.settingsData.tileSize;
    let canInteract = false;

    let avatarBounds = avatar.getBounds()
    let parentBounds = this.parent.getBounds()

    avatarBounds.x = avatarBounds.x + tileSize;
    if (this.hitTestRectangle(avatarBounds, parentBounds)) {
      canInteract = true;
    }

    avatarBounds = avatar.getBounds()
    avatarBounds.x = avatarBounds.x - tileSize;
    if (this.hitTestRectangle(avatarBounds, parentBounds)) {
      canInteract = true;
    }

    avatarBounds = avatar.getBounds()
    avatarBounds.y = avatarBounds.y + tileSize;
    if (this.hitTestRectangle(avatarBounds, parentBounds)) {
      canInteract = true;
    }
    avatarBounds = avatar.getBounds()
    avatarBounds.y = avatarBounds.y - tileSize;
    if (this.hitTestRectangle(avatarBounds, parentBounds)) {
      canInteract = true;
    }

    return canInteract;
  }

  hitTestRectangle(objA, objB) {
    const aBounds = objA;
    const bBounds = objB;

    return (
      aBounds.x + aBounds.width > bBounds.x &&
      aBounds.x < bBounds.x + bBounds.width &&
      aBounds.y + aBounds.height > bBounds.y &&
      aBounds.y < bBounds.y + bBounds.height
    );
  }
}
