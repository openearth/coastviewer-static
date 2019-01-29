import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    jarkusLayers: {},
  },
  mutations: {
    setJarkusLayers (state, jarkus) {
      console.log('setJarkusLayers', jarkus.year, jarkus.layer)
      state.jarkusLayers[jarkus.year] = jarkus.layer
    }
  }
})
