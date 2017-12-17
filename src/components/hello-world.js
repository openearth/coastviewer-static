import {experimental, GeoJsonLayer} from 'deck.gl';
import {bus} from '@/event-bus.js';
const {DeckGLJS, MapControllerJS} = experimental;
import Vue2MapboxGL from 'vue2mapbox-gl';
import Vue from 'vue';

import 'mapbox-gl/dist/mapbox-gl.css';

Vue.use(Vue2MapboxGL);

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      layers: [
      ],
      sources: [
      ]
    };
  },
  mounted() {
    let viewport = {
      latitude: 52,
      longitude: 4,
      zoom: 10,
      bearing: 0,
      pitch: 60
    };
    let deckgl = new DeckGLJS({
      // TODO EventManager should accept element id
      /* global document */
      canvas: document.getElementById('deck'),
      ...viewport,
      width: 300,
      height: 300,
      debug: true
    });

    this.$refs.map.map.on('load', () => {
      // we can only add these layers after fetching the mapid and token
      fetch("http://coastal-test.eu-west-1.elasticbeanstalk.com/vaklodingen")
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          let mapUrl = this.getTileUrl(json.mapid, json.token);
          let layer = {
            id: "imageLayer",
            name: "vaklodingen",
            type: "raster",
            source: {
              type: "raster",
              tiles: [mapUrl],
              tileSize: 256
            }
          };
          this.$refs.map.map.addLayer(layer);
          this.layers.push(layer);
          bus.$emit('select-layers', this.layers);
        });

    });
    bus.$emit('select-layers', this.layers);


  },
  methods: {
     getTileUrl(mapId, token) {
      let baseUrl = "https://earthengine.googleapis.com/map";
      let url = [baseUrl, mapId, "{z}", "{x}", "{y}"].join("/");
      url += "?token=" + token;
      return url;
    },
    addDeck() {

    }
  }
};
