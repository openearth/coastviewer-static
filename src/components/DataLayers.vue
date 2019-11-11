<template>
  <div></div>
</template>

<script>
import {
  bus
} from '@/event-bus.js'

import { mapGetters, mapState, mapMutations } from 'vuex'
import {GeoJsonLayer} from '@deck.gl/layers'
import {Deck, MapController}  from '@deck.gl/core'
import tinygradient from 'tinygradient'
import moment from 'moment'
import mapboxgl from 'mapbox-gl'
import _ from 'lodash'

const jarkusUrl = 'https://s3-eu-west-1.amazonaws.com/deltares-opendata/jarkus/jarkus_'
const SERVER_URL = 'https://coast-viewer-dot-hydro-engine.appspot.com'
const coastviewerServer = 'http://coastal-prod.eu-west-1.elasticbeanstalk.com'

let showLayers = {}
let testLayerShow = true
export default {
  name: 'DataLayers',
  computed: {
    ...mapGetters(['getAllLayers']),
    ...mapState(['layers', 'jarkusLayers', 'deckgl'])
  },
  watch: {
    layers: {
      handler: function (val, oldVal) {
        // If the layers in the store are set, make sure to fetch all jarkus json
        const jarkuslayer = val.find(layer => layer.layertype === "deckgl-layer")
        // this.updateJarkusLayer(this.activeYears, jarkuslayer.active)
        if (jarkuslayer && this.years.length === 0) {
          this.years = _.range(parseInt(moment(jarkuslayer.timeslider.begindate, jarkuslayer.timeslider.format).format("YYYY")),
            parseInt(moment(jarkuslayer.timeslider.enddate, jarkuslayer.timeslider.format).format("YYYY"))
          )
          this.steps = this.years[this.years.length-1] - this.years[0] + 1
          // For each year fetch the Jarkus data
          Promise.all(this.years.map(year => {
            return this.fetchJarkus(year)
          }))
          .then (resp => {
            bus.$emit('jarkus-loaded')
          })
        }
      }
    }
  },
  data() {
    return {
      activeYears: [],
      steps: 0,
      timeExtent: [],
      years: []
    }
  },

  created() {
    bus.$on('slider-created', event => {
      this.timeExtent[0] = moment(event.begindate, 'MM-YYYY')
      this.timeExtent[1] = moment(event.enddate, 'MM-YYYY')
    })
  },
  mounted() {

    // create specific popup for Jarkus
    this.popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false
    })

    bus.$on('map-loaded', map => {
      this.map = map
      this.addMapboxLayers()
      this.updateNourishmentFilter()
    })

    bus.$on('update-gee-layer', (layer) => {
      console.log('update-gee')
      this.updateGEELayer(layer)
    })

    bus.$on('slider-update', (event) => {
      var jarkus = this.layers.find(layer => layer.data[0].id === "jarkus")
      this.timeExtent[0] = event.begindate
      this.timeExtent[1] = event.enddate
      var endyear = moment(this.timeExtent[1], "MM-YYYY").format("YYYY")
      var beginyear = moment(this.timeExtent[0], "MM-YYYY").format("YYYY")
      var activeYears =  _.range(endyear, beginyear)
      if (!this.map) {
        return
      }


      if(this.activeYears[this.activeYears.length -1] !== endyear) {
        var kustLayer = this.layers.find(layer => layer.name === "Kustindicatoren")
        this.updateKust(kustLayer, endyear)
      }

      if(this.activeYears !== activeYears){
        if (jarkus && jarkus.active) {
          this.activeYears = activeYears
          // this.years.map(year => {
          //   if (this.activeYears.includes(year)) showLayers[year] = true
          //   else showLayers[year] = false
          // })
            // this.year = year
            // var layer = this.$store.state.deckgl.props.layers.find(layer => layer.id === event.enddate)
            this.updateJarkusLayer(this.activeYears, jarkus.active)
          }
      }
      this.updateNourishmentFilter()
    })
    bus.$on('update-deckgl', (event) => {
      // This is a specific update for the Jarkus layers only
      this.updateJarkusLayer(this.activeYears, event)
    })

    bus.$on('slider-end', (event) => {
      var activeGEElayers = this.layers.filter(layer => layer.layertype === "gee-layer" && layer.active)
      activeGEElayers.forEach(layer => {
        this.updateGEELayer(layer)
      })
    })
  },
  methods: {
    ...mapMutations(['setJarkusLayers', 'updateLayer']),
    updateNourishmentFilter() {
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
    },
    addMapboxLayers(){
      this.layers.forEach((layer, index) => {
        if (layer.layertype ===  'mapbox-layer-group') {
          layer.data.forEach((sublayer, index) => {
            if(!this.map.getLayer(sublayer.id)) {
              this.map.addLayer(sublayer)
              this.map.setLayoutProperty(sublayer.id, 'visibility', 'none')
            }
          })
        } else if (layer.layertype ===  'mapbox-layer') {
          if(!this.map.getLayer(layer.id)) {
            this.map.addLayer(layer)
            this.map.setLayoutProperty(layer.id, 'visibility', 'none')
          }
        }
      })
    },

    fetchJarkus(year) {
      return fetch(`${jarkusUrl}${year}.json`)
        .then(resp => {
          return resp.json()
        })
        .catch(error => console.log('error is', error))
        .then(json => {
          var dist = 0.00005
          json.features.forEach(f => {
            const coords = json.features[0].geometry.coordinates
            var begin = coords[0]
            var end = coords[coords.length - 1]
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
          var jarkuslayer = {
            id: `jarkus-${year}`,
            data: json,
            pickable: true,
            filled: false,
            extruded: true,
            lineWidthScale: 20,
            // lineWidthMinPixels: 2,
            // elevationScale: 30
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
                  .setHTML(`Transect Id: ${d.object.id.split('-')[0].toString() }<br> year: ${year}`)
                  .addTo(this.map)
                }
              },
            onClick: d => window.open(`${coastviewerServer}/coastviewer/1.1.0/transects/${d.object.id.split('-')[0].toString()}/info`,'_blank'),
          }
          this.setJarkusLayers({year: year, layer: jarkuslayer})
        })
    },
    updateJarkusLayer(years, active) {
      var layers = []
      if (active){
        //  TODO: uncomment this line and remove next to switch to series of jarkus raaien depending on timeslider
        var layers =  years.map(l => {
          return new GeoJsonLayer(this.jarkusLayers[String(l)])
        })
      }
      this.deckgl.setProps({layers: layers})
    },

    getTileUrl(mapId, token) {
      let baseUrl = "https://earthengine.googleapis.com/map"
      let url = `${baseUrl}/${mapId}/{z}/{x}/{y}?token=${token}`
      return url
    },

    updateGEELayer(layer) {
      if (!layer.static){
        layer.ghostlayercount += 1
        this.updateLayer(layer)
      }
      layer.data.forEach(data =>{
        let format = "MM-YYYY"
        var json_data = {
          "dataset": data.id,
          "begin_date": moment(this.timeExtent[0], format),
          "end_date": moment(this.timeExtent[1], format),
          "min": data.min,
          "max": data.max
        }
        if (layer.hillshade) {
          json_data.hillshade = layer.hillshade
        }
        if (layer.static){
          if (this.map.getLayer(data.id)){
            return
          } else {
            format = layer.timeslider.format
            json_data.begin_date = moment(layer.timeslider.begindate, format)
            json_data.end_date = moment(layer.timeslider.enddate, format)
          }
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
            if(json.mapid && json.token) {
              let mapUrl = this.getTileUrl(json.mapid, json.token)
              data.source.tiles = [mapUrl]
              data.layout.visibility = "visible"
              const newData = Object.assign({}, data)
              newData.id = `${data.id}_${layer.ghostlayercount}`
              this.map.addLayer(newData)

              const oldId = `${data.id}_${layer.ghostlayercount-1}`

              if(this.map.getLayer(oldId)){
                setTimeout(() => {
                  this.map.removeLayer(oldId)
                  this.map.removeSource(oldId)
                }, 5000)
              }

              bus.$emit('check-layer-order')
            }
          })
      })

    },
    updateKust(layer, year) {
      if (!layer.active) return
      layer.data.forEach(data => {
        const url = data.source.data.split(".json")[0]
        const emptyurl = url.slice(0, -4)
        this.map.getSource(data.id).setData(`${emptyurl}${year}.json`)
      })

    }
  }
}
</script>

<style>
@import 'mapbox-gl/dist/mapbox-gl.css';

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

.mapboxgl-popup {
  z-index: 10;
}

</style>
