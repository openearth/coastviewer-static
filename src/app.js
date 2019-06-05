import Vue from 'vue'
import {bus} from '@/event-bus.js'
import 'material-design-icons/iconfont/material-icons.css'
import LayerControl from './components/LayerControl'
import TimeSlider from './components/TimeSlider'
import DataLayers from '@/components/DataLayers'

export default {
  data () {
    return {
      map: null,
      deckgl: null,
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
      rightDrawer: false
    };
  },
  mounted() {
    bus.$on('map-loaded', (map) => {
      Vue.set(this, 'map', map);
    })
  },
  components: {
    'layer-control': LayerControl,
    'time-slider': TimeSlider,
    'v-data-layers': DataLayers
  }
};
