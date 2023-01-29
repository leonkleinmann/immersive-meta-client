export default class Tile {
  constructor(x, y, texture) {
    this.x = x;
    this.y = y;
    this.texture = texture;
  }

  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getTexture() {
    return this.texture;
  }
}
