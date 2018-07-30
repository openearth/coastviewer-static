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
      // map is loaded, notify everyone
      this.addLayers();
      // we can only add these layers after fetching the mapid and token

      // this.addVaklodingen()
      this.addJarkusLayer('1965')
    })
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
      bus.$on('slider-update', (event) => {
        if (event.id === 'vaklodingen') {
          this.map.removeLayer('vaklodingen')
          this.map.removeSource('vaklodingen')
          this.timeExtent[0] = event.begindate
          this.timeExtent[1] = event.enddate
          this.addVaklodingen()
        } else if (event.id === 'jarkus') {
          this.addJarkusLayer(event.begindate)

            // this.jarkuslayer.props.data.features.forEach((feature, raai) => {
            //   feature.geometry.coordinates.forEach((coordinate, i) => {
            //     coordinate.push(feature.properties['z_' + (event.begindate.toString())][i] * 30)
            //   })
            // });
        }
      })

  },
  methods: {
    getTileUrl(mapId, token) {
      let baseUrl = "https://earthengine.googleapis.com/map";
      let url = [baseUrl, mapId, "{z}", "{x}", "{y}"].join("/");
      url += "?token=" + token;
      return url;
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
            bus.$emit('add-layer', layer)
          });
        });
    },

    addVaklodingen() {
      var json_data = {
        "dataset": "vaklodingen",
        "begin_date": this.timeExtent[0],
        "end_date": this.timeExtent[1]
      }
      json_data = {
            "dataset": "vaklodingen",
            "begin_date": "2011-08-01",
            "end_date": "2011-09-01"
        }
      fetch(SERVER_URL + "/get_bathymetry", {
          method: "POST",
          body: JSON.stringify(json_data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
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
    },

    addJarkusLayer(year) {
      console.log(year)
      fetch('./static/jarkus_years/jarkus_' + year + '.json')
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          this.jarkuslayer = new GeoJsonLayer ({
            id: 'jarkus',
            data: json,
            pickable: true,
            filled: true,
            extruded: true,
            lineWidthScale: 20,
            lineWidthMinPixels: 2,
            elevationScale: 30,
            getElevation: 30,
            getLineColor: d => this.layers.find(layer => layer.name === 'Jarkus').active ? [255, 0, 0, 100] : [0, 0, 255, 100],
            updateTriggers: {
              lineColor: this.layers,
            },
            getRadius: d =>100,
            getLineWidth: d =>1,
            onHover: d => {
              if (d.index === -1) {
                this.popup.remove();
              }
              else {
                this.popup.setLngLat([d.lngLat[0], d.lngLat[1]])
                  .setHTML("Transect Id: " + d.object.id.split('-')[0].toString())
                  .addTo(this.map)
                }
              },
            onClick: d => window.open(coastviewerServer + '/coastviewer/1.1.0/transects/' + d.object.id.split('-')[0].toString() + '/info','_blank')
          })
          // this.deckgl.props.layers = [this.jarkuslayer]
          console.log('new jarkuslayer', this.deckgl)
          bus.$emit('deckgl-layers-update', this.jarkuslayer)

          // this.jarkuslayer.props.data.features.forEach((feature, raai) => {
          //   feature.geometry.coordinates.forEach((coordinate, i) => {
          //     coordinate.push(feature.properties['z_1965'][i] * 30)
          //   })
          // });
        })
      }
    },


  //   updateJarkusLayer(year) {
  //     // fetch('./static/jarkus_years/jarkus_' + year + '.json')
  //     fetch('./static/data/jarkus_' + year + '.json')
  //       .then(resp => {
  //         return resp.json();
  //       })
  //       .then(json => {
  //         this.jarkuslayer.props.data.features.forEach((feature, raai) => {
  //         feature.geometry.coordinates.forEach((coordinate, i) => {
  //           coordinate.push(feature.properties[][i] * 30)
  //         })
  //       });
  //     }
  // },
  components: {
  }
};
