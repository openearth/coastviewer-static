import Vue from 'vue';
import {bus} from '@/event-bus.js';
import 'material-design-icons/iconfont/material-icons.css';
import LayerControl from './components/LayerControl';

export default {
  data () {
    return {
      map: null,
      startDate: null,
      endDate: null,
      startDateMenu: false,
      endDateMenu: false,
      drawer: false,
      fixed: false,
      showSettings: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      rightDrawer: false,
      layers: []
    };
  },
  mounted() {
    bus.$on('select-layers', (layers) => {
      Vue.set(this, 'layers', layers);
    });
    bus.$on('map-loaded', (event) => {
      Vue.set(this, 'map', event.target);
    });
  },
  components: {
    'layer-control': LayerControl
  }
};
