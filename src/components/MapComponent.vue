<template>
<v-container fluid fill-height pa-0>
  <div id="map">
    <v-mapbox-legend v-show="showLegend"></v-mapbox-legend>
    <v-mapbox-style-picker v-if="map !== null"  :satelliteLayerName="satelliteLayerName" :rightDrawer="rightDrawer" />
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
// eslint-disable-next-line
import { TileLayer } from '@deck.gl/geo-layers'
// eslint-disable-next-line
import { GeoJsonLayer} from '@deck.gl/layers'
// eslint-disable-next-line
import { Deck, MapController } from '@deck.gl/core'
import DataLayers from './DataLayers'
import { mapMutations } from 'vuex'
import mapboxgl from 'mapbox-gl'
import DataTable from './DataTable'
import DataSelectionTable from './DataSelectionTable'
import Vue from 'vue'
// eslint-disable-next-line
import MapboxDraw from '@mapbox/mapbox-gl-draw'

export default {
  name: 'MapComponent',
  props: {
    showLegend: {
      type: Boolean
    },
    showDistance: {
      type: Boolean
    },
    rightDrawer: {
      type: Boolean
    },
    satelliteLayerName: {
      type: String
    }
  },
  provide () {
    // allows to use inject:  ['getMap']  in child components
    return {
      getMap: () => this.map
    }
  },

  data () {
    return {
      map: null,
      deckgl: null,
      showModal: false,
      tableHeaders: [{
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
      }],
      tableItems: [],
      tableSelectionItems: [],
      popup: {},
      LocalDataTable: Vue.extend(DataTable),
      DataSelectionTable: Vue.extend(DataSelectionTable)
    }
  },
  mounted () {
    this.viewState = {
      latitude: 52.1,
      longitude: 4.5,
      zoom: 9.2
    }

    // saving data about the Nourisments in a certain area as a global variable,
    // so that this can be called when pressing the buttons (and subsequently when leaving the onClick function)
    this.nourishmentsArea = []
    this.pressedLocation = null

    this.createMapboxMap()
    this.createMapboxPopup()
    this.createMultipleSelectPopup()
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
      this.selectionPopup.remove()
    })
    bus.$on('update-suppleties', () => {
      this.popup.remove()
      this.selectionPopup.remove()
    })
    bus.$on('nourishmentRowSelected', value => {
      // listens to see if nourishment is selected in DataSelectionTable
      this.selectNourishment(value)
    })
  },
  methods: {
    ...mapMutations(['setDeckgl']),
    createMapboxMap () {
      mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v9',
        interactive: true,
        center: [this.viewState.longitude, this.viewState.latitude],
        zoom: this.viewState.zoom,
        preserveDrawingBuffer: true
      })

      // Add scale
      var scale = new mapboxgl.ScaleControl({
        maxWidth: 200,
        unit: 'imperial'
      })
      this.map.addControl(scale, 'top-left')
      scale.setUnit('metric')

      // Add navigation controller
      this.map.addControl(new mapboxgl.NavigationControl({
        visualizePitch: true
      }), 'top-left')
    },
    createMapboxPopup () {
      this.popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true
      })
    },
    createMultipleSelectPopup () {
      this.selectionPopup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true
      })
    },

    writePopUp (elem) {
      // Function which has the functionality to write the main PopUp Window (which displays information about the Nourishment)
      this.tableItems = []
      Object.entries(elem.properties).forEach(val => {
        if (val[0] !== 'ID') {
          this.tableItems.push({
            value: val[1],
            name: val[0]
          })
        }
      })
      this.popup.setLngLat(this.pressedLocation.coordinate)
        .setHTML('<div id="vue-popup-content"></div>')
        .addTo(this.map)
        .setMaxWidth('320px')

      new this.LocalDataTable({
        propsData: {
          tableHeaders: this.tableHeaders,
          tableItems: this.tableItems
        }
      }).$mount('#vue-popup-content')
    },

    selectNourishment (numberNourishment) {
      this.selectionPopup.remove()
      this.writePopUp(this.nourishmentsArea[numberNourishment], this.pressedLocation)
    },
    createDeckGlObject () {
      this.deckgl = new Deck({
        canvas: 'deck-canvas',
        width: '100%',
        height: '100%',
        controller: { inertia: true },
        initialViewState: this.viewState,
        onViewStateChange: ({ viewState }) => {
          this.viewState = viewState

          // Sync the Mapbox view state with Deck.gl
          this.map.jumpTo({
            center: [viewState.longitude, viewState.latitude],
            zoom: viewState.zoom,
            bearing: viewState.bearing,
            pitch: viewState.pitch
          })

          // Update the Deck.gl view state
          this.deckgl.setProps({
            viewState: this.viewState
          })
        },
        onClick: props => {
          if (this.showDistance) {
            bus.$emit('clicked-on-map', props)
          }

          // create the TableHeaders, which will be used both in
          // DataTable and DataSelectionTable (same structure)
          this.pressedLocation = props

          this.popup.remove()
          this.selectionPopup.remove()

          const mapboxFeatures = this.map.queryRenderedFeatures([props.x, props.y])
          // If there are none mapboxfeatures at all, return
          if (!mapboxFeatures[0]) {
            return
          }

          var bbox = [[props.x - 5, props.y - 5], [props.x + 5, props.y + 5]]
          this.nourishmentsArea = this.map.queryRenderedFeatures(bbox, {
            layers: ['nourishments']
          })

          var layerId = mapboxFeatures[0].layer.id
          if (layerId === 'beheerbibliotheek') {
            var urlBeheer = mapboxFeatures[0].properties.url
            window.open(urlBeheer, '_blank')
          }

          if (layerId === 'nourishments_hover') {
            layerId = mapboxFeatures[1].layer.id
          }

          if (this.nourishmentsArea.length >= 2) {
            this.tableSelectionItems = []
            var counter = 0
            Object.entries(this.nourishmentsArea).forEach(val => {
              if (val[0] !== 'ID') {
                this.tableSelectionItems.push({
                  type: val[1].properties.Type,
                  beginYear: val[1].properties['Begin datum'],
                  endYear: val[1].properties['Eind datum'],
                  elemNumber: counter
                })
                counter += 1
              }
            })
            this.selectionPopup.setLngLat(props.coordinate)
              .setHTML('<div id="vue-popup-selection-content"></div>')
              .addTo(this.map)
              .setMaxWidth('1000px')

            new this.DataSelectionTable({
              propsData: {
                tableHeaders: this.tableHeaders,
                tableItems: this.tableSelectionItems
              }
            }).$mount('#vue-popup-selection-content')
          } else if (this.nourishmentsArea.length === 1) {
            var f = mapboxFeatures[0]
            this.writePopUp(f, props)
          }
        },
        onHover: props => {
          const dist = 1
          const mapboxFeatures = this.map.queryRenderedFeatures([props.x - dist, props.y - dist, props.x + dist, props.y + dist])
          this.map.getCanvas().style.cursor = ''

          if (!mapboxFeatures[0]) {
            return
          }

          var layerIds = mapboxFeatures.map(layer => layer.source)
          // TODO: find better way to get this list from the layers config.
          const hoverLayers = [{
            layerId: 'nourishments',
            hoverId: 'nourishments_hover'
          }]
          hoverLayers.forEach(hover => {
            if (!layerIds.includes(hover.layerId)) {
              this.map.setFilter(hover.hoverId, ['==', 'ID', ''])
              return
            }
            if (this.map.getLayer(hover.hoverId)) {
              this.map.setFilter(hover.hoverId, ['==', 'ID', mapboxFeatures[0].properties.ID])
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
#deckgl-overlay,
#map {
  width: 100% !important;
  height: 100% !important;
}
</style>
