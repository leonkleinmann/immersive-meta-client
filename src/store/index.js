import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    setupData: {
      gender: "male",
    },
    isMobile: false,
    isLoading: false,
    settings: {},
    assets: {},
    map: {},
  },
  getters: {
    isMobile: (state) => {
      return state.isMobile;
    },
    isLoading: (state) => {
      return state.isLoading;
    },
    settings: (state) => {
      return state.settings;
    },
    assetData: (state) => {
      return state.assets;
    },
    mapData: (state) => {
      return state.map;
    },
    setupData: (state) => {
      return state.setupData;
    },
  },
  mutations: {
    setIsMobile(state, isMobile) {
      state.isMobile = isMobile;
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setData(state, data) {
      state.settings = data.settings;
      state.assets = data.assets;
      state.map = data.map;
    },
    setSetupGender(state, gender) {
      state.setupData.gender = gender;
    },
  },
  actions: {},
});
