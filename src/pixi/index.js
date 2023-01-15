import * as PIXI from "pixi.js";
import Vue from 'vue'

const PixiPlugin = {
    // eslint-disable-next-line no-unused-vars
    install(Vue) {
        const pixiApp = new PIXI.Application({
            resizeTo: window,
            backgroundColor: 'black',
            autoDensity: true,
            resolution: window.devicePixelRatio || 1
        })

        Vue.prototype.$pixiApp = pixiApp
        Vue.prototype.$pixiLoader = pixiApp.loader
    }
};
export default PixiPlugin;
Vue.use(PixiPlugin)