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

export default {
  name: 'DataLayers',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      toggle: '',
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

    let jarkusloaded = false;

    this.$refs.map.map.on('load', () => {
      this.addLayers();
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
            // active: false,
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

      fetch("http://coastal-test.eu-west-1.elasticbeanstalk.com/coastviewer/1.1.0/transects")
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          let layer = {
            id: "Jarkus",
            name: "Jarkus",
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

          this.$refs.map.map.setFilter('Jarkus', ['<=', 'lod', 16])
          this.$refs.map.map.on('click', 'Jarkus', (e) => {
            var id = e.features[0].id
            // TODO: embed those pages here
            window.open('http://coastal-test.eu-west-1.elasticbeanstalk.com/coastviewer/1.1.0/transects/' + id.toString() + '/info', '_blank');

          });


          var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
          });
          this.$refs.map.map.on('mouseenter', 'Jarkus', (e) => {
            this.$refs.map.map.getCanvas().style.cursor = 'pointer';
            popup.setLngLat([e.lngLat.lng, e.lngLat.lat])
              .setHTML("Transect Id: " + e.features[0].id.toString())
              .addTo(this.$refs.map.map);
          });
          this.$refs.map.map.on('mouseleave', 'Jarkus', () => {
            this.$refs.map.map.getCanvas().style.cursor = '';
            popup.remove();
          });
        });
      this.$refs.map.map.on('zoomend', (e) => {
        if (this.$refs.map.map.getZoom() >= 14) {
          this.$refs.map.map.setFilter('Jarkus', ['<=', 'lod', 64]);
        } else if (this.$refs.map.map.getZoom() >= 11) {
          this.$refs.map.map.setFilter('Jarkus', ['<=', 'lod', 32]);
        } else if (this.$refs.map.map.getZoom() >= 8) {
          this.$refs.map.map.setFilter('Jarkus', ['<=', 'lod', 16]);
        } else if (this.$refs.map.map.getZoom() >= 5) {
          this.$refs.map.map.setFilter('Jarkus', ['<=', 'lod', 8]);
        }
      });
    });
    bus.$emit('select-layers', this.layers);
  },
  watch: {
    "layers": {
      handler: function(layers) {
        console.log(layers)
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
      // TODO: This could be a bit more efficient
      _.each(this.layers, (layer) => {
        if (layer.active) {
          if (layer.type === 'group') {
            _.each(layer.data, (sublayer) => {
              this.$refs.map.map.setLayoutProperty(sublayer.id, "visibility", "visible");
            })
          } else {
            this.$refs.map.map.setLayoutProperty(layer.id, "visibility", "visible");
          }
        } else {
          if (layer.type === 'group') {
            _.each(layer.data, (sublayer) => {
              this.$refs.map.map.setLayoutProperty(sublayer.id, "visibility", "none");
            });
          } else {
            this.$refs.map.map.setLayoutProperty(layer.id, "visibility", "none");
          }
        }
      });
    }
  }
};
