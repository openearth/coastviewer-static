import _ from 'lodash';
import {
  bus
} from '@/event-bus.js';
import draggable from 'vuedraggable'

export default {
  name: 'layer-control',
  props: {
    map: {
      type: Object
    }
  },
  data() {
    return {
    };
  },
  mounted() {
    bus.$on('update-layers', (event) => {
      this.sortLayers()
      this.toggleLayers()
    })
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
