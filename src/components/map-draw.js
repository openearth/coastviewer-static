import Vue from 'vue';
import Vue2MapboxGL from 'vue2mapbox-gl';

import * as MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.js';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

Vue.use(Vue2MapboxGL);

export default {
  name: 'MapDraw',
  data () {
    return {
      layers: []

    };
  },
  mounted() {
    let draw = new MapboxDraw();
    console.log('draw', draw);
    this.$refs.map.map.addControl(draw);
    // let draw = new MapboxDraw();
  },
  methods: {
  }
};
