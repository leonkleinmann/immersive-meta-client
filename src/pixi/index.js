import * as PIXI from "pixi.js";

const PixiPlugin = {
    // eslint-disable-next-line no-unused-vars
    install(Vue, options) {
        Vue.prototype.$pixiApp = new PIXI.Application({
            resizeTo: window,
            backgroundColor: 'black',
            autoDensity: true,
            resolution: window.devicePixelRatio || 1
        })
        Vue.prototype.$pixiLoader = Vue.prototype.$pixiApp.loader
    }
};
export default PixiPlugin;
