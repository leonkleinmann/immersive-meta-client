import Vue from 'vue'
import VueRouter from 'vue-router'
import TutorialComponent from "@/components/views/TutorialComponent";
import AboutComponent from "@/components/views/AboutComponent";

Vue.use(VueRouter)
export default new VueRouter({
    routes: [
        {
            path: '/tutorial',
            name: 'Tutorial',
            component: TutorialComponent
        },
        {
            path: '/about',
            name: 'About',
            component: AboutComponent
        }
    ]
})