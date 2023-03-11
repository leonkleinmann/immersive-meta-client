import store from "@/store";

/**
 * Class which represents the server connector which manages websocket connection to server
 */
export default class ServerConnector {

  /**
   * Constructor of ServerConnector
   * @param uri URI socket should connect to
   */
  constructor(uri) {
    this.uri = uri
    this.serverSocket = null;
    this.init();
  }

  static instance = null;

  /**
   * static function to retrieve ServerConnector instance (singleton)
   * @returns {ServerConnector} the instance of ServerConnector
   */
  static getInstance() {
    if (!this.instance) {
      let uri = `ws://${store.getters.server.host}:${store.getters.server.socket_port}`;
      this.instance = new ServerConnector(uri);
    }
    return this.instance;
  }

  /**
   * function which initializes the connection to server
   */
  init() {
    this.serverSocket = new WebSocket(this.uri);
    this.serverSocket.onopen = this.handleOpen.bind(this);
    this.serverSocket.onclose = this.handleClose.bind(this);
    this.serverSocket.onmessage = this.handleMessage.bind(this);
  }

  /**
   * function which handles the openeing of the connection
   */
  handleOpen() {
    console.log("Connection to Server was established!");

    const setupData = store.getters.setupData;
    this.sendMessage("REGISTER", {
      gender: setupData.gender,
      username: setupData.username,
      link: setupData.link,
    });
  }

  /**
   * function which handles connection closing
   */
  handleClose() {
    console.warn("Connection to Server was lost..");
    store.commit("setIsLoading", true);
  }

  /**
   * function which handles different incoming messages from server
   * @param event
   */
  handleMessage(event) {
    const parsedCommand = JSON.parse(event.data);
    //console.log("COMMAND RECEIVED", parsedCommand);
    switch (parsedCommand.command) {
      case "REGISTER_COMPLETE":
        this.handleRegisterComplete(parsedCommand);
        break;
      case "CHAT_MSG":
        this.handleChatMessage(parsedCommand);
        break;
      case "ROOM_ENTERED":
        parsedCommand.data.forEach((clientAvatar) => {
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
      case "VIDEO_CHUNK":
        this.handleVideoChunk(parsedCommand);
        break;
      case "SCREEN_CHUNK":
        this.handleScreenChunk(parsedCommand);
        break;
      default:
        console.warn("Unknown command type: ", parsedCommand);
        break;
    }
  }

  /**
   * function which handles the REGISTER_COMPLETE command
   * @param parsed the parsed message which will contain the client id the server created for this client
   */
  handleRegisterComplete(parsed) {
    store.commit("setClientId", parsed.clientId);
  }

  /**
   * function which handles the CHAT_MESSAGE command
   * @param parsed the parsed message which will contain the chat message and the author of the chat message
   */
  handleChatMessage(parsed) {
    store.commit("addChatMessage", parsed.message);
  }

  /**
   * function which handles the AVATAR_STATE_UPATED command
   * @param parsed the parsed message which will contain the new position of an avatar (clientId,x,y,direction)
   */
  handleAvatarStateUpdated(parsed) {
    let avatarToChange = store.getters.clientAvatars[parsed.clientId];
    avatarToChange.x = parsed.x;
    avatarToChange.y = parsed.y;
    avatarToChange.direction = parsed.direction;
    store.commit("setClientAvatar", avatarToChange);
  }

  /**
   * function which handles the VIDEO_CHUNK command
   * @param parsed the parsed message which will contain clientId and chunk data of a webcam video stream sending client
   */
  handleVideoChunk(parsed) {
    store.commit("updateConnectedClient", parsed);
  }

  /**
   * function which handles the SCREEN_CHUNK command
   * @param parsed the parsed message which will contain screen chunk data and the corresponding object id
   */
  handleScreenChunk(parsed) {
    store.commit("updateWorkshopObject", parsed);
  }

  /**
   * function which sends a message to the server
   * @param command_type command client wants to send
   * @param parameters parameters client wants to send with the command
   */
  sendMessage(command_type, parameters) {
    let command = {
      command: command_type,
      message: parameters,
      clientId: store.getters.clientId,
    };
    this.serverSocket.send(JSON.stringify(command));
  }
}
