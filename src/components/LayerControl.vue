<template>
  <div>
    <v-card small flat>
      <v-card-title>
        <h1>
          Kaartlagen
        </h1>
      </v-card-title>
    </v-card>

    <v-expansion-panel>
      <draggable
        id="draggable"
        class="draggable"
        v-model="menulayers"
        @start="drag = true"
        @end="drag=false; sortLayers()"
        v-bind="{ handle: '.draghandle' }"
      >
        <v-expansion-panel-content
          class="ma-0 pa-0"
          v-for="layer in layers"
          :key="layer.id"
          extra-small
          expand-icon="fa-caret-down"
          hide-actions
        >

          <div slot="header" class="pa-0">
              <v-layout class="menutile" align-center justify-space-end fill-height>
                <v-flex xs2 @click.stop="" class="ml-auto">
                  <v-switch
                    :disabled="layer.layertype === 'deckgl-layer' && jarkusLoading"
                    @change="toggleLayers(layer)"
                    v-model="layer.active">
                  ></v-switch>
                </v-flex>
                <v-flex xs7>
                  {{ layer.name }}
                </v-flex>
                <v-flex xs1 >
                  <v-progress-circular v-if="jarkusLoading && layer.layertype === 'deckgl-layer'" indeterminate color="purple"></v-progress-circular>
                </v-flex>
                <v-flex xs1>
                  <v-icon class="ma-2" v-if="layer.info || layer.barlegend || layer.legendlabels" id="dragicon" title="Open details" small
                    >fa-caret-down</v-icon
                  >
                </v-flex>
              </v-layout>
          </div>
          <div class="pa-2"  v-if="layer.info || layer.barlegend || layer.legendlabels">
            <div class="infodiv" v-if="layer.info">
              <h4>Informatie</h4>
              {{ layer.info }}
              <v-divider />
            </div>
            <div class="legend" v-if="layer.barlegend || layer.legendlabels">
              <h4>Legenda</h4>
              <v-legend :layer="layer"></v-legend>
            </div>
          </div>
        </v-expansion-panel-content>
      </draggable>
    </v-expansion-panel>
  </div>
</template>

<!-- <template>
<div class="layer-control">
  <v-toolbar flat>
    <h2>Layers</h2>
  </v-toolbar> -->
  <!-- <div id="layer-div">
    <draggable class="draggable" v-model="menulayers" @start="drag=true" @end="drag=false; sortLayers()">
      <v-list three-line dense pt-0 v-for="layer in layers" :key="layer.id">
        <v-list-tile>
          <v-list-tile-action>
            <v-switch :disabled="layer.layertype === 'deckgl-layer' && jarkusLoading" @change="toggleLayers(layer)" v-model="layer.active"></v-switch>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{layer.name}}
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <v-legend :layer="layer"></v-legend>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action v-if="layer.layertype === 'deckgl-layer'">
            <v-progress-circular v-if="jarkusLoading" indeterminate color="purple"></v-progress-circular>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </draggable>
  </div> -->
<!-- </div>
</template> -->

<script>
import _ from 'lodash';
import {
  bus
} from '@/event-bus.js';
import draggable from 'vuedraggable'
import {
  mapGetters,
  mapMutations,
  mapState
} from 'vuex'
import VLegend from './VLegend'

export default {
  name: 'layer-control',
  computed: {
    ...mapGetters(['getAllLayers']),
    ...mapState(['layers']),
    menulayers: {
      get() {
        return this.layers
      },
      set(newLayers) {
        this.setLayers(newLayers)
      }
    },
  },
  data() {
    return {
      jarkusLoading: true
    }
  },
  mounted() {
    bus.$on('map-loaded', (map) => {
      this.map = map
    })
    bus.$on('check-layer-order', () => {
      this.sortLayers()
    })

    bus.$on('jarkus-loaded', () => {
      this.jarkusLoading = false
    })
  },
  methods: {
    ...mapMutations(['setLayers', 'updateLayer']),
    sortLayers() {
      if (_.isNil(this.map)) {
        return;
      }
      for (var i = this.getAllLayers.length - 2; i >= 0; --i) {
        for (var thislayer = 0; thislayer < this.getAllLayers[i].data.length; ++thislayer) {
          const currentlayer = this.getAllLayers[i].data[thislayer]
          if (this.map.getLayer(currentlayer.id) !== undefined) {
            this.map.moveLayer(currentlayer.id)
          }
          if (this.map.getLayer(`${currentlayer.id}_${currentlayer.ghostlayercount}`) !== undefined) {
            this.map.moveLayer(`${currentlayer.id}_${currentlayer.ghostlayercount}`)
          }
        }
      }
    },
    toggleLayers(layer) {
      if (_.isNil(this.map)) {
        return;
      }

      if (!layer) return
      this.updateLayer(layer)

      if(layer.name === "Suppleties"){
        bus.$emit('update-suppleties')
      }
      // Function to toggle the visibility and opacity of the layers.
      var vis = ['none', 'visible']
      if (layer.layertype === 'deckgl-layer') {
        bus.$emit('update-deckgl', layer.active)
      } else if (layer.layertype === 'gee-layer') {
        // TODO: think of something smart to not throw away on toggling rapidly a layer on/off without changing the timeslider
        layer.data.forEach(sublayer => {
          const layerId = `${sublayer.id}_${layer.ghostlayercount}`
          if (layer.active) {
            bus.$emit('update-gee-layer', layer)
          }
          if (this.map.getLayer(layerId)) {
            if (layer.active) {
              this.map.setLayoutProperty(layerId, 'visibility', vis[1])
            } else {
              this.map.setLayoutProperty(layerId, 'visibility', vis[0])
            }
          }
        })

      } else {
        layer.data.forEach(sublayer => {
          if (this.map.getLayer(sublayer.id)) {
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
    draggable,
    VLegend
  }
}
</script>

<style>
#draggable {
  width: 100%;
}
.carddiv {
  width: 100%;
  height: 100%;
}

.v-expansion-panel__header {
  padding: 0;
}
.menutile:hover {
  padding: 0px;
  background-color: lightgrey;
  cursor: move;
}

.layer-div {
  overflow-y: scroll;
  height: 100%;
}

.fa-carot-down:hover {
  cursor: pointer;
}

.list__tile__title {
  min-height: fit-content;
}
</style>
