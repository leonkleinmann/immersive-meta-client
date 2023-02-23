import * as PIXI from "pixi.js";
import Vue from "vue";

const PixiPlugin = {
  install(Vue) {
    Vue.prototype.$pixiApp = new PIXI.Application({
      resizeTo: window,
      backgroundColor: "black",
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
      antialias: true
    });
  },
};
export default PixiPlugin;
Vue.use(PixiPlugin);
