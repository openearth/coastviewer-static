import {
  bus
} from '@/event-bus.js';

import Vue2MapboxGL from 'vue2mapbox-gl';
import Vue from 'vue';
import mapboxgl from 'mapbox-gl';
import moment from 'moment';

Vue.use(Vue2MapboxGL);

const coastviewerServer = 'coastal-test.eu-west-1.elasticbeanstalk.com';
var SERVER_URL = 'https://hydro-engine.appspot.com'
export default {
  name: 'MapLayers',
  data() {
    return {
      layers: [],
      sources: [],
      map: null,
      deckgl: null,
      timeExtent: [moment("20110301", "YYYYMMDD"), moment()],
      jarkuslayer: null
    };
  },
  watch: {
    // Watch "layers". This is a switch, which can toggle a layer on or off
    // When toggled, this watcher will activate the toggleLayers function.
    layers: {
      handler: function(layers) {
        this.layers = layers
      },
      deep: true
    },
    map: {
      handler: function(map) {
        this.map = map
      },
      deep: true
    },
    deckgl: {
      handler: function(deckgl) {
        this.deckgl = deckgl
      },
      deep: true
    }
  },
  mounted() {
    bus.$on('map-loaded', () => {
      this.popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false
      });
      this.map.on("click", "dijkringpolygonen", (e) => {
        popup.setLngLat([e.lngLat.lng, e.lngLat.lat])
          .setHTML(e.features[0].properties.description)
          .addTo(this.map);
      })
      this.map.on("mousemove", "dijkringpolygonen", (e) => {
        this.map.setFilter("dijkringlijnen", ["==", "name", e.features[0].properties.name]);
      })

      this.map.on("mouseleave", "dijkringpolygonen", (e) => {
        this.map.setFilter("dijkringlijnen", ["==", "name", ""]);
      })

  },
  methods: {

  components: {
  }
};
