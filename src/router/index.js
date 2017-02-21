import Vue from 'vue';
import Router from 'vue-router';
import Attendee from 'components/Attendee';
import Moderate from 'components/Moderate';
import Queue from 'components/Queue';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'Attendee',
    component: Attendee,
  }, {
    path: '/moderate',
    name: 'Moderate',
    component: Moderate,
  }, {
    path: '/queue',
    name: 'Queue',
    component: Queue,
  }],
});
