import store from "@/store";

export default class ServerConnector {
  constructor(host) {
    this.host = host;
    this.serverSocket = null;
    this.init();
  }

  static instance = null;

  static getInstance(host) {
    if (!this.instance) {
      this.instance = new ServerConnector(host);
    }
    return this.instance;
  }

  init() {
    this.serverSocket = new WebSocket(this.host);
    this.serverSocket.onopen = this.handleOpen.bind(this);
    this.serverSocket.onmessage = this.handleMessage.bind(this);
  }

  handleOpen() {
    console.log("Connection to Server was established!");

    const setupData = store.getters.setupData;
    this.sendMessage("REGISTER", {
      gender: setupData.gender,
      username: setupData.username,
      link: setupData.link,
    });
  }

  handleMessage(event) {
    const parsedCommand = JSON.parse(event.data);
    console.log("COMMAND RECEIVED", parsedCommand);
    switch (parsedCommand.command) {
      case "REGISTER_COMPLETE":
        this.handleRegisterComplete(parsedCommand);
        break;
      case "CHAT_MSG":
        this.handleChatMessage(parsedCommand);
        break;
      case "ROOM_ENTERED":
        parsedCommand.data.forEach(clientAvatar => {
          store.commit("setClientAvatar", clientAvatar);
        });
        break;
      case "ROOM_ENTRY":
        store.commit("setClientAvatar", parsedCommand.data);
        break;
      case "ROOM_LEFT":
        store.commit("removeClientAvatar", parsedCommand.data.clientId);
        break;
      case "AVATAR_STATE_UPDATED":
        this.handleAvatarStateUpdated(parsedCommand);
        break;
      default:
        console.warn("Unknown command type: ", parsedCommand);
        break;
    }
  }

  handleRegisterComplete(parsed) {
    store.commit("setClientId", parsed.clientId);
  }

  handleChatMessage(parsed) {
    store.commit("addChatMessage", parsed.message);
  }

  handleAvatarStateUpdated(parsed) {
    let avatarToChange = store.getters.clientAvatars[parsed.clientId];
    avatarToChange.x = parsed.x;
    avatarToChange.y = parsed.y;
    avatarToChange.direction = parsed.direction;
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
