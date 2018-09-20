import {
  bus
} from '@/event-bus.js';

import Vue2MapboxGL from 'vue2mapbox-gl';
import Vue from 'vue';
// import mapboxgl from 'mapbox-gl';
import moment from 'moment';
import tinygradient from 'tinygradient';
// import VFlowParticles from './VFlowParticles';
import {loadData} from './deckgl/utils/load-data';
import TWEEN from 'tween.js';
import ParticleLayer from './deckgl/particle-layer/particle-layer';

Vue.use(Vue2MapboxGL);

const animate = () => {
  TWEEN.update();
  window.requestAnimationFrame(animate);
};

import fsfp32 from './shaderlib/fs-fp32/fs-fp32';
import fsproject from './shaderlib/fs-project/fs-project';
import fslighting from './shaderlib/fs-lighting/fs-lighting';

registerShaderModules([fsfp32, fsproject, fslighting]);


const coastviewerServer = 'coastal-test.eu-west-1.elasticbeanstalk.com';
var SERVER_URL = 'https://hydro-engine.appspot.com'
export default {
  name: 'DataLayers',
  data() {
    return {
      layers: [],
      sources: [],
      map: null,
      deckgl: null,
      jarkuslayer: null,
      jarkusActive: true,
      // year: 1965,
      timeExtent: [moment("20110301", "YYYYMMDD"), moment()],
      gradient: null,
      steps: 52,
      layerlist: [],
      year: moment().format("YYYY"),
      viewport: {
          longitude: -98.31907156932937,
          latitude: 37.613897372628045,
          zoom: 4.241754140284522,
        },
      settings: {
          time: 30,
          showParticles: true,
          showWind: true,
          showElevation: true,
          useDevicePixels: true
        },
      state: {}
    };
  },
  watch: {
    // Watch "layers". This is a switch, which can toggle a layer on or off
    // When toggled, this watcher will activate the toggleLayers function.
    layers: {
      handler: function(layers) {
        this.layers = layers
        var layer = (this.layers.find(layer => layer.name === 'Jarkus'))
        this.jarkusActive = layer.active
        if (!this.jarkusActive){
          this.deckgl.setProps({layers: []})
        } else {
          this.addJarkusLayer(this.year)
        }
      },
      deep: true
    }
  },
  mounted() {
    this.gradient = tinygradient('#5614b0', '#dbd65c').rgb(this.steps)

    const particleState = {particleTime: 0};
    this._particleAnimation = new TWEEN.Tween(particleState)
      .to({particleTime: 60}, 1000)
      .onUpdate(() => {
        this.state.particleState = particleState
      })
      .repeat(Infinity);

    loadData().then(data => {
      animate();
      this.state.data = data
      this._particleAnimation.start();

      const webGL2Supported = this.state.webGL2Supported
      var viewport = this.viewport
      var settings = this.settings
      var layer = new ParticleLayer({
          id: 'particles',
          bbox: data.bbox,
          texData: data.texData,
          time: settings.time,
          zScale: 100
        })
      console.log('! misschien is die texData nog niet compleet gevuld: ', layer)
      this.deckgl = new DeckGL({
        ...viewport,
        controller: {type: MapController, dragRotate: true},
        mapboxApiAccessToken: "pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA",
        mapStyle: "mapbox://styles/mapbox/dark-v9",
        layers: [layer],
        glOptions: {webgl2: true},
        useDevicePixels: this.settings.useDevicePixels,
        onWebGLInitialized: this._onWebGLInitialized.bind(this),
        onViewportChange: (v => {this.viewport= v})
      });
      // this.deckgl = new DeckGL({
      //   mapboxApiAccessToken: "pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA",
      //   mapStyle: "mapbox://styles/mapbox/light-v9",
      //   latitude: 52,
      //   longitude: 4,
      //   zoom: 10
      // });
    Vue.set(this, 'deckgl', this.deckgl);

    this.map = this.deckgl.getMapboxMap()
    this.map.on('load', (event) => {
      bus.$emit('map-loaded', this.map)

      // map is loaded, notify everyone
      this.addLayers();
      // we can only add these layers after fetching the mapid and token

      // _.each(_.range(1965, 2016), (year) => {
      //   this.addJarkusLayer(year)
      // })

      // this.addVaklodingen()
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
        var vaklodingen = this.layers.find(layer => layer.data[0].id === "vaklodingen")
        var jarkus = this.layers.find(layer => layer.data[0].id === "jarkus")
        this.timeExtent[0] = event.begindate
        this.timeExtent[1] = event.enddate

        if (vaklodingen.active){
          this.map.removeLayer('vaklodingen')
          this.map.removeSource('vaklodingen')

          this.addVaklodingen()
        } else if (jarkus.active) {
          var year = moment(event.enddate, "MM-YYYY").format("YYYY")

          if (year != this.year) {
            this.year = year
            // var layer = this.deckgl.props.layers.find(layer => layer.id === event.enddate)
            this.addJarkusLayer(year)
          }
        }
      })
    });

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
          console.log(json)
          let mapUrl = this.getTileUrl(json.mapid, json.token);
          let layer = this.layers.find(item => item.name === "Vaklodingen").data[0]
          layer.source.tiles = [mapUrl]
          this.map.addLayer(layer);
          bus.$emit('select-layers', this.layers);
        });
    },

    addJarkusLayer(year) {
      fetch('https://s3-eu-west-1.amazonaws.com/deltares-opendata/jarkus/jarkus_' + year + '.json')
        .then(resp => {
          return resp.json();
        })
        .catch(error => console.log('error is', error))
        .then(json => {
          console.log(json)
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
            getLineColor: (d) => {
              var rgb = this.gradient[year - 1965].toRgb()
              rgb.a = 255
              return Object.values(rgb)
            },
            getLineWidth: d =>1,
            onHover: d => {
              if (d.index === -1) {
                this.popup.remove();
              }
              else {
                this.popup.setLngLat([d.lngLat[0], d.lngLat[1]])
                  .setHTML("Transect Id: " + d.object.id.split('-')[0].toString() + '<br> year: ' + year)
                  .addTo(this.map)
                }
              },
            onClick: d => window.open(coastviewerServer + '/coastviewer/1.1.0/transects/' + d.object.id.split('-')[0].toString() + '/info','_blank')
          })
          this.deckgl.setProps({layers: [this.jarkuslayer]});
        })
      },



      _onWebGLInitialized(gl) {
        const webGL2Supported = isWebGL2(gl);
        this.stat.webGL2Supported = webGL2Supported;
      },
      _updateViewport(viewport) {
        this.setState({
          viewport: {...this.state.viewport, ...viewport}
        });
      }

    },
  components: {
    // 'v-flow-particles': VFlowParticles,
  }
};