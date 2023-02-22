import AnimatedObject from "@/components/world/object/AnimatedObject";
import store from "@/store";

export default class InteractiveObject extends AnimatedObject {
  constructor(x, y, textures_identifier, content) {
    super(x, y, textures_identifier);
    this.content = content;
  }

  canInteract(avatar) {
    const tileSize = store.getters.settingsData.tileSize;
    let canInteract = false;

    let avatarCpy = avatar;
    avatarCpy.x = avatarCpy.x + tileSize;
    if (this.hitTestRectangle(avatarCpy, this.parent)) {
      canInteract = true;
    }

    avatarCpy = avatar;
    avatarCpy.x = avatarCpy.x - tileSize - 1;
    if (this.hitTestRectangle(avatarCpy, this.parent)) {
      canInteract = true;
    }

    avatarCpy = avatar;
    avatarCpy.y = avatarCpy.y + tileSize;
    if (this.hitTestRectangle(avatarCpy, this.parent)) {
      canInteract = true;
    }
    avatarCpy = avatar;
    avatarCpy.y = avatarCpy.y - tileSize;
    if (this.hitTestRectangle(avatarCpy, this.parent)) {
      canInteract = true;
    }

    console.log(canInteract)
    return canInteract;
  }

  toggleInteraction() {
    console.log("TOGGLE");
  }

  hitTestRectangle(objA, objB) {
    // Berechnung der umfassenden Rechtecke der beiden Objekte
    const aBounds = objA.getBounds();
    const bBounds = objB.getBounds();

    // Überprüfen, ob sich die umfassenden Rechtecke überschneiden
    return (
      aBounds.x + aBounds.width > bBounds.x &&
      aBounds.x < bBounds.x + bBounds.width &&
      aBounds.y + aBounds.height > bBounds.y &&
      aBounds.y < bBounds.y + bBounds.height
    );
  }
}
