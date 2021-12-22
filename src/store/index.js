import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    jarkusLayers: {},
    layers: [],
    geojsonLayers: {},
    deckgl: null,
    timesliderEndYear: null,
    geojsonVTLayers: {},
    acceptedLegal: false
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
    setTimesliderEndYear (state, date) { // TODO: use this one
      state.timesliderEndYear = date
    }
  },
  getters: {
    getAllLayers (state) {
      return state.layers
    },
    satelliteLayerName (state) {
      const endYear = state.timesliderEndYear
      if (!endYear) {
        return
      }
      // Construct satelliteLayerName
      const year = endYear <= '2016' ? '2016' : endYear
      const name = year === '2021' ? 'orthoHR' : 'ortho25'

      return `${year}_${name}`
    }

  }
})
