import { bus } from '@/event-bus.js'
import moment from 'moment'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    jarkusLayers: {},
    layers: [],
    geojsonLayers: {},
    deckgl: null,
    endYear: null,
    geojsonVTLayers: {},
    acceptedLegal: false,
    baseLayerYear: null
  },
  get enddate () {
    return this._enddate
  },
  set enddate (value) {
    this._enddate = value
  },
  mutations: {
    setAcceptedLegal (state, value) {
      state.acceptedLegal = value
    },
    setJarkusLayers (state, jarkus) {
      state.jarkusLayers[jarkus.year] = jarkus.layer
    },
    setLayers (state, layers) {
      state.layers = layers
    },
    updateLayer (state, layer) {
      state.layers = state.layers.map((l) => {
        if (l.name === layer.name) {
          return layer
        } else {
          return l
        }
      })
    },
    setGeoJsonVTLayers (state, vtlayer) {
      state.geojsonVTLayers[vtlayer.year] = vtlayer.layer
    },
    setDeckgl (state, deckgl) {
      state.deckgl = deckgl
    },
    setYear (state, year) {
      state.endYear = year
    }
  },
  actions: {
    changeYear ({ commit }, year) {
      const Time = bus.$on('slider-update', (date) => {
        const endtime = date.enddate
        let endTime = moment([endtime], 'MM-YYYY').format('YYYY')
        const enddate = 2016
        if (endTime <= enddate) {
          endTime = enddate
        } else {
          return endTime
        }
      })(this.state.endYear, year)
      commit('setYear', Time)
    }
  },
  getters: {
    getAllLayers (state) {
      return state.layers
    },

    baseLayerYear (state) {
      const baseLayer = {
        id: `satellite-${state.endYear}`,
        type: 'raster',
        source: {
          type: 'raster',
          tiles: [
            `https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/${state.endYear}_ortho25/EPSG:3857/{z}/{x}/{y}.jpeg`
          ],
          tileSize: 256
        },
        paint: {
          'raster-opacity': 0
        },
        'country-label-lg': 'TODO: write something here'
      }
      return baseLayer
    }
  }
})
