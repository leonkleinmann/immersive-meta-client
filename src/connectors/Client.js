export default class ClientConnectionManager {
  constructor(id) {
    this.id = id;
    this.connections = new Map();
  }

  handle(clientAvatar) {
    const clientAvatarId = clientAvatar.id;
    if (!this.connections.has(clientAvatarId) && clientAvatarId < this.id) {
      this.initConnection();
    }
  }

  initConnection(clientAvatar) {
    this.connections.set(clientAvatar.id)
  }
}
