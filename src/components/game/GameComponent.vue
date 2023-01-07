<template>
  <div class="game">
  </div>
</template>

<script>
import * as PIXI from 'pixi.js';
import {generateMaptileSheet, buildTileMap, setTileBackground} from "@/components/game/map";
import { preloadAssets } from "@/components/game/assets/";
import {moveUp, moveDown, moveLeft, moveRight, createAvatarSheet, createAnimatedAvatar} from "@/components/game/avatar";
import {mapGetters} from "vuex";

export default {
  name: "GameComponent",
  mounted() {
    this.$store.commit('setIsLoading', true)
    this.pixiApp = new PIXI.Application({
      resizeTo: window,
      backgroundColor: 'black',
      autoDensity: true,
      resolution: window.devicePixelRatio || 1
    })
    this.pixiLoader = this.pixiApp.loader
    document.querySelectorAll('.game')[0].appendChild(this.pixiApp.view)
    this.preloadAssets()
    this.registerKeyEvents()
    window.addEventListener('resize', () => {
      console.log('resize')
    })
  },
  data() {
    return {
      pixiApp: undefined,
      pixiLoader: undefined,
      mapSheet: undefined,
      tileMap: undefined,
      avatar: undefined,
      avatarSheet: undefined,
    }
  },
  computed: {
    ...mapGetters(['mapSettings', 'gameSettings'])
  },
  methods: {
    preloadAssets() {
      preloadAssets(this.pixiLoader)
      this.pixiLoader.onComplete.add(() => {

        // preloading fertig -> baue Mape und andere Objekte
        this.mapSheet = generateMaptileSheet(this.pixiLoader)
        setTileBackground(this.pixiApp, this.mapSheet.grass)
        this.tileMap = buildTileMap(this.mapSheet)

        this.avatarSheet = createAvatarSheet(this.pixiLoader, 64, 64)
        this.avatar = createAnimatedAvatar(this.avatarSheet)
        this.avatar.anchor.set(0.5)
        this.avatar.animationSpeed = 1/4
        this.avatar.loop = false
        this.avatar.x = this.pixiApp.view.width / 2
        this.avatar.y = this.pixiApp.view.height / 2

        this.pixiApp.stage.addChild(this.tileMap)
        this.pixiApp.stage.addChild(this.avatar)

        this.$store.commit('setIsLoading', false)
        this.$store.commit('setIsPlaying', true)
      })
      this.pixiLoader.onError.add((e) => {
        console.log('ERROR LOADING ASSETS', e.message)
      })
      this.pixiLoader.load()
    },
    registerKeyEvents() {
      document.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowUp' || event.code === 'KeyW') {
          moveUp(this.avatar, this.avatarSheet,this.gameSettings.moveSpeed)
        }
        if (event.code === 'ArrowDown' || event.code === 'KeyS') {
          moveDown(this.avatar, this.avatarSheet,this.gameSettings.moveSpeed)
        }
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
          moveLeft(this.avatar, this.avatarSheet, this.gameSettings.moveSpeed)
        }
        if (event.code === 'ArrowRight' || event.code === 'KeyD') {
          moveRight(this.avatar, this.avatarSheet,this.gameSettings.moveSpeed)
        }
      }, false);
    }
  },
  destroyed() {
    document.removeEventListener('keydown', () => {})
  }
}
</script>

<style lang="scss" scoped>
.game {
  position: relative;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}
</style>