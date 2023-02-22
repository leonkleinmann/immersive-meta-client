import store from "@/store";

export default class ServerConnector {
  constructor(host) {
    this.host = host;
    this.init();
  }

  static instance;

  static getInstance(host) {
    if (!this.instance) {
      this.instance = new ServerConnector(host);
    }
    return this.instance;
  }

  init() {
    this.serverSocket = new WebSocket(this.host);
    this.serverSocket.onopen = this.handleOpen;
    this.serverSocket.onmessage = this.handleMessage.bind(this);
  }

  handleOpen() {
    console.log("Connection to Server was established!");

    const setupData = store.getters.setupData;
    ServerConnector.getInstance().sendMessage("REGISTER", {
      gender: setupData.gender,
      username: setupData.username,
      link: setupData.link,
    });
  }

  handleMessage(command) {
    const parsedCommand = JSON.parse(command.data);
    console.log("COMMAND RECEIVED", parsedCommand);
    switch (parsedCommand.command) {
      case "REGISTER_COMPLETE":
        this.handleRegisterComplete(parsedCommand);
        break;
      case "CHAT_MSG":
        this.handleChatMessage(parsedCommand);
        break;
      case "ROOM_ENTERED":
        this.handleRoomEntered(parsedCommand);
        break;
      case "ROOM_ENTRY":
        this.handleRoomEntry(parsedCommand);
        break;
      case "ROOM_LEFT":
        this.handleRoomLeave(parsedCommand);
        break;
      case "AVATAR_STATE_UPDATED":
        this.handleAvatarStateUpdated(parsedCommand);
        break;
    }
  }

  handleRegisterComplete(parsed) {
    store.commit("setClientId", parsed.clientId);
  }
  handleChatMessage(parsed) {
    store.commit("addChatMessage", parsed.message);
  }
  handleRoomEntered(parsed) {
    parsed.data.forEach((clientAvatar) => {
      store.commit("setClientAvatar", clientAvatar);
    });
  }
  handleRoomEntry(parsed) {
    store.commit("setClientAvatar", parsed.data);
  }
  handleRoomLeave(parsed) {
    store.commit('removeClientAvatar', parsed.data.clientId)
  }
  handleAvatarStateUpdated(parsed) {
    let avatarToChange = store.getters.clientAvatars[parsed.clientId];
    avatarToChange.x = parsed.x;
    avatarToChange.y = parsed.y;
    avatarToChange.direction = parsed.direction

    store.commit("setClientAvatar", avatarToChange);
  }

  sendMessage(command_type, parameters) {
    console.log(
      "SENDING COMMAND",
      store.getters.clientId,
      command_type,
      parameters
    );
    let command = {
      command: command_type,
      message: parameters,
      clientId: store.getters.clientId,
    };

    this.serverSocket.send(JSON.stringify(command));
  }
}
