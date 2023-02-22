import AnimatedObject from "@/components/world/object/AnimatedObject";

export default class InteractiveObject extends AnimatedObject {
  constructor(x, y, width, height, textures_identifier, content) {
    super(x, y, width, height, textures_identifier);
    this.content = content;
  }
}
