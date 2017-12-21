import Vue from 'vue';
import Router from 'vue-router';
import DataLayers from '@/components/DataLayers';
import MapCompare from '@/components/MapCompare';
import MapDraw from '@/components/MapDraw';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DataLayers',
      component: DataLayers
    },
    {
      path: '/compare',
      name: 'MapCompare',
      component: MapCompare
    },
    {
      path: '/draw',
      name: 'MapDraw',
      component: MapDraw
    }
  ]
});
