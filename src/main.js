import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import pixi from "./pixi";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  pixi,
  render: (h) => h(App),
}).$mount("#app");
