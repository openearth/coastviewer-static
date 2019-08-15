<template>
  <div class="layer-control">
    <draggable class="draggable" v-model="$store.state.layers" @start="drag=true" @end="drag=false; sortLayers()">
      <v-list three-line dense pt-0 v-for="layer in $store.state.layers" :key="layer.id">
        <v-list-tile>
          <v-list-tile-action>
            <v-switch  @change="toggleLayers" v-model="layer.active"></v-switch>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{layer.name}}
            </v-list-tile-title>
            <v-list-tile-sub-title>
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
            </v-list-tile-sub-title>

          </v-list-tile-content>
          <v-list-tile-action v-if="layer.name==='Jarkus'">
            <v-progress-circular
              v-if="$store.state.jarkusLayers.length >= 53"
              indeterminate
              color="purple"
              label="loading layers"
            ></v-progress-circular>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </draggable>
  </div>
</template>

<script>
import _ from 'lodash';
import {
  bus
} from '@/event-bus.js';
import draggable from 'vuedraggable'

export default {
  name: 'layer-control',
  props: {
    layers: {
      type: Array
    },
    map: {
      type: Object
    }
  },
  watch: {
    layers: (newValue) => {
      this.sortLayers()
      this.toggleLayers()
    }
  },
  methods: {
    sortLayers() {
      for (var i = this.$store.state.layers.length - 2; i >= 0; --i) {
        for (var thislayer = 0; thislayer < this.$store.state.layers[i].data.length; ++thislayer) {
          if (this.map.getLayer(this.$store.state.layers[i].data[thislayer].id) !== undefined) {
            this.map.moveLayer(this.$store.state.layers[i].data[thislayer].id)
          }
        }
      }
    },
    toggleLayers() {
      if (_.isNil(this.map)) {
        return;
      }
      // Function to toggle the visibility and opacity of the layers.
      var vis = ['none', 'visible']
      _.each(this.$store.state.layers, (layer) => {
        if(layer.name === 'Jarkus') {
          bus.$emit('update-deckgl', layer.active)
        } else {
          _.each(layer.data, (sublayer) => {
            if (this.map.getLayer(sublayer.id) !== undefined) {
              if (layer.active) {
                this.map.setLayoutProperty(sublayer.id, 'visibility', vis[1]);
              } else {
                this.map.setLayoutProperty(sublayer.id, 'visibility', vis[0]);
              }
            }
          })
        }
      })
    }
  },
  components: {
    draggable
  }
}

</script>

<style>
.navigation-drawer .list {
  cursor: move;
}

.list.list--dense:hover {
  background-color: lightgrey;
}

.list__tile__title {
  min-height: fit-content;
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
