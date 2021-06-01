<template>
<div class="layer-control">
  <div class="layer-header">
    <v-card small flat>
      <v-card-title>
        <h1>
          Kaartlagen
        </h1>
        <v-tooltip bottom max-width="200px">
          <template v-slot:activator="{ on }">
            <v-icon small color="primary" class="px-2" v-on="on">info</v-icon>
          </template>
          <span>De volgorde van de weergave op de kaart kan veranderd worden door de lagen in de legenda te verslepen.</span>
          <span>Met Ctrl ingedrukt en bewegen van de muis is het mogelijk om de kaart te kantelen. </span>
        </v-tooltip>
      </v-card-title>
    </v-card>
  </div>
  <div class="layer-div">
    <draggable class="draggable" v-model="menulayers" @start="drag=true" @end="drag=false; sortLayers()">
      <v-list three-line dense pt-0 v-for="layer in layers" :key="layer.id" class="pa-0">
        <v-list-group v-if="layer.configurableDataSelection || layer.minmaxfactor" class="pa-0">
          <template v-slot:activator>
            <v-list-item-icon class="mx-0">
              <v-switch @click.stop="" @change="toggleLayers(layer)" v-model="layer.active"></v-switch>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{layer.name}}
                <v-tooltip v-if="layer.info" bottom max-width="200px">
                  <template v-slot:activator="{ on }">
                    <v-icon small color="primary" v-on="on">info</v-icon>
                  </template>
                  <span>{{layer.info}}</span>
                </v-tooltip>
                <v-btn v-if="layer.sourceUrl" icon small :href="layer.sourceUrl" target="_blank">
                  <v-icon small color="primary">link</v-icon>
                </v-btn>
              </v-list-item-title>
              <v-list-item-subtitle v-if="!layer.configurableDataSelection">
                <v-legend :layer="layer"></v-legend>
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <v-list-item>
            <div class="checkbox px-2" v-if="layer.configurableDataSelection">
              <v-layout row wrap class="mt-1">
                <v-flex v-for="(sublayer, index) in layer.data" :key="index" xs6>
                  <v-checkbox
                    class="pa-0 ma-0"
                    v-model="sublayer.active"
                    :label="sublayer.label"
                    :color="sublayer.paint['line-color'] || sublayer.paint['text-color']"
                    hide-details
                    @change="toggleLayers(layer)"
                  ></v-checkbox>
                </v-flex>
              </v-layout>
            </div>
            <div v-if="layer.layertype === 'gee-layer'">
              <v-radio-group
                v-model="layer.minmaxfactor"
                @change="updateGeeFactor(layer)"
                row
              >
                <v-radio
                  v-for="factor in [1, 2, 0.5, 0.33]"
                  :key= factor
                  :label="minmaxLabel(layer, factor)"
                  :value="factor"
                ></v-radio>
              </v-radio-group>
            </div>
          </v-list-item>
        </v-list-group>
        <v-list-item-group v-else class="pa-0">
          <v-list-item>
            <v-list-item-icon class="mx-0">
              <v-switch :disabled="layer.layertype === 'deckgl-layer' && jarkusLoading" @change="toggleLayers(layer)" v-model="layer.active"></v-switch>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="mt-auto">
                {{layer.name}}
                <v-tooltip v-if="layer.info" bottom max-width="200px">
                  <template v-slot:activator="{ on }">
                    <v-icon small color="primary" v-on="on">info</v-icon>
                  </template>
                  <span>{{layer.info}}</span>
                </v-tooltip>
                <v-btn v-if="layer.sourceUrl" icon small :href="layer.sourceUrl" target="_blank">
                  <v-icon small color="primary">link</v-icon>
                </v-btn>
              </v-list-item-title>
              <v-list-item-subtitle >
                <v-legend :layer="layer"></v-legend>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon v-if="layer.layertype === 'deckgl-layer'">
              <v-progress-circular v-if="jarkusLoading" indeterminate color="purple"></v-progress-circular>
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </draggable>
  </div>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  bus
} from '@/event-bus.js'
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
      get () {
        return this.layers
      },
      set (newLayers) {
        this.setLayers(newLayers)
      }
    }
  },
  data () {
    return {
      jarkusLoading: true
    }
  },
  mounted () {
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
    sortLayers () {
      // Sort layers by order of the layers array, all data objects should get the
      // correct place as the order of the layer they belong to.
      if (_.isNil(this.map)) {
        return
      }
      for (var i = this.getAllLayers.length - 2; i >= 0; --i) {
        for (var thislayer = 0; thislayer < this.getAllLayers[i].data.length; ++thislayer) {
          const currentlayer = this.getAllLayers[i].data[thislayer]
          if (this.map.getLayer(currentlayer.id) !== undefined) {
            this.map.moveLayer(currentlayer.id)
          }
          if (this.map.getLayer(`${currentlayer.id}_${this.getAllLayers[i].ghostlayercount}`) !== undefined) {
            this.map.moveLayer(`${currentlayer.id}_${this.getAllLayers[i].ghostlayercount}`)
          }
        }
      }
    },
    toggleLayers (layer) {
      // Switching the visibility of the layers on/off according to the switch in the menu
      if (_.isNil(this.map)) {
        return
      }

      if (!layer) return
      this.updateLayer(layer)

      if (layer.name === 'Suppleties') {
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
          if (!this.map.getLayer(layerId) && layer.active) {
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
            const checkSubLayer = _.has(sublayer, 'active') ? sublayer.active : true
            if (layer.active && checkSubLayer) {
              bus.$emit('set-active')
              this.map.setLayoutProperty(sublayer.id, 'visibility', vis[1])
            } else {
              if (layer.configurableDataSelection) {
                bus.$emit('set-inactive')
              }
              this.map.setLayoutProperty(sublayer.id, 'visibility', vis[0])
            }
          }
        })
      }
      this.sortLayers()
    },
    minmaxLabel (layer, factor) {
      let conversionParam = 1
      if (layer.name === 'Vaklodingen') {
        conversionParam = 100
      }
      return `min: ${(layer.data[0].min * factor / conversionParam).toFixed()}, max: ${(layer.data[0].max * factor / conversionParam).toFixed()}]`
    },
    updateGeeFactor (layer) {
      const start = layer.data[0].min * layer.minmaxfactor
      const stop = layer.data[0].max * layer.minmaxfactor
      let conversionParam = 1
      if (layer.name === 'Vaklodingen') {
        conversionParam = 100
      }
      const stepSize = (stop - start) / 4
      let barText = ''
      _.range(5).forEach((step) => {
        barText = `${barText} ${parseInt((start + (step * stepSize)) / conversionParam)}`
      })
      layer.bartext = barText
      bus.$emit('update-gee-layer', layer)
      this.updateLayer(layer)
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

.layer-selection, .v-list-item {
  overflow: visible !important;
}

.carddiv {
  width: 100%;
  height: 100%;
}

.layer-control {
  height: 100%;
  overflow: hidden;
}

.layer-header {
  height: 64px;
  overflow: hidden;
}
.navigation-drawer .list {
  padding: 0;
  cursor: move;
}

.menutile:hover {
  padding: 0px;
  background-color: lightgrey;
  cursor: move;
}

.layer-div {
  overflow-y: auto;
  height: calc(100% - 64px);
}

.fa-carot-down:hover {
  cursor: pointer;
}
</style>
