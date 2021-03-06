<template>
  <div class="mapboxgl-ctrl-bottom-left pl-2 pb-4" id="legend">
    <div v-for="layer in activeLayers" :key="layer.name">
      {{layerMessage(layer)}}
      <v-legend :layer="layer"></v-legend>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VLegend from './VLegend'
import moment from 'moment'
import _ from 'lodash'
import {
  bus
} from '@/event-bus.js'

export default {
  name: 'VMapboxLegend',
  computed: {
    ...mapState(['layers'])
  },
  watch: {
    layers: {
      handler () {
        this.setActiveLayers()
      }
    }
  },
  data () {
    return {
      layerStatus: {},
      activeLayers: []
    }
  },
  mounted () {
    this.setActiveLayers()
    bus.$on('loading-layer', data => {
      this.layerStatus[data.dataset] = `Loading... (${moment(data.begin_date).format('DD/MM/YY')} - ${moment(data.end_date).format('DD/MM/YY')})`
    })
    bus.$on('layer-loaded', data => {
      this.layerStatus[data.dataset] = `(${moment(data.begin_date).format('DD/MM/YY')} - ${moment(data.end_date).format('DD/MM/YY')})`
      this.setActiveLayers()
    })

    bus.$on('layer-error', id => {
      this.layerStatus[id] = 'Error loading layer'
    })
  },
  components: {
    VLegend
  },
  methods: {
    layerMessage (layer) {
      const unit = layer.unit ? ` [${layer.unit}]` : ''
      const message = `${layer.name}${unit} ${this.layerStatus[_.get(layer, 'data[0].id')] || ''}`
      return message
    },
    setActiveLayers () {
      this.activeLayers = this.layers.filter(layer => layer.active && (layer.barlegend || layer.legendlabels))
    }
  }
}
</script>

<style>
#legend {
  width: 20vw;
}
.bar {
  width: 100%;
  height: 10px;
}

.bar-wrapper {
  display: block;
  width: 100%;
  /* margin-bottom: 10px; */
}
.bartext {
  width: 100%;
  display: inline-block;
  text-align: justify;
  text-align-last: justify
}

.colored-span {
  width: 10px;
  height: 10px;
  border-radius: 5px;
}
</style>
