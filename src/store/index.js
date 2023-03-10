import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    devMode: false,
    isMobile: false,
    isLoading: false,
    isPlaying: false,
    modalOpen: false,
    modalContent: "",
    server: {
      host: "localhost",
      api_port: 9003,
      socket_port: 8888,
      clientId: undefined,
    },
    setupData: {
      gender: "male",
      username: "DevUser",
      link: "https://hs-rm.de/",
    },
    settingsData: {
      tileSize: undefined,
      maxPlayers: undefined,
      initialRoom: undefined,
      avatarInformationWidth: 100,
      avatarInformationHeight: 30,
      avatarMediaWidth: 100,
      avatarMediaHeight: 60,
    },
    worldData: undefined,
    textures: {},
    animations: {},
    currentRoom: {},
    clientAvatars: [],
    chatMessages: [],
    audioSource: "",
    playMusic: true,
    connectedClients: [],
    workshopObjectData: {},
  },
  getters: {
    server: (state) => {
      return state.server;
    },
    clientId: (state) => {
      return state.server.clientId;
    },
    devMode: (state) => {
      return state.devMode;
    },
    isMobile: (state) => {
      return state.isMobile;
    },
    isLoading: (state) => {
      return state.isLoading;
    },
    isPlaying: (state) => {
      return state.isPlaying;
    },
    modalOpen: (state) => {
      return state.modalOpen;
    },
    modalContent: (state) => {
      return state.modalContent;
    },
    setupData: (state) => {
      return state.setupData;
    },
    chatMessages: (state) => {
      return state.chatMessages;
    },
    settingsData: (state) => {
      return state.settingsData;
    },
    assetData: (state) => {
      return state.assetData;
    },
    mapData: (state) => {
      return state.mapData;
    },
    worldData: (state) => {
      return state.worldData;
    },
    textures: (state) => {
      return state.textures;
    },
    animations: (state) => {
      return state.animations;
    },
    currentRoom: (state) => {
      return state.currentRoom;
    },
    clientAvatars: (state) => {
      return state.clientAvatars;
    },
    avatarInformationWidth: (state) => {
      return state.settingsData.avatarInformationWidth;
    },
    avatarInformationHeight: (state) => {
      return state.settingsData.avatarInformationHeight;
    },
    audioSource: (state) => {
      return state.audioSource;
    },
    playMusic: (state) => {
      return state.playMusic;
    },
    connectedClients: (state) => {
      return state.connectedClients;
    },
  },
  mutations: {
    setClientId(state, clientId) {
      state.server.clientId = clientId;
    },
    setIsMobile(state, isMobile) {
      state.isMobile = isMobile;
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setIsPlaying(state, isPlaying) {
      state.isPlaying = isPlaying;
    },
    setModalOpen(state, modalState) {
      state.modalOpen = modalState;
    },
    setModalContent(state, modalContent) {
      state.modalContent = modalContent;
    },
    setSetupConfig(state, config) {
      state.setupData.username = config.username;
      state.setupData.link = config.link;
      state.setupData.gender = config.gender;
    },
    addChatMessage(state, message) {
      state.chatMessages.push(message);
    },
    setSettingsData(state, data) {
      state.settingsData.tileSize = data.tile_size;
      state.settingsData.maxPlayers = data.max_players;
      state.settingsData.initialRoom = data.initial_room;
    },
    setAssetData(state, data) {
      state.assetData = data;
    },
    setMapData(state, data) {
      state.map = data.map;
    },
    setWorldData(state, worldData) {
      state.worldData = worldData;
    },
    addTexture(state, type, texture) {
      state.textures[type] = texture;
    },
    addAnimations(state, type, animation) {
      state.animations[type] = animation;
    },
    setCurrentRoom(state, currentRoom) {
      state.currentRoom = currentRoom;
    },
    setClientAvatar(state, data) {
      Vue.set(state.clientAvatars, data.clientId, data);
    },
    removeClientAvatar(state, clientId) {
      Vue.delete(state.clientAvatars, clientId.toString());
    },
    clearClientAvatars(state) {
      state.clientAvatars = [];
    },
    setPlayMusic(state, play) {
      state.playMusic = play;
    },
    setAudioSource(state, audioSource) {
      state.audioSource = audioSource;
    },
    setConnectedClients(state, connectedClients) {
      state.connectedClients = connectedClients;
    },
    addConnectedClient(state, clientId) {
      state.connectedClients[clientId] = true;
    },
    removeConnectedClient(state, clientId) {
      Vue.delete(state.connectedClients, clientId);
    },
    updateConnectedClient(state, data) {
      Vue.set(state.connectedClients, data.clientId, data.chunk);
    },
    updateWorkshopObject(state, data) {
      Vue.set(state.workshopObjectData, data.objectId, data.chunk);
    },
    removeWorkshopObject(state, objectId) {
      Vue.delete(state.workshopObjectData, objectId);
    },
  },
  actions: {
    loadSettings({ commit, state }) {
      try {
        return axios
          .get(`http://${state.server.host}:${state.server.api_port}/settings`)
          .then((settings) => {
            commit("setSettingsData", settings.data);
          });
      } catch {
        console.log("ERROR LOADING SETTINGS");
      }
    },
    loadAssets({ commit, state }) {
      try {
        return axios
          .get(`http://${state.server.host}:${state.server.api_port}/assets`)
          .then((assets) => {
            commit("setAssetData", assets.data);
          });
      } catch {
        console.log("ERROR LOADING ASSETS");
      }
    },
    loadWorld({ commit, state }) {
      try {
        return axios
          .get(`http://${state.server.host}:${state.server.api_port}/map/world`)
          .then((world) => {
            commit("setWorldData", world.data);
          });
      } catch {
        console.log("ERROR LOADING WORLD");
      }
    },
    loadRoom({ commit, state }, roomId) {
      try {
        return axios
          .get(
            `http://${state.server.host}:${state.server.api_port}/map/room/${roomId}`
          )
          .then((room) => {
            commit("setCurrentRoom", room.data);
          });
      } catch {
        console.log("ERROR LOADING ROOM");
      }
    },
  },
});
