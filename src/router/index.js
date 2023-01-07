import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeComponent from "@/components/views/HomeComponent";

Vue.use(VueRouter)
export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeComponent
        },
    ]
})