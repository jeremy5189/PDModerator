// Load CSS
import 'bootstrap/dist/css/bootstrap.css';
import BootstrapVue from 'bootstrap-vue';

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import VueSocketio from 'vue-socket.io';
import App from './App';
import router from './router';
import config from '../common-config.json';

Vue.use(BootstrapVue);
Vue.use(VueResource);
Vue.use(VueSocketio, config.ws_url);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
