<template>
  <div class="mapboxgl-ctrl-bottom-left pl-2 pb-4" id="legend">
    <div v-for="layer in activeLayers">
      {{layer.name}}
        <div v-if="layer.barlegend" class="bar-wrapper">
          <div :style="layer.barlegend" class="bar"></div>
          <div class="bartext">{{layer.bartext}} </div>
        </div>
        <div v-if="layer.legendlabels" class="bar-wrapper">
          <v-layout wrap class="color-label">
            <v-layout
              align-center
              v-for="(color, index) in layer.legendcolors"
              :key="index"
            >
              <span
                class="colored-span"
                :style="`background-color: ${color}`"
              ></span>
              <label class="ma-1">{{ layer.legendlabels[index] }}</label>
            </v-layout>
          </v-layout>
        </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'VMapboxLegend',
    computed: {
      ...mapState(['layers']),
      activeLayers: {
        get() {
          return this.layers.filter(layer => layer.active && (layer.barlegend || layer.legendlabels))
        }
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
