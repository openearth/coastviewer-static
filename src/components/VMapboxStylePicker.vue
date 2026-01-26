<template>
  <div>
    <div
      :id="id"
      :ref="id"
      class="mapboxgl-ctrl mapboxgl-ctrl-bottom-right mapboxgl-ctrl-group mapbox-style-picker"
      :class="rightDrawer ? 'satellite-open' : 'satellite-closed'"
    >
      <v-btn class="satellite-btn" text v-on:click.native="switchSatellite()">
        <img v-if="satelliteSwitch === 0" src="@/static/images/satellite.png" />
        <img v-if="satelliteSwitch === 1" src="@/static/images/light.png" />
      </v-btn>
    </div>
    <div class="mapboxgl-ctrl mapboxgl-ctrl-bottom-right" v-if="satelliteSwitch === 1" id="satellite-date">
      01-06-2016 tot 10-11-2025
    </div>
  </div>
</template>

<script>

import { mapMutations } from 'vuex'

export default {
  name: 'v-mapbox-style-picker',
  props: {
    rightDrawer: {
      type: Boolean
    },
    satelliteLayerName: {
      type: String
    }
  },
  data () {
    return {
      id: this._uid,
      satelliteSwitch: 0
    }
  },
  computed: {
    satelliteLayer () {
      const layer = {
        id: 'satellite',
        type: 'raster',
        source: {
          type: 'raster',
          tiles: [`https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/${this.satelliteLayerName}/EPSG:3857/{z}/{x}/{y}.jpeg`],
          tileSize: 256
        },
        paint: {
          'raster-opacity': this.satelliteSwitch
        }
      }
      return layer
    }
  },
  // Disable for now
  watch: {
    satelliteLayerName () {
      this.removeLayer()
      this.map.addLayer(this.satelliteLayer, 'country-label-lg')
    }
  },
  inject: ['getMap'],
  mounted () {
    this.map = this.getMap()
    this.map.on('load', () => {
      this.deferredMountedTo()
    })
    // check optional props
    this.mapstyles = this.mapboxstyles || this.mapstyles
    this.mapstyle = this.mapboxstyle || this.mapstyle
  },
  methods: {
  // insert mapmutations
    ...mapMutations({
      endTime: 'setYear'
    }),

    deferredMountedTo () {
      // initialize control
      this.map.addControl(this, 'bottom-right')

      // Add additional background layer
      this.map.addLayer(this.satelliteLayer, 'country-label-lg')
    },
    onAdd (map) {
      // return containing div
      return this.$refs[this.id]
    },
    onRemove () {
      return null
    },
    removeLayer () {
      // Remove layer before adding the one with the other year
      const layer = this.map.getLayer(this.satelliteLayer.id)
      if (layer) {
        this.map.removeLayer(this.satelliteLayer.id)
        try {
          this.map.removeSource(layer.source)
        } catch {
          console.warn('could not remove source', layer.source)
        }
      }
    },
    switchSatellite () {
      if (this.satelliteSwitch === 1) {
        this.satelliteSwitch = 0
      } else {
        this.satelliteSwitch = 1
      }
      this.map.setPaintProperty(
        'satellite',
        'raster-opacity',
        this.satelliteSwitch
      )
    }
  }
}

</script>

<style scoped>
.mapbox-style-picker,
.satellite-btn {
  height: 60px !important;
  width: 60px !important;
  padding: 0 !important;
}

span.v-btn__content {
  height: 100% !important;
  width: 100%;
  border-radius: 4px !important;
}

.mapboxgl-ctrl-bottom-right {
  bottom: 30px;
}

.satellite-closed {
  right: 10px;
}

.satellite-open {
  right: 460px;
}

#satellite-date {
  right: 80px;
  margin: 10px;
}

img {
  height: 60px;
  width: 60px;
  border-radius: 4px !important;
}
</style>
