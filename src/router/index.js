import Vue from 'vue';
import Router from 'vue-router';
import VueSocketio from 'vue-socket.io';
import IndexPage from 'components/IndexPage';
import Attendee from 'components/Attendee';
import Moderate from 'components/Moderate';
import Queue from 'components/Queue';
import config from '../../common-config.json';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'IndexPage',
    component: IndexPage,
  }, {
    path: '/attendee',
    name: 'Attendee',
    component: Attendee,
  }, {
    path: '/moderate',
    name: 'Moderate',
    component: Moderate,
    beforeEnter(to, from, next) {
      // Load vue-socketio
      if (!Vue.prototype.$socket) {
        Vue.use(VueSocketio, config.ws_url);
      }
      next();
    },
  }, {
    path: '/queue',
    name: 'Queue',
    component: Queue,
    beforeEnter(to, from, next) {
      // Load vue-socketio
      if (!Vue.prototype.$socket) {
        Vue.use(VueSocketio, config.ws_url);
      }
      next();
    },
  }],
});
