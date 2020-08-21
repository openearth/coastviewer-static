<template>
  <div id="checkbox-div" >
    <v-container fluid class="pa-0">
      <v-layout row wrap>
        <v-flex v-for="(sublayer,index) in layer.data" :key="index" xs6>
          <v-checkbox
            class="pa-0 ma-0"
            v-model="sublayer.active"
            :label="sublayer.label"
            :color="sublayer.paint['line-color']"
            hide-details
            @change="toggleLayerVisibility(sublayer)"
          ></v-checkbox>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import {
  bus
} from '@/event-bus.js';
export default {
  name: "VLayersCheckbox",
  props: {
    layer: {
      type: Object,
      required: true
    }
  },
  mounted() {
    bus.$on('map-loaded', (map) => {
      this.map = map
    })
    bus.$on('set-active', () => {
      this.layer.data.forEach(sublayer => {
        sublayer.active = true
      })
    })
    bus.$on('set-inactive', () => {
      this.layer.data.forEach(sublayer => {
        sublayer.active = false
      })
    })
  },
  methods: {
    toggleLayerVisibility (layer) {
      if (layer.active === false) {
        this.map.setLayoutProperty(layer.id, 'visibility', 'none')
      } else {
        this.map.setLayoutProperty(layer.id, 'visibility', 'visible')
      }
    } }
}
</script>

<style>
#checkbox-div {
  width: 100%;
}
.v-label {
  font-size: 13px;
}
.v-input--selection-controls__input {
  margin-right: 0px;
}
.v-input__slot {
  margin-bottom: 0px;
}
.container {
  padding: 0px;
}
</style>
