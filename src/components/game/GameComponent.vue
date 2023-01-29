<template>
  <div class="game">
  </div>
</template>

<script>
import AssetManager from '@/components/game/assets/index'
import VirtualWorld from "@/components/game/world";
import Avatar from '@/components/game/avatar';
import axios from 'axios'
import {mapGetters} from "vuex";


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

      this.world = new VirtualWorld(this.assetManager)
      this.world.renderMap(this.$pixiApp)

      this.avatar = new Avatar(this.setupData.gender, this.assetManager)
      this.$pixiApp.stage.addChild(this.avatar.getDrawable())
      this.registerKeyEvents()

      this.$store.commit('setIsLoading', false)
    })
  },
  data() {
    return {
      assetManager: undefined,
      world: undefined,
      avatar: undefined,
    }
  },
  computed: {
    ...mapGetters(['setupData'])
  },
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
          this.avatar.moveNorth()
        }
        if (event.code === 'ArrowDown' || event.code === 'KeyS') {
          this.avatar.moveSouth()
        }
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
          this.avatar.moveWest()
        }
        if (event.code === 'ArrowRight' || event.code === 'KeyD') {
          this.avatar.moveEast()
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