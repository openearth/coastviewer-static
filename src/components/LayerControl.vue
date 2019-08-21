<template>
  <div class="layer-control">
    <v-toolbar flat >
      <h2>Layers</h2>
    </v-toolbar>
    <div id="layer-div">
      <draggable class="draggable" v-model="menulayers" @start="drag=true" @end="drag=false; sortLayers()">
        <v-list three-line dense pt-0 v-for="layer in layers" :key="layer.id">
          <v-list-tile>
            <v-list-tile-action>
              <v-switch  @change="toggleLayers(layer)" v-model="layer.active"></v-switch>
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
  </div>
</template>

<script>
import _ from 'lodash';
import {
  bus
} from '@/event-bus.js';
import draggable from 'vuedraggable'
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'layer-control',
  computed: {
    ...mapGetters(['getAllLayers']),
    ...mapState(['layers']),
    menulayers: {
      get () {
        return this.layers
      },
      set(newLayers) {
        this.setLayers(newLayers)
      }
    },
  },
  mounted() {
    bus.$on('map-loaded', (map) => {
      this.map = map
    })
    bus.$on('check-layer-order', () => {
      console.log('check layer order')
      this.sortLayers()
    })
  },
  methods: {
    ...mapMutations(['setLayers', 'updateLayer']),
    sortLayers() {
      if (_.isNil(this.map)) {
        return;
      }
      console.log('sorting layers', this.getAllLayers )
      for (var i = this.getAllLayers.length - 2; i >= 0; --i) {
        for (var thislayer = 0; thislayer < this.getAllLayers[i].data.length; ++thislayer) {
          if (this.map.getLayer(this.getAllLayers[i].data[thislayer].id) !== undefined) {
            this.map.moveLayer(this.getAllLayers[i].data[thislayer].id)
          }
        }
      }
    },
    toggleLayers(layer) {
      if (_.isNil(this.map)) {
        return;
      }

      if ( !layer ) return
      this.updateLayer(layer)
      // Function to toggle the visibility and opacity of the layers.
      var vis = ['none', 'visible']
      if (layer.layertype === 'gee-layer'){
        if (layer.active){
          // TODO: think of something smart to not throw away on toggling rapidly a layer on/off without changing the timeslider
          bus.$emit('update-gee-layer', layer)
        }
      }
      if (layer.layertype === 'deckgl-layer') {
        bus.$emit('update-deckgl', layer.active)
      } else {
        layer.data.forEach(sublayer => {
          if (this.map.getLayer(sublayer.id) !== undefined) {
            if (layer.active) {
              this.map.setLayoutProperty(sublayer.id, 'visibility', vis[1])
            } else {
              this.map.setLayoutProperty(sublayer.id, 'visibility', vis[0])
            }
          }
        })
      }
      this.sortLayers()
    }
  },
  components: {
    draggable
  }
}

</script>

<style>

.layer-div {
  overflow-y: scroll;
  height: 100%;
}

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
