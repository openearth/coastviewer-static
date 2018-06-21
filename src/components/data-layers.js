import {
  bus
} from '@/event-bus.js';

import Vue2MapboxGL from 'vue2mapbox-gl';
import Vue from 'vue';
import mapboxgl from 'mapbox-gl';

Vue.use(Vue2MapboxGL);

const coastviewerServer = 'http://coastal-prod.eu-west-1.elasticbeanstalk.com';

export default {
  name: 'DataLayers',
  data() {
    return {
      layers: [],
      sources: [],
      map: null
    };
  },
  mounted() {
    let deckgl = new DeckGL({
      container: 'deck-gl',
      mapboxApiAccessToken: 'pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA',
      mapStyle: 'mapbox://styles/mapbox/satellite-streets-v10',
      longitude: 4,
      latitude: 52,
      zoom: 12,
      layers: [
        new ScatterplotLayer({
          data: [
            {position: [4, 52], color: [255, 0, 0], radius: 1000}
          ],
          opacity: 0.3
        })
      ]
    })
    console.log(deckgl)
    this.map = deckgl.getMapboxMap()
    console.log(this.map)
    this.map.on('load', (event) => {
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
          this.map.addLayer(layer);
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
          this.map.addLayer(layer);

          this.map.setFilter('jarkus', ['<=', 'lod', 16]);
          this.map.on('click', 'jarkus', (e) => {
            let id = e.features[0].id;
            // TODO: embed those pages here
            window.open(coastviewerServer + '/coastviewer/1.1.0/transects/' + id.toString() + '/info','_blank');

          });

          var popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false
          });

          // Mouse events
          this.map.on('mouseenter', 'jarkus', (e) => {
            this.map.getCanvas().style.cursor = 'pointer';
            popup.setLngLat([e.lngLat.lng, e.lngLat.lat])
              .setHTML("Transect Id: " + e.features[0].id.toString())
              .addTo(this.map);
          });
          this.map.on('mouseleave', 'jarkus', () => {
            this.map.getCanvas().style.cursor = '';
            popup.remove();
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
        });

        // Set Level of detail for zoomlevels
        const zoomlevels = [14, 11, 8, 5]
        const lod = [64, 32, 16, 8]
        this.map.on('zoomend', (e) => {
          _.each(zoomlevels, (zoomlevel, i) => {
            if (this.map.getZoom() >= zoomlevel) {
              this.map.setFilter('jarkus', ['<=', 'lod', lod[i]]);
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
                this.map.addLayer(sublayer)
              });
            } else if (layer.layertype ===  'mapbox-layer') {
              this.map.addLayer(layer)
            }
            this.layers.push(layer);
          });
        });
    }
  },
  components: {
  }
};
