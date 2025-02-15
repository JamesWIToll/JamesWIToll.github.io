import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'
import './assets/main.css'
import {createRouter, createWebHistory} from "vue-router";
import { createBootstrap } from "bootstrap-vue-next";
import { createApp } from 'vue'

import AppState from "./plugins/appState.js";


import App from './App.vue'
import Home from './pages/Home.vue'
import Skills from './pages/Skills.vue'


const app = createApp(App);

const router  = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: Home},
        {path: '/skills', component: Skills},
    ]
});

const bootstrap = createBootstrap();


app.use(AppState);
app.use(router);
app.use(bootstrap);
app.mount('#app')
