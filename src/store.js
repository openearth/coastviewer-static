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
    geojsonVTLayers: {}
  },
  mutations: {
    setJarkusLayers (state, jarkus) {
      state.jarkusLayers[jarkus.year] = jarkus.layer
    },
    setLayers(state, layers) {
      state.layers = layers
    },
    setGeoJsonVTLayers(state, vtlayer) {
      state.geojsonVTLayers[vtlayer.year] = vtlayer.layer
    },
    setDeckgl(state, deckgl) {
      state.deckgl = deckgl
    },
    setYear(state, year) {
      state.endYear = year
    }
  }
})
