<template>
  <v-container fluid fill-height pa-0>
    <div id="map">
      <v-mapbox-legend v-show="showLegend"></v-mapbox-legend>
      <v-mapbox-style-picker v-if="map !== null" />
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
import VMapboxLegend from './VMapboxLegend'
import {TileLayer} from '@deck.gl/geo-layers'
import {GeoJsonLayer} from '@deck.gl/layers'
import {Deck, MapController}  from '@deck.gl/core'
import DataLayers from './DataLayers'
import { mapMutations } from 'vuex'
import mapboxgl from 'mapbox-gl'


export default {
  name: 'MapComponent',
  props: {
    showLegend: {
      type: Boolean
    }
  },
  provide () {
    // allows to use inject:  ['getMap']  in child components
    return {
      getMap: () => this.map
    }
  },
  data() {
    return {
       map: null,
       deckgl: null
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
  },
  methods: {
    ...mapMutations(['setDeckgl']),
    createMapboxMap() {
      mapboxgl.accessToken =  "pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
      this.map = new mapboxgl.Map({
        container: 'map',
        style:  "mapbox://styles/mapbox/light-v9",
        interactive: true,
        center: [this.viewState.longitude, this.viewState.latitude],
        zoom: this.viewState.zoom
      })
      this.map.addControl(new mapboxgl.NavigationControl())


    },
    createMapboxPopup() {
      this.popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false
      })
    },
    createDeckGlObject() {
      this.deckgl = new Deck({
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


          // TODO: find better way to get this list from the layers config.
          const hoverLayers = [{
            layerId: 'nourishments_points',
            hoverId: 'nourishments_points_hover'
          } ,{
            layerId: 'nourishments',
            hoverId: 'nourishments_hover'
          }]
          hoverLayers.forEach(hover => {
            if(this.map.getLayer(hover.hoverId)) {
              if (layerId === hover.layerId) {
                this.map.getCanvas().style.cursor = 'pointer'

                this.map.setFilter(hover.hoverId, ["==", "id", mapboxFeatures[0].properties.id])
              }
              else {
                this.map.getCanvas().style.cursor = ''
                this.map.setFilter(hover.hoverId, ["==", "id", ""])
              }
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
    VMapboxLegend
  }
}
</script>

<style>
.deck-canvas, #map{
  position: relative;
  width:  100%;
  height: 100%;
}

.deck-canvas {
  top: 64px;
}
</style>
