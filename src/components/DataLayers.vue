<template>
  <div></div>
</template>

<script>
import { bus } from '@/event-bus.js'

import { mapGetters, mapState, mapMutations } from 'vuex'
import { GeoJsonLayer } from '@deck.gl/layers'
// eslint-disable-next-line
import { Deck, MapController } from '@deck.gl/core'
import tinygradient from 'tinygradient'
import moment from 'moment'
import mapboxgl from 'mapbox-gl'
import _ from 'lodash'
// eslint-disable-next-line
const showLayers = {}
// eslint-disable-next-line
const testLayerShow = true
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
        const jarkuslayer = val.find(
          layer => layer.layertype === 'deckgl-layer'
        )

        if (jarkuslayer && this.years.length === 0) {
          this.years = _.range(
            parseInt(
              moment(
                jarkuslayer.timeslider.begindate,
                jarkuslayer.timeslider.format
              ).format('YYYY')
            ),
            parseInt(
              moment(
                jarkuslayer.timeslider.enddate,
                jarkuslayer.timeslider.format
              ).format('YYYY')
            )
          )
          this.steps = this.years[this.years.length - 1] - this.years[0] + 1
          var endYear = this.years[this.years.length - 1]
          // For each year fetch the Jarkus data
          Promise.all(
            this.years.map(year => {
              return this.fetchJarkus(year, endYear)
            })
          ).then(resp => {
            bus.$emit('jarkus-loaded')
          })
        }
      }
    }
  },
  data () {
    return {
      activeYears: [],
      steps: 0,
      timeExtent: [],
      years: []
    }
  },
  created () {
    bus.$on('slider-created', event => {
      this.timeExtent[0] = moment(event.begindate, 'MM-YYYY')
      this.timeExtent[1] = moment(event.enddate, 'MM-YYYY')
    })
  },
  mounted () {
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
    bus.$on('update-gee-layer', layer => {
      this.updateGEELayer(layer)
    })

    bus.$on('slider-update', event => {
      var jarkus = this.layers.find(layer => layer.data[0].id === 'jarkus')
      this.timeExtent[0] = event.begindate
      this.timeExtent[1] = event.enddate
      var endyear = moment(this.timeExtent[1], 'MM-YYYY').format('YYYY')
      var beginyear = moment(this.timeExtent[0], 'MM-YYYY').format('YYYY')
      var activeYears = _.range(endyear, beginyear)

      if (this.activeYears !== activeYears) {
        this.activeYears = activeYears
        if (jarkus && jarkus.active) {
          this.updateJarkusLayer(this.activeYears, jarkus.active)
        }
      }
      if (this.activeYears !== activeYears) {
        this.activeYears = activeYears
      }
      if (!this.map) {
        return
      }
      if (this.activeYears[this.activeYears.length - 1] !== endyear) {
        const customLayers = ['Kustindicatoren', 'MKL', 'Kustlijnkaartenboek']
        customLayers.forEach(customLayer => {
          var kustLayer = this.layers.find(layer => layer.name === customLayer)
          this.updateKust(kustLayer, endyear)
        })
      }
      this.updateNourishmentFilter()
    })
    bus.$on('update-deckgl', event => {
      // This is a specific update for the Jarkus layers only
      this.updateJarkusLayer(this.activeYears, event)
    })

    bus.$on('slider-end', event => {
      this.setTimesliderEndYear(moment(event.enddate, 'MM-YYYY').format('YYYY'))
      var activeGEElayers = this.layers.filter(
        layer => layer.layertype === 'gee-layer' && layer.active
      )
      activeGEElayers.forEach(layer => {
        this.updateGEELayer(layer)
      })
    })
  },
  methods: {
    ...mapMutations(['setJarkusLayers', 'updateLayer', 'setTimesliderEndYear']),
    updateNourishmentFilter () {
      var filter = [
        'all',
        [
          '>',
          ['get', 'Begin datum'],
          moment(this.timeExtent[0], 'MM-YYYY').format('YYYY-MM')
        ],
        [
          '<',
          ['get', 'Eind datum'],
          moment(this.timeExtent[1], 'MM-YYYY').format('YYYY-MM')
        ]
      ]

      const filters = ['nourishments', 'nourishments_points']
      filters.forEach(f => {
        if (this.map.getLayer(f)) {
          this.map.setFilter(f, filter)
        }
      })
      this.map.setFilter('nourishments_hover', ['==', 'ID', ''])
    },
    addMapboxLayers () {
      this.layers.forEach((layer, index) => {
        if (layer.layertype === 'mapbox-layer-group') {
          layer.data.forEach((sublayer, index) => {
            if (!this.map.getLayer(sublayer.id)) {
              this.map.addLayer(sublayer)
              this.map.setLayoutProperty(sublayer.id, 'visibility', 'none')
            }
          })
        } else if (layer.layertype === 'mapbox-layer') {
          if (!this.map.getLayer(layer.id)) {
            this.map.addLayer(layer)
            this.map.setLayoutProperty(layer.id, 'visibility', 'none')
          }
        }
      })
    },
    fetchJarkus (year, endYear) {
      return fetch(`${process.env.VUE_APP_JARKUS_BASE_URL}${year}.json`)
        .then(resp => {
          return resp.json()
        })
        .catch(error => console.log('error is', error))
        .then(json => {
          var dist = 7
          json.features.forEach(f => {
            const coords = f.geometry.coordinates
            var beginCoord = coords[0]
            var begin = mapboxgl.MercatorCoordinate.fromLngLat({ lng: beginCoord[0], lat: beginCoord[1] })

            var endCoord = coords[coords.length - 1]
            var end = mapboxgl.MercatorCoordinate.fromLngLat({ lng: endCoord[0], lat: endCoord[1] })

            var dx = end.x - begin.x
            var dy = end.y - begin.y

            var angle = Math.atan2(dy, dx) + 0.5 * Math.PI
            f.geometry.coordinates.forEach(coord => {
              // Convert to cartesian

              var coordMercator = mapboxgl.MercatorCoordinate.fromLngLat({
                lng: coord[0],
                lat: coord[1]
              })

              var x01 = coordMercator.x
              var x = x01 / coordMercator.meterInMercatorCoordinateUnits()
              x += (year - endYear) * dist * Math.cos(angle)
              x01 = x * coordMercator.meterInMercatorCoordinateUnits()

              var y01 = coordMercator.y
              var y = y01 / coordMercator.meterInMercatorCoordinateUnits()
              y += (year - endYear) * dist * Math.sin(angle)
              y01 = y * coordMercator.meterInMercatorCoordinateUnits()

              coordMercator.x = x01
              coordMercator.y = y01
              var newCoord = coordMercator.toLngLat()
              coord[0] = newCoord.lng
              coord[1] = newCoord.lat
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
            getElevation: 30,
            wireframe: false,
            fp64: false,
            getLineColor: d => {
              var rgb = gradient[year - 1965].toRgb()
              rgb.a = 255
              return Object.values(rgb)
            },
            getLineWidth: 0.5,
            onHover: d => {
              if (d.index === -1) {
                this.popup.remove()
              } else {
                this.popup
                  .setLngLat([d.coordinate[0], d.coordinate[1]])
                  .setHTML(
                    `Transect Id: ${d.object.id
                      .split('-')[0]
                      .toString()}<br> year: ${year}`
                  )
                  .addTo(this.map)
              }
            },
            onClick: d =>
              window.open(
                `${process.env.VUE_APP_COASTVIEWER_SERVER_URL}/${d.object.id
                  .split('-')[0]
                  .toString()}`,
                '_blank'
              )
          }
          this.setJarkusLayers({ year: year, layer: jarkuslayer })
        })
    },
    updateJarkusLayer (years, active) {
      var layers = []
      if (active) {
        // Filter out years that don't have data loaded, then create layers
        layers = years
          .filter(l => this.jarkusLayers[String(l)] !== undefined)
          .map(l => {
            return new GeoJsonLayer(this.jarkusLayers[String(l)])
          })
      }
      this.deckgl.setProps({ layers: layers })
    },
    updateGEELayer (layer) {
      // Only when layer active
      if (!layer.active) {
        return
      }
      // If a new layer is added, update the store
      if (!layer.static) {
        layer.ghostlayercount += 1
        this.updateLayer(layer)
      }

      // Create jsonData for fetch request
      layer.data.forEach(data => {
        let format = 'MM-YYYY'
        var jsonData = {
          dataset: data.id,
          begin_date: moment(this.timeExtent[0], format),
          end_date: moment(this.timeExtent[1], format),
          min: data.min * layer.minmaxfactor,
          max: data.max * layer.minmaxfactor
        }
        if (layer.hillshade) {
          jsonData.hillshade = layer.hillshade
        }
        if (layer.static) {
          if (this.map.getLayer(data.id)) {
            return
          } else {
            format = layer.timeslider.format
            jsonData.begin_date = moment(layer.timeslider.begindate, format)
            jsonData.end_date = moment(layer.timeslider.enddate, format)
          }
        }
        bus.$emit('loading-layer', jsonData)

        fetch(`${process.env.VUE_APP_SERVER_URL}/get_bathymetry`, {
          method: 'POST',
          body: JSON.stringify(jsonData),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(resp => {
            return resp.json()
          })
          .then(json => {
            bus.$emit('layer-loaded', jsonData)

            if (json.url) {
              const mapUrl = json.url
              data.source.tiles = [mapUrl]
              data.layout.visibility = 'visible'
              const newData = Object.assign({}, data)
              newData.id = `${data.id}_${layer.ghostlayercount}`
              this.map.addLayer(newData)

              const oldId = `${data.id}_${layer.ghostlayercount - 1}`

              if (this.map.getLayer(oldId)) {
                setTimeout(() => {
                  this.map.removeLayer(oldId)
                  this.map.removeSource(oldId)
                }, 5000)
              }

              bus.$emit('check-layer-order')
            } else {
              const oldId = `${data.id}_${layer.ghostlayercount - 1}`
              this.map.removeLayer(oldId)
              this.map.removeSource(oldId)
            }
          })
          .catch(() => {
            const oldId = `${data.id}_${layer.ghostlayercount - 1}`
            this.map.removeLayer(oldId)
            this.map.removeSource(oldId)
            bus.$emit('layer-error', data.id)
          })
      })
    },
    updateKust (layer, year) {
      if (!_.get(layer, 'active')) return
      layer.data.forEach(data => {
        if (data.source && data.source.data) {
          const url = data.source.data.split('.json')[0]
          const emptyurl = url.slice(0, -4)
          this.map.getSource(data.id).setData(`${emptyurl}${year}.json`)
        }
      })
    }
  }
}
</script>

<style>
.mapboxgl-popup {
  z-index: 10;
}
</style>
