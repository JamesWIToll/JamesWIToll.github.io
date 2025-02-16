import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'
import './assets/main.css'
import {createRouter, createWebHashHistory} from "vue-router";
import { createBootstrap } from "bootstrap-vue-next";
import { createApp } from 'vue'

import AppState from "./plugins/appState.js";


import App from './App.vue'
import Home from './components/Home.vue'
import Skills from './components/Skills.vue'
import Experience from "@/components/Experience.vue";
import Education from "@/components/Education.vue";
import Projects from "@/components/Projects.vue"

const app = createApp(App);

const router  = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/', component: Home},
        {path: '/skills', component: Skills},
        {path: '/experience', component: Experience},
        {path: '/education', component: Education},
        {path: '/projects', component: Projects},
    ]
});

const bootstrap = createBootstrap();


app.use(AppState);
app.use(router);
app.use(bootstrap);
app.mount('#app')
