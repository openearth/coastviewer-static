import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    jarkusLayers: {},
    layers: [],
    deckgl: null,
    endYear: null
  },
  mutations: {
    setJarkusLayers (state, jarkus) {
      state.jarkusLayers[jarkus.year] = jarkus.layer
    },
    setLayers(state, layers) {
      state.layers = layers
    },
    setDeckgl(state, deckgl) {
      state.deckgl = deckgl
    },
    setYear(state, year) {
      state.endYear = year
    }
  }
})
