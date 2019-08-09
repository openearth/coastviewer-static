import {
  bus
} from '@/event-bus.js'

import Vue2MapboxGL from 'vue2mapbox-gl'
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

Vue.use(Vue2MapboxGL)

const coastviewerServer = 'http://coastal-prod.eu-west-1.elasticbeanstalk.com'
var SERVER_URL = 'https://hydro-engine.appspot.com'
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
  mounted() {
    this.gradient = tinygradient('#5614b0', '#dbd65c').rgb(this.steps)
    this.viewState = {
      latitude: 52,
      longitude: 4,
      zoom: 10
    }

    mapboxgl.accessToken =  "pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
    this.map = new mapboxgl.Map({
      container: 'map',
      style:  "mapbox://styles/mapbox/light-v9",
      interactive: true,
      center: [this.viewState.longitude, this.viewState.latitude],
      zoom: this.viewState.zoom
    })
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



    var deck = new Deck({
      canvas: 'deck-canvas',
      width: '100%',
      height: '100%',
      controller: true,
      initialViewState: this.viewState,
      onViewStateChange: ({viewState}) => {
        this.viewState = viewState
        this.map.jumpTo({
          center: [viewState.longitude, viewState.latitude],
          zoom: viewState.zoom,
          bearing: viewState.bearing,
          pitch: viewState.pitch
        });
      },
      onClick: props => {

        this.popup.remove()
        const mapboxFeatures = this.map.queryRenderedFeatures([props.x, props.y])
        if (!mapboxFeatures[0]) {return}
        var layerId = mapboxFeatures[0].layer.id
        if (layerId === 'nourishments' || layerId === 'nourishments_points') {
          var f = mapboxFeatures[0]

          console.log('layerId', layerId, f.properties)
          var description = ""
          Object.entries(f.properties).forEach(val => {
            if(val[0] !== 'id'){
              description +=  `<tr><th>${val[0]}</th><th>${val[1]}</th></tr>`
            }
          })
          this.popup.setLngLat([props.lngLat[0], props.lngLat[1]])
            .setHTML(`<table>${description}</table>`)
            .addTo(this.map)
        }
      },
      onHover: props => {
        const dist = 1
        const mapboxFeatures = this.map.queryRenderedFeatures([props.x - 1, props.y -1 ,props.x + 1, props.y + 1])

        if (!mapboxFeatures[0]) {return}

        var layerId = mapboxFeatures[0].layer.id
        if (layerId === 'nourishments_points') {
          this.map.getCanvas().style.cursor = 'pointer'

          this.map.setFilter("nourishments_points_hover", ["==", "id", mapboxFeatures[0].properties.id])
        }
        else if (layerId === 'nourishments') {
          this.map.getCanvas().style.cursor = 'pointer'

          this.map.setFilter("nourishments_hover", ["==", "id", mapboxFeatures[0].properties.id])
        }
        else {
          this.map.getCanvas().style.cursor = ''
          this.map.setFilter("nourishments_hover", ["==", "id", ""])
          this.map.setFilter("nourishments_points_hover", ["==", "id", ""])
        }
      }
    })
    this.$store.commit('setDeckgl', deck)

    this.map.addControl(new mapboxgl.NavigationControl())
    this.map.on('load', (event) => {
      this.map.on('move', (e) => {
        this.viewState = {
          longitude: this.map.getCenter().lng,
          latitude: this.map.getCenter().lat,
          zoom: this.map.getZoom(),
          bearing: this.map.getBearing(),
          pitch: this.map.getPitch()
        }
        this.$store.state.deckgl.setProps({
          viewState: this.viewState
        })

      })
      this.map.resize()
      bus.$emit('map-loaded', this.map)
      this.addVaklodingen()
      // map is loaded, notify everyone
      this.addLayers()
    })

      bus.$on('slider-end', (event) => {
        var vaklodingen = this.$store.state.layers.find(layer => layer.data[0].id === "vaklodingen")
        if (vaklodingen.active){
          this.addVaklodingen()
        }
      })

      bus.$on('slider-update', (event) => {
        console.log('slider=update', this.$store.state.layers)
        var jarkus = this.$store.state.layers.find(layer => layer.data[0].id === "jarkus")
        this.timeExtent[0] = event.begindate
        this.timeExtent[1] = event.enddate
        var endyear = moment(this.timeExtent[1], "MM-YYYY").format("YYYY")
        var beginyear = moment(this.timeExtent[0], "MM-YYYY").format("YYYY")
        var activeYears =  _.range(endyear, beginyear)

        console.log('jarkus', jarkus, activeYears)
        if(this.activeYears !== activeYears){
          if (jarkus && jarkus.active) {
            this.activeYears = activeYears
              // this.year = year
              // var layer = this.$store.state.deckgl.props.layers.find(layer => layer.id === event.enddate)
              console.log(this.activeYears, this.$store.state.layers, this.$store.state.layers.find(x => x.name==="Jarkus"))
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
    deferredMountedTo (map) {
      console.log(map)
      // initialize control
      this.map = map
    },
    getTileUrl(mapId, token) {
      let baseUrl = "https://earthengine.googleapis.com/map"
      let url = [baseUrl, mapId, "{z}", "{x}", "{y}"].join("/")
      url += "?token=" + token
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
        "dataset": "vaklodingen",
        "begin_date": moment(this.timeExtent[0], "MM-YYYY"),
        "end_date": moment(this.timeExtent[1], "MM-YYYY"),
        "max": 500,
        "min": -1500,
        "hillshade": true
        // "palette": "#A49018,#B89E21,#E2B247,#F3CA89,#D9E0A3,#D7F1FF,#A1DBFF,#86D0FF,#6BC5FF,#35AFFF,#1AA4FF,#0099FF,#2176FF,#3265FF,#4354FF,#6532FF,#7621FF,#8810FF,#9900FF,#9900FF"
      }

      fetch(SERVER_URL + "/get_bathymetry", {
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

    fetchJarkus(year) {
      fetch(`https://s3-eu-west-1.amazonaws.com/deltares-opendata/jarkus/jarkus_${year}.json`)
        .then(resp => {
          return resp.json()
        })
        .catch(error => console.log('error is', error))
        .then(json => {
          var dist = 0.00005
          json.features.forEach(f => {
            var begin = json.features[0].geometry.coordinates[0]
            var end = json.features[0].geometry.coordinates[10]
            var dx = end[0] - begin[0]
            var dy = end[1] - begin[1]
            var angle = Math.atan(dx/dy) + (1.25 * Math.PI)
            f.geometry.coordinates.forEach(coord => {
              coord[0] += (year - 1964) * dist * Math.cos(angle)
              coord[1] += (year - 1964) * dist * Math.sin(angle)
              return coord
            })
            return f
          })
          var gradient = tinygradient('#5614b0', '#dbd65c').rgb(this.steps)
          var jarkuslayer = new GeoJsonLayer ({
            id: `jarkus-${year}`,
            data: json,
            pickable: true,
            filled: false,
            extruded: true,
            lineWidthScale: 20,
            // lineWidthMinPixels: 2,
            // elevationScale: 30,
            getElevation: 30,
            wireframe: false,
            fp64: false,
            getLineColor: (d) => {
              var rgb = gradient[year - 1965].toRgb()
              rgb.a = 255
              return Object.values(rgb)
            },
            getLineWidth: 1,
            onHover: d => {
              if (d.index === -1) {
                this.popup.remove()
              }
              else {
                this.popup.setLngLat([d.lngLat[0], d.lngLat[1]])
                  .setHTML("Transect Id: " + d.object.id.split('-')[0].toString() + '<br> year: ' + year)
                  .addTo(this.map)
                }
              },
            onClick: d => window.open(`${coastviewerServer}/coastviewer/1.1.0/transects/${d.object.id.split('-')[0].toString()}/info`,'_blank')
          })
          this.$store.commit('setJarkusLayers', {year: year, layer: jarkuslayer})
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
