// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import promise from 'es6-promise';
import 'isomorphic-fetch';

import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App';
import router from './router';

import store from './store'
import 'vuetify/dist/vuetify.css';

Vue.use(Vuetify);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
});
