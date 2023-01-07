import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        mapData: {

        },
        settings: {
            map: {
                tileWidth: 32,
                tileHeight: 32,
            },
            graphics: {
                width: 64,
                height: 64,
            },
            game: {
                moveSpeed: 32,
            }
        },
        isMobile: false,
        setupCompleted: false,
        isLoading: false,
        isPlaying: false,
    },
    getters:{
        isMobile: (state) => {
            return state.isMobile
        },
        setupCompleted: (state) => {
          return state.setupCompleted
        },
        isLoading: (state) =>  {
            return state.isLoading
        },
        isPlaying: (state) => {
            return state.isPlaying
        },
        // settings
        settings: (state) => {
            return state.settings
        },
        mapSettings: (state) => {
            return state.settings.map
        },
        graphicSettings: (state) => {
            return state.settings.graphics
        },
        gameSettings: (state) => {
            return state.settings.game
        }
    },
    mutations: {
        setIsMobile(state, isMobile) {
            state.isMobile = isMobile
        },
        setSetupCompleted(state, setupCompleted) {
            state.setupCompleted = setupCompleted
        },
        setIsLoading(state, isLoading) {
            state.isLoading = isLoading
        },
        setIsPlaying(state, isPlaying) {
            state.isPlaying = isPlaying
        },
        setSettings(state, settings) {
            state.settings = settings
        }
    },
    actions:{}
})

