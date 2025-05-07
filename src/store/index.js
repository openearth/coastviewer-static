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
    timesliderEndYear: null,
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
    setTimesliderEndYear (state, date) {
      state.timesliderEndYear = date
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
    satelliteLayerName (state) {
      const endYear = state.timesliderEndYear
      if (!endYear) {
        return
      }
      // Construct satelliteLayerName
      const year = endYear <= '2016' ? '2016'
        : endYear >= '2024' ? '2024' : endYear
      const name = year === '2021' || year === '2022' || year === '2023' || year === '2024' ? 'orthoHR' : 'ortho25'

      return `${year}_${name}`
    }

  }
})
