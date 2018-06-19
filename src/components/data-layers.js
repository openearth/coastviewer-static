import {
  experimental,
  GeoJsonLayer
} from 'deck.gl';
import {
  bus
} from '@/event-bus.js';
const {
  DeckGLJS,
  MapControllerJS
} = experimental;
import Vue2MapboxGL from 'vue2mapbox-gl';
import Vue from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

Vue.use(Vue2MapboxGL);

const coastviewerServer = 'http://coastal-prod.eu-west-1.elasticbeanstalk.com';

export default {
  name: 'DataLayers',
  data() {
    return {
      layers: [],
      sources: []
    };
  },
  mounted() {
    this.$refs.map.$on('mb-load', (event) => {
      bus.$emit('map-loaded', event)
    });
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
    this.$refs.map.$on('mb-load', (event) => {
      // map is loaded, notify everyone
      bus.$emit('map-loaded', event);
      this.addLayers();

      // we can only add these layers after fetching the mapid and token
      // Vaklodingen layer
      fetch(coastviewerServer + "/vaklodingen")
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          let mapUrl = this.getTileUrl(json.mapid, json.token);
          let layer = this.layers.find(item => item.name === "Vaklodingen").data[0]
          layer.source.tiles = [mapUrl]
          this.$refs.map.map.addLayer(layer);
          bus.$emit('select-layers', this.layers);
        });

      // Jarkus layer
      fetch(coastviewerServer + "/coastviewer/1.1.0/transects")
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          let layer = this.layers.find(item => item.name === "Jarkus").data[0]
          layer.source.data = json
          this.$refs.map.map.addLayer(layer);

          this.$refs.map.map.setFilter('jarkus', ['<=', 'lod', 16]);
          this.$refs.map.map.on('click', 'jarkus', (e) => {
            let id = e.features[0].id;
            // TODO: embed those pages here
            window.open(coastviewerServer + '/coastviewer/1.1.0/transects/' + id.toString() + '/info','_blank');

          });

          var popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false
          });

          // Mouse events
          this.$refs.map.map.on('mouseenter', 'jarkus', (e) => {
            this.$refs.map.map.getCanvas().style.cursor = 'pointer';
            popup.setLngLat([e.lngLat.lng, e.lngLat.lat])
              .setHTML("Transect Id: " + e.features[0].id.toString())
              .addTo(this.$refs.map.map);
          });
          this.$refs.map.map.on('mouseleave', 'jarkus', () => {
            this.$refs.map.map.getCanvas().style.cursor = '';
            popup.remove();
          });

          this.$refs.map.map.on("click", "dijkringpolygonen", (e) => {
            popup.setLngLat([e.lngLat.lng, e.lngLat.lat])
              .setHTML(e.features[0].properties.description)
              .addTo(this.$refs.map.map);
          })

          this.$refs.map.map.on("mousemove", "dijkringpolygonen", (e) => {
            this.$refs.map.map.setFilter("dijkringlijnen", ["==", "name", e.features[0].properties.name]);
          })

          this.$refs.map.map.on("mouseleave", "dijkringpolygonen", (e) => {
            this.$refs.map.map.setFilter("dijkringlijnen", ["==", "name", ""]);
          })
        });

        // Set Level of detail for zoomlevels
        const zoomlevels = [14, 11, 8, 5]
        const lod = [64, 32, 16, 8]
        this.$refs.map.map.on('zoomend', (e) => {
          _.each(zoomlevels, (zoomlevel, i) => {
            if (this.$refs.map.map.getZoom() >= zoomlevel) {
              this.$refs.map.map.setFilter('jarkus', ['<=', 'lod', lod[i]]);
            }
          })
        });
    });
    bus.$emit('select-layers', this.layers);
  },
  watch: {
  },
  methods: {
    getTileUrl(mapId, token) {
      let baseUrl = "https://earthengine.googleapis.com/map";
      let url = [baseUrl, mapId, "{z}", "{x}", "{y}"].join("/");
      url += "?token=" + token;
      return url;
    },
    addDeck() {

    },

    addLayers() {
      // Function to add all layers made in the datalayers.json to the map
      // Layers can be individual layers or a list containing different Layers
      // a type indentifies as a single layer or a "group".
      fetch("./static/data/datalayers.json")
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          _.each(json, (layer) => {
            if (layer.layertype ===  'mapbox-layer-group') {
              _.each(layer.data, (sublayer) => {
                this.$refs.map.map.addLayer(sublayer)
              });
            } else if (layer.layertype ===  'mapbox-layer') {
              this.$refs.map.map.addLayer(layer)
            }
            this.layers.push(layer);
          });
        });
    }
  }
};
