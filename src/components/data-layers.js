import {
  bus
} from '@/event-bus.js'

import Vue from 'vue'
import mapboxgl from 'mapbox-gl'
import moment from 'moment'
import tinygradient from 'tinygradient'
import _ from 'lodash'
import geojsonvt from 'geojson-vt'
import {TileLayer} from '@deck.gl/geo-layers'
import {GeoJsonLayer} from '@deck.gl/layers'
import {Deck, MapController}  from '@deck.gl/core'
import {VectorTile} from '@mapbox/vector-tile'
import Protobuf from 'pbf'
import VMapboxStylePicker from './VMapboxStylePicker'

const coastviewerServer = 'http://coastal-prod.eu-west-1.elasticbeanstalk.com'
// var SERVER_URL = 'https://hydro-engine.appspot.com'
const SERVER_URL = 'https://coast-viewer-dot-hydro-engine.appspot.com'
export default {
  name: 'DataLayers',
  data() {
    return {
      sources: [],
      map: null,
      jarkuslayer: null,
      jarkusActive: true,
      timeExtent: [moment("19650101", "YYYYMMDD"), moment("20180101", "YYYYMMDD")],
      gradient: null,
      steps: 52,
      layerlist: [],
      year: moment().format("YYYY"),
      viewState: {}
    }
  },
  provide () {
    // allows to use inject:  ['getMap']  in child components
    return {
      getMap: () => this.map
    }
  },
  created() {
    this.createMapboxMap()
  },
  mounted() {
    this.gradient = tinygradient('#5614b0', '#dbd65c').rgb(this.steps)

    this.popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false
    })

    var endyear = moment(this.timeExtent[1], "MM-YYYY").format("YYYY")
    var beginyear = moment(this.timeExtent[0], "MM-YYYY").format("YYYY")
    this.activeYears =  _.range(endyear, beginyear)

    bus.$on('update-deckgl', (event) => {
      console.log('updating deckgl', event)
      this.updateJarkusLayer(this.activeYears, event)
    })
    var years = _.range(this.timeExtent[1].format("YYYY"), this.timeExtent[0].format("YYYY"))
    years.forEach(year => {
      this.fetchJarkus(year)
    })




      bus.$on('slider-end', (event) => {
        var vaklodingen = this.$store.state.layers.find(layer => layer.data[0].id === "vaklodingen")
        if (vaklodingen.active){
          this.addVaklodingen()
        }
      })

      bus.$on('slider-update', (event) => {
        var jarkus = this.$store.state.layers.find(layer => layer.data[0].id === "jarkus")
        this.timeExtent[0] = event.begindate
        this.timeExtent[1] = event.enddate
        var endyear = moment(this.timeExtent[1], "MM-YYYY").format("YYYY")
        var beginyear = moment(this.timeExtent[0], "MM-YYYY").format("YYYY")
        var activeYears =  _.range(endyear, beginyear)


        if (!this.map.loaded()) {
          return
        }
        if(this.activeYears !== activeYears){
          if (jarkus && jarkus.active) {
            this.activeYears = activeYears
              // this.year = year
              // var layer = this.$store.state.deckgl.props.layers.find(layer => layer.id === event.enddate)
              this.updateJarkusLayer(this.activeYears, jarkus.active)
            }
        }

        var filter = [
            "all",
            [
              ">",
              ["get", "begin"],
              moment(this.timeExtent[0], "MM-YYYY").format("YYYY-MM")
            ],
            [
              "<",
              ["get", "eind"],
              moment(this.timeExtent[1], "MM-YYYY").format("YYYY-MM")
            ]
          ]

        const filters = ['nourishments', 'nourishments_points', 'nourishments_hover', 'nourishments_points_hover']
        filters.forEach(f => {
          if(this.map.getLayer(f)) {
            this.map.setFilter(f, filter)
          }
        })
      })

  },
  methods: {
    getTileUrl(mapId, token) {
      let baseUrl = "https://earthengine.googleapis.com/map"
      let url = `${baseUrl}/${mapId}/{z}/{x}/{y}?token=${token}`
      console.log(mapId, token, url)
      return url
    },
    addLayers() {
      // Function to add all layers made in the datalayers.json to the map
      // Layers can be individual layers or a list containing different Layers
      // a type indentifies as a single layer or a "group".
      fetch("./static/data/datalayers.json")
        .then(resp => {
          return resp.json()
        })
        .then(json => {
          _.each(json, (layer) => {
            if (layer.layertype ===  'mapbox-layer-group') {
              _.each(layer.data, (sublayer) => {
                this.map.addLayer(sublayer)
              })
            } else if (layer.layertype ===  'mapbox-layer') {
              this.map.addLayer(layer)
            }
            this.$store.state.layers.push(layer)
            bus.$emit('update-layers')
            // bus.$emit('add-layer', layer)
          })
        })
    },

    addVaklodingen() {
      var json_data = {
        "dataset": "ahn",
        "begin_date": moment(this.timeExtent[0], "MM-YYYY"),
        "end_date": moment(this.timeExtent[1], "MM-YYYY"),
        "hillshade": true
      }

      fetch( `${SERVER_URL}/get_bathymetry`, {
          method: "POST",
          body: JSON.stringify(json_data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(resp => {
          return resp.json()
        })
        .then(json => {
          let mapUrl = this.getTileUrl(json.mapid, json.token)
          let layer = this.$store.state.layers.find(item => item.name === "Vaklodingen").data[0]
          layer.source.tiles = [mapUrl]
          if(this.map.getLayer('vaklodingen')){
            this.map.removeLayer('vaklodingen')
            this.map.removeSource('vaklodingen')
          }
          this.map.addLayer(layer)
          bus.$emit('update-layers')
        })
    },



    updateJarkusLayer(years, active) {
      if (active){
        var layers = []
        //  TODO: uncomment this line and remove next to switch to series of jarkus raaien depending on timeslider
        var layers =  years.map(l => this.$store.state.jarkusLayers[String(l)])
        // var layers = this.$store.state.jarkusLayers[String(years[years.length - 1])]
        console.log('updating', layers, years, this.$store.state.jarkusLayers)
        this.$store.state.deckgl.setProps({layers: layers})
      } else {
        this.$store.state.deckgl.setProps({layers: []})
      }
    }
  },
  components: {
    VMapboxStylePicker
  }
}
