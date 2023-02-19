import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    devMode: false,
    isMobile: false,
    isLoading: false,
    isPlaying: false,
    server: {
      host: "http://localhost",
      api_port: 9003,
      state_machine_port: 8888,
      clientId: undefined,
    },
    setupData: {
      gender: "male",
      username: "DevUser",
      link: "",
    },
    settingsData: {
      moveSpeed: 10,
      tileSize: undefined,
      maxPlayers: undefined,
      initialRoom: undefined,
      avatarAnimationSize: 5,
      avatarInformationWidth: 120,
      avatarInformationHeight: 120,
    },
    textures: {},
    animations: {},
    currentRoom: {},
    chatMessages: [],
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
    textures: (state) => {
      return state.textures;
    },
    animations: (state) => {
      return state.animations;
    },
    currentRoom: (state) => {
      return state.currentRoom;
    },
    avatarInformationWidth: (state) => {
      return state.settingsData.avatarInformationWidth;
    },
    avatarInformationHeight: (state) => {
      return state.settingsData.avatarInformationHeight;
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
    addTexture(state, type, texture) {
      state.textures[type] = texture;
    },
    addAnimations(state, type, animation) {
      state.animations[type] = animation;
    },
    setCurrentRoom(state, currentRoom) {
      state.currentRoom = currentRoom;
    },
  },
  actions: {},
});
