import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import MapCompare from '@/components/MapCompare';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/compare',
      name: 'MapCompare',
      component: MapCompare
    }
  ]
});
