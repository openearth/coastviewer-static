import Vue from 'vue';
import Vue2MapboxGL from 'vue2mapbox-gl';

import * as MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.js';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

Vue.use(Vue2MapboxGL);

export default {
  name: 'MapDraw',
  data() {
    return {
      layers: []

    };
  },
  mounted() {

    this.$refs.map.$on('mb-load', (event) => {

      let draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          line_string: true,
          trash: true
        }
      });

      this.$refs.map.map.addControl(draw);
      this.$refs.map.map.on('draw.create', () => {
        var region = draw.getAll()
        var profile = this.download_raster_profile(region.features[0].geometry, 'bathymetry', 100)
      })
    })
  },
  methods: {
    download_raster_profile(region, variable, scale) {
      var SERVER_URL = 'http://hydro-engine.appspot.com'
      // var SERVER_URL = 'http://localhost:8080'
      var data = {
        'polyline': region,
        'variable ': variable,
        'scale': scale
      }
      var myHeaders = new Headers();
      var profile = fetch(SERVER_URL + '/get_raster_profile', {
          method: "POST",
          body: JSON.stringify(data),
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        .then((res) => {
          return res.json();
        })
        .then((profile_data) => {
          return profile_data
        })
      return profile

    }
  }
};
