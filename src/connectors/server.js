import store from "@/store";

export default class ServerConnector {
  constructor(host) {
    this.host = host;
    this.init()
  }

  static instance

  static getInstance(host) {
    if (!this.instance) {
      this.instance = new ServerConnector(host)
    }
    return this.instance
  }

  init() {
    this.serverSocket = new WebSocket(this.host);
    this.serverSocket.onopen = this.handleOpen;
    this.serverSocket.onmessage = this.handleMessage;
  }

  handleOpen() {
    console.log("Connection to Server was established!");
  }

  handleMessage(message) {
    const parsedMessage = JSON.parse(message.data);
    switch (parsedMessage.command) {
      case "REGISTER_COMPLETE":
        store.commit("setClientId", parsedMessage.clientId);
        break;
      case "CHAT_MSG":
        store.commit("addChatMessage", parsedMessage.message);
    }
  }

  sendMessage(command_type, parameters) {
    let command = {
      command: command_type,
      message: parameters
    }

    this.serverSocket.send(JSON.stringify(command))
  }
}
