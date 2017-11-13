// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import _ from 'lodash';
import router from './router';
import Vue2MapboxGL from 'vue2mapbox-gl';

Vue.use(Vue2MapboxGL);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
});
