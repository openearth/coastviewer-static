<template>
  <div class="mapboxgl-ctrl-bottom-left pl-2 pb-4" id="legend">
    <div v-for="layer in activeLayers">
      {{layer.name}}
      <v-legend :layer="layer"></v-legend>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VLegend from './VLegend'

export default {
    name: 'VMapboxLegend',
    computed: {
      ...mapState(['layers']),
      activeLayers: {
        get() {
          return this.layers.filter(layer => layer.active && (layer.barlegend || layer.legendlabels))
        }
      }
    },
    components: {
      VLegend
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
