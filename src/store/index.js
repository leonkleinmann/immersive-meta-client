import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    devMode: true,
    isMobile: false,
    isLoading: false,
    isPlaying: false,
    modalOpen: false,
    modalContent: "",
    server: {
      host: "http://localhost",
      api_port: 9003,
      state_machine_port: 8888,
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
      avatarInformationWidth: 120,
      avatarInformationHeight: 120,
    },
    worldData: undefined,
    textures: {},
    animations: {},
    currentRoom: {},
    clientAvatars: [],
    exitObjects: [],
    chatMessages: [],
    audioSource: '',
    playMusic: true,
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
    exitObjects: (state) => {
      return state.exitObjects;
    },
    avatarInformationWidth: (state) => {
      return state.settingsData.avatarInformationWidth;
    },
    avatarInformationHeight: (state) => {
      return state.settingsData.avatarInformationHeight;
    },
    audioSource: (state) => {
      return state.audioSource
    },
    playMusic: (state) => {
      return state.playMusic
    }
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
    addExitObject(state, exitObject) {
      state.exitObjects.push(exitObject);
    },
    setClientAvatar(state, data) {
      Vue.set(state.clientAvatars, data.clientId, data);
    },
    removeClientAvatar(state, clientId) {
      Vue.delete(state.clientAvatars, clientId.toString());
    },
    clearClientAvatars(state) {
      state.clientAvatars = []
    },
    setPlayMusic(state, play) {
      state.playMusic = play
    },
    setAudioSource(state, audioSource) {
      state.audioSource = audioSource
    }
  },
  actions: {},
});
