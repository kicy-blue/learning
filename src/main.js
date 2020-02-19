import 'amfe-flexible';
import Vue from 'vue';
import store from "./store";
import router from './router'
import App from './App';

import Vant from 'vant';
import { Lazyload } from 'vant';
import 'vant/lib/index.css';
import 'Assets/css/global.css';
import axios from './services/axios'



Vue.use(Vant);
Vue.use(Lazyload);
Vue.prototype.$http = axios;

new Vue({
    router,
    store,
    ...App
});