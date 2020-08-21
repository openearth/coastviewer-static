<template>
<v-container fluid fill-height pa-0>
  <div id="map">
    <v-mapbox-legend v-show="showLegend"></v-mapbox-legend>
    <v-mapbox-style-picker v-if="map !== null" />
    <v-measure-distance v-if="showDistance"/>
    <data-layers></data-layers>
  </div>
  <canvas id="deck-canvas"></canvas>
</v-container>
</template>

<script>
import {
  bus
} from '@/event-bus.js'

import VMapboxStylePicker from './VMapboxStylePicker'
import VMeasureDistance from './VMeasureDistance'
import VMapboxLegend from './VMapboxLegend'
import {
  TileLayer
} from '@deck.gl/geo-layers'
import {
  GeoJsonLayer
} from '@deck.gl/layers'
import {
  Deck,
  MapController
} from '@deck.gl/core'
import DataLayers from './DataLayers'
import {
  mapMutations
} from 'vuex'
import mapboxgl from 'mapbox-gl'
import DataTable from './DataTable'
import Vue from 'vue'
import MapboxDraw from '@mapbox/mapbox-gl-draw'


export default {
  name: 'MapComponent',
  props: {
    showLegend: {
      type: Boolean
    },
    showDistance: {
      type: Boolean
    }
  },
  provide() {
    // allows to use inject:  ['getMap']  in child components
    return {
      getMap: () => this.map
    }
  },
  data() {
    return {
      map: null,
      deckgl: null,
      showModal: false,
      tableHeaders: [],
      tableItems: [],
      popup: {},
      dataTable: Vue.extend(DataTable)
    }
  },
  mounted() {
    this.viewState = {
      latitude: 52,
      longitude: 4,
      zoom: 10
    }

    this.createMapboxMap()
    this.createMapboxPopup()
    this.createDeckGlObject()

    this.map.on('load', (event) => {
      bus.$emit('map-loaded', this.map)

      this.map.on('move', (e) => {
        this.viewState = {
          longitude: this.map.getCenter().lng,
          latitude: this.map.getCenter().lat,
          zoom: this.map.getZoom(),
          bearing: this.map.getBearing(),
          pitch: this.map.getPitch()
        }
        this.deckgl.setProps({
          viewState: this.viewState
        })

      })
      this.map.resize()
    })
    bus.$on('slider-update', (event) => {
      this.popup.remove()
    })
    bus.$on('update-suppleties', () => {
      this.popup.remove()
    })
  },
  methods: {
    ...mapMutations(['setDeckgl']),
    createMapboxMap() {
      mapboxgl.accessToken = "pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
      this.map = new mapboxgl.Map({
        container: 'map',
        style: "mapbox://styles/mapbox/light-v9",
        interactive: true,
        center: [this.viewState.longitude, this.viewState.latitude],
        zoom: this.viewState.zoom,
        preserveDrawingBuffer: true
      })
      this.map.addControl(new mapboxgl.NavigationControl())

      var scale = new mapboxgl.ScaleControl({
        maxWidth: 200,
        unit: 'imperial'
      })
      this.map.addControl(scale, 'top-left')

      scale.setUnit('metric')

    },
    createMapboxPopup() {
      this.popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true
      })
    },
    createDeckGlObject() {
      this.deckgl = new Deck({
        canvas: 'deck-canvas',
        width: '100%',
        height: '100%',
        controller: true,
        initialViewState: this.viewState,
        onViewStateChange: ({
          viewState
        }) => {
          this.viewState = viewState
          this.map.jumpTo({
            center: [viewState.longitude, viewState.latitude],
            zoom: viewState.zoom,
            bearing: viewState.bearing,
            pitch: viewState.pitch
          });
        },
        onClick: props => {
          if(this.showDistance) {
            console.log('clicked on map', props)
            bus.$emit('clicked-on-map', props)
          }
          this.popup.remove()
          const mapboxFeatures = this.map.queryRenderedFeatures([props.x, props.y])
          // If there are none mapboxfeatures at all, return
          if (!mapboxFeatures[0]) {
            return
          }

          var layerId = mapboxFeatures[0].layer.id
          if (layerId === 'nourishments_hover') {
            var layerId = mapboxFeatures[1].layer.id
          }
          if (layerId === 'nourishments_points') {
            this.tableHeaders = [{
              text: 'Metadata',
              align: 'left',
              sortable: false,
              value: 'name',
              class: 'primary'
            },
            {
              style: 'font-color: blue',
              align: 'left',
              sortable: false,
              value: 'value',
              class: 'primary'
            }
            ]

            this.tableItems = []

            var f = mapboxFeatures[0]
            Object.entries(f.properties).forEach(val => {
              if (val[0] !== 'ID') {
                this.tableItems.push({
                  value: val[1],
                  name: val[0]
                })
              }
            })
            this.popup.setLngLat(props.coordinate)
              .setHTML('<div id="vue-popup-content"></div>')
              .addTo(this.map)
              .setMaxWidth("320px")

            new this.dataTable({
              propsData: {
                tableHeaders: this.tableHeaders,
                tableItems: this.tableItems
              }
            }).$mount('#vue-popup-content')
          }
        },
        onHover: props => {

          const dist = 1
          const mapboxFeatures = this.map.queryRenderedFeatures([props.x - 1, props.y - 1, props.x + 1, props.y + 1])
          this.map.getCanvas().style.cursor = ''

          if (!mapboxFeatures[0]) {
            return
          }

          var layerIds = mapboxFeatures.map(layer => layer.source)
          // TODO: find better way to get this list from the layers config.
          const hoverLayers = [{
            layerId: 'nourishments_points',
            hoverId: 'nourishments_hover'
          }]
          hoverLayers.forEach(hover => {
            if (!layerIds.includes(hover.layerId)) {
              this.map.setFilter(hover.hoverId, ["==", "ID", ""])
              return
            }
            if (this.map.getLayer(hover.hoverId)) {
              this.map.setFilter(hover.hoverId, ["==", "ID", mapboxFeatures[0].properties.ID])
            }
          })

        }
      })
      this.setDeckgl(this.deckgl)
    }
  },
  components: {
    VMapboxStylePicker,
    DataLayers,
    VMapboxLegend,
    VMeasureDistance
  }
}
</script>

<style>
.deck-canvas,
#map {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
