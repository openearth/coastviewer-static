import _ from 'lodash';
import {
  bus
} from '@/event-bus.js';
import draggable from 'vuedraggable'

export default {
  name: 'layer-control',
  props: {
    layers: {
      type: Array,
      required: true
    },
    map: {
      type: Object
    }
  },
  data() {
    return {
    };
  },
  mounted() {
    console.log('mounted layer-control', this);
  },
  watch: {
    // Watch "layers". This is a switch, which can toggle a layer on or off
    // When toggled, this watcher will activate the toggleLayers function.
    layers: {
      handler: function(layers) {
        this.toggleLayers();
        this.sortLayers()
      },
      deep: true
    }
  },
  computed: {
    computedList: {
      get() {
        return this.layers
      },
      set(layers) {
        bus.$emit('select-layers', layers)
      }
    }
  },
  methods: {
    sortLayers() {
      for (var i = this.layers.length - 2; i >= 0; --i) {
        for (var thislayer = 0; thislayer < this.layers[i].data.length; ++thislayer) {
          if (this.map.getLayer(this.layers[i].data[thislayer].id) !== undefined) {
            this.map.moveLayer(this.layers[i].data[thislayer].id)
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
      _.each(this.layers, (layer) => {
        _.each(layer.data, (sublayer) => {
          if (this.map.getLayer(sublayer.id) !== undefined) {
            if (layer.active) {
              this.map.setLayoutProperty(sublayer.id, 'visibility', vis[1]);
            } else {
              this.map.setLayoutProperty(sublayer.id, 'visibility', vis[0]);
            }
          }
            // if layer === deckgl-layer: use deck gl updateTrigger ergument
        })
      })
    }
  },
  components: {
    draggable
  }
}
