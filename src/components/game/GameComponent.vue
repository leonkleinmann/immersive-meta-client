<template>
  <div class="game">
  </div>
</template>

<script>
import AssetManager from '@/components/game/assets/index'
import TileMap from "@/components/game/map";
import axios from 'axios'
import {moveUp, moveDown, moveLeft, moveRight} from "@/components/game/avatar";


export default {
  name: "GameComponent",
  mounted() {
    this.$store.commit('setIsLoading', true)
    document.querySelectorAll('.game')[0].appendChild(this.$pixiApp.view)
    this.assetManager = new AssetManager(this.$pixiLoader)

    this.loadData().then(() => {
      this.assetManager.preloadAssets()
    })
    this.$pixiLoader.onComplete.add(() => {
      console.log('PRELOADING ASSETS DONE')
      this.assetManager.generatePixiAssets()

      this.tileMap = new TileMap(this.assetManager)
      this.tileMap.render(this.$pixiApp)
      this.$store.commit('setIsLoading', false)
    })
  },
  data() {
    return {
      assetManager: undefined,
      tileMap: undefined,
    }
  },
  computed: {},
  methods: {
    async loadData() {
      try {
        let response = await axios.get('/assets/mapData.json')
        this.$store.commit('setData', response.data)
      } catch (error) {
        console.log('error occured', error)
      }
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