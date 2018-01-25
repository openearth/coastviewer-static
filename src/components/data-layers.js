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
      msg: 'Welcome to Your Vue.js App',
      layers: [],
      sources: []
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
      this.addLayers();

      // we can only add these layers after fetching the mapid and token
      fetch(coastviewerServer + "/vaklodingen")
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

      fetch(coastviewerServer + "/coastviewer/1.1.0/transects")
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          let layer = {
            id: "jarkus",
            name: "jarkus",
            type: "line",
            // active: false,
            source: {
              type: "geojson",
              data: json
            },
            paint: {
              "line-color": "hsla(0, 1%, 25%, 0.73)",
              "line-width": 3
            }
          };
          this.$refs.map.map.addLayer(layer);
          this.layers.push(layer);

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

      this.$refs.map.map.on('zoomend', (e) => {
        if (this.$refs.map.map.getZoom() >= 14) {
          this.$refs.map.map.setFilter('jarkus', ['<=', 'lod', 64]);
        }
        else if (this.$refs.map.map.getZoom() >= 11) {
          this.$refs.map.map.setFilter('jarkus', ['<=', 'lod', 32]);
        }
        else if (this.$refs.map.map.getZoom() >= 8) {
          this.$refs.map.map.setFilter('jarkus', ['<=', 'lod', 16]);
        }
        else if (this.$refs.map.map.getZoom() >= 5) {
          this.$refs.map.map.setFilter('jarkus', ['<=', 'lod', 8]);
        }
      });
    });
    bus.$emit('select-layers', this.layers);
  },
  watch: {
    // Watch "layers". This is a switch, which can toggle a layer on or off
    // When toggled, this watcher will activate the toggleLayers function.
    layers: {
      handler: function(layers) {
        this.toggleLayers();
      },
      deep: true
    }
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
            if (layer.type === 'group') {
              _.each(layer.data, (sublayer) => {
                this.$refs.map.map.addLayer(sublayer)
              })
            } else {
              this.$refs.map.map.addLayer(layer)
            }
            this.layers.push(layer);
          })
        })
    },

    toggleLayers() {
      // Function to toggle the visibility of the layers.
      _.each(this.layers, (layer) => {
        var vis = "none"
        if (layer.active) {
          vis = "visible"
        }

        if (layer.type === 'group') {
          _.each(layer.data, (sublayer) => {
            this.$refs.map.map.setLayoutProperty(sublayer.id, "visibility", vis);
          })
        } else {
          this.$refs.map.map.setLayoutProperty(layer.id, "visibility", vis);
        }
      });
    }
  }
};
